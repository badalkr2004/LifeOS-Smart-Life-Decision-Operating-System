/**
 * DecisionCardSkeleton — Animated placeholder loader for the decision list.
 */

import React from 'react';
import { View } from 'react-native';
import { SkeletonBlock } from '@/components/ui';
import { COLORS, SPACING, RADII } from '@/utils/designTokens';

export const DecisionCardSkeleton: React.FC = () => (
    <View
        style={{
            backgroundColor: COLORS.surfaceLowest,
            borderRadius: RADII.xl,
            padding: SPACING.xl,
            marginBottom: SPACING.md,
            marginHorizontal: SPACING.xl,
        }}
    >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md }}>
            <SkeletonBlock width={40} height={40} radius={RADII.md} />
            <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBlock width="75%" height={18} />
                <SkeletonBlock width="50%" height={13} />
            </View>
        </View>
        <SkeletonBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <SkeletonBlock width="60%" height={14} />
    </View>
);
