/**
 * AI Chat History — Lists past chat sessions.
 * Tapping a session navigates back to the chat with that session loaded.
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useChatSessions } from '@/hooks/useAI';
import type { ChatSession } from '@/services/aiService';

export default function AiHistoryScreen() {
    const router = useRouter();
    const { data: sessions, isLoading, refetch } = useChatSessions();

    const handleSessionPress = (session: ChatSession) => {
        router.push({
            pathname: '/(tabs)/ai',
            params: { sessionId: session.id },
        });
    };

    const renderSession = ({ item }: { item: ChatSession }) => {
        const timeAgo = getRelativeTime(item.lastMessageAt);

        return (
            <TouchableOpacity
                onPress={() => handleSessionPress(item)}
                activeOpacity={0.7}
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    padding: 16,
                    marginHorizontal: 16,
                    marginBottom: 10,
                    shadowColor: 'rgba(0,0,0,0.5)',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.03,
                    shadowRadius: 6,
                    elevation: 1,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            backgroundColor: '#EEF2FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="chatbubbles-outline" size={18} color="#4F46E5" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontFamily: 'Inter_600SemiBold',
                                fontSize: 15,
                                color: '#111827',
                                marginBottom: 4,
                            }}
                            numberOfLines={2}
                        >
                            {item.title || 'Untitled Chat'}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="chatbubble-outline" size={12} color="#9CA3AF" />
                                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9CA3AF' }}>
                                    {item.messageCount || 0} messages
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9CA3AF' }}>
                                {timeAgo}
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#D1D5DB" style={{ marginTop: 8 }} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F5F7' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F5F7" />

            {/* ── Header ── */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F0F0F0',
                    gap: 12,
                }}
            >
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: '#111827', flex: 1 }}>
                    Chat History
                </Text>
            </View>

            {/* ── Content ── */}
            {isLoading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : !sessions || sessions.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
                    <View
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: '#EEF2FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                        }}
                    >
                        <Ionicons name="chatbubbles-outline" size={28} color="#4F46E5" />
                    </View>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: '#111827', marginBottom: 6 }}>
                        No conversations yet
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 }}>
                        Start a new chat with your AI Decision Advisor to see your conversation history here.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/ai')}
                        activeOpacity={0.85}
                        style={{
                            marginTop: 20,
                            backgroundColor: '#4F46E5',
                            borderRadius: 12,
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFFFFF' }}>Start Chat</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={sessions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSession}
                    contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
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