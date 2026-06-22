import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';
import { PillBadge } from '@/components/ui';
import { getCategoryColor, getCategoryBg } from '@/utils/helpers';
import type { DecisionFramework } from '@/services/frameworkService';

interface FrameworkDetailProps {
  framework: DecisionFramework | null;
  visible: boolean;
  onClose: () => void;
}

const FrameworkDetail: React.FC<FrameworkDetailProps> = ({ framework, visible, onClose }) => {
  if (!framework) return null;

  const catColor = getCategoryColor(framework.category || 'other');
  const catBg = getCategoryBg(framework.category || 'other');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md }}>
          <TouchableOpacity onPress={onClose} style={{ padding: SPACING.sm }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary }]}>Framework</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: SPACING.xxl, paddingBottom: SPACING.huge }}>
          {/* Badges */}
          <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg }}>
            <PillBadge label={framework.category?.replace(/_/g, ' ') || 'General'} color={catColor} bgColor={catBg} />
            {framework.isSystemFramework && <PillBadge label="System" color={COLORS.textMuted} bgColor={COLORS.surfaceLow} />}
          </View>

          {/* Title */}
          <Text style={[TYPOGRAPHY.h1, { color: COLORS.textPrimary, marginBottom: SPACING.sm }]}>{framework.name}</Text>
          {framework.description && (
            <Text style={[TYPOGRAPHY.bodyLarge, { color: COLORS.textSecondary, marginBottom: SPACING.xxl }]}>{framework.description}</Text>
          )}

          {/* Steps */}
          {framework.framework.steps.map((step, i) => (
            <View key={i} style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, marginBottom: SPACING.md, ...SHADOWS.card }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: COLORS.primary }}>{i + 1}</Text>
                </View>
                <Text style={[TYPOGRAPHY.heading, { flex: 1, color: COLORS.textPrimary }]}>{step.title}</Text>
              </View>
              <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginBottom: SPACING.sm }]}>{step.description}</Text>
              {step.questions.map((q, qi) => (
                <View key={qi} style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: 4 }}>
                  <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.primary }]}>•</Text>
                  <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textBody, flex: 1 }]}>{q}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* Criteria */}
          {framework.framework.criteria && framework.framework.criteria.length > 0 && (
            <>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted, marginBottom: SPACING.md, marginTop: SPACING.lg }]}>Evaluation Criteria</Text>
              {framework.framework.criteria.map((criterion, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceDim }}>
                  <Text style={[TYPOGRAPHY.body, { color: COLORS.textPrimary, flex: 1 }]}>{criterion.name}</Text>
                  <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.primary }]}>{(criterion.weight * 100).toFixed(0)}%</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default FrameworkDetail;
