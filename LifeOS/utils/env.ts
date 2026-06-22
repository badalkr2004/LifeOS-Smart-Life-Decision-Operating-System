/**
 * Environment validation — ensures required env vars are set on startup.
 */

export function validateEnv(): void {
  if (!process.env.EXPO_PUBLIC_API_URL) {
    console.warn(
      "[LifeOS] EXPO_PUBLIC_API_URL is not set. Defaulting to http://localhost:8000/api/v1",
    );
  }
}
