/**
 * ActionRequired — Horizontal scroll of pending check-in cards.
 * Review navigates to check-in, Skip dismisses the reminder.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SkeletonBlock } from '@/components/ui';
import { daysUntil } from '@/utils/helpers';
import { useSkipCheckin } from '@/hooks/useDecisions';
import type { PendingCheckin } from '@/services/dashboardService';

const ACTION_CARD_WIDTH = Dimensions.get('window').width * 0.62;

// ─── Single Action Card ───────────────────────────────────────────────────────

const ActionCard: React.FC<{ item: PendingCheckin }> = ({ item }) => {
    const router = useRouter();
    const skipMutation = useSkipCheckin();

    const handleReview = () => {
        router.push(`/(tabs)/decisions/checkin?id=${item.decisionId}`);
    };

    const handleSkip = () => {
        Alert.alert(
            'Skip Check-in',
            'Are you sure you want to skip this reminder?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Skip',
                    onPress: () => skipMutation.mutate(item.id),
                },
            ],
        );
    };

    return (
        <View
            style={{
                width: ACTION_CARD_WIDTH,
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 20,
                marginRight: 14,
                shadowColor: 'rgba(25,28,29,0.8)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 16,
                elevation: 2,
                justifyContent: 'space-between',
                minHeight: 140,
            }}
        >
            <Text
                style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#111827', lineHeight: 22 }}
                numberOfLines={2}
            >
                {item.customMessage || 'Check-in Required'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#6B7280' }}>
                    {daysUntil(item.scheduledDate)}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                        onPress={handleSkip}
                        style={{
                            borderRadius: 9999,
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                        }}
                    >
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#6B7280' }}>Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleReview}
                        style={{
                            backgroundColor: '#111827',
                            borderRadius: 9999,
                            paddingHorizontal: 18,
                            paddingVertical: 8,
                        }}
                    >
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#FFFFFF' }}>Review</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// ─── Section Wrapper ──────────────────────────────────────────────────────────

type ActionRequiredProps = {
    checkins: PendingCheckin[];
    isLoading: boolean;
};

export const ActionRequired: React.FC<ActionRequiredProps> = ({ checkins, isLoading }) => (
    <View style={{ marginBottom: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 14 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Action Required
            </Text>
            {checkins.length > 0 && (
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#4F46E5' }}>
                    {checkins.length} item{checkins.length > 1 ? 's' : ''}
                </Text>
            )}
        </View>

        {isLoading ? (
            <View style={{ flexDirection: 'row', paddingLeft: 24 }}>
                <SkeletonBlock width={ACTION_CARD_WIDTH} height={140} style={{ marginRight: 14 }} />
                <SkeletonBlock width={ACTION_CARD_WIDTH} height={140} />
            </View>
        ) : checkins.length === 0 ? (
            <View style={{ paddingHorizontal: 24 }}>
                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center' }}>
                    <Ionicons name="checkmark-circle-outline" size={32} color="#10B981" />
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827', marginTop: 10 }}>All caught up!</Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7280', marginTop: 4 }}>No pending check-ins right now.</Text>
                </View>
            </View>
        ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 24, paddingRight: 10 }}>
                {checkins.map((item) => (
                    <ActionCard key={item.id} item={item} />
                ))}
            </ScrollView>
        )}
    </View>
);
