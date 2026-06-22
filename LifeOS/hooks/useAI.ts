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
    onError: (error) => {
      console.error("Pre-decision analysis failed:", error);
    },
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
    retry: 2,
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
    onError: (error) => {
      console.error("Profile computation failed:", error);
    },
  });
}

// ─── Pattern Detection ───────────────────────────────────────────────────────

export function usePatterns() {
  return useQuery({
    queryKey: AI_KEYS.patterns,
    queryFn: () => aiService.getPatterns(),
    staleTime: 60_000,
    retry: 2,
  });
}

export function useDetectPatterns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => aiService.detectPatterns(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_KEYS.patterns });
    },
    onError: (error) => {
      console.error("Pattern detection failed:", error);
    },
  });
}
