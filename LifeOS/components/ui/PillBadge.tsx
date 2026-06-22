import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADII } from '@/utils/designTokens';

interface PillBadgeProps {
  label: string;
  color: string;
  bgColor: string;
  size?: 'sm' | 'md';
}

const PillBadge: React.FC<PillBadgeProps> = ({ label, color, bgColor, size = 'sm' }) => {
  const isMd = size === 'md';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: isMd ? SPACING.md : SPACING.sm,
        paddingVertical: isMd ? SPACING.xs : 2,
        borderRadius: RADII.lg,
        backgroundColor: bgColor,
      }}
    >
      <View style={{ width: isMd ? 8 : 6, height: isMd ? 8 : 6, borderRadius: isMd ? 4 : 3, backgroundColor: color, marginRight: SPACING.xs }} />
      <Text
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: isMd ? 12 : 11,
          color,
          textTransform: 'capitalize',
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

export default PillBadge;
