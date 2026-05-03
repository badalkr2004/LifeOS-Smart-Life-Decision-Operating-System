/**
 * SkeletonBlock — Shared placeholder loader block used by all screens.
 */

import React from 'react';
import { View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

type SkeletonBlockProps = {
    width: DimensionValue;
    height: number;
    radius?: number;
    style?: StyleProp<ViewStyle>;
};

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
    width,
    height,
    radius = 12,
    style,
}) => (
    <View
        style={[
            {
                width,
                height,
                borderRadius: radius,
                backgroundColor: '#EDEEEF',
            },
            style,
        ]}
    />
);
