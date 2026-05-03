/**
 * DetailSkeleton — Placeholder loader for the decision detail screen.
 */

import React from 'react';
import { View } from 'react-native';
import { SkeletonBlock } from '@/components/ui';

export const DetailSkeleton: React.FC = () => (
    <View style={{ padding: 24, gap: 20 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
            <SkeletonBlock width={80} height={28} radius={8} />
            <SkeletonBlock width={80} height={28} radius={8} />
        </View>
        <SkeletonBlock width="90%" height={36} />
        <SkeletonBlock width="60%" height={36} />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <SkeletonBlock width="48%" height={44} radius={12} />
            <SkeletonBlock width="48%" height={44} radius={12} />
        </View>
        <SkeletonBlock width="100%" height={140} radius={20} />
        <SkeletonBlock width="100%" height={100} radius={20} />
        <SkeletonBlock width="100%" height={100} radius={20} />
    </View>
);
