/**
 * AIReflection — Lavender insight card on the dashboard.
 * Shows AI-generated reflection with a subtle gradient accent.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SkeletonBlock } from '@/components/ui';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '@/utils/designTokens';
import { getRandomQuote } from '@/utils/constants';

type AIReflectionProps = {
    insight: any | null;
    isLoading: boolean;
};

const EmptyContent: React.FC = () => (
    <>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(79,70,229,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="sparkles" size={14} color={COLORS.primary} />
            </View>
            <Text style={[TYPOGRAPHY.label, { color: COLORS.primary }]}>AI Reflection</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: SPACING.md }}>
            <View style={{ width: 3, borderRadius: 2, backgroundColor: COLORS.primary + '30' }} />
            <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.textPrimary, lineHeight: 24, fontStyle: 'italic' }}>
                    "{getRandomQuote()}"
                </Text>
                <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: SPACING.md }]}>
                    Insights will appear here as you track more decisions and outcomes.
                </Text>
            </View>
        </View>
    </>
);

export const AIReflection: React.FC<AIReflectionProps> = ({ insight, isLoading }) => {
    if (isLoading) {
        return (
            <View style={{ paddingHorizontal: SPACING.xxl, marginBottom: SPACING.xxl }}>
                <SkeletonBlock width="100%" height={160} radius={RADII.xxl} />
            </View>
        );
    }

    const description = insight?.description ?? null;
    const dataPoints = insight?.dataPoints;

    return (
        <View style={{ paddingHorizontal: SPACING.xxl, marginBottom: SPACING.xxl }}>
            <View style={{ backgroundColor: COLORS.primarySurface, borderRadius: RADII.xxl, padding: SPACING.xxl, borderWidth: 1, borderColor: COLORS.primary + '20' }}>
                {description ? (
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md }}>
                            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(79,70,229,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="sparkles" size={14} color={COLORS.primary} />
                            </View>
                            <Text style={[TYPOGRAPHY.label, { color: COLORS.primary }]}>AI Reflection</Text>
                        </View>
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: COLORS.textPrimary, lineHeight: 24, marginBottom: SPACING.md }}>
                            {description}
                        </Text>
                        {dataPoints != null && (
                            <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(79,70,229,0.1)', borderRadius: RADII.full, paddingHorizontal: SPACING.md, paddingVertical: 6 }}>
                                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.primary }}>
                                    Based on {dataPoints} data points
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <EmptyContent />
                )}
            </View>
        </View>
    );
};
