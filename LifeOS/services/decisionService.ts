import apiClient from "@/utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Alternative = {
  option: string;
  prosAndCons?: {
    pros: string[];
    cons: string[];
  };
  whyNotChosen?: string;
};

export type ExpectedOutcome = {
  outcome: string;
  metric?: string;
  targetValue?: number;
  timeframe?: string;
  importance?: number;
};

export type Decision = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  status: string;
  decisionDate: string;
  expectedOutcomeDate?: string;
  context?: string;
  reasoningProcess?: string;
  alternativesConsidered?: Alternative[];
  expectedOutcomes?: ExpectedOutcome[];
  confidenceLevel: number;
  frameworkUsed?: string;
  tags?: string[];
  isPrivate: boolean;
  parentDecisionId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type DecisionListParams = {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type DecisionCreatePayload = {
  title: string;
  category?: string;
  description?: string;
  context?: string;
  reasoningProcess?: string;
  alternativesConsidered?: Alternative[];
  expectedOutcomes?: ExpectedOutcome[];
  confidenceLevel?: number;
  frameworkUsed?: string;
  tags?: string[];
  isPrivate?: boolean;
  subcategory?: string;
  expectedOutcomeDate?: string;
  parentDecisionId?: string;
  status?: string;
};

export type DecisionUpdatePayload = Partial<DecisionCreatePayload>;

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type Outcome = {
  id: string;
  decisionId: string;
  checkInDate?: string;
  timeElapsedDays?: number;
  satisfactionScore: number;
  wouldDecideAgain?: boolean;
  actualResults: string;
  metrics?: {
    metric: string;
    value: number;
    unit?: string;
    vsExpected?: string;
  }[];
  reflections?: string;
  surprises?: string;
  lessonsLearned?: string;
  unintendedConsequences?: {
    description: string;
    impact: string;
    severity: number;
  }[];
  contextChanges?: string;
  moodAtCheckIn?: number;
  stressLevel?: number;
  createdAt: string;
  updatedAt: string;
};

export type Template = {
  id: string;
  userId?: string | null;
  name: string;
  description?: string;
  category: string;
  template: {
    titlePrompt?: string;
    descriptionPrompt?: string;
    contextQuestions?: string[];
    expectedOutcomePrompts?: string[];
    suggestedTags?: string[];
    checkInIntervals?: string[];
  };
  usageCount: number;
  isPublic: boolean;
  isSystemTemplate: boolean;
  createdAt: string;
};

export type OutcomeCreatePayload = {
  decisionId: string;
  satisfactionScore: number;
  actualResults: string;
  reflections?: string;
  surprises?: string;
  lessonsLearned?: string;
  wouldDecideAgain?: boolean;
  moodAtCheckIn?: number;
  stressLevel?: number;
  metrics?: { metric: string; value: number; unit?: string; vsExpected?: string }[];
  unintendedConsequences?: { description: string; impact: string; severity: number }[];
  contextChanges?: string;
};

// ─── API Functions ────────────────────────────────────────────────────────────

export const decisionService = {
  /** GET /api/v1/decisions — Paginated decision list */
  getDecisions: async (
    params?: DecisionListParams,
  ): Promise<PaginatedResponse<Decision>> => {
    const { data } = await apiClient.get<PaginatedResponse<Decision>>(
      "/decisions",
      { params },
    );
    return data;
  },

  /** GET /api/v1/decisions/:id — Single decision */
  getDecision: async (id: string): Promise<Decision> => {
    const { data } = await apiClient.get<{ data: Decision }>(
      `/decisions/${id}`,
    );
    return data.data;
  },

  /** POST /api/v1/decisions — Create decision */
  createDecision: async (
    payload: DecisionCreatePayload,
  ): Promise<Decision> => {
    const { data } = await apiClient.post<{ data: Decision }>(
      "/decisions",
      payload,
    );
    return data.data;
  },

  /** PATCH /api/v1/decisions/:id — Update decision */
  updateDecision: async (
    id: string,
    payload: DecisionUpdatePayload,
  ): Promise<Decision> => {
    const { data } = await apiClient.patch<{ data: Decision }>(
      `/decisions/${id}`,
      payload,
    );
    return data.data;
  },

  /** DELETE /api/v1/decisions/:id — Soft delete */
  deleteDecision: async (id: string): Promise<void> => {
    await apiClient.delete(`/decisions/${id}`);
  },

  /** GET /api/v1/outcomes?decision_id=:id — Outcomes for a decision */
  getOutcomes: async (decisionId: string): Promise<Outcome[]> => {
    const { data } = await apiClient.get<{ data: Outcome[] }>("/outcomes", {
      params: { decision_id: decisionId },
    });
    return data.data;
  },

  /** POST /api/v1/outcomes — Create an outcome check-in */
  createOutcome: async (payload: OutcomeCreatePayload): Promise<Outcome> => {
    const { data } = await apiClient.post<{ data: Outcome }>("/outcomes", payload);
    return data.data;
  },

  /** POST /api/v1/outcomes/schedule-checkin — Schedule a check-in reminder */
  scheduleCheckin: async (payload: {
    decisionId: string;
    scheduledDate: string;
    reminderType?: string;
    customMessage?: string;
  }): Promise<any> => {
    const { data } = await apiClient.post("/outcomes/schedule-checkin", payload);
    return data;
  },

  /** POST /api/v1/outcomes/checkins/:id/complete — Mark check-in as completed */
  completeCheckin: async (id: string): Promise<void> => {
    await apiClient.post(`/outcomes/checkins/${id}/complete`);
  },

  /** POST /api/v1/outcomes/checkins/:id/skip — Skip a check-in */
  skipCheckin: async (id: string): Promise<void> => {
    await apiClient.post(`/outcomes/checkins/${id}/skip`);
  },

  /** GET /api/v1/templates — All templates */
  getTemplates: async (): Promise<Template[]> => {
    const { data } = await apiClient.get<{ data: Template[] }>("/templates");
    return data.data;
  },
};

