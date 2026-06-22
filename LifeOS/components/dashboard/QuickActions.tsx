/**
 * QuickActions — "New Decision" + "Ask AI" action buttons.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, SHADOWS } from '@/utils/designTokens';

type QuickActionsProps = {
    onNewDecision: () => void;
    onAskAI: () => void;
};

export const QuickActions: React.FC<QuickActionsProps> = ({ onNewDecision, onAskAI }) => (
    <View style={{ flexDirection: 'row', gap: SPACING.md, paddingHorizontal: SPACING.xxl, marginBottom: SPACING.xxl }}>
        <TouchableOpacity onPress={onNewDecision} style={{ flex: 1 }} activeOpacity={0.85} accessibilityLabel="Create new decision" accessibilityRole="button">
            <LinearGradient colors={['#3525CD', COLORS.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: RADII.full, padding: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, height: 52, borderRadius: RADII.full - 1, ...SHADOWS.button }}>
                    <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="add" size={18} color={COLORS.textOnPrimary} />
                    </View>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: COLORS.textOnPrimary }}>New Decision</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={onAskAI}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, height: 52, borderRadius: RADII.full, borderWidth: 1.5, borderColor: COLORS.surfaceDim, backgroundColor: COLORS.surfaceLowest, paddingHorizontal: 22 }}
            activeOpacity={0.85}
            accessibilityLabel="Ask AI advisor" accessibilityRole="button"
        >
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="sparkles" size={14} color={COLORS.primary} />
            </View>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: COLORS.textPrimary }}>Ask AI</Text>
        </TouchableOpacity>
    </View>
);
