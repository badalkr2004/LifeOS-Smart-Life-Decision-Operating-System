import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';
import { PillBadge } from '@/components/ui';
import { getCategoryColor, getCategoryBg } from '@/utils/helpers';
import type { DecisionFramework } from '@/services/frameworkService';

interface FrameworkCardProps {
  framework: DecisionFramework;
  onPress: (framework: DecisionFramework) => void;
}

const FrameworkCard: React.FC<FrameworkCardProps> = ({ framework, onPress }) => {
  const catColor = getCategoryColor(framework.category || 'other');
  const catBg = getCategoryBg(framework.category || 'other');

  return (
    <TouchableOpacity
      onPress={() => onPress(framework)}
      activeOpacity={0.7}
      style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, marginBottom: SPACING.md, ...SHADOWS.card }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: SPACING.md }}>
          <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, marginBottom: 4 }]} numberOfLines={1}>{framework.name}</Text>
          {framework.description ? (
            <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary }]} numberOfLines={2}>{framework.description}</Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
      </View>

      <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md }}>
        {framework.category && (
          <PillBadge label={framework.category.replace(/_/g, ' ')} color={catColor} bgColor={catBg} />
        )}
        {framework.isPublic && (
          <PillBadge label="Public" color={COLORS.primary} bgColor={COLORS.primaryFixed} />
        )}
        {framework.isSystemFramework && (
          <PillBadge label="System" color={COLORS.textMuted} bgColor={COLORS.surfaceLow} />
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm }}>
        <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textMuted }]}>
          {framework.framework.steps.length} step{framework.framework.steps.length !== 1 ? 's' : ''}
        </Text>
        {framework.framework.criteria && framework.framework.criteria.length > 0 && (
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textMuted }]}>
            · {framework.framework.criteria.length} criter{framework.framework.criteria.length !== 1 ? 'ia' : 'ion'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default FrameworkCard;
