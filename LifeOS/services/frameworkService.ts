import apiClient from "@/utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DecisionFramework = {
  id: string;
  userId: string | null;
  name: string;
  description: string | null;
  category: string | null;
  framework: {
    steps: Array<{ title: string; description: string; questions: string[] }>;
    criteria?: Array<{ name: string; weight: number; description?: string }>;
  };
  isPublic: boolean;
  isSystemFramework: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateFrameworkPayload = {
  name: string;
  description?: string;
  category?: string;
  framework: DecisionFramework["framework"];
  isPublic?: boolean;
};

// ─── API Functions ────────────────────────────────────────────────────────────

export const frameworkService = {
  /** GET /frameworks */
  getFrameworks: async (): Promise<DecisionFramework[]> => {
    const { data } = await apiClient.get<{ data: DecisionFramework[] }>("/frameworks");
    return data.data;
  },

  /** GET /frameworks/:id */
  getFramework: async (id: string): Promise<DecisionFramework> => {
    const { data } = await apiClient.get<{ data: DecisionFramework }>(`/frameworks/${id}`);
    return data.data;
  },

  /** POST /frameworks */
  createFramework: async (payload: CreateFrameworkPayload): Promise<DecisionFramework> => {
    const { data } = await apiClient.post<{ data: DecisionFramework }>("/frameworks", payload);
    return data.data;
  },
};
