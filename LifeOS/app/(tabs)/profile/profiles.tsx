/**
 * Decision Profile Screen — User's decision-making profile
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useAnalyticsSummary } from '@/hooks/useAnalytics';
import { usePatterns, useDetectPatterns } from '@/hooks/useAI';
import { useComputeProfile } from '@/hooks/useAI';
import { DecisionProfileStats, BehavioralPatterns } from '@/components/profile';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '@/utils/designTokens';

export default function ProfilesScreen() {
  const queryClient = useQueryClient();
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch } = useAnalyticsSummary();
  const { data: patterns = [], isLoading: patternsLoading } = usePatterns();
  const detectPatterns = useDetectPatterns();
  const computeProfile = useComputeProfile();

  const isRefreshing = summaryLoading;

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['analytics'] });
    queryClient.invalidateQueries({ queryKey: ['ai', 'patterns'] });
  }, [queryClient]);

  const handleDetectPatterns = () => {
    detectPatterns.mutate(undefined, {
      onSuccess: () => Alert.alert('Pattern detection started', 'Results will appear shortly.'),
      onError: (err: any) => Alert.alert('Error', err?.response?.data?.error || 'Detection failed.'),
    });
  };

  const handleComputeProfile = () => {
    computeProfile.mutate(undefined, {
      onSuccess: () => Alert.alert('Profile computation started', 'Your decision profile is being updated.'),
      onError: (err: any) => Alert.alert('Error', err?.response?.data?.error || 'Computation failed.'),
    });
  };

  if (summaryError && !summaryLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxl }}>
          <Ionicons name="person-circle-outline" size={48} color={COLORS.danger} />
          <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, marginTop: SPACING.lg, textAlign: 'center' }]}>Could not load profile</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: SPACING.lg, backgroundColor: COLORS.primary, borderRadius: RADII.md, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.textOnPrimary }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.xxxl }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
      >
        <View style={{ paddingHorizontal: SPACING.xxl, paddingTop: SPACING.lg, paddingBottom: SPACING.xl }}>
          <Text style={[TYPOGRAPHY.h1, { color: COLORS.textPrimary }]}>Decision Profile</Text>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: SPACING.xs }]}>Your decision-making patterns at a glance</Text>
        </View>

        <View style={{ paddingHorizontal: SPACING.xxl, marginBottom: SPACING.lg }}>
          {summaryLoading ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={{ flex: 1, minWidth: '45%', height: 90, backgroundColor: COLORS.surfaceContainer, borderRadius: RADII.xl }} />
              ))}
            </View>
          ) : summary ? (
            <DecisionProfileStats
              totalDecisions={summary.totalDecisions}
              avgConfidence={summary.averageConfidence}
              avgSatisfaction={summary.averageSatisfaction}
              totalOutcomes={summary.totalOutcomes}
            />
          ) : null}
        </View>

        <View style={{ paddingHorizontal: SPACING.xxl, marginBottom: SPACING.lg }}>
          <BehavioralPatterns patterns={patterns} isLoading={patternsLoading} onRefresh={handleDetectPatterns} />
        </View>

        <View style={{ paddingHorizontal: SPACING.xxl, gap: SPACING.md }}>
          <TouchableOpacity
            onPress={handleComputeProfile}
            disabled={computeProfile.isPending}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.md, paddingVertical: SPACING.lg, borderWidth: 1.5, borderColor: COLORS.surfaceDim }}
          >
            <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.primary }}>
              {computeProfile.isPending ? 'Computing...' : 'Recompute Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
