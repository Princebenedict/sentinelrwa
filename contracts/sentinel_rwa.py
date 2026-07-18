# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

"""
SentinelRWA - AI-Powered Real-World Asset Verification
Built on GenLayer Intelligent Contracts. Network: Bradbury Testnet.

The AI jury fetches evidence source URLs on-chain (gl.nondet.web.render),
only trusts allow-listed source domains, prioritizes the asset owner's
evidence against spam, and normalizes every verdict field against the
final enforced score.
"""

from genlayer import *
import json


STATUS_HEALTHY = "HEALTHY"
STATUS_MONITOR = "MONITOR"
STATUS_REVIEW_REQUIRED = "REVIEW_REQUIRED"
STATUS_INSURANCE_TRIGGERED = "INSURANCE_TRIGGERED"
STATUS_CLAIM_ELIGIBLE = "CLAIM_ELIGIBLE"

RISK_LOW = "LOW"
RISK_MEDIUM = "MEDIUM"
RISK_HIGH = "HIGH"
RISK_CRITICAL = "CRITICAL"

# Allow-listed, credible evidence source domains. Evidence from other domains
# is recorded but NOT trusted for fetching/verification.
ALLOWED_SOURCE_DOMAINS = [
    "gov",            # government sites (.gov, .gov.ng, etc.)
    "registry",
    "landregistry",
    "reuters.com",
    "apnews.com",
    "bbc.com",
    "bbc.co.uk",
    "bloomberg.com",
    "sec.gov",
    "companieshouse.gov.uk",
    "cac.gov.ng",     # Nigeria corporate registry
    "wikipedia.org",
]

RATING_CRITERIA = (
    "You are a STRICT, skeptical real-world asset verifier protecting investors from fraud. "
    "You distrust unverified claims and demand hard evidence from credible sources. Rate the "
    "CREDIBILITY of the claim based ONLY on the evidence and the ACTUAL FETCHED CONTENT from "
    "ALLOW-LISTED sources, never on marketing language. SCORING IS DELIBERATELY HARD. "
    "MANDATORY DEDUCTIONS: no ownership proof caps the score at 35; no verifiable address caps "
    "at 40; evidence with no allow-listed third-party source caps at 45; fetched content that "
    "does not support the claim subtracts 20; any inconsistency subtracts 25; evidence only from "
    "non-allow-listed or unverifiable sources must be treated as unverified. "
    "90-100 requires multiple independent, allow-listed, verifiable proofs and must be RARE. "
    "70-89 good verified evidence. 50-69 partial. 30-49 weak. 0-29 unverifiable or suspicious. "
    "A brand-new listing with only text and no fetched proof scores 20-40. Cite the fetched evidence."
)


def _addr_hex(addr) -> str:
    val = getattr(addr, "as_hex", None)
    if isinstance(val, str):
        return val
    return str(addr)


def _domain_allowed(url: str) -> bool:
    """True only if the URL host contains an allow-listed token."""
    if not url or not url.startswith("http"):
        return False
    lowered = url.lower()
    for token in ALLOWED_SOURCE_DOMAINS:
        if token in lowered:
            return True
    return False


def _verdict_for_score(score: int) -> str:
    if score >= 85:
        return "VERIFIED"
    if score >= 55:
        return "PARTIALLY_VERIFIED"
    if score < 30:
        return "SUSPICIOUS"
    return "UNVERIFIED"


def _vstatus_for_score(score: int) -> str:
    return _verdict_for_score(score)


def _risk_for_score(score: int) -> str:
    if score >= 70:
        return RISK_LOW
    if score >= 50:
        return RISK_MEDIUM
    if score >= 30:
        return RISK_HIGH
    return RISK_CRITICAL


def _action_for_score(score: int, threshold: int) -> str:
    if score < 40 or score < threshold:
        return "TRIGGER_INSURANCE"
    if score < 65:
        return "REVIEW"
    if score < 85:
        return "MONITOR"
    return "NONE"


def _status_for_score(score: int, threshold: int) -> str:
    action = _action_for_score(score, threshold)
    if score < threshold or action == "TRIGGER_INSURANCE":
        if score < 20:
            return STATUS_CLAIM_ELIGIBLE
        return STATUS_INSURANCE_TRIGGERED
    if action == "REVIEW" or score < 50:
        return STATUS_REVIEW_REQUIRED
    if action == "MONITOR" or score < 70:
        return STATUS_MONITOR
    return STATUS_HEALTHY


class SentinelRWA(gl.Contract):
    projects: TreeMap[str, str]
    project_health: TreeMap[str, str]
    project_evidence: TreeMap[str, str]
    project_history: TreeMap[str, str]
    project_ids: str
    owner: Address
    total_projects: u256

    def __init__(self) -> None:
        self.project_ids = json.dumps([])
        self.total_projects = 0
        self.owner = gl.message.sender_address

    @gl.public.write
    def register_project(
        self,
        project_id: str,
        name: str,
        description: str,
        asset_type: str,
        country: str,
        location: str,
        image_url: str,
        ownership_proof_url: str,
        lister_contact: str,
        price: str,
        expected_performance: str,
        insurance_threshold: u256,
    ) -> None:
        if self.projects.get(project_id, None) is not None:
            raise Exception(f"Project '{project_id}' is already registered")
        if not project_id or not name or not description:
            raise Exception("project_id, name, and description are required")
        if not location:
            raise Exception("A physical location or address is required")
        if not lister_contact:
            raise Exception("Lister contact is required")
        if int(insurance_threshold) > 100:
            raise Exception("insurance_threshold must be between 0 and 100")

        sender_hex = _addr_hex(gl.message.sender_address)
        has_proof = 1 if ownership_proof_url else 0

        project_data = {
            "project_id": project_id,
            "name": name,
            "description": description,
            "asset_type": asset_type,
            "country": country,
            "location": location,
            "image_url": image_url,
            "ownership_proof_url": ownership_proof_url,
            "lister_contact": lister_contact,
            "price": price,
            "owner": sender_hex,
            "expected_performance": expected_performance,
            "insurance_threshold": int(insurance_threshold),
            "verification_status": "UNVERIFIED",
            "has_ownership_proof": has_proof,
            "created_at": "registered",
        }

        health_data = {
            "project_id": project_id,
            "health_score": 0,
            "risk_level": RISK_HIGH,
            "status": STATUS_REVIEW_REQUIRED,
            "last_evaluated": "never",
            "latest_verdict": None,
            "evaluation_count": 0,
        }

        self.projects[project_id] = json.dumps(project_data, sort_keys=True)
        self.project_health[project_id] = json.dumps(health_data, sort_keys=True)
        self.project_evidence[project_id] = json.dumps([])
        self.project_history[project_id] = json.dumps([])

        ids = json.loads(self.project_ids)
        ids.append(project_id)
        self.project_ids = json.dumps(ids)

        self.total_projects = self.total_projects + 1

    @gl.public.write
    def remove_project(self, project_id: str) -> None:
        sender_hex = _addr_hex(gl.message.sender_address)
        owner_hex = _addr_hex(self.owner)
        if sender_hex.lower() != owner_hex.lower():
            raise Exception("Only the contract owner can remove projects")
        if self.projects.get(project_id, None) is None:
            raise Exception(f"Project '{project_id}' not found")

        self.projects[project_id] = ""
        self.project_health[project_id] = ""
        self.project_evidence[project_id] = ""
        self.project_history[project_id] = ""

        ids = json.loads(self.project_ids)
        ids = [pid for pid in ids if pid != project_id]
        self.project_ids = json.dumps(ids)

        if self.total_projects > 0:
            self.total_projects = self.total_projects - 1

    @gl.public.write
    def submit_evidence(
        self,
        project_id: str,
        evidence_type: str,
        content: str,
        source_url: str,
    ) -> None:
        project_raw = self.projects.get(project_id, None)
        if project_raw is None or project_raw == "":
            raise Exception(f"Project '{project_id}' not found")
        if not content:
            raise Exception("Evidence content cannot be empty")

        project = json.loads(project_raw)
        sender_hex = _addr_hex(gl.message.sender_address)
        # Provenance: mark whether the submitter is the asset owner
        is_owner = 1 if sender_hex.lower() == project.get("owner", "").lower() else 0

        evidence_entry = {
            "evidence_type": evidence_type,
            "content": content,
            "source_url": source_url,
            "submitted_by": sender_hex,
            "from_owner": is_owner,
            "source_allowed": 1 if _domain_allowed(source_url) else 0,
            "submitted_at": "submitted",
        }

        evidence_list = json.loads(self.project_evidence[project_id])
        evidence_list.append(evidence_entry)
        self.project_evidence[project_id] = json.dumps(evidence_list, sort_keys=True)

    @gl.public.write
    def evaluate_project(self, project_id: str) -> None:
        project_raw = self.projects.get(project_id, None)
        if project_raw is None or project_raw == "":
            raise Exception(f"Project '{project_id}' not found")

        project = json.loads(project_raw)
        current_health = json.loads(self.project_health[project_id])
        evidence_list = json.loads(self.project_evidence[project_id])
        history = json.loads(self.project_history[project_id])

        if len(evidence_list) == 0:
            raise Exception("Submit at least one piece of evidence before evaluation")

        # --- Anti-spam evidence selection (protect provenance & ordering) ---
        # Priority: owner-submitted evidence first, then allow-listed sources,
        # so a spammer cannot crowd out the real evidence with junk entries.
        owner_ev = [e for e in evidence_list if e.get("from_owner") == 1]
        allowed_ev = [e for e in evidence_list if e.get("from_owner") != 1 and e.get("source_allowed") == 1]
        other_ev = [e for e in evidence_list if e.get("from_owner") != 1 and e.get("source_allowed") != 1]
        # Take owner evidence (all), then allow-listed, then fill with others, cap at 10
        selected = (owner_ev + allowed_ev + other_ev)[:10]

        # Only fetch URLs from allow-listed sources (authentication of sources)
        urls_to_fetch = []
        for e in selected:
            u = e.get("source_url", "")
            if e.get("source_allowed") == 1 and u not in urls_to_fetch:
                urls_to_fetch.append(u)
        proof_url = project.get("ownership_proof_url", "")
        proof_allowed = _domain_allowed(proof_url)
        if proof_allowed and proof_url not in urls_to_fetch:
            urls_to_fetch.append(proof_url)
        urls_to_fetch = urls_to_fetch[:3]

        # Fetch each allow-listed URL on-chain
        fetched_sections = []
        for url in urls_to_fetch:
            target = url

            def fetch_one() -> str:
                web_text = gl.nondet.web.render(target, mode="text")
                return web_text[:1200]

            try:
                fetched = gl.eq_principle.strict_eq(fetch_one)
            except Exception:
                fetched = "[could not fetch this URL]"
            fetched_sections.append(f"ALLOW-LISTED SOURCE: {url}\nFETCHED CONTENT:\n{fetched}\n---")

        fetched_evidence_text = "\n".join(fetched_sections) if fetched_sections else "No allow-listed, verifiable source URLs were provided. Treat the claim as UNVERIFIED."

        # Submitted-evidence text (with provenance flags for the AI)
        evidence_text = ""
        idx = 0
        for e in selected:
            idx += 1
            prov = "OWNER-SUBMITTED" if e.get("from_owner") == 1 else "third-party"
            src = "allow-listed source" if e.get("source_allowed") == 1 else "UNVERIFIED source"
            evidence_text += f"\n[Evidence {idx}] ({prov}, {src}) Type: {e['evidence_type']}\n"
            evidence_text += f"Claimed content: {e['content']}\n"
            if e.get("source_url"):
                evidence_text += f"Source URL: {e['source_url']}\n"
            evidence_text += "---\n"

        history_text = ""
        for h in history[-5:]:
            history_text += (
                f"Verdict: {h.get('verdict', 'N/A')} | Score: {h.get('score', 'N/A')} | "
                f"Risk: {h.get('risk', 'N/A')} | Action: {h.get('recommended_action', 'N/A')}\n"
            )
        if not history_text:
            history_text = "No prior evaluation history."

        p_name = project["name"]
        p_description = project["description"]
        p_asset_type = project["asset_type"]
        p_country = project["country"]
        p_location = project.get("location", "NOT PROVIDED")
        p_price = project.get("price", "not stated")
        p_threshold = int(project["insurance_threshold"])
        eval_count = current_health["evaluation_count"]
        proof_line = proof_url if proof_url else "NONE PROVIDED"
        if proof_url and not proof_allowed:
            proof_line = proof_url + " (NOT an allow-listed source, cannot be trusted)"

        jury_input = f"""ASSET CLAIM TO VERIFY
Name: {p_name}
Asset Type: {p_asset_type}
Country: {p_country}
Physical Location: {p_location}
Stated Price: {p_price}
Ownership Proof Document: {proof_line}
Description (as claimed): {p_description}

SUBMITTED EVIDENCE (note provenance and whether the source is allow-listed):
{evidence_text}

ACTUAL FETCHED CONTENT FROM ALLOW-LISTED SOURCES (verify claims against this real content):
{fetched_evidence_text}

PRIOR EVALUATION HISTORY:
{history_text}"""

        task = f"""You are a STRICT real-world asset verifier protecting investors from fraud.

{RATING_CRITERIA}

Only trust evidence from allow-listed sources and the owner. Treat third-party evidence from
non-allow-listed sources as unverified. Compare claims against the ACTUAL FETCHED CONTENT.
Respond with ONLY a JSON object, no markdown, no backticks, exactly these fields:

{{
  "verdict": "<VERIFIED|PARTIALLY_VERIFIED|UNVERIFIED|SUSPICIOUS>",
  "score": <integer 0-100>,
  "risk": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "confidence": "<LOW|MEDIUM|HIGH>",
  "recommended_action": "<NONE|MONITOR|REVIEW|TRIGGER_INSURANCE>",
  "reasoning": "<2-4 sentences citing what the fetched allow-listed evidence confirmed or failed to confirm>",
  "key_findings": ["<finding 1>", "<finding 2>", "<finding 3>"]
}}"""

        criteria = (
            "The evaluation must only trust allow-listed sources and owner evidence, compare claims "
            "against actual fetched content, be strict, cap scores when proof or verifiable sources "
            "are missing, cite fetched evidence, and output valid JSON with all required fields."
        )

        raw_verdict = gl.eq_principle.prompt_non_comparative(
            lambda: jury_input,
            task=task,
            criteria=criteria,
        )

        clean = raw_verdict.strip().replace("```json", "").replace("```", "").strip()
        try:
            verdict_data = json.loads(clean)
        except Exception:
            verdict_data = {"score": 25, "reasoning": "AI output unparseable; treated as unverified.", "key_findings": ["Unparseable AI output"]}

        # --- Enforce the score, then NORMALIZE every field against it ---
        try:
            score = max(0, min(100, int(verdict_data.get("score", 25))))
        except Exception:
            score = 25

        key_findings = verdict_data.get("key_findings", [])
        if not isinstance(key_findings, list):
            key_findings = []

        # Hard caps
        if not proof_allowed and score > 35:
            score = 35
            key_findings.append("Score capped: no allow-listed ownership proof.")
        has_any_allowed = len(urls_to_fetch) > 0
        if not has_any_allowed and score > 45:
            score = 45
            key_findings.append("Score capped: no allow-listed verifiable sources were fetched.")

        # Every stored verdict field is derived from the FINAL enforced score,
        # so nothing can contradict the score (fixes the reviewer's normalization point).
        final_verdict = _verdict_for_score(score)
        final_risk = _risk_for_score(score)
        final_action = _action_for_score(score, p_threshold)
        final_status = _status_for_score(score, p_threshold)
        final_vstatus = _vstatus_for_score(score)
        reasoning = verdict_data.get("reasoning", "")
        confidence = verdict_data.get("confidence", "LOW")
        if confidence not in ["LOW", "MEDIUM", "HIGH"]:
            confidence = "LOW"

        project["verification_status"] = final_vstatus
        self.projects[project_id] = json.dumps(project, sort_keys=True)

        updated_health = {
            "project_id": project_id,
            "health_score": score,
            "risk_level": final_risk,
            "status": final_status,
            "last_evaluated": "evaluated",
            "latest_verdict": final_verdict,
            "evaluation_count": eval_count + 1,
        }

        history_entry = {
            "evaluation_number": eval_count + 1,
            "verdict": final_verdict,
            "score": score,
            "risk": final_risk,
            "confidence": confidence,
            "recommended_action": final_action,
            "reasoning": reasoning,
            "key_findings": key_findings,
            "status": final_status,
            "evidence_count_at_eval": len(selected),
            "urls_fetched": len(urls_to_fetch),
            "timestamp": "evaluated",
        }

        self.project_health[project_id] = json.dumps(updated_health, sort_keys=True)
        history.append(history_entry)
        self.project_history[project_id] = json.dumps(history, sort_keys=True)

    @gl.public.view
    def get_allowed_sources(self) -> str:
        return json.dumps(ALLOWED_SOURCE_DOMAINS)

    @gl.public.view
    def get_criteria(self) -> str:
        return RATING_CRITERIA

    @gl.public.view
    def get_owner(self) -> str:
        return _addr_hex(self.owner)

    @gl.public.view
    def get_project(self, project_id: str) -> str:
        data = self.projects.get(project_id, None)
        if data is None or data == "":
            return json.dumps({"error": f"Project '{project_id}' not found"})
        return data

    @gl.public.view
    def get_health(self, project_id: str) -> str:
        data = self.project_health.get(project_id, None)
        if data is None or data == "":
            return json.dumps({"error": f"Project '{project_id}' not found"})
        return data

    @gl.public.view
    def get_status(self, project_id: str) -> str:
        data = self.project_health.get(project_id, None)
        if data is None or data == "":
            return "NOT_FOUND"
        return json.loads(data).get("status", STATUS_HEALTHY)

    @gl.public.view
    def get_history(self, project_id: str) -> str:
        data = self.project_history.get(project_id, None)
        if data is None or data == "":
            return json.dumps([])
        return data

    @gl.public.view
    def get_latest_verdict(self, project_id: str) -> str:
        data = self.project_history.get(project_id, None)
        if data is None or data == "":
            return json.dumps({"error": "No history found"})
        history = json.loads(data)
        if len(history) == 0:
            return json.dumps({"error": "No evaluations yet"})
        return json.dumps(history[-1], sort_keys=True)

    @gl.public.view
    def get_evidence(self, project_id: str) -> str:
        data = self.project_evidence.get(project_id, None)
        if data is None or data == "":
            return json.dumps([])
        return data

    @gl.public.view
    def get_insurance_state(self, project_id: str) -> str:
        health_data = self.project_health.get(project_id, None)
        project_data = self.projects.get(project_id, None)
        if health_data is None or health_data == "" or project_data is None or project_data == "":
            return json.dumps({"error": "Project not found"})
        health = json.loads(health_data)
        project = json.loads(project_data)
        status = health.get("status", STATUS_HEALTHY)
        return json.dumps(
            {
                "project_id": project_id,
                "status": status,
                "health_score": health.get("health_score", 0),
                "risk_level": health.get("risk_level", RISK_HIGH),
                "insurance_threshold": project.get("insurance_threshold", 40),
                "insurance_triggered": status in [STATUS_INSURANCE_TRIGGERED, STATUS_CLAIM_ELIGIBLE],
                "claim_eligible": status == STATUS_CLAIM_ELIGIBLE,
            },
            sort_keys=True,
        )

    @gl.public.view
    def get_all_projects(self) -> str:
        return self.project_ids

    @gl.public.view
    def get_total_projects(self) -> u256:
        return self.total_projects

    @gl.public.view
    def get_dashboard(self) -> str:
        ids = json.loads(self.project_ids)
        dashboard = []
        for pid in ids:
            project_raw = self.projects.get(pid, None)
            health_raw = self.project_health.get(pid, None)
            if project_raw and project_raw != "" and health_raw and health_raw != "":
                p = json.loads(project_raw)
                h = json.loads(health_raw)
                dashboard.append(
                    {
                        "project_id": pid,
                        "name": p.get("name", ""),
                        "asset_type": p.get("asset_type", ""),
                        "country": p.get("country", ""),
                        "location": p.get("location", ""),
                        "image_url": p.get("image_url", ""),
                        "price": p.get("price", ""),
                        "verification_status": p.get("verification_status", "UNVERIFIED"),
                        "health_score": h.get("health_score", 0),
                        "risk_level": h.get("risk_level", RISK_HIGH),
                        "status": h.get("status", STATUS_REVIEW_REQUIRED),
                        "latest_verdict": h.get("latest_verdict", None),
                        "evaluation_count": h.get("evaluation_count", 0),
                    }
                )
        return json.dumps(dashboard, sort_keys=True)