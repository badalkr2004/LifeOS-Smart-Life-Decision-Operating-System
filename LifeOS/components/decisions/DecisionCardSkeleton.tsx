/**
 * DecisionCardSkeleton — Placeholder loader for the decision list.
 */

import React from 'react';
import { View } from 'react-native';
import { SkeletonBlock } from '@/components/ui';

export const DecisionCardSkeleton: React.FC = () => (
    <View
        style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 20,
            marginBottom: 12,
            marginHorizontal: 20,
        }}
    >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <SkeletonBlock width={40} height={40} radius={12} />
            <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBlock width="75%" height={18} />
                <SkeletonBlock width="50%" height={13} />
            </View>
        </View>
        <SkeletonBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <SkeletonBlock width="60%" height={14} />
    </View>
);
