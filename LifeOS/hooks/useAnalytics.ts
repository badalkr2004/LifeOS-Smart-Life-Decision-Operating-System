import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const analyticsKeys = {
  summary: ["analytics", "summary"] as const,
  patterns: ["analytics", "patterns"] as const,
  qualityOverTime: ["analytics", "quality-over-time"] as const,
  insights: ["analytics", "insights"] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: analyticsKeys.summary,
    queryFn: () => analyticsService.getSummary(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useAnalyticsPatterns() {
  return useQuery({
    queryKey: analyticsKeys.patterns,
    queryFn: () => analyticsService.getPatterns(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useQualityOverTime() {
  return useQuery({
    queryKey: analyticsKeys.qualityOverTime,
    queryFn: () => analyticsService.getQualityOverTime(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useInsights() {
  return useQuery({
    queryKey: analyticsKeys.insights,
    queryFn: () => analyticsService.getInsights(),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}

export function useDismissInsight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analyticsService.dismissInsight(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: analyticsKeys.insights });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: (error) => {
      console.error("Failed to dismiss insight:", error);
    },
  });
}
