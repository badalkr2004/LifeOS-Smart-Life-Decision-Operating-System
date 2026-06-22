import apiClient from "@/utils/api";
import { useAuthStore } from "@/store/authStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PreDecisionAnalysis = {
  verdict: "proceed" | "caution" | "reconsider";
  confidenceInVerdict: number;
  summary: string;
  riskFactors: Array<{
    factor: string;
    severity: "high" | "medium" | "low";
    basedOn: string;
  }>;
  supportingEvidence: Array<{
    point: string;
    source: string;
  }>;
  suggestions: string[];
  blindSpots: string[];
  timingAssessment: string;
  historicalContext: {
    totalCategoryDecisions: number;
    avgSatisfaction: number | null;
    regretRate: number;
    recentDecisionCount: number;
    overallAvgSatisfaction: number | null;
    pastDecisions: Array<{
      title: string;
      satisfaction: number;
      wouldDecideAgain: boolean | null;
      lessons: string | null;
    }>;
  };
};

export type AnalysisPayload = {
  title: string;
  category: string;
  description?: string;
  context?: string;
  confidenceLevel?: number;
  expectedOutcomes?: any[];
  alternativesConsidered?: any[];
};

export type ChatSession = {
  id: string;
  userId: string;
  decisionId: string | null;
  title: string | null;
  messageCount: number;
  totalTokensUsed: number;
  createdAt: string;
  lastMessageAt: string;
};

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: { model?: string; tokensUsed?: number };
  createdAt: string;
};

export type ChatSendPayload = {
  sessionId?: string;
  message: string;
  decisionId?: string;
};

// ─── SSE Event Types ──────────────────────────────────────────────────────────

export type SSEEvent =
  | { type: "session"; sessionId: string }
  | { type: "delta"; text: string }
  | { type: "done"; usage: number };

export type DetectedPattern = {
  id: string;
  userId: string;
  patternType: string;
  category: string | null;
  pattern: {
    condition: string;
    outcome: string;
    frequency: number;
    confidence: number;
    sampleSize: number;
  };
  strength: string;
  discoveredAt: string;
  lastUpdatedAt: string;
};

// ─── API Functions ────────────────────────────────────────────────────────────

export const aiService = {
  /** POST /ai/pre-decision-analysis */
  preDecisionAnalysis: async (
    payload: AnalysisPayload,
  ): Promise<PreDecisionAnalysis> => {
    const { data } = await apiClient.post<{ data: PreDecisionAnalysis }>(
      "/ai/pre-decision-analysis",
      payload,
    );
    return data.data;
  },

  /** GET /ai/chat/sessions */
  getChatSessions: async (): Promise<ChatSession[]> => {
    const { data } = await apiClient.get<{ data: ChatSession[] }>(
      "/ai/chat/sessions",
    );
    return data.data;
  },

  /** GET /ai/chat/sessions/:id */
  getChatHistory: async (
    sessionId: string,
  ): Promise<{ session: ChatSession; messages: ChatMessage[] }> => {
    const { data } = await apiClient.get<{
      data: { session: ChatSession; messages: ChatMessage[] };
    }>(`/ai/chat/sessions/${sessionId}`);
    return data.data;
  },

  /**
   * POST /ai/chat — Streaming via SSE (EventSource)
   * Returns a reader-style callback pattern for React Native
   */
  sendChatMessage: async (
    payload: ChatSendPayload,
    onEvent: (event: SSEEvent) => void,
    onError: (err: Error) => void,
    onComplete: () => void,
  ): Promise<void> => {
    const baseURL =
      process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

    // Get token from the Zustand store (hydrated on app start by _layout.tsx)
    const getToken = () => useAuthStore.getState().accessToken;

    const doFetch = async (retried = false): Promise<void> => {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`${baseURL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
      });

      // If 401 and we haven't retried yet, trigger refresh via axios interceptor
      if (response.status === 401 && !retried) {
        try {
          // Make a dummy API call to trigger the interceptor's refresh logic
          await apiClient.get("/users/me", { timeout: 5000 });
        } catch {
          // Interceptor handles refresh — if it fails, we'll get a fresh 401 on retry
        }
        return doFetch(true);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat request failed: ${response.status} ${errorText}`);
      }

      const contentType = response.headers.get("content-type") || "";

      // ── SSE streaming response ──
      if (contentType.includes("text/event-stream")) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event = JSON.parse(line.slice(6)) as SSEEvent;
                onEvent(event);
                if (event.type === "done") {
                  onComplete();
                  return;
                }
              } catch {
                // Skip malformed lines
              }
            }
          }
        }
        onComplete();
      } else {
        // ── JSON fallback response ──
        const json = await response.json();
        if (json.data?.sessionId) {
          onEvent({ type: "session", sessionId: json.data.sessionId });
        }
        if (json.data?.reply) {
          onEvent({ type: "delta", text: json.data.reply });
        }
        onEvent({ type: "done", usage: 0 });
        onComplete();
      }
    };

    try {
      await doFetch();
    } catch (err: any) {
      onError(err);
    }
  },

  /** POST /ai/compute-profile */
  computeProfile: async (): Promise<void> => {
    await apiClient.post("/ai/compute-profile");
  },

  /** GET /ai/patterns */
  getPatterns: async (): Promise<DetectedPattern[]> => {
    const { data } = await apiClient.get<{ data: DetectedPattern[] }>(
      "/ai/patterns",
    );
    return data.data;
  },

  /** POST /ai/detect-patterns */
  detectPatterns: async (): Promise<void> => {
    await apiClient.post("/ai/detect-patterns");
  },
};
