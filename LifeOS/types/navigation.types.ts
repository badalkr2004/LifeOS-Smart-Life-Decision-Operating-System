/**
 * navigation.types.ts
 *
 * Typed route params for Expo Router.
 * These are used with the useRouter() hook and <Link href={...} /> for type safety.
 *
 * Expo Router v3+ supports typed routes natively when you enable
 * `experiments.typedRoutes: true` in app.config.ts.
 */

// ─── Auth Stack ───────────────────────────────────────────────────────────────
// Used only if you ever need to imperatively navigate within the auth group.

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// ─── Tab Routes ───────────────────────────────────────────────────────────────

export type TabRoutes =
  | "/(tabs)" // Dashboard
  | "/(tabs)/decisions"
  | "/(tabs)/ai"
  | "/(tabs)/analytics"
  | "/(tabs)/profile";

// ─── Decision routes ─────────────────────────────────────────────────────────

export type DecisionDetailParams = {
  id: string; // Maps to app/(tabs)/decisions/[id].tsx
};

// ─── Auth routes ─────────────────────────────────────────────────────────────

export type AuthRoutes = "/(auth)/login" | "/(auth)/register";
