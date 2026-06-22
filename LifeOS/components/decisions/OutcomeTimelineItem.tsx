/**
 * OutcomeTimelineItem — Single outcome entry in the vertical timeline.
 * Shows satisfaction score, results, mood/stress, and reflections.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '@/utils/helpers';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';
import type { Outcome } from '@/services/decisionService';

type OutcomeTimelineItemProps = {
    outcome: Outcome;
    isLast: boolean;
};

const SATISFACTION_COLORS: Record<string, { color: string; bg: string; label: string }> = {
    high: { color: '#059669', bg: '#ECFDF5', label: 'Great' },
    good: { color: '#2563EB', bg: '#EFF6FF', label: 'Good' },
    mid: { color: '#D97706', bg: '#FFFBEB', label: 'Okay' },
    low: { color: '#DC2626', bg: '#FEF2F2', label: 'Low' },
};

function getSatisfactionMeta(score: number) {
    if (score >= 8) return SATISFACTION_COLORS.high;
    if (score >= 6) return SATISFACTION_COLORS.good;
    if (score >= 4) return SATISFACTION_COLORS.mid;
    return SATISFACTION_COLORS.low;
}

export const OutcomeTimelineItem: React.FC<OutcomeTimelineItemProps> = ({ outcome, isLast }) => {
    const satMeta = getSatisfactionMeta(outcome.satisfactionScore);

    return (
        <View style={{ flexDirection: 'row', marginBottom: isLast ? 0 : SPACING.xs }}>
            {/* Timeline line + dot */}
            <View style={{ width: 28, alignItems: 'center', marginRight: SPACING.md }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: satMeta.color, zIndex: 1, marginTop: 18 }} />
                {!isLast && <View style={{ width: 2, flex: 1, backgroundColor: COLORS.surfaceDim }} />}
            </View>

            {/* Content card */}
            <View style={{ flex: 1, backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.lg, marginBottom: SPACING.md, ...SHADOWS.card, overflow: 'hidden' }}>
                {/* Score accent bar */}
                <View style={{ height: 3, backgroundColor: satMeta.color }} />

                <View style={{ padding: SPACING.lg }}>
                    {/* Header: date + score */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md }}>
                        <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textSecondary }]}>
                            {formatDate(outcome.createdAt)}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: satMeta.bg, paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADII.full }}>
                            <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 15, color: satMeta.color }}>
                                {outcome.satisfactionScore}
                            </Text>
                            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: satMeta.color }}>/10</Text>
                        </View>
                    </View>

                    {/* Results */}
                    <Text style={[TYPOGRAPHY.body, { color: COLORS.textBody }]}>
                        {outcome.actualResults}
                    </Text>

                    {/* Reflections */}
                    {outcome.reflections ? (
                        <View style={{ marginTop: SPACING.md, paddingLeft: SPACING.sm, borderLeftWidth: 2, borderLeftColor: COLORS.surfaceDim }}>
                            <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textSecondary, fontStyle: 'italic' }]}>
                                {outcome.reflections}
                            </Text>
                        </View>
                    ) : null}

                    {/* Mood & Stress tags */}
                    {(outcome.moodAtCheckIn != null || outcome.stressLevel != null) ? (
                        <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.md }}>
                            {outcome.moodAtCheckIn != null ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.successBg, borderRadius: RADII.full, paddingHorizontal: 10, paddingVertical: 3 }}>
                                    <Ionicons name="heart" size={11} color={COLORS.success} />
                                    <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.success }]}>
                                        Mood {outcome.moodAtCheckIn}/10
                                    </Text>
                                </View>
                            ) : null}
                            {outcome.stressLevel != null ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.warningBg, borderRadius: RADII.full, paddingHorizontal: 10, paddingVertical: 3 }}>
                                    <Ionicons name="flash" size={11} color={COLORS.warning} />
                                    <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.warning }]}>
                                        Stress {outcome.stressLevel}/10
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    ) : null}

                    {/* Lessons Learned */}
                    {outcome.lessonsLearned ? (
                        <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md }}>
                            <Ionicons name="school-outline" size={14} color={COLORS.textMuted} />
                            <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textMuted, flex: 1 }]}>
                                {outcome.lessonsLearned}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </View>
    );
};
