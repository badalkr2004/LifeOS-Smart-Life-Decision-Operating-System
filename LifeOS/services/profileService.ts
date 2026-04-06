import apiClient from "@/utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  timezone: string;
  locale: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id?: string;
  userId: string;
  bio?: string | null;
  occupation?: string | null;
  location?: string | null;
  dateOfBirth?: string | null;
  defaultCheckInIntervals?: string[] | null;
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    frequency?: string;
  } | null;
  privacySettings?: {
    shareAnonymousData?: boolean;
    allowAITraining?: boolean;
    publicProfile?: boolean;
  } | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  timezone?: string;
  locale?: string;
};

export type UpdateProfilePayload = {
  bio?: string | null;
  occupation?: string | null;
  location?: string | null;
  dateOfBirth?: string | null;
  notificationPreferences?: UserProfile["notificationPreferences"];
  privacySettings?: UserProfile["privacySettings"];
};

// ─── API Functions ────────────────────────────────────────────────────────────

export const profileService = {
  /** GET /api/v1/users/me */
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<{ user: User }>("/users/me");
    return data.user;
  },

  /** PUT /api/v1/users/me (update basic user info) */
  updateMe: async (payload: UpdateUserPayload): Promise<User> => {
    const { data } = await apiClient.put<{ user: User }>("/users/me", payload);
    return data.user;
  },

  /** GET /api/v1/users/me/profile */
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<{ profile: UserProfile }>(
      "/users/me/profile",
    );
    return data.profile;
  },

  /** PUT /api/v1/users/me/profile (upsert) */
  updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const { data } = await apiClient.put<{ profile: UserProfile }>(
      "/users/me/profile",
      payload,
    );
    return data.profile;
  },

  /** POST /api/v1/auth/logout */
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post("/auth/logout", { refreshToken });
  },
};
