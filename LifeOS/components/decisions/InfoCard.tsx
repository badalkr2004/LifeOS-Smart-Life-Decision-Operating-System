/**
 * InfoCard — Labelled content card with icon header and left accent.
 * Used in Decision Detail to show description, reasoning, context.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';

type InfoCardProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    content: string;
};

export const InfoCard: React.FC<InfoCardProps> = ({ icon, label, content }) => (
    <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, ...SHADOWS.card, overflow: 'hidden' }}>
        {/* Top accent line */}
        <View style={{ height: 3, backgroundColor: COLORS.primary + '22' }} />

        <View style={{ padding: SPACING.xl }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={icon} size={14} color={COLORS.primary} />
                </View>
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted }]}>{label}</Text>
            </View>
            <Text style={[TYPOGRAPHY.bodyLarge, { color: COLORS.textBody }]}>
                {content}
            </Text>
        </View>
    </View>
);
