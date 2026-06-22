/**
 * RecentActivity — Decision feed on the dashboard.
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SkeletonBlock } from '@/components/ui';
import { getCategoryIconOutline, getCategoryColor, getCategoryBg, getStatusColor, timeAgo } from '@/utils/helpers';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';
import type { Decision } from '@/services/dashboardService';

// ─── Single Activity Item ─────────────────────────────────────────────────────

const ActivityItem: React.FC<{ decision: Decision }> = memo(({ decision }) => {
    const router = useRouter();
    const catColor = getCategoryColor(decision.category);
    const catBg = getCategoryBg(decision.category);
    const statusColor = getStatusColor(decision.status);

    return (
        <TouchableOpacity
            onPress={() => router.push(`/(tabs)/decisions/${decision.id}`)}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.xxl }}
            activeOpacity={0.7}
        >
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: catBg, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md }}>
                <Ionicons name={getCategoryIconOutline(decision.category)} size={20} color={catColor} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.textPrimary }} numberOfLines={1}>
                    {decision.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusColor }} />
                    <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textSecondary }]}>
                        {timeAgo(decision.updatedAt)}
                    </Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.outlineVariant} />
        </TouchableOpacity>
    );
});

// ─── Section Wrapper ──────────────────────────────────────────────────────────

type RecentActivityProps = {
    decisions: Decision[];
    isLoading: boolean;
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ decisions, isLoading }) => {
    const router = useRouter();
    return (
        <View style={{ marginBottom: SPACING.xxxl }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.xxl, marginBottom: SPACING.md }}>
                <Text style={[TYPOGRAPHY.label, { color: COLORS.textMuted }]}>Recent Activity</Text>
                {decisions.length > 0 && (
                    <TouchableOpacity onPress={() => router.push('/(tabs)/decisions')} accessibilityLabel="View all decisions" accessibilityRole="button">
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.primary }}>View All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isLoading ? (
                <View style={{ paddingHorizontal: SPACING.xxl, gap: SPACING.md }}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
                            <SkeletonBlock width={44} height={44} radius={RADII.md} />
                            <View style={{ flex: 1, gap: 6 }}>
                                <SkeletonBlock width="70%" height={16} />
                                <SkeletonBlock width="50%" height={12} />
                            </View>
                        </View>
                    ))}
                </View>
            ) : decisions.length === 0 ? (
                <View style={{ paddingHorizontal: SPACING.xxl }}>
                    <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xxl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.surfaceDim, borderStyle: 'dashed' }}>
                        <Ionicons name="layers-outline" size={32} color={COLORS.outlineVariant} />
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textPrimary, marginTop: 10 }}>No decisions yet</Text>
                        <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' }]}>
                            Tap "New Decision" above to get started.
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={{ backgroundColor: COLORS.surfaceLowest, marginHorizontal: SPACING.xxl, borderRadius: RADII.xl, ...SHADOWS.card, overflow: 'hidden' }}>
                    {decisions.map((d) => (
                        <ActivityItem key={d.id} decision={d} />
                    ))}
                </View>
            )}
        </View>
    );
};
