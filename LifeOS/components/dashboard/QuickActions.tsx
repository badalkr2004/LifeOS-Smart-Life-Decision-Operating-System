/**
 * QuickActions — "New Decision" + "Ask AI" pill buttons.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type QuickActionsProps = {
    onNewDecision: () => void;
    onAskAI: () => void;
};

export const QuickActions: React.FC<QuickActionsProps> = ({ onNewDecision, onAskAI }) => (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginBottom: 28 }}>
        <TouchableOpacity onPress={onNewDecision} style={{ flex: 1 }} activeOpacity={0.85}>
            <LinearGradient
                colors={['#3525CD', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    height: 50,
                    borderRadius: 9999,
                    shadowColor: '#4F46E5',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.22,
                    shadowRadius: 12,
                    elevation: 6,
                }}
            >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#FFFFFF' }}>New Decision</Text>
            </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={onAskAI}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 50,
                borderRadius: 9999,
                borderWidth: 1.5,
                borderColor: '#E1E3E4',
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 22,
            }}
            activeOpacity={0.85}
        >
            <Ionicons name="sparkles-outline" size={18} color="#4F46E5" />
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#111827' }}>Ask AI</Text>
        </TouchableOpacity>
    </View>
);
