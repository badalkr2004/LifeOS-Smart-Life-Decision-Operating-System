/**
 * DashboardHeader — App logo, hamburger, avatar
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DashboardHeaderProps = {
    firstName?: string;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ firstName }) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 20,
        }}
    >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="menu-outline" size={24} color="#111827" />
            </TouchableOpacity>
            <Text
                style={{
                    fontFamily: 'Inter_800ExtraBold',
                    fontSize: 20,
                    color: '#111827',
                    letterSpacing: -0.5,
                }}
            >
                LifeOS
            </Text>
        </View>
        <TouchableOpacity
            style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: '#E2DFFF',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#4F46E5' }}>
                {firstName ? firstName.charAt(0).toUpperCase() : '?'}
            </Text>
        </TouchableOpacity>
    </View>
);
