/**
 * SkeletonBlock — Animated shimmer placeholder loader.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS, RADII } from '@/utils/designTokens';

type SkeletonBlockProps = {
    width: DimensionValue;
    height: number;
    radius?: number;
    style?: StyleProp<ViewStyle>;
};

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
    width,
    height,
    radius = RADII.md,
    style,
}) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ]),
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius: radius,
                    backgroundColor: COLORS.skeleton,
                    opacity,
                },
                style,
            ]}
            accessibilityLabel="Loading content"
            accessibilityLiveRegion="polite"
        />
    );
};
