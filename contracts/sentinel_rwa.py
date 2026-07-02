# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""
SentinelRWA - AI-Powered Real-World Asset Intelligence
Built on GenLayer Intelligent Contracts
Network: Bradbury Testnet / GenLayer Studio
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


def _addr_hex(addr) -> str:
    val = getattr(addr, "as_hex", None)
    if isinstance(val, str):
        return val
    return str(addr)


def _determine_status(score: int, recommended_action: str, threshold: int) -> str:
    if score < threshold or recommended_action == "TRIGGER_INSURANCE":
        if score < 20:
            return STATUS_CLAIM_ELIGIBLE
        return STATUS_INSURANCE_TRIGGERED
    if recommended_action == "REVIEW" or score < 50:
        return STATUS_REVIEW_REQUIRED
    if recommended_action == "MONITOR" or score < 70:
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
        image_url: str,
        evaluation_criteria: str,
        expected_performance: str,
        insurance_threshold: u256,
    ) -> None:
        if self.projects.get(project_id, None) is not None:
            raise Exception(f"Project '{project_id}' is already registered")
        if not project_id or not name or not description:
            raise Exception("project_id, name, and description are required")
        if int(insurance_threshold) > 100:
            raise Exception("insurance_threshold must be between 0 and 100")

        sender_hex = _addr_hex(gl.message.sender_address)

        project_data = {
            "project_id": project_id,
            "name": name,
            "description": description,
            "asset_type": asset_type,
            "country": country,
            "image_url": image_url,
            "owner": sender_hex,
            "evaluation_criteria": evaluation_criteria,
            "expected_performance": expected_performance,
            "insurance_threshold": int(insurance_threshold),
            "created_at": "registered",
        }

        health_data = {
            "project_id": project_id,
            "health_score": 100,
            "risk_level": RISK_LOW,
            "status": STATUS_HEALTHY,
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
    def submit_evidence(
        self,
        project_id: str,
        evidence_type: str,
        content: str,
        source_url: str,
    ) -> None:
        if self.projects.get(project_id, None) is None:
            raise Exception(f"Project '{project_id}' not found")
        if not content:
            raise Exception("Evidence content cannot be empty")

        sender_hex = _addr_hex(gl.message.sender_address)

        evidence_entry = {
            "evidence_type": evidence_type,
            "content": content,
            "source_url": source_url,
            "submitted_by": sender_hex,
            "submitted_at": "submitted",
        }

        evidence_list = json.loads(self.project_evidence[project_id])
        evidence_list.append(evidence_entry)
        self.project_evidence[project_id] = json.dumps(evidence_list, sort_keys=True)

    @gl.public.write
    def evaluate_project(self, project_id: str) -> None:
        project_raw = self.projects.get(project_id, None)
        if project_raw is None:
            raise Exception(f"Project '{project_id}' not found")

        project = json.loads(project_raw)
        current_health = json.loads(self.project_health[project_id])
        evidence_list = json.loads(self.project_evidence[project_id])
        history = json.loads(self.project_history[project_id])

        if len(evidence_list) == 0:
            raise Exception("Submit at least one piece of evidence before evaluation")

        evidence_text = ""
        i = 0
        for ev in evidence_list[-10:]:
            i += 1
            evidence_text += f"\n[Evidence {i}] Type: {ev['evidence_type']}\n"
            evidence_text += f"Content: {ev['content']}\n"
            if ev.get("source_url"):
                evidence_text += f"Reference URL: {ev['source_url']}\n"
            evidence_text += "---\n"

        history_text = ""
        for h in history[-5:]:
            history_text += (
                f"Verdict: {h.get('verdict', 'N/A')} | "
                f"Score: {h.get('score', 'N/A')} | "
                f"Risk: {h.get('risk', 'N/A')} | "
                f"Action: {h.get('recommended_action', 'N/A')}\n"
            )
        if not history_text:
            history_text = "No prior evaluation history."

        p_name = project["name"]
        p_description = project["description"]
        p_asset_type = project["asset_type"]
        p_country = project["country"]
        p_criteria = project["evaluation_criteria"]
        p_expected = project["expected_performance"]
        p_threshold = int(project["insurance_threshold"])
        current_score = current_health["health_score"]
        eval_count = current_health["evaluation_count"]

        jury_input = f"""ASSET PROFILE
Name: {p_name}
Asset Type: {p_asset_type}
Country: {p_country}
Description: {p_description}

EVALUATION CRITERIA (what must be true for this asset to be healthy):
{p_criteria}

EXPECTED PERFORMANCE BENCHMARK:
{p_expected}

INSURANCE TRIGGER THRESHOLD: Health score below {p_threshold}/100 triggers insurance review.

SUBMITTED EVIDENCE:
{evidence_text}

PRIOR EVALUATION HISTORY:
{history_text}

Current Health Score (before this evaluation): {current_score}/100
Total Previous Evaluations: {eval_count}"""

        task = f"""You are a senior analyst on the SentinelRWA AI Jury evaluating a Real-World Asset.

Evaluate the asset in the input using ALL evidence. Respond with ONLY a JSON object, no markdown, no backticks, exactly these fields:

{{
  "verdict": "<PASS|CONCERN|FAIL>",
  "score": <integer 0-100>,
  "risk": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "confidence": "<LOW|MEDIUM|HIGH>",
  "recommended_action": "<NONE|MONITOR|REVIEW|TRIGGER_INSURANCE>",
  "reasoning": "<2-4 sentences>",
  "key_findings": ["<finding 1>", "<finding 2>", "<finding 3>"]
}}

SCORING GUIDE:
- 90-100 excellent, all criteria met, low risk
- 70-89 good, minor concerns
- 50-69 moderate concern, elevated risk
- 30-49 significant issues, high risk
- 0-29 critical failure, insurance action warranted

VERDICT: PASS if score >= 70, CONCERN if 40-69, FAIL if < 40.
ACTION: NONE if score >= 70; MONITOR if 55-69; REVIEW if 40-54; TRIGGER_INSURANCE if score < 40 or below the threshold of {p_threshold}."""

        criteria = (
            "The evaluation must reference the provided evidence, assign a score "
            "consistent with evidence quality, classify risk to match the score, "
            "recommend an action consistent with the score and insurance threshold, "
            "and give reasoning that logically connects evidence to the verdict. "
            "Output must be valid JSON with all required fields."
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
            verdict_data = {
                "verdict": "CONCERN",
                "score": 50,
                "risk": RISK_MEDIUM,
                "confidence": "LOW",
                "recommended_action": "REVIEW",
                "reasoning": "AI output could not be parsed, manual review required.",
                "key_findings": ["Unparseable AI output"],
                "parse_error": True,
            }

        try:
            score = max(0, min(100, int(verdict_data.get("score", 50))))
        except Exception:
            score = 50
        verdict_data["score"] = score

        new_status = _determine_status(
            score, verdict_data.get("recommended_action", "NONE"), p_threshold
        )
        new_risk = verdict_data.get("risk", RISK_MEDIUM)

        updated_health = {
            "project_id": project_id,
            "health_score": score,
            "risk_level": new_risk,
            "status": new_status,
            "last_evaluated": "evaluated",
            "latest_verdict": verdict_data.get("verdict", "CONCERN"),
            "evaluation_count": eval_count + 1,
        }

        history_entry = {
            "evaluation_number": eval_count + 1,
            "verdict": verdict_data.get("verdict", "CONCERN"),
            "score": score,
            "risk": new_risk,
            "confidence": verdict_data.get("confidence", "MEDIUM"),
            "recommended_action": verdict_data.get("recommended_action", "NONE"),
            "reasoning": verdict_data.get("reasoning", ""),
            "key_findings": verdict_data.get("key_findings", []),
            "status": new_status,
            "evidence_count_at_eval": len(evidence_list),
            "timestamp": "evaluated",
        }

        self.project_health[project_id] = json.dumps(updated_health, sort_keys=True)
        history.append(history_entry)
        self.project_history[project_id] = json.dumps(history, sort_keys=True)

    @gl.public.view
    def get_project(self, project_id: str) -> str:
        data = self.projects.get(project_id, None)
        if data is None:
            return json.dumps({"error": f"Project '{project_id}' not found"})
        return data

    @gl.public.view
    def get_health(self, project_id: str) -> str:
        data = self.project_health.get(project_id, None)
        if data is None:
            return json.dumps({"error": f"Project '{project_id}' not found"})
        return data

    @gl.public.view
    def get_status(self, project_id: str) -> str:
        data = self.project_health.get(project_id, None)
        if data is None:
            return "NOT_FOUND"
        return json.loads(data).get("status", STATUS_HEALTHY)

    @gl.public.view
    def get_history(self, project_id: str) -> str:
        data = self.project_history.get(project_id, None)
        if data is None:
            return json.dumps([])
        return data

    @gl.public.view
    def get_latest_verdict(self, project_id: str) -> str:
        data = self.project_history.get(project_id, None)
        if data is None:
            return json.dumps({"error": "No history found"})
        history = json.loads(data)
        if len(history) == 0:
            return json.dumps({"error": "No evaluations yet"})
        return json.dumps(history[-1], sort_keys=True)

    @gl.public.view
    def get_evidence(self, project_id: str) -> str:
        data = self.project_evidence.get(project_id, None)
        if data is None:
            return json.dumps([])
        return data

    @gl.public.view
    def get_insurance_state(self, project_id: str) -> str:
        health_data = self.project_health.get(project_id, None)
        project_data = self.projects.get(project_id, None)
        if health_data is None or project_data is None:
            return json.dumps({"error": "Project not found"})
        health = json.loads(health_data)
        project = json.loads(project_data)
        status = health.get("status", STATUS_HEALTHY)
        return json.dumps(
            {
                "project_id": project_id,
                "status": status,
                "health_score": health.get("health_score", 100),
                "risk_level": health.get("risk_level", RISK_LOW),
                "insurance_threshold": project.get("insurance_threshold", 40),
                "insurance_triggered": status
                in [STATUS_INSURANCE_TRIGGERED, STATUS_CLAIM_ELIGIBLE],
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
            if project_raw and health_raw:
                p = json.loads(project_raw)
                h = json.loads(health_raw)
                dashboard.append(
                    {
                        "project_id": pid,
                        "name": p.get("name", ""),
                        "asset_type": p.get("asset_type", ""),
                        "country": p.get("country", ""),
                        "image_url": p.get("image_url", ""),
                        "health_score": h.get("health_score", 100),
                        "risk_level": h.get("risk_level", RISK_LOW),
                        "status": h.get("status", STATUS_HEALTHY),
                        "latest_verdict": h.get("latest_verdict", None),
                        "evaluation_count": h.get("evaluation_count", 0),
                    }
                )
        return json.dumps(dashboard, sort_keys=True)
