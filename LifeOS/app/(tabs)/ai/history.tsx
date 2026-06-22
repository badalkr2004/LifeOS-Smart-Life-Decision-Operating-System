/**
 * AI Chat History — Lists past chat sessions.
 * Tapping a session navigates back to the chat with that session loaded.
 */

import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useChatSessions } from '@/hooks/useAI';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';
import type { ChatSession } from '@/services/aiService';

export default function AiHistoryScreen() {
    const router = useRouter();
    const { data: sessions, isLoading, isError, refetch } = useChatSessions();

    const handleSessionPress = (session: ChatSession) => {
        router.push({ pathname: '/(tabs)/ai', params: { sessionId: session.id } });
    };

    const renderSession = ({ item }: { item: ChatSession }) => {
        const timeAgo = getRelativeTime(item.lastMessageAt);
        return (
            <TouchableOpacity
                onPress={() => handleSessionPress(item)}
                activeOpacity={0.7}
                style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.lg, padding: SPACING.lg, marginHorizontal: SPACING.lg, marginBottom: 10, ...SHADOWS.card }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md }}>
                    <View style={{ width: 40, height: 40, borderRadius: RADII.md, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="chatbubbles-outline" size={20} color={COLORS.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, marginBottom: 4 }]} numberOfLines={2}>
                            {item.title || 'Untitled Chat'}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="chatbubble-outline" size={12} color="#9CA3AF" />
                                <Text style={[TYPOGRAPHY.bodySmall, { color: '#9CA3AF' }]}>
                                    {item.messageCount || 0} messages
                                </Text>
                            </View>
                            <Text style={[TYPOGRAPHY.bodySmall, { color: '#9CA3AF' }]}>
                                {timeAgo}
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.outlineVariant} style={{ marginTop: 8 }} />
                </View>
            </TouchableOpacity>
        );
    };

    // Error state
    if (isError && !isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxl }}>
                    <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
                    <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, marginTop: SPACING.lg, textAlign: 'center' }]}>Could not load history</Text>
                    <TouchableOpacity onPress={() => refetch()} style={{ marginTop: SPACING.lg, backgroundColor: COLORS.primary, borderRadius: RADII.md, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md }}>
                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.textOnPrimary }}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: SPACING.md }}>
                <TouchableOpacity onPress={() => router.back()} style={{ minWidth: 44, minHeight: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, flex: 1 }]}>Chat History</Text>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : !sessions || sessions.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
                    <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg }}>
                        <Ionicons name="chatbubbles-outline" size={28} color={COLORS.primary} />
                    </View>
                    <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, marginBottom: 6 }]}>No conversations yet</Text>
                    <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, textAlign: 'center' }]}>
                        Start a new chat with your AI Decision Advisor to see your conversation history here.
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/ai')} activeOpacity={0.85} style={{ marginTop: SPACING.xl, backgroundColor: COLORS.primary, borderRadius: RADII.md, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="add-circle-outline" size={18} color={COLORS.textOnPrimary} />
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textOnPrimary }}>Start Chat</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={sessions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSession}
                    contentContainerStyle={{ paddingTop: SPACING.lg, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    onRefresh={refetch}
                    refreshing={isLoading}
                />
            )}
        </SafeAreaView>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRelativeTime(dateStr: string): string {
    try {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
        return '';
    }
}
