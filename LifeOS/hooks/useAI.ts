import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiService, type AnalysisPayload } from "@/services/aiService";

// ─── Query Keys ──────────────────────────────────────────────────────────────

const AI_KEYS = {
  sessions: ["ai", "sessions"] as const,
  session: (id: string) => ["ai", "session", id] as const,
  patterns: ["ai", "patterns"] as const,
};

// ─── Pre-Decision Analysis ───────────────────────────────────────────────────

export function usePreDecisionAnalysis() {
  return useMutation({
    mutationFn: (payload: AnalysisPayload) =>
      aiService.preDecisionAnalysis(payload),
  });
}

// ─── Chat Sessions ───────────────────────────────────────────────────────────

export function useChatSessions() {
  return useQuery({
    queryKey: AI_KEYS.sessions,
    queryFn: () => aiService.getChatSessions(),
    staleTime: 30_000,
  });
}

export function useChatHistory(sessionId: string) {
  return useQuery({
    queryKey: AI_KEYS.session(sessionId),
    queryFn: () => aiService.getChatHistory(sessionId),
    enabled: !!sessionId,
  });
}

export function useInvalidateSessions() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: AI_KEYS.sessions });
}

// ─── Profile Computation ─────────────────────────────────────────────────────

export function useComputeProfile() {
  return useMutation({
    mutationFn: () => aiService.computeProfile(),
  });
}

// ─── Pattern Detection ───────────────────────────────────────────────────────

export function usePatterns() {
  return useQuery({
    queryKey: AI_KEYS.patterns,
    queryFn: () => aiService.getPatterns(),
    staleTime: 60_000,
  });
}

export function useDetectPatterns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => aiService.detectPatterns(),
    onSuccess: () => {
      // Invalidate patterns cache after detection
      queryClient.invalidateQueries({ queryKey: AI_KEYS.patterns });
    },
  });
}
