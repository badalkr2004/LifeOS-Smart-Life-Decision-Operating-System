/**
 * LifeOS — Shared Constants
 *
 * Category lists, status filters, and other constants
 * used across Decision List, Wizard, and Detail screens.
 */

import type { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// ─── Category List ────────────────────────────────────────────────────────────

export type CategoryItem = {
    key: string;
    label: string;
    icon: IoniconsName;
};

/** All decision categories (used in wizard grid + list filter chips) */
export const CATEGORIES: CategoryItem[] = [
    { key: 'career', label: 'Career', icon: 'briefcase' },
    { key: 'health', label: 'Health', icon: 'heart' },
    { key: 'financial', label: 'Finance', icon: 'wallet' },
    { key: 'relationship', label: 'Interpersonal', icon: 'people' },
    { key: 'education', label: 'Education', icon: 'school' },
    { key: 'lifestyle', label: 'Lifestyle', icon: 'leaf' },
    { key: 'business', label: 'Business', icon: 'trending-up' },
    { key: 'personal_growth', label: 'Growth', icon: 'rocket' },
    { key: 'family', label: 'Family', icon: 'home' },
    { key: 'other', label: 'Other', icon: 'ellipse' },
];

/** Categories with "All" prepended + outline icons for filter chips */
export const CATEGORY_FILTERS: CategoryItem[] = [
    { key: '', label: 'All', icon: 'apps-outline' },
    ...CATEGORIES.map((c) => ({
        ...c,
        icon: (`${c.icon}-outline` as IoniconsName),
    })),
];

// ─── Status Filters ───────────────────────────────────────────────────────────

export type StatusFilterItem = {
    key: string;
    label: string;
};

export const STATUS_FILTERS: StatusFilterItem[] = [
    { key: '', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'archived', label: 'Archived' },
];

// ─── Motivational Quotes ──────────────────────────────────────────────────────

export const MOTIVATIONAL_QUOTES = [
    'Every great outcome starts with a clear intention.',
    'The quality of your decisions shapes the quality of your life.',
    'Precision is the sanctuary of the wise.',
];

export function getRandomQuote(): string {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}
