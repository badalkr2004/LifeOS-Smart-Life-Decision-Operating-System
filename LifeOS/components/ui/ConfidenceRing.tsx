/**
 * ConfidenceRing — SVG circular progress indicator for confidence level.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY } from '@/utils/designTokens';

type ConfidenceRingProps = {
    value: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
};

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({
    value,
    size = 72,
    strokeWidth = 6,
    color = COLORS.primary,
}) => {
    const percentage = value * 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (percentage / 100) * circumference;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }} accessible accessibilityLabel={`${percentage}% confidence`}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx={size / 2} cy={size / 2} r={radius} stroke={COLORS.surfaceDim} strokeWidth={strokeWidth} fill="none" />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                />
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[TYPOGRAPHY.h2, { color: COLORS.textPrimary }]}>{percentage}%</Text>
            </View>
        </View>
    );
};
