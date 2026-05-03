import apiClient from "@/utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PreDecisionAnalysis = {
  verdict: "proceed" | "caution" | "reconsider";
  confidenceInVerdict: number;
  summary: string;
  riskFactors: Array<{
    factor: string;
    severity: "high" | "medium" | "low";
    basedOn: string;
  }>;
  supportingEvidence: Array<{
    point: string;
    source: string;
  }>;
  suggestions: string[];
  blindSpots: string[];
  timingAssessment: string;
  historicalContext: {
    totalCategoryDecisions: number;
    avgSatisfaction: number | null;
    regretRate: number;
    recentDecisionCount: number;
    overallAvgSatisfaction: number | null;
    pastDecisions: Array<{
      title: string;
      satisfaction: number;
      wouldDecideAgain: boolean | null;
      lessons: string | null;
    }>;
  };
};

export type AnalysisPayload = {
  title: string;
  category: string;
  description?: string;
  context?: string;
  confidenceLevel?: number;
  expectedOutcomes?: any[];
  alternativesConsidered?: any[];
};

// ─── API Functions ────────────────────────────────────────────────────────────

export const aiService = {
  /** POST /api/v1/ai/pre-decision-analysis */
  preDecisionAnalysis: async (
    payload: AnalysisPayload,
  ): Promise<PreDecisionAnalysis> => {
    const { data } = await apiClient.post<{ data: PreDecisionAnalysis }>(
      "/ai/pre-decision-analysis",
      payload,
    );
    return data.data;
  },
};
