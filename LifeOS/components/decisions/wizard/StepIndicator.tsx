/**
 * StepIndicator — Progress bar and step label for the wizard.
 */

import React from 'react';
import { View, Text } from 'react-native';

type StepIndicatorProps = {
    step: number;
    total: number;
};

const PHASE_LABELS = ['PHASE 01', 'STEP 2 OF 3', 'STEP 3 OF 3'];
const STEP_TITLES = ['Foundations', 'Context &\nAlternatives', 'Final\nCalibration'];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ step, total }) => {
    const progress = step / total;
    const rightLabels = [
        `Step ${step} of ${total}`,
        `${Math.round(progress * 100)}%\nComplete`,
        'Outcomes &\nConfidence',
    ];

    return (
        <View style={{ marginBottom: 24 }}>
            <Text
                style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 11,
                    color: '#4F46E5',
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                }}
            >
                {PHASE_LABELS[step - 1]}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 14,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Inter_800ExtraBold',
                        fontSize: 28,
                        color: '#111827',
                        letterSpacing: -1,
                        lineHeight: 34,
                        flex: 1,
                    }}
                >
                    {STEP_TITLES[step - 1]}
                </Text>
                <Text
                    style={{
                        fontFamily: 'Inter_500Medium',
                        fontSize: 13,
                        color: '#6B7280',
                        textAlign: 'right',
                        lineHeight: 18,
                    }}
                >
                    {rightLabels[step - 1]}
                </Text>
            </View>
            {/* Progress bar */}
            <View style={{ height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                <View
                    style={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#4F46E5',
                        width: `${progress * 100}%`,
                    }}
                />
            </View>
        </View>
    );
};

/**
 * SectionLabel — Tiny uppercase label used above form sections.
 */
export const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
    <Text
        style={{
            fontFamily: 'Inter_700Bold',
            fontSize: 10,
            color: '#464555',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 10,
        }}
    >
        {text}
    </Text>
);
