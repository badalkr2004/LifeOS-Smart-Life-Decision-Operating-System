/**
 * Analytics Screen — Dashboard of decision metrics, charts, and AI insights.
 *
 * Displays:
 *  - Summary cards (total decisions, avg confidence, avg satisfaction, pending checkins)
 *  - Category breakdown chart
 *  - Satisfaction quality-over-time chart
 *  - AI insights list with dismiss
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAnalyticsSummary,
  useQualityOverTime,
  useInsights,
  useDismissInsight,
  analyticsKeys,
} from '@/hooks/useAnalytics';
import { SummaryCard, CategoryBreakdown, QualityTimeline, InsightList } from '@/components/analytics';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '@/utils/designTokens';

export default function AnalyticsScreen() {
  const queryClient = useQueryClient();

  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useAnalyticsSummary();
  const { data: timeline = [], isLoading: timelineLoading } = useQualityOverTime();
  const { data: insights = [], isLoading: insightsLoading, isError: insightsError } = useInsights();
  const dismissMutation = useDismissInsight();

  const isRefreshing = summaryLoading;

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['analytics'] });
  }, [queryClient]);

  const handleDismiss = (id: string) => {
    dismissMutation.mutate(id);
  };

  // ── Error State ──
  if (summaryError && !summaryLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxl }}>
          <Ionicons name="analytics-outline" size={48} color={COLORS.danger} />
          <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, marginTop: SPACING.lg, textAlign: 'center' }]}>
            Could not load analytics
          </Text>
          <TouchableOpacity
            onPress={() => refetchSummary()}
            style={{ marginTop: SPACING.lg, backgroundColor: COLORS.primary, borderRadius: RADII.md, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md }}
          >
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
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />
        }
      >
        {/* Header */}
        <View style={{ paddingHorizontal: SPACING.xxl, paddingTop: SPACING.lg, paddingBottom: SPACING.xl }}>
          <Text style={[TYPOGRAPHY.h1, { color: COLORS.textPrimary }]}>Analytics</Text>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: SPACING.xs }]}>
            Track your decision-making patterns
          </Text>
        </View>

        {/* Summary Cards - 2-column grid */}
        <View style={{ paddingHorizontal: SPACING.xxl, marginBottom: SPACING.xxl }}>
          {summaryLoading ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={{ width: '47%', aspectRatio: 1.4, backgroundColor: COLORS.surfaceContainer, borderRadius: RADII.xl }} />
              ))}
            </View>
          ) : summary ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
              <SummaryCard icon="checkmark-circle" label="Total Decisions" value={summary.totalDecisions} color={COLORS.primary} bgColor={COLORS.primaryFixed} />
              <SummaryCard icon="trending-up" label="Avg Confidence" value={summary.averageConfidence != null ? `${summary.averageConfidence.toFixed(1)}/10` : '—'} color={COLORS.success} bgColor={COLORS.successBg} />
              <SummaryCard icon="star" label="Avg Satisfaction" value={summary.averageSatisfaction != null ? `${summary.averageSatisfaction.toFixed(1)}/10` : '—'} color={COLORS.warning} bgColor={COLORS.warningBg} />
              <SummaryCard icon="notifications" label="Pending Check-ins" value={summary.pendingCheckins} color={COLORS.danger} bgColor={COLORS.dangerBg} />
            </View>
          ) : null}
        </View>

        {/* Category Breakdown */}
        {summary && summary.topCategories.length > 0 && (
          <View style={{ paddingHorizontal: SPACING.xxl, marginBottom: SPACING.lg }}>
            <CategoryBreakdown data={summary.topCategories} />
          </View>
        )}

        {/* Quality Over Time */}
        <View style={{ paddingHorizontal: SPACING.xxl, marginBottom: SPACING.lg }}>
          {timelineLoading ? (
            <View style={{ height: 200, backgroundColor: COLORS.surfaceContainer, borderRadius: RADII.xl }} />
          ) : (
            <QualityTimeline data={timeline} />
          )}
        </View>

        {/* Insights */}
        <View style={{ paddingHorizontal: SPACING.xxl }}>
          <InsightList insights={insights} onDismiss={handleDismiss} isLoading={insightsLoading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
