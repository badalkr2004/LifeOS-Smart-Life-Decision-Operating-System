/**
 * InfoCard — Labelled content card with icon header.
 * Used in Decision Detail to show description, reasoning, context.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type InfoCardProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    content: string;
};

export const InfoCard: React.FC<InfoCardProps> = ({ icon, label, content }) => (
    <View
        style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 20,
            shadowColor: 'rgba(25,28,29,0.8)',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.03,
            shadowRadius: 12,
            elevation: 1,
        }}
    >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Ionicons name={icon} size={16} color="#4F46E5" />
            <Text
                style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 11,
                    color: '#464555',
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                }}
            >
                {label}
            </Text>
        </View>
        <Text
            style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 15,
                color: '#374151',
                lineHeight: 24,
            }}
        >
            {content}
        </Text>
    </View>
);
