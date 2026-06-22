/**
 * ActionRequired — Horizontal scroll of pending check-in cards.
 * Shows urgency via color-coded due dates, reminder type icons,
 * and a polished card layout.
 */

import React, { memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SkeletonBlock } from '@/components/ui';
import { daysUntil } from '@/utils/helpers';
import { useSkipCheckin } from '@/hooks/useDecisions';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';
import type { PendingCheckin } from '@/services/dashboardService';

const ACTION_CARD_WIDTH = Dimensions.get('window').width * 0.68;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REMINDER_CONFIG: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  '1_week': { icon: 'calendar-outline', label: '1-Week Check-in' },
  '1_month': { icon: 'calendar-outline', label: '1-Month Check-in' },
  '3_months': { icon: 'calendar-outline', label: '3-Month Check-in' },
  target_date: { icon: 'flag-outline', label: 'Target Date Review' },
};

function getReminderConfig(type: string) {
  return REMINDER_CONFIG[type] ?? { icon: 'notifications-outline' as const, label: 'Check-in' };
}

function getUrgency(dateStr: string): { color: string; bgColor: string; label: string } {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return { color: '#DC2626', bgColor: '#FEF2F2', label: 'Overdue' };
  if (days <= 3) return { color: '#EA580C', bgColor: '#FFF7ED', label: `Due in ${days}d` };
  if (days <= 7) return { color: '#F59E0B', bgColor: '#FFFBEB', label: `Due in ${days}d` };
  return { color: '#059669', bgColor: '#ECFDF5', label: `Due in ${days}d` };
}

// ─── Single Action Card ───────────────────────────────────────────────────────

const ActionCard: React.FC<{ item: PendingCheckin }> = memo(({ item }) => {
  const router = useRouter();
  const skipMutation = useSkipCheckin();

  const handleReview = () => {
    router.push(`/(tabs)/decisions/checkin?id=${item.decisionId}`);
  };

  const handleSkip = () => {
    Alert.alert('Skip Check-in', 'Are you sure you want to skip this reminder?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Skip', onPress: () => skipMutation.mutate(item.id) },
    ]);
  };

  const urgency = getUrgency(item.scheduledDate);
  const reminder = getReminderConfig(item.reminderType);

  return (
    <View
      style={{
        width: ACTION_CARD_WIDTH,
        backgroundColor: COLORS.surfaceLowest,
        borderRadius: RADII.xl,
        ...SHADOWS.card,
        marginRight: SPACING.md,
        overflow: 'hidden',
      }}
    >
      {/* Urgency accent bar */}
      <View style={{ height: 4, backgroundColor: urgency.color }} />

      <View style={{ padding: SPACING.xl, gap: SPACING.md }}>
        {/* Top: icon + reminder type */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: urgency.bgColor, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={reminder.icon} size={18} color={urgency.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted }]}>{reminder.label}</Text>
            <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, marginTop: 2 }]} numberOfLines={1}>
              {item.customMessage || 'Check-in Required'}
            </Text>
          </View>
        </View>

        {/* Middle: decision info */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
          <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textSecondary }]}>
            Created {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Urgency badge */}
        <View style={{ alignSelf: 'flex-start', backgroundColor: urgency.bgColor, borderRadius: RADII.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: urgency.color }}>{urgency.label}</Text>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
          <TouchableOpacity
            onPress={handleSkip}
            style={{ flex: 1, borderRadius: RADII.full, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.surfaceDim, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.textSecondary }}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReview}
            style={{ flex: 1, backgroundColor: COLORS.textPrimary, borderRadius: RADII.full, paddingVertical: SPACING.md, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.textOnPrimary }}>Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyCheckins: React.FC = () => (
  <View style={{ paddingHorizontal: SPACING.xxl }}>
    <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xxl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.surfaceDim, borderStyle: 'dashed' }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.successBg, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md }}>
        <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
      </View>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary }}>All caught up!</Text>
      <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: SPACING.xs, textAlign: 'center' }]}>
        No pending check-ins right now. New ones will appear when decisions need reviewing.
      </Text>
    </View>
  </View>
);

// ─── Loading State ────────────────────────────────────────────────────────────

const LoadingSkeletons: React.FC = () => (
  <View style={{ flexDirection: 'row', paddingLeft: SPACING.xxl }}>
    <SkeletonBlock width={ACTION_CARD_WIDTH} height={200} style={{ marginRight: SPACING.md }} />
    <SkeletonBlock width={ACTION_CARD_WIDTH} height={200} />
  </View>
);

// ─── Section Wrapper ──────────────────────────────────────────────────────────

type ActionRequiredProps = {
  checkins: PendingCheckin[];
  isLoading: boolean;
};

export const ActionRequired: React.FC<ActionRequiredProps> = ({ checkins, isLoading }) => (
  <View style={{ marginBottom: SPACING.xxl }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.xxl, marginBottom: SPACING.md }}>
      <Text style={[TYPOGRAPHY.label, { color: COLORS.textMuted }]}>Action Required</Text>
      {checkins.length > 0 && (
        <View style={{ backgroundColor: COLORS.dangerBg, borderRadius: RADII.full, paddingHorizontal: SPACING.sm, paddingVertical: 2 }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: COLORS.danger }}>
            {checkins.length} pending
          </Text>
        </View>
      )}
    </View>

    {isLoading ? (
      <LoadingSkeletons />
    ) : checkins.length === 0 ? (
      <EmptyCheckins />
    ) : (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: SPACING.xxl, paddingRight: SPACING.md, paddingBottom: SPACING.xs }}>
        {checkins.map((item) => (
          <ActionCard key={item.id} item={item} />
        ))}
      </ScrollView>
    )}
  </View>
);
