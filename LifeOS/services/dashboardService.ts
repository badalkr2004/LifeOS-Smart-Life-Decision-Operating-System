import apiClient from "@/utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName?: string;
  status: string;
};

export type PendingCheckin = {
  id: string;
  decisionId: string;
  userId: string;
  reminderType: string;
  scheduledDate: string;
  status: string;
  customMessage?: string;
  createdAt: string;
};

export type Insight = {
  id: string;
  userId: string;
  insightType: string;
  title: string;
  description: string;
  dataPoints?: number;
  dismissed: boolean;
  createdAt: string;
};

export type Decision = {
  id: string;
  userId: string;
  title: string;
  category: string;
  status: string;
  description?: string;
  confidenceLevel: number;
  decisionDate: string;
  createdAt: string;
  updatedAt: string;
};

// ─── API Functions ────────────────────────────────────────────────────────────

export const dashboardService = {
  /** GET /api/v1/users/me — Current user for greeting */
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<{ user: User }>("/users/me");
    return data.user;
  },

  /** GET /api/v1/outcomes/pending-checkins — Pending action items */
  getPendingCheckins: async (): Promise<PendingCheckin[]> => {
    const { data } = await apiClient.get<{ data: PendingCheckin[] }>(
      "/outcomes/pending-checkins",
    );
    return data.data;
  },

  /** GET /api/v1/analytics/insights — AI insights */
  getInsights: async (): Promise<Insight[]> => {
    const { data } = await apiClient.get<{ data: Insight[] }>(
      "/analytics/insights",
    );
    return data.data;
  },

  /** GET /api/v1/decisions?limit=5&sortOrder=desc — Recent decisions */
  getRecentDecisions: async (): Promise<Decision[]> => {
    const { data } = await apiClient.get<{
      data: Decision[];
      pagination: any;
    }>("/decisions", {
      params: { limit: 5, sortOrder: "desc" },
    });
    return data.data;
  },
};
