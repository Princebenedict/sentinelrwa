"use client";

import { useState, useCallback } from "react";
import { callView, sendWrite } from "@/lib/genlayer";
import { useWallet } from "@/hooks/useWallet";
import type {
  DashboardItem, Project, ProjectHealth, VerdictHistory, InsuranceState, EvidenceEntry,
} from "@/lib/types";

export function useContract() {
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try { return await fn(); }
      catch (e) { setError(e instanceof Error ? e.message : String(e)); return null; }
      finally { setLoading(false); }
    }, []);

  const getDashboard = useCallback(() => withLoading(() => callView<DashboardItem[]>("get_dashboard")), [withLoading]);
  const getProject = useCallback((id: string) => withLoading(() => callView<Project>("get_project", [id])), [withLoading]);
  const getHealth = useCallback((id: string) => withLoading(() => callView<ProjectHealth>("get_health", [id])), [withLoading]);
  const getHistory = useCallback((id: string) => withLoading(() => callView<VerdictHistory[]>("get_history", [id])), [withLoading]);
  const getInsuranceState = useCallback((id: string) => withLoading(() => callView<InsuranceState>("get_insurance_state", [id])), [withLoading]);
  const getEvidence = useCallback((id: string) => withLoading(() => callView<EvidenceEntry[]>("get_evidence", [id])), [withLoading]);
  const getOwner = useCallback(() => withLoading(() => callView<string>("get_owner")), [withLoading]);

  const registerProject = useCallback(
    (p: {
      project_id: string; name: string; description: string; asset_type: string;
      country: string; location: string; image_url: string; ownership_proof_url: string;
      lister_contact: string; price: string; expected_performance: string; insurance_threshold: number;
    }) =>
      withLoading(() =>
        sendWrite("register_project", [
          p.project_id, p.name, p.description, p.asset_type, p.country, p.location,
          p.image_url, p.ownership_proof_url, p.lister_contact, p.price,
          p.expected_performance, p.insurance_threshold,
        ], address || "")
      ),
    [withLoading, address]
  );

  const removeProject = useCallback((id: string) => withLoading(() => sendWrite("remove_project", [id], address || "")), [withLoading, address]);

  const submitEvidence = useCallback(
    (p: { project_id: string; evidence_type: string; content: string; source_url: string }) =>
      withLoading(() => sendWrite("submit_evidence", [p.project_id, p.evidence_type, p.content, p.source_url], address || "")),
    [withLoading, address]
  );

  const evaluateProject = useCallback((id: string) => withLoading(() => sendWrite("evaluate_project", [id], address || "")), [withLoading, address]);

  return {
    loading, error, address,
    getDashboard, getProject, getHealth, getHistory, getInsuranceState, getEvidence, getOwner,
    registerProject, removeProject, submitEvidence, evaluateProject,
  };
}
