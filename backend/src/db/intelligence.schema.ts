/**
 * LifeOS - Intelligence Schema
 * Tables: userDecisionProfiles, userMemories
 *
 * Powers the 3-Layer Intelligence Architecture:
 *  - Layer 1: Pre-computed user decision profiles
 *  - Memory system: Persistent cross-session facts
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./user.schema";

// ============================================================================
// TYPES
// ============================================================================

export type CategoryProfile = {
  count: number;
  avgSatisfaction: number | null;
  regretRate: number;
  avgConfidence: number;
  topLessons: string[];
  commonMistakes: string[];
};

export type UserProfileData = {
  memberSince: string;
  totalDecisions: number;
  totalOutcomes: number;

  // Decision velocity
  decisionsPerWeek: number;
  avgTimeBetweenDecisions: number; // days

  // Quality metrics
  overallSatisfaction: number | null;
  confidenceAccuracy: number | null; // how well confidence predicts satisfaction

  // Behavioral traits (plain English for LLM)
  traits: string[];

  // Category breakdown
  categoryProfiles: Record<string, CategoryProfile>;

  // Life context (extracted from decision descriptions over time)
  lifeContext: string[];
};

export type UserMemoryCategory =
  | "financial"
  | "life_event"
  | "preference"
  | "goal"
  | "relationship"
  | "career"
  | "health"
  | "behavioral";

// ============================================================================
// TABLES
// ============================================================================

export const userDecisionProfiles = pgTable(
  "user_decision_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),

    // Structured profile data (for programmatic access)
    profile: jsonb("profile").$type<UserProfileData>(),

    // Compact text summary for direct LLM injection (~200-400 tokens)
    textSummary: text("text_summary"),

    // Version tracking
    version: integer("version").default(1),
    lastComputedAt: timestamp("last_computed_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("user_decision_profiles_user_id_idx").on(table.userId),
  }),
);

export const userMemories = pgTable(
  "user_memories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    category: varchar("category", { length: 50 }).$type<UserMemoryCategory>(),
    fact: text("fact").notNull(),
    importance: integer("importance").default(5), // 1-10

    source: varchar("source", { length: 50 }), // "chat_session", "outcome_reflection", "decision_context"
    sourceId: uuid("source_id"),

    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("user_memories_user_id_idx").on(table.userId),
    categoryIdx: index("user_memories_category_idx").on(table.category),
    importanceIdx: index("user_memories_importance_idx").on(table.importance),
  }),
);

// ============================================================================
// RELATIONS
// ============================================================================

export const userDecisionProfilesRelations = relations(
  userDecisionProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [userDecisionProfiles.userId],
      references: [users.id],
    }),
  }),
);

export const userMemoriesRelations = relations(userMemories, ({ one }) => ({
  user: one(users, {
    fields: [userMemories.userId],
    references: [users.id],
  }),
}));
