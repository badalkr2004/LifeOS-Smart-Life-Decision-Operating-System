import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  profileService,
  type UpdateUserPayload,
  type UpdateProfilePayload,
} from "@/services/profileService";
import { dashboardKeys } from "@/hooks/useDashboard";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const profileKeys = {
  user: ["user", "me"] as const,           // shared with dashboard
  profile: ["user", "profile"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Current user data (shared cache key with dashboard's useUser) */
export function useUser() {
  return useQuery({
    queryKey: profileKeys.user,
    queryFn: profileService.getMe,
    staleTime: 1000 * 60 * 10,
  });
}

/** User profile (bio, occupation, location, etc.) */
export function useUserProfile() {
  return useQuery({
    queryKey: profileKeys.profile,
    queryFn: profileService.getProfile,
    staleTime: 1000 * 60 * 10,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Update basic user info (firstName, lastName, displayName) */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => profileService.updateMe(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.user });
    },
  });
}

/** Update profile details (bio, occupation, location) */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile });
    },
  });
}
