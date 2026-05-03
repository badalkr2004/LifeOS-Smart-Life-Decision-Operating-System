/**
 * Background Job Scheduler
 *
 * Runs periodic intelligence jobs:
 *  - Profile recomputation (every 6 hours)
 *  - Pattern detection (every 12 hours)
 *  - Memory cleanup (daily — remove expired/low-importance memories)
 *
 * Uses simple setInterval — lightweight, no external deps.
 * For production, consider upgrading to pg-cron or BullMQ.
 */

import { db } from "../db/connection";
import { users, userDecisionProfiles, userMemories, decisions } from "../db/schema";
import { eq, sql, lt, and, isNotNull, isNull, desc } from "drizzle-orm";
import { computeUserProfile } from "./profileService";
import { detectPatterns } from "./patternService";

// ─── Configuration ───────────────────────────────────────────────────────────

const JOB_INTERVALS = {
  /** Recompute profiles for active users — every 6 hours */
  profileRefresh: 6 * 60 * 60 * 1000,

  /** Detect patterns for active users — every 12 hours */
  patternDetection: 12 * 60 * 60 * 1000,

  /** Clean up expired/low-importance memories — every 24 hours */
  memoryCleanup: 24 * 60 * 60 * 1000,

  /** Stale profile threshold — recompute if older than this */
  staleProfileAge: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// ─── Active User Discovery ──────────────────────────────────────────────────

async function getActiveUserIds(): Promise<string[]> {
  // Users who have made a decision in the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await db
    .selectDistinct({ userId: decisions.userId })
    .from(decisions)
    .where(
      and(
        isNull(decisions.deletedAt),
        sql`${decisions.decisionDate} >= ${thirtyDaysAgo.toISOString()}`,
      ),
    );

  return result.map((r) => r.userId);
}

// ─── Job: Refresh Stale Profiles ─────────────────────────────────────────────

async function refreshStaleProfiles(): Promise<void> {
  console.log("[Scheduler] Starting stale profile refresh...");

  const activeUsers = await getActiveUserIds();
  const staleThreshold = new Date(Date.now() - JOB_INTERVALS.staleProfileAge);

  let refreshed = 0;

  for (const userId of activeUsers) {
    // Check if profile is stale or doesn't exist
    const profile = await db
      .select({ lastComputedAt: userDecisionProfiles.lastComputedAt })
      .from(userDecisionProfiles)
      .where(eq(userDecisionProfiles.userId, userId))
      .limit(1);

    const isStale =
      profile.length === 0 ||
      new Date(profile[0]!.lastComputedAt) < staleThreshold;

    if (isStale) {
      try {
        await computeUserProfile(userId);
        refreshed++;
      } catch (err) {
        console.error(`[Scheduler] Profile refresh failed for ${userId}:`, err);
      }

      // Small delay between users to avoid overwhelming the DB/LLM
      await sleep(500);
    }
  }

  console.log(`[Scheduler] Profile refresh complete. ${refreshed}/${activeUsers.length} users updated.`);
}

// ─── Job: Run Pattern Detection ──────────────────────────────────────────────

async function runPatternDetection(): Promise<void> {
  console.log("[Scheduler] Starting pattern detection batch...");

  const activeUsers = await getActiveUserIds();
  let processed = 0;

  for (const userId of activeUsers) {
    try {
      await detectPatterns(userId);
      processed++;
    } catch (err) {
      console.error(`[Scheduler] Pattern detection failed for ${userId}:`, err);
    }

    await sleep(300);
  }

  console.log(`[Scheduler] Pattern detection complete. ${processed}/${activeUsers.length} users processed.`);
}

// ─── Job: Memory Cleanup ─────────────────────────────────────────────────────

async function cleanupMemories(): Promise<void> {
  console.log("[Scheduler] Starting memory cleanup...");

  const now = new Date();

  // 1. Remove expired memories
  const expiredResult = await db
    .delete(userMemories)
    .where(
      and(
        isNotNull(userMemories.expiresAt),
        lt(userMemories.expiresAt, now),
      ),
    )
    .returning({ id: userMemories.id });

  // 2. Cap memories per user at 50 (keep highest importance)
  const activeUsers = await getActiveUserIds();

  let trimmed = 0;
  for (const userId of activeUsers) {
    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(userMemories)
      .where(eq(userMemories.userId, userId));

    const memCount = count[0]?.count || 0;

    if (memCount > 50) {
      // Get the 50th highest importance score
      const threshold = await db
        .select({ importance: userMemories.importance })
        .from(userMemories)
        .where(eq(userMemories.userId, userId))
        .orderBy(desc(userMemories.importance))
        .limit(1)
        .offset(49);

      if (threshold.length > 0) {
        const deleted = await db
          .delete(userMemories)
          .where(
            and(
              eq(userMemories.userId, userId),
              lt(userMemories.importance, threshold[0]!.importance || 1),
            ),
          )
          .returning({ id: userMemories.id });

        trimmed += deleted.length;
      }
    }
  }

  console.log(`[Scheduler] Memory cleanup: ${expiredResult.length} expired removed, ${trimmed} low-importance trimmed.`);
}

// ─── Scheduler ───────────────────────────────────────────────────────────────

let intervals: NodeJS.Timeout[] = [];

export function startScheduler(): void {
  console.log("[Scheduler] Starting background job scheduler...");

  // Profile refresh — every 6 hours (first run after 5 minutes)
  const profileInterval = setInterval(refreshStaleProfiles, JOB_INTERVALS.profileRefresh);
  intervals.push(profileInterval);
  setTimeout(refreshStaleProfiles, 5 * 60 * 1000);

  // Pattern detection — every 12 hours (first run after 10 minutes)
  const patternInterval = setInterval(runPatternDetection, JOB_INTERVALS.patternDetection);
  intervals.push(patternInterval);
  setTimeout(runPatternDetection, 10 * 60 * 1000);

  // Memory cleanup — every 24 hours (first run after 15 minutes)
  const memoryInterval = setInterval(cleanupMemories, JOB_INTERVALS.memoryCleanup);
  intervals.push(memoryInterval);
  setTimeout(cleanupMemories, 15 * 60 * 1000);

  console.log("[Scheduler] Scheduled: profileRefresh (6h), patternDetection (12h), memoryCleanup (24h)");
}

export function stopScheduler(): void {
  for (const interval of intervals) {
    clearInterval(interval);
  }
  intervals = [];
  console.log("[Scheduler] Background jobs stopped.");
}

// ─── Manual Triggers (for API endpoints) ─────────────────────────────────────

export { refreshStaleProfiles, runPatternDetection, cleanupMemories };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
