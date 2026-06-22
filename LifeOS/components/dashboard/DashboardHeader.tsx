/**
 * DashboardHeader — App logo and avatar
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/utils/designTokens';

type DashboardHeaderProps = {
    firstName?: string;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ firstName }) => {
    const router = useRouter();
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: SPACING.xxl,
                paddingTop: SPACING.sm,
                paddingBottom: SPACING.xl,
            }}
        >
            <Text
                style={{
                    fontFamily: 'Inter_800ExtraBold',
                    fontSize: 20,
                    color: COLORS.textPrimary,
                    letterSpacing: -0.5,
                }}
            >
                LifeOS
            </Text>
            <TouchableOpacity
                onPress={() => router.push('/(tabs)/profile')}
                style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: COLORS.primaryFixed,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                accessibilityLabel="View profile"
                accessibilityRole="button"
            >
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.primary }}>
                    {firstName ? firstName.charAt(0).toUpperCase() : '?'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
