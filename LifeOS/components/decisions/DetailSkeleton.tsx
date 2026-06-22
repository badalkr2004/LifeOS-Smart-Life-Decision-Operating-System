/**
 * DetailSkeleton — Animated placeholder loader for the decision detail screen.
 */

import React from 'react';
import { View } from 'react-native';
import { SkeletonBlock } from '@/components/ui';
import { SPACING, RADII } from '@/utils/designTokens';

export const DetailSkeleton: React.FC = () => (
    <View style={{ padding: SPACING.xxl, gap: SPACING.xl }}>
        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            <SkeletonBlock width={80} height={28} radius={RADII.sm} />
            <SkeletonBlock width={80} height={28} radius={RADII.sm} />
        </View>
        <SkeletonBlock width="90%" height={36} />
        <SkeletonBlock width="60%" height={36} />
        <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm }}>
            <SkeletonBlock width="48%" height={44} radius={RADII.md} />
            <SkeletonBlock width="48%" height={44} radius={RADII.md} />
        </View>
        <SkeletonBlock width="100%" height={140} radius={RADII.xl} />
        <SkeletonBlock width="100%" height={100} radius={RADII.xl} />
        <SkeletonBlock width="100%" height={100} radius={RADII.xl} />
    </View>
);
