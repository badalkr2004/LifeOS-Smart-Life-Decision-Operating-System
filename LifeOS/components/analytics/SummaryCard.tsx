import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';

interface SummaryCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, label, value, color, bgColor }) => (
  <View
    style={{
      width: '47%',
      backgroundColor: COLORS.surfaceLowest,
      borderRadius: RADII.xl,
      padding: SPACING.xl,
      ...SHADOWS.card,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md }}>
      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, flex: 1 }]} numberOfLines={1}>{label}</Text>
    </View>
    <Text style={[TYPOGRAPHY.h1, { color }]}>{value}</Text>
  </View>
);

export default SummaryCard;
