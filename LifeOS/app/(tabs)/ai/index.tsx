/**
 * AI Chat Screen — Streaming chat with the LifeOS Decision Advisor.
 *
 * Features:
 *  - Real-time streaming text (SSE)
 *  - Chat bubble UI with typing indicator
 *  - Session management (auto-create, switch)
 *  - Decision context linking
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { aiService, type SSEEvent } from '@/services/aiService';
import { useChatHistory, useInvalidateSessions } from '@/hooks/useAI';

// ─── Types ───────────────────────────────────────────────────────────────────

type DisplayMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
    createdAt: string;
};

// ─── Chat Bubble ─────────────────────────────────────────────────────────────

const ChatBubble: React.FC<{ message: DisplayMessage }> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <View
            style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                marginBottom: 12,
                marginHorizontal: 16,
            }}
        >
            {!isUser && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                    </View>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#6B7280' }}>LifeOS Advisor</Text>
                </View>
            )}
            <View
                style={{
                    backgroundColor: isUser ? '#4F46E5' : '#FFFFFF',
                    borderRadius: 18,
                    borderTopRightRadius: isUser ? 4 : 18,
                    borderTopLeftRadius: isUser ? 18 : 4,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    shadowColor: 'rgba(0,0,0,0.5)',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isUser ? 0.1 : 0.04,
                    shadowRadius: 6,
                    elevation: isUser ? 2 : 1,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 14.5,
                        color: isUser ? '#FFFFFF' : '#111827',
                        lineHeight: 22,
                    }}
                >
                    {message.content}
                    {message.isStreaming && '▊'}
                </Text>
            </View>
            <Text
                style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 10,
                    color: '#9CA3AF',
                    marginTop: 4,
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    marginHorizontal: 4,
                }}
            >
                {formatTime(message.createdAt)}
            </Text>
        </View>
    );
};

// ─── Typing Indicator ────────────────────────────────────────────────────────

const TypingIndicator: React.FC = () => (
    <View style={{ alignSelf: 'flex-start', marginHorizontal: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="sparkles" size={12} color="#FFFFFF" />
            </View>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#6B7280' }}>LifeOS Advisor</Text>
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, borderTopLeftRadius: 4, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', gap: 4, shadowColor: 'rgba(0,0,0,0.5)', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#6B7280', marginLeft: 6 }}>Thinking...</Text>
        </View>
    </View>
);

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ onSuggestionPress: (text: string) => void }> = ({ onSuggestionPress }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 100 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Ionicons name="sparkles" size={32} color="#4F46E5" />
        </View>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: '#111827', textAlign: 'center', marginBottom: 8 }}>
            Decision Advisor
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 }}>
            Ask me anything about your decisions. I'll use your history, patterns, and past outcomes to give personalized advice.
        </Text>
        <View style={{ marginTop: 24, gap: 8, width: '100%' }}>
            {[
                'Should I invest in this opportunity?',
                'Am I being impulsive with this purchase?',
                'What patterns do you see in my decisions?',
            ].map((suggestion, i) => (
                <TouchableOpacity key={i} onPress={() => onSuggestionPress(suggestion)} activeOpacity={0.7} style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#F3F4F6' }}>
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#4F46E5' }}>{suggestion}</Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function AiChatScreen() {
    const router = useRouter();
    const { decisionId, sessionId: paramSessionId } = useLocalSearchParams<{
        decisionId?: string;
        sessionId?: string;
    }>();

    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(paramSessionId);

    const flatListRef = useRef<FlatList>(null);
    const invalidateSessions = useInvalidateSessions();

    // Load existing session if provided
    const { data: existingSession } = useChatHistory(paramSessionId || '');

    useEffect(() => {
        if (existingSession && paramSessionId) {
            const loaded: DisplayMessage[] = existingSession.messages
                .filter((m) => m.role !== 'system')
                .map((m) => ({
                    id: m.id,
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                    createdAt: m.createdAt,
                }));
            setMessages(loaded);
            setCurrentSessionId(paramSessionId);
        }
    }, [existingSession, paramSessionId]);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, []);

    const handleSend = useCallback(async (textOverride?: string) => {
        const trimmed = (textOverride || input).trim();
        if (!trimmed || isLoading || isStreaming) return;

        Keyboard.dismiss();
        if (!textOverride) setInput('');

        // Add user message to UI
        const userMsg: DisplayMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: trimmed,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMsg]);
        scrollToBottom();

        // Add placeholder for assistant
        const assistantId = `assistant-${Date.now()}`;
        setIsLoading(true);

        try {
            let sessionEstablished = false;

            await aiService.sendChatMessage(
                {
                    sessionId: currentSessionId,
                    message: trimmed,
                    decisionId: decisionId || undefined,
                },
                // onEvent
                (event: SSEEvent) => {
                    if (event.type === 'session') {
                        setCurrentSessionId(event.sessionId);
                        sessionEstablished = true;
                    } else if (event.type === 'delta') {
                        setIsLoading(false);
                        setIsStreaming(true);
                        setMessages((prev) => {
                            const existing = prev.find((m) => m.id === assistantId);
                            if (existing) {
                                return prev.map((m) =>
                                    m.id === assistantId
                                        ? { ...m, content: m.content + event.text, isStreaming: true }
                                        : m,
                                );
                            }
                            return [
                                ...prev,
                                {
                                    id: assistantId,
                                    role: 'assistant' as const,
                                    content: event.text,
                                    isStreaming: true,
                                    createdAt: new Date().toISOString(),
                                },
                            ];
                        });
                        scrollToBottom();
                    } else if (event.type === 'done') {
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === assistantId ? { ...m, isStreaming: false } : m,
                            ),
                        );
                    }
                },
                // onError
                (err) => {
                    console.error('Chat error:', err);
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: assistantId,
                            role: 'assistant',
                            content: 'Sorry, I encountered an error. Please try again.',
                            createdAt: new Date().toISOString(),
                        },
                    ]);
                },
                // onComplete
                () => {
                    setIsLoading(false);
                    setIsStreaming(false);
                    invalidateSessions();
                    scrollToBottom();
                },
            );
        } catch (err) {
            setIsLoading(false);
            setIsStreaming(false);
        }
    }, [input, isLoading, isStreaming, currentSessionId, decisionId, scrollToBottom, invalidateSessions]);

    const handleSendDirect = useCallback((text: string) => {
        handleSend(text);
    }, [handleSend]);

    const handleNewChat = () => {
        setMessages([]);
        setCurrentSessionId(undefined);
        setInput('');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F5F7' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F5F7" />

            {/* ── Header ── */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F0F0F0',
                    backgroundColor: '#F4F5F7',
                }}
            >
                <TouchableOpacity onPress={() => router.push('/(tabs)/ai/history')} style={{ padding: 8 }}>
                    <Ionicons name="time-outline" size={22} color="#464555" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#111827' }}>AI Advisor</Text>
                    {currentSessionId && (
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#9CA3AF' }}>
                            Session active
                        </Text>
                    )}
                </View>
                <TouchableOpacity onPress={handleNewChat} style={{ padding: 8 }}>
                    <Ionicons name="add-circle-outline" size={22} color="#4F46E5" />
                </TouchableOpacity>
            </View>

            {/* ── Messages ── */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                {messages.length === 0 ? (
                    <EmptyState onSuggestionPress={handleSendDirect} />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <ChatBubble message={item} />}
                        contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={scrollToBottom}
                        ListFooterComponent={isLoading ? <TypingIndicator /> : null}
                    />
                )}

                {/* ── Input Bar ── */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        paddingBottom: 14,
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 1,
                        borderTopColor: '#F0F0F0',
                        gap: 8,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#F4F5F7',
                            borderRadius: 22,
                            paddingHorizontal: 18,
                            paddingVertical: Platform.OS === 'ios' ? 12 : 8,
                            maxHeight: 120,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                        }}
                    >
                        <TextInput
                            style={{
                                fontFamily: 'Inter_400Regular',
                                fontSize: 15,
                                color: '#111827',
                                maxHeight: 100,
                            }}
                            placeholder="Ask about your decisions..."
                            placeholderTextColor="#9CA3AF"
                            value={input}
                            onChangeText={setInput}
                            multiline
                            returnKeyType="default"
                            editable={!isStreaming}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => handleSend()}
                        disabled={!input.trim() || isLoading || isStreaming}
                        activeOpacity={0.8}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: input.trim() && !isLoading && !isStreaming ? '#4F46E5' : '#D1D5DB',
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#4F46E5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: input.trim() ? 0.2 : 0,
                            shadowRadius: 6,
                            elevation: input.trim() ? 3 : 0,
                        }}
                    >
                        <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
}
