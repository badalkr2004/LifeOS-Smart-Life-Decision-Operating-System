import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  decisionService,
  type DecisionListParams,
  type DecisionCreatePayload,
  type DecisionUpdatePayload,
  type OutcomeCreatePayload,
} from "@/services/decisionService";
import { dashboardKeys } from "@/hooks/useDashboard";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const decisionKeys = {
  all: ["decisions"] as const,
  lists: () => [...decisionKeys.all, "list"] as const,
  list: (params?: DecisionListParams) =>
    [...decisionKeys.lists(), params ?? {}] as const,
  details: () => [...decisionKeys.all, "detail"] as const,
  detail: (id: string) => [...decisionKeys.details(), id] as const,
  outcomes: (id: string) => [...decisionKeys.all, "outcomes", id] as const,
  templates: ["templates"] as const,
};

// ─── Query Hooks ──────────────────────────────────────────────────────────────

/** Paginated decision list with filters */
export function useDecisions(params?: DecisionListParams) {
  return useQuery({
    queryKey: decisionKeys.list(params),
    queryFn: () => decisionService.getDecisions(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });
}

/** Single decision by ID */
export function useDecision(id: string) {
  return useQuery({
    queryKey: decisionKeys.detail(id),
    queryFn: () => decisionService.getDecision(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/** Outcomes for a decision */
export function useDecisionOutcomes(decisionId: string) {
  return useQuery({
    queryKey: decisionKeys.outcomes(decisionId),
    queryFn: () => decisionService.getOutcomes(decisionId),
    enabled: !!decisionId,
    staleTime: 1000 * 60 * 2,
  });
}

/** Templates for autofill */
export function useTemplates() {
  return useQuery({
    queryKey: decisionKeys.templates,
    queryFn: decisionService.getTemplates,
    staleTime: 1000 * 60 * 30,
  });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

/** Create a new decision */
export function useCreateDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DecisionCreatePayload) =>
      decisionService.createDecision(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: decisionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["decisions", "recent"] });
    },
  });
}

/** Update an existing decision */
export function useUpdateDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: DecisionUpdatePayload;
    }) => decisionService.updateDecision(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: decisionKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: decisionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["decisions", "recent"] });
    },
  });
}

/** Soft-delete a decision */
export function useDeleteDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => decisionService.deleteDecision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: decisionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["decisions", "recent"] });
    },
  });
}

/** Create an outcome check-in for a decision */
export function useCreateOutcome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OutcomeCreatePayload) =>
      decisionService.createOutcome(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: decisionKeys.outcomes(variables.decisionId),
      });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.pendingCheckins });
    },
  });
}

/** Complete a pending check-in reminder */
export function useCompleteCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => decisionService.completeCheckin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.pendingCheckins });
    },
  });
}

/** Skip a pending check-in reminder */
export function useSkipCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => decisionService.skipCheckin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.pendingCheckins });
    },
  });
}
