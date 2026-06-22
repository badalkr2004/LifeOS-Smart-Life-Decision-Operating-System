/**
 * LifeOS — Shared Utility Functions
 *
 * Centralised helpers used across multiple screens:
 *   • Category icon / colour resolvers
 *   • Status label / colour resolvers
 *   • Confidence colour
 *   • Date/time formatters (timeAgo, daysUntil, formatDate)
 *   • Greeting generator
 */

import type { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// ─── Category Helpers ─────────────────────────────────────────────────────────

/** Filled icon name for a decision category (used in cards / detail) */
export function getCategoryIcon(category: string): IoniconsName {
    const map: Record<string, IoniconsName> = {
        career: 'briefcase',
        financial: 'wallet',
        health: 'heart',
        relationship: 'people',
        education: 'school',
        lifestyle: 'leaf',
        technology: 'hardware-chip',
        business: 'trending-up',
        personal_growth: 'rocket',
        family: 'home',
    };
    return map[category] ?? 'ellipse';
}

/** Outline icon name for a decision category (used in dashboard feed) */
export function getCategoryIconOutline(category: string): IoniconsName {
    const map: Record<string, IoniconsName> = {
        career: 'briefcase-outline',
        financial: 'wallet-outline',
        health: 'heart-outline',
        relationship: 'people-outline',
        education: 'school-outline',
        lifestyle: 'leaf-outline',
        technology: 'hardware-chip-outline',
        business: 'trending-up-outline',
        personal_growth: 'rocket-outline',
        family: 'home-outline',
    };
    return map[category] ?? 'ellipse-outline';
}

/** Brand colour for each decision category */
export function getCategoryColor(category: string): string {
    const map: Record<string, string> = {
        career: '#3B82F6',
        financial: '#10B981',
        health: '#F59E0B',
        relationship: '#EC4899',
        education: '#8B5CF6',
        lifestyle: '#06B6D4',
        business: '#F97316',
        personal_growth: '#6366F1',
        family: '#E11D48',
    };
    return map[category] ?? '#6B7280';
}

/** Light background for each decision category */
export function getCategoryBg(category: string): string {
    const map: Record<string, string> = {
        career: '#EFF6FF',
        financial: '#ECFDF5',
        health: '#FFFBEB',
        relationship: '#FDF2F8',
        education: '#F5F3FF',
        lifestyle: '#ECFEFF',
        business: '#FFF7ED',
        personal_growth: '#EEF2FF',
        family: '#FFF1F2',
    };
    return map[category] ?? '#F3F4F6';
}

// ─── Status Helpers ───────────────────────────────────────────────────────────

export function getStatusLabel(status: string): string {
    const map: Record<string, string> = {
        active: 'Active',
        completed: 'Completed',
        archived: 'Archived',
        superseded: 'Superseded',
        resolved: 'Resolved',
    };
    return map[status] ?? status;
}

export function getStatusColor(status: string): string {
    const map: Record<string, string> = {
        active: '#10B981',
        completed: '#4F46E5',
        archived: '#6B7280',
        superseded: '#F59E0B',
        resolved: '#10B981',
    };
    return map[status] ?? '#6B7280';
}

// ─── Confidence Helpers ───────────────────────────────────────────────────────

export function getConfidenceColor(level: number): string {
    if (level >= 8) return '#10B981';
    if (level >= 5) return '#F59E0B';
    return '#EF4444';
}

export function getConfidenceText(level: number): string {
    if (level >= 9) return 'Extremely confident';
    if (level >= 7) return 'Strongly leaning towards acceptance';
    if (level >= 5) return 'Moderately confident';
    if (level >= 3) return 'Somewhat uncertain';
    return 'Very uncertain';
}

// ─── Date / Time Helpers ──────────────────────────────────────────────────────

export function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

export function daysUntil(dateStr: string): string {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Overdue';
    if (days === 1) return 'Expires in 1d';
    return `Expires in ${days}d`;
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}
