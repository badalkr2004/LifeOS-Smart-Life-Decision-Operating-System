/**
 * Greeting — Time-aware greeting with user's name.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { SkeletonBlock } from '@/components/ui';
import { getGreeting } from '@/utils/helpers';

type GreetingProps = {
    firstName?: string;
    isLoading: boolean;
};

export const Greeting: React.FC<GreetingProps> = ({ firstName, isLoading }) => (
    <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
        {isLoading ? (
            <>
                <SkeletonBlock width={220} height={36} style={{ marginBottom: 8 }} />
                <SkeletonBlock width={180} height={18} />
            </>
        ) : (
            <>
                <Text
                    style={{
                        fontFamily: 'Inter_800ExtraBold',
                        fontSize: 32,
                        color: '#111827',
                        letterSpacing: -1.5,
                        lineHeight: 38,
                    }}
                >
                    {getGreeting()}, {firstName ?? 'there'}
                </Text>
                <Text
                    style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 15,
                        color: '#6B7280',
                        marginTop: 4,
                    }}
                >
                    Ready to optimize your day?
                </Text>
            </>
        )}
    </View>
);
