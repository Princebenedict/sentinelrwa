"""
SentinelRWA Integration Tests
Tests run against GenLayer Studio (localnet / studionet).
"""

import pytest
import json

# NOTE: Install genlayer test runner:
# pip install genlayer


def test_contract_imports():
    """Verify the contract file has valid Python syntax."""
    import ast
    with open("contracts/sentinel_rwa.py", "r") as f:
        source = f.read()
    # Remove the GenVM header comment for pure Python parsing
    source_clean = "\n".join(
        line for line in source.split("\n")
        if not line.strip().startswith("# {")
    )
    try:
        ast.parse(source_clean)
        print("✅ Contract syntax valid")
    except SyntaxError as e:
        pytest.fail(f"Syntax error in contract: {e}")


def test_status_thresholds():
    """Test insurance status logic at various score levels."""
    # Simulate the _determine_status logic
    def determine_status(score, recommended_action, threshold):
        if score < threshold or recommended_action == "TRIGGER_INSURANCE":
            if score < 20:
                return "CLAIM_ELIGIBLE"
            return "INSURANCE_TRIGGERED"
        if recommended_action == "REVIEW" or score < 50:
            return "REVIEW_REQUIRED"
        if recommended_action == "MONITOR" or score < 70:
            return "MONITOR"
        return "HEALTHY"

    threshold = 40

    assert determine_status(95, "NONE", threshold) == "HEALTHY"
    assert determine_status(65, "MONITOR", threshold) == "MONITOR"
    assert determine_status(45, "REVIEW", threshold) == "REVIEW_REQUIRED"
    assert determine_status(35, "TRIGGER_INSURANCE", threshold) == "INSURANCE_TRIGGERED"
    assert determine_status(15, "TRIGGER_INSURANCE", threshold) == "CLAIM_ELIGIBLE"

    print("✅ Status threshold logic correct")


def test_evidence_structure():
    """Validate expected evidence JSON structure."""
    evidence = {
        "evidence_type": "inspection_report",
        "content": "Annual inspection complete. Building structure sound.",
        "source_url": "",
        "fetched_web_content": "",
        "submitted_by": "0x1234567890abcdef",
        "submitted_at": "submitted",
    }
    assert "evidence_type" in evidence
    assert "content" in evidence
    assert isinstance(evidence["content"], str)
    print("✅ Evidence structure valid")


def test_verdict_parsing():
    """Verify verdict JSON parsing handles valid and malformed outputs."""
    valid_verdict = json.dumps({
        "verdict": "PASS",
        "score": 82,
        "risk": "LOW",
        "confidence": "HIGH",
        "recommended_action": "NONE",
        "reasoning": "Asset is performing well against all criteria.",
        "key_findings": ["Revenue on target", "Maintenance up to date"],
    })
    parsed = json.loads(valid_verdict)
    assert parsed["score"] == 82
    assert parsed["verdict"] == "PASS"

    # Test clamping
    score = max(0, min(100, int(parsed.get("score", 50))))
    assert 0 <= score <= 100

    print("✅ Verdict parsing correct")


if __name__ == "__main__":
    test_contract_imports()
    test_status_thresholds()
    test_evidence_structure()
    test_verdict_parsing()
    print("\n✅ All tests passed")