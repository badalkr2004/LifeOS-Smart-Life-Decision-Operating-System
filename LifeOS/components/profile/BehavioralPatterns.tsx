import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';
import type { DetectedPattern } from '@/services/aiService';

interface BehavioralPatternsProps {
  patterns: DetectedPattern[];
  isLoading: boolean;
  onRefresh: () => void;
}

const BehavioralPatterns: React.FC<BehavioralPatternsProps> = ({ patterns, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, ...SHADOWS.card }}>
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted, marginBottom: SPACING.md }]}>Decision Patterns</Text>
        {[1, 2].map((i) => (
          <View key={i} style={{ height: 50, backgroundColor: COLORS.surfaceContainer, borderRadius: RADII.md, marginBottom: SPACING.sm }} />
        ))}
      </View>
    );
  }

  if (patterns.length === 0) {
    return (
      <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, alignItems: 'center', ...SHADOWS.card }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md }}>
          <Ionicons name="analytics-outline" size={24} color={COLORS.primary} />
        </View>
        <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, textAlign: 'center' }]}>
          No patterns detected yet. Record more outcomes to discover your decision tendencies.
        </Text>
        <TouchableOpacity onPress={onRefresh} style={{ marginTop: SPACING.md }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.primary }}>Detect Patterns</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, ...SHADOWS.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
          <Ionicons name="analytics-outline" size={16} color={COLORS.primary} />
          <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted }]}>Decision Patterns</Text>
        </View>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {patterns.map((pattern) => (
        <View key={pattern.id} style={{ marginBottom: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceDim }}>
          <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.textPrimary, marginBottom: 2, textTransform: 'capitalize' }]}>
            {pattern.patternType.replace(/_/g, ' ')}
          </Text>
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textSecondary }]}>
            When {pattern.pattern.condition} → {pattern.pattern.outcome}
          </Text>
          <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xs }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: pattern.strength === 'strong' ? COLORS.success : pattern.strength === 'moderate' ? COLORS.warning : COLORS.danger }}>
              {pattern.strength.toUpperCase()} ({pattern.pattern.confidence.toFixed(0)}%)
            </Text>
            <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textMuted }]}>
              {pattern.pattern.frequency}x · {pattern.pattern.sampleSize} samples
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default BehavioralPatterns;
