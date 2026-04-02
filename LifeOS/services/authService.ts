import apiClient from "@/utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

// ─── Service ──────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * POST /api/v1/auth/login
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  /**
   * POST /api/v1/auth/register
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },

  /**
   * POST /api/v1/auth/logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
