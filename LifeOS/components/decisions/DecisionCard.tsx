/**
 * DecisionCard — Card component used in the decision list.
 * Features a left accent bar, category icon, confidence indicator, and status badge.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Decision } from '@/services/decisionService';
import {
    getCategoryIcon,
    getCategoryColor,
    getCategoryBg,
    getStatusColor,
    getConfidenceColor,
    timeAgo,
} from '@/utils/helpers';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';

type DecisionCardProps = {
    decision: Decision;
    onPress: () => void;
};

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onPress }) => {
    const catColor = getCategoryColor(decision.category);
    const catBg = getCategoryBg(decision.category);
    const statusColor = getStatusColor(decision.status);
    const confColor = getConfidenceColor(decision.confidenceLevel);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{
                backgroundColor: COLORS.surfaceLowest,
                borderRadius: RADII.xl,
                marginBottom: SPACING.md,
                marginHorizontal: SPACING.xl,
                ...SHADOWS.card,
                overflow: 'hidden',
            }}
        >
            {/* Left accent bar */}
            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: catColor, borderTopLeftRadius: RADII.xl, borderBottomLeftRadius: RADII.xl }} />

            <View style={{ padding: SPACING.xl, paddingLeft: SPACING.xl + 4 }}>
                {/* Top: icon + title row */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.md }}>
                    <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: catBg, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name={getCategoryIcon(decision.category)} size={22} color={catColor} />
                    </View>
                    <View style={{ flex: 1, marginRight: SPACING.sm }}>
                        <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary }]} numberOfLines={2}>
                            {decision.title}
                        </Text>
                        {decision.description ? (
                            <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: 4 }]} numberOfLines={2}>
                                {decision.description}
                            </Text>
                        ) : null}
                    </View>
                    {/* Confidence ring */}
                    <View style={{ alignItems: 'center', marginTop: 2 }}>
                        <View style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 2.5, borderColor: confColor, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surfaceLowest }}>
                            <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 12, color: confColor }}>
                                {decision.confidenceLevel}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Bottom: badges + time */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' }}>
                        <View style={{ backgroundColor: catBg, borderRadius: RADII.sm, paddingHorizontal: 10, paddingVertical: 4 }}>
                            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: catColor, textTransform: 'capitalize' }}>
                                {decision.category.replace(/_/g, ' ')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: statusColor + '14', borderRadius: RADII.sm, paddingHorizontal: 10, paddingVertical: 4 }}>
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusColor }} />
                            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: statusColor }}>{decision.status}</Text>
                        </View>
                    </View>
                    <Text style={[TYPOGRAPHY.bodySmall, { color: '#9CA3AF' }]}>
                        {timeAgo(decision.updatedAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
