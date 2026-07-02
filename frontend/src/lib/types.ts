export interface Project {
  project_id: string;
  name: string;
  description: string;
  asset_type: string;
  country: string;
  image_url: string;
  owner: string;
  evaluation_criteria: string;
  expected_performance: string;
  insurance_threshold: number;
  created_at: string;
}

export interface ProjectHealth {
  project_id: string;
  health_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "HEALTHY" | "MONITOR" | "REVIEW_REQUIRED" | "INSURANCE_TRIGGERED" | "CLAIM_ELIGIBLE";
  last_evaluated: string;
  latest_verdict: string | null;
  evaluation_count: number;
}

export interface EvidenceEntry {
  evidence_type: string;
  content: string;
  source_url: string;
  submitted_by: string;
  submitted_at: string;
}

export interface VerdictHistory {
  evaluation_number: number;
  verdict: "PASS" | "CONCERN" | "FAIL";
  score: number;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: "LOW" | "MEDIUM" | "HIGH";
  recommended_action: "NONE" | "MONITOR" | "REVIEW" | "TRIGGER_INSURANCE";
  reasoning: string;
  key_findings: string[];
  status: string;
  evidence_count_at_eval: number;
  timestamp: string;
}

export interface DashboardItem {
  project_id: string;
  name: string;
  asset_type: string;
  country: string;
  image_url: string;
  health_score: number;
  risk_level: string;
  status: string;
  latest_verdict: string | null;
  evaluation_count: number;
}

export interface InsuranceState {
  project_id: string;
  status: string;
  health_score: number;
  risk_level: string;
  insurance_threshold: number;
  insurance_triggered: boolean;
  claim_eligible: boolean;
}
