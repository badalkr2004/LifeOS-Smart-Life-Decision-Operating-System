/**
 * AIReflection — Lavender insight card on the dashboard.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SkeletonBlock } from '@/components/ui';

type AIReflectionProps = {
    insight: any | null;
    isLoading: boolean;
};

export const AIReflection: React.FC<AIReflectionProps> = ({ insight, isLoading }) => {
    if (isLoading) {
        return (
            <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
                <SkeletonBlock width="100%" height={160} radius={24} />
            </View>
        );
    }

    const description = insight?.description ?? 'Your personal AI advisor will analyze your decision patterns and provide personalized reflections here.';
    const dataPoints = insight?.dataPoints;

    return (
        <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
            <View style={{ backgroundColor: '#E8E6FF', borderRadius: 24, padding: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <View
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: 'rgba(79,70,229,0.15)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="sparkles" size={14} color="#4F46E5" />
                    </View>
                    <Text
                        style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 10,
                            color: '#4F46E5',
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                        }}
                    >
                        AI Reflection
                    </Text>
                </View>

                <Text
                    style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        lineHeight: 26,
                        marginBottom: 14,
                    }}
                >
                    {description}
                </Text>

                {dataPoints != null && (
                    <View
                        style={{
                            alignSelf: 'flex-start',
                            backgroundColor: 'rgba(79,70,229,0.1)',
                            borderRadius: 9999,
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                        }}
                    >
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#4F46E5' }}>
                            Based on {dataPoints} data points
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};
