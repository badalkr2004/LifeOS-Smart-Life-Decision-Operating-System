import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const dashboardKeys = {
  user: ["user", "me"] as const,
  pendingCheckins: ["outcomes", "pending-checkins"] as const,
  insights: ["analytics", "insights"] as const,
  recentDecisions: ["decisions", "recent"] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Current user data for greeting */
export function useUser() {
  return useQuery({
    queryKey: dashboardKeys.user,
    queryFn: dashboardService.getMe,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}

/** Pending check-in reminders */
export function usePendingCheckins() {
  return useQuery({
    queryKey: dashboardKeys.pendingCheckins,
    queryFn: dashboardService.getPendingCheckins,
    staleTime: 1000 * 60 * 2, // 2 min
  });
}

/** AI insights — returns top non-dismissed insight */
export function useTopInsight() {
  return useQuery({
    queryKey: dashboardKeys.insights,
    queryFn: dashboardService.getInsights,
    select: (insights) => insights[0] ?? null,
    staleTime: 1000 * 60 * 5,
  });
}

/** Recent decisions feed */
export function useRecentDecisions() {
  return useQuery({
    queryKey: dashboardKeys.recentDecisions,
    queryFn: dashboardService.getRecentDecisions,
    staleTime: 1000 * 60 * 2,
  });
}
