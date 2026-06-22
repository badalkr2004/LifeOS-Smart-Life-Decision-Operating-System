import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { frameworkService, type CreateFrameworkPayload } from "@/services/frameworkService";

// ─── Query Keys ──────────────────────────────────────────────────────────────

const FRAMEWORK_KEYS = {
  all: ["frameworks"] as const,
  detail: (id: string) => ["frameworks", id] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useFrameworks() {
  return useQuery({
    queryKey: FRAMEWORK_KEYS.all,
    queryFn: () => frameworkService.getFrameworks(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useFramework(id: string) {
  return useQuery({
    queryKey: FRAMEWORK_KEYS.detail(id),
    queryFn: () => frameworkService.getFramework(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateFramework() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFrameworkPayload) => frameworkService.createFramework(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRAMEWORK_KEYS.all });
    },
    onError: (error) => {
      console.error("Failed to create framework:", error);
    },
  });
}
