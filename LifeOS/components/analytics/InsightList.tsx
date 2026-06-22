import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';
import type { UserInsight } from '@/services/analyticsService';

interface InsightListProps {
  insights: UserInsight[];
  onDismiss: (id: string) => void;
  isLoading: boolean;
}

const InsightList: React.FC<InsightListProps> = ({ insights, onDismiss, isLoading }) => {
  if (isLoading) {
    return (
      <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, ...SHADOWS.card }}>
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted, marginBottom: SPACING.md }]}>AI Insights</Text>
        {[1, 2].map((i) => (
          <View key={i} style={{ height: 60, backgroundColor: COLORS.surfaceContainer, borderRadius: RADII.md, marginBottom: SPACING.sm }} />
        ))}
      </View>
    );
  }

  if (insights.length === 0) {
    return (
      <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, alignItems: 'center', ...SHADOWS.card }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md }}>
          <Ionicons name="bulb-outline" size={24} color={COLORS.primary} />
        </View>
        <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, textAlign: 'center' }]}>
          Insights will appear here as you track more decisions and outcomes.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, ...SHADOWS.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md }}>
        <Ionicons name="bulb-outline" size={16} color={COLORS.primary} />
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted }]}>AI Insights</Text>
      </View>
      {insights.map((insight) => (
        <View key={insight.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.md }}>
          <View style={{ flex: 1 }}>
            <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.textPrimary, marginBottom: 2 }]}>{insight.title}</Text>
            <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary }]} numberOfLines={3}>{insight.description}</Text>
          </View>
          <TouchableOpacity onPress={() => onDismiss(insight.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default InsightList;
