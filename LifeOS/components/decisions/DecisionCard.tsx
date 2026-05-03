/**
 * DecisionCard — Card component used in the decision list.
 *
 * Displays: category icon, title, description, confidence ring,
 * category badge, status badge, and time ago.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Decision } from '@/services/decisionService';
import {
    getCategoryIcon,
    getCategoryColor,
    getStatusLabel,
    getStatusColor,
    getConfidenceColor,
    timeAgo,
} from '@/utils/helpers';

type DecisionCardProps = {
    decision: Decision;
    onPress: () => void;
};

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onPress }) => {
    const catColor = getCategoryColor(decision.category);
    const statusColor = getStatusColor(decision.status);
    const confColor = getConfidenceColor(decision.confidenceLevel);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 20,
                marginBottom: 12,
                marginHorizontal: 20,
                shadowColor: 'rgba(25,28,29,0.8)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 16,
                elevation: 2,
            }}
        >
            {/* Top row: icon + title + confidence */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                <View
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 13,
                        backgroundColor: catColor + '14',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Ionicons name={getCategoryIcon(decision.category)} size={20} color={catColor} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 16,
                            color: '#111827',
                            lineHeight: 22,
                            letterSpacing: -0.3,
                        }}
                        numberOfLines={2}
                    >
                        {decision.title}
                    </Text>
                    {decision.description ? (
                        <Text
                            style={{
                                fontFamily: 'Inter_400Regular',
                                fontSize: 13,
                                color: '#6B7280',
                                marginTop: 4,
                                lineHeight: 18,
                            }}
                            numberOfLines={2}
                        >
                            {decision.description}
                        </Text>
                    ) : null}
                </View>
                {/* Confidence indicator */}
                <View
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        borderWidth: 2.5,
                        borderColor: confColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 2,
                    }}
                >
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: confColor }}>
                        {decision.confidenceLevel}
                    </Text>
                </View>
            </View>

            {/* Bottom row: badges + time */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 4,
                }}
            >
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    {/* Category badge */}
                    <View
                        style={{
                            backgroundColor: catColor + '14',
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Inter_600SemiBold',
                                fontSize: 11,
                                color: catColor,
                                textTransform: 'capitalize',
                            }}
                        >
                            {decision.category}
                        </Text>
                    </View>
                    {/* Status badge */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            backgroundColor: statusColor + '14',
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                        }}
                    >
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: statusColor,
                            }}
                        />
                        <Text
                            style={{
                                fontFamily: 'Inter_600SemiBold',
                                fontSize: 11,
                                color: statusColor,
                            }}
                        >
                            {getStatusLabel(decision.status)}
                        </Text>
                    </View>
                </View>
                <Text
                    style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                        color: '#9CA3AF',
                    }}
                >
                    {timeAgo(decision.updatedAt)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
