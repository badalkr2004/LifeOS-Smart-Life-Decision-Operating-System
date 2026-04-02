import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

// ─── Keys ─────────────────────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY = "lifeos_access_token";
const REFRESH_TOKEN_KEY = "lifeos_refresh_token";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  hydrate: () => Promise<void>;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  /**
   * Persist tokens to SecureStore and update Zustand state.
   * Called after successful login or register.
   * AuthGuard in _layout.tsx reacts to accessToken change → redirects to /(tabs).
   */
  setTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, refreshToken });
  },

  /**
   * Clear tokens from SecureStore and Zustand state.
   * Called on logout.
   * AuthGuard reacts → redirects to /(auth)/login.
   */
  clearTokens: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    set({ accessToken: null, refreshToken: null });
  },

  /**
   * Rehydrate tokens from SecureStore on app start.
   * Call this once in app/_layout.tsx before rendering.
   */
  hydrate: async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    set({ accessToken, refreshToken, isHydrated: true });
  },
}));
