/**
 * OutcomeTimelineItem — Single outcome entry in the vertical timeline.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '@/utils/helpers';
import type { Outcome } from '@/services/decisionService';

type OutcomeTimelineItemProps = {
    outcome: Outcome;
    isLast: boolean;
};

export const OutcomeTimelineItem: React.FC<OutcomeTimelineItemProps> = ({ outcome, isLast }) => (
    <View style={{ flexDirection: 'row', marginBottom: isLast ? 0 : 8 }}>
        {/* Timeline line + dot */}
        <View style={{ width: 24, alignItems: 'center', marginRight: 14 }}>
            <View
                style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#4F46E5',
                    zIndex: 1,
                    marginTop: 6,
                }}
            />
            {!isLast && (
                <View style={{ width: 2, flex: 1, backgroundColor: '#E5E7EB', marginTop: 4 }} />
            )}
        </View>

        {/* Content card */}
        <View
            style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                shadowColor: 'rgba(0,0,0,0.5)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 1,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#6B7280' }}>
                    {formatDate(outcome.createdAt)}
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        backgroundColor: '#E8E6FF',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 9999,
                    }}
                >
                    <Ionicons name="happy-outline" size={12} color="#4F46E5" />
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: '#4F46E5' }}>
                        {outcome.satisfactionScore}/10
                    </Text>
                </View>
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#374151', lineHeight: 22 }}>
                {outcome.actualResults}
            </Text>
            {outcome.reflections ? (
                <Text
                    style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 13,
                        color: '#6B7280',
                        fontStyle: 'italic',
                        marginTop: 8,
                        lineHeight: 20,
                    }}
                >
                    "{outcome.reflections}"
                </Text>
            ) : null}
            {/* Mood & Stress */}
            {(outcome.moodAtCheckIn || outcome.stressLevel) ? (
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                    {outcome.moodAtCheckIn ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="heart" size={12} color="#10B981" />
                            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#6B7280' }}>
                                Mood: {outcome.moodAtCheckIn}/10
                            </Text>
                        </View>
                    ) : null}
                    {outcome.stressLevel ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="flash" size={12} color="#F59E0B" />
                            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#6B7280' }}>
                                Stress: {outcome.stressLevel}/10
                            </Text>
                        </View>
                    ) : null}
                </View>
            ) : null}
        </View>
    </View>
);
