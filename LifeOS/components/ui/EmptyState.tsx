/**
 * EmptyState — Reusable empty state with icon, title, subtitle, and CTA.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';

type EmptyStateProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconColor?: string;
    iconBgColor?: string;
    title: string;
    subtitle: string;
    ctaLabel?: string;
    onCta?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    iconColor = COLORS.primary,
    iconBgColor = COLORS.primarySurface,
    title,
    subtitle,
    ctaLabel,
    onCta,
}) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 60 }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: iconBgColor, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xxl, ...SHADOWS.card }}>
            <Ionicons name={icon} size={40} color={iconColor} />
        </View>
        <Text style={[TYPOGRAPHY.h2, { color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.sm }]}>{title}</Text>
        <Text style={[TYPOGRAPHY.bodyLarge, { color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xxl, lineHeight: 24 }]}>{subtitle}</Text>
        {ctaLabel && onCta && (
            <TouchableOpacity onPress={onCta} activeOpacity={0.85}>
                <LinearGradient colors={['#3525CD', COLORS.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: 28, paddingVertical: 15, borderRadius: RADII.full, ...SHADOWS.button }}>
                    <Ionicons name="add" size={20} color={COLORS.textOnPrimary} />
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: COLORS.textOnPrimary }}>{ctaLabel}</Text>
                </LinearGradient>
            </TouchableOpacity>
        )}
    </View>
);
