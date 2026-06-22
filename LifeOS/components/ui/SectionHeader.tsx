import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '@/utils/designTokens';

interface SectionHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, label, subtitle, actionLabel, onAction }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xxl, marginBottom: SPACING.md }}>
    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm }}>
      <Ionicons name={icon as any} size={16} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm }}>
        <Text style={[TYPOGRAPHY.label, { color: COLORS.textMuted }]}>{label}</Text>
      </View>
      {subtitle ? <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: 2 }]}>{subtitle}</Text> : null}
    </View>
    {actionLabel && onAction ? (
      <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.primary }}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export default SectionHeader;
