/**
 * Greeting — Time-aware greeting with user's name and decorative accent.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { SkeletonBlock } from '@/components/ui';
import { getGreeting } from '@/utils/helpers';
import { COLORS, SPACING, TYPOGRAPHY } from '@/utils/designTokens';

type GreetingProps = {
    firstName?: string;
    isLoading: boolean;
};

export const Greeting: React.FC<GreetingProps> = ({ firstName, isLoading }) => (
    <View style={{ paddingHorizontal: SPACING.xxl, marginBottom: SPACING.xxl }}>
        {isLoading ? (
            <>
                <SkeletonBlock width={220} height={36} style={{ marginBottom: SPACING.sm }} />
                <SkeletonBlock width={180} height={18} />
            </>
        ) : (
            <>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SPACING.md }}>
                    <Text style={[TYPOGRAPHY.h1, { color: COLORS.textPrimary }]}>
                        {getGreeting()}, {firstName ?? 'there'}
                    </Text>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginBottom: 4 }} />
                </View>
                <Text style={[TYPOGRAPHY.bodyLarge, { color: COLORS.textSecondary, marginTop: SPACING.xs }]}>
                    Ready to optimize your day?
                </Text>
            </>
        )}
    </View>
);
