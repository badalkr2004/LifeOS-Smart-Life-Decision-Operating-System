import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';

interface DecisionProfileStatsProps {
  totalDecisions: number;
  avgConfidence: number | null;
  avgSatisfaction: number | null;
  totalOutcomes: number;
}

const DecisionProfileStats: React.FC<DecisionProfileStatsProps> = ({
  totalDecisions,
  avgConfidence,
  avgSatisfaction,
  totalOutcomes,
}) => {
  const stats = [
    { label: 'Decisions', value: totalDecisions, icon: 'checkmark-circle', color: COLORS.primary, bgColor: COLORS.primaryFixed },
    { label: 'Avg Confidence', value: avgConfidence != null ? `${avgConfidence.toFixed(1)}/10` : '—', icon: 'trending-up', color: COLORS.success, bgColor: COLORS.successBg },
    { label: 'Avg Satisfaction', value: avgSatisfaction != null ? `${avgSatisfaction.toFixed(1)}/10` : '—', icon: 'star', color: COLORS.warning, bgColor: COLORS.warningBg },
    { label: 'Check-ins', value: totalOutcomes, icon: 'checkbox', color: '#8B5CF6', bgColor: '#F5F3FF' },
  ];

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
      {stats.map((stat, i) => (
        <View key={i} style={{ flex: 1, minWidth: '45%', backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.lg, alignItems: 'center', ...SHADOWS.card }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: stat.bgColor, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm }}>
            <Ionicons name={stat.icon as any} size={18} color={stat.color} />
          </View>
          <Text style={[TYPOGRAPHY.h2, { color: stat.color }]}>{stat.value}</Text>
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textSecondary }]}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default DecisionProfileStats;
