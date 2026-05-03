import { useMutation } from "@tanstack/react-query";
import { aiService, type AnalysisPayload } from "@/services/aiService";

/** Trigger pre-decision analysis before creating a decision */
export function usePreDecisionAnalysis() {
  return useMutation({
    mutationFn: (payload: AnalysisPayload) =>
      aiService.preDecisionAnalysis(payload),
  });
}
