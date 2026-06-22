/**
 * AI Module — Barrel Export
 */

export { models, SYSTEM_PROMPTS } from "./config";
export { assembleContext, generateDecisionEmbedding } from "./pipeline";
export { computeUserProfile } from "./profileService";
export { extractAndStoreMemories } from "./memoryService";
export { detectPatterns } from "./patternService";
export { startScheduler, stopScheduler } from "./scheduler";
