/**
 * Wizard Reducer — State management for the decision creation wizard.
 *
 * Manages: title, category, description, context, alternatives,
 * expected outcomes, confidence level, and template autofill.
 */

import type { Template, Decision } from '@/services/decisionService';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WizardState = {
    title: string;
    category: string;
    description: string;
    context: string;
    reasoningProcess: string;
    alternatives: string[];
    expectedOutcomes: { outcome: string; metric: string; targetValue: string }[];
    expectedOutcomeDate: string;
    confidenceLevel: number;
    tags: string[];
};

export type WizardAction =
    | { type: 'SET_FIELD'; field: keyof WizardState; value: any }
    | { type: 'ADD_ALTERNATIVE' }
    | { type: 'UPDATE_ALTERNATIVE'; index: number; value: string }
    | { type: 'REMOVE_ALTERNATIVE'; index: number }
    | { type: 'ADD_METRIC' }
    | { type: 'UPDATE_METRIC'; index: number; field: string; value: string }
    | { type: 'REMOVE_METRIC'; index: number }
    | { type: 'APPLY_TEMPLATE'; template: Template }
    | { type: 'LOAD_DECISION'; decision: Decision }
    | { type: 'RESET' };

// ─── Initial State ────────────────────────────────────────────────────────────

export const initialWizardState: WizardState = {
    title: '',
    category: 'career',
    description: '',
    context: '',
    reasoningProcess: '',
    alternatives: ['', ''],
    expectedOutcomes: [],
    expectedOutcomeDate: '',
    confidenceLevel: 5,
    tags: [],
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };

        case 'ADD_ALTERNATIVE':
            return { ...state, alternatives: [...state.alternatives, ''] };

        case 'UPDATE_ALTERNATIVE': {
            const alts = [...state.alternatives];
            alts[action.index] = action.value;
            return { ...state, alternatives: alts };
        }

        case 'REMOVE_ALTERNATIVE':
            return {
                ...state,
                alternatives: state.alternatives.filter((_, i) => i !== action.index),
            };

        case 'ADD_METRIC':
            return {
                ...state,
                expectedOutcomes: [
                    ...state.expectedOutcomes,
                    { outcome: '', metric: '', targetValue: '' },
                ],
            };

        case 'UPDATE_METRIC': {
            const metrics = [...state.expectedOutcomes];
            metrics[action.index] = {
                ...metrics[action.index],
                [action.field]: action.value,
            };
            return { ...state, expectedOutcomes: metrics };
        }

        case 'REMOVE_METRIC':
            return {
                ...state,
                expectedOutcomes: state.expectedOutcomes.filter((_, i) => i !== action.index),
            };

        case 'APPLY_TEMPLATE': {
            const t = action.template;
            return {
                ...state,
                category: t.category || state.category,
                tags: t.template.suggestedTags || state.tags,
                description: t.template.descriptionPrompt || state.description,
            };
        }

        case 'LOAD_DECISION': {
            const d = action.decision;
            return {
                ...state,
                title: d.title || '',
                category: d.category || 'career',
                description: d.description || '',
                context: d.context || '',
                reasoningProcess: d.reasoningProcess || '',
                alternatives: d.alternativesConsidered?.map((a) => a.option) || ['', ''],
                expectedOutcomes: d.expectedOutcomes?.map((eo) => ({
                    outcome: eo.outcome || '',
                    metric: eo.metric || '',
                    targetValue: eo.targetValue?.toString() || '',
                })) || [],
                expectedOutcomeDate: d.expectedOutcomeDate?.split('T')[0] || '',
                confidenceLevel: d.confidenceLevel || 5,
                tags: d.tags || [],
            };
        }

        case 'RESET':
            return { ...initialWizardState };

        default:
            return state;
    }
}
