/**
 * EmptyState — Reusable empty state card with icon, title, subtitle, and optional CTA.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type EmptyStateProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconColor?: string;
    iconBgColor?: string;
    title: string;
    subtitle: string;
    ctaLabel?: string;
    onCta?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    iconColor = '#4F46E5',
    iconBgColor = '#E8E6FF',
    title,
    subtitle,
    ctaLabel,
    onCta,
}) => (
    <View
        style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
            paddingTop: 60,
        }}
    >
        <View
            style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: iconBgColor,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
            }}
        >
            <Ionicons name={icon} size={36} color={iconColor} />
        </View>

        <Text
            style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 20,
                color: '#111827',
                textAlign: 'center',
                marginBottom: 8,
            }}
        >
            {title}
        </Text>

        <Text
            style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 15,
                color: '#6B7280',
                textAlign: 'center',
                lineHeight: 22,
                marginBottom: 28,
            }}
        >
            {subtitle}
        </Text>

        {ctaLabel && onCta && (
            <TouchableOpacity onPress={onCta} activeOpacity={0.85}>
                <LinearGradient
                    colors={['#3525CD', '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        paddingHorizontal: 28,
                        paddingVertical: 14,
                        borderRadius: 9999,
                        shadowColor: '#4F46E5',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.22,
                        shadowRadius: 12,
                        elevation: 6,
                    }}
                >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text
                        style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 15,
                            color: '#FFFFFF',
                        }}
                    >
                        {ctaLabel}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )}
    </View>
);
