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
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';

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
                marginBottom: SPACING.md,
                marginHorizontal: SPACING.lg,
            }}
        >
            {!isUser && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="sparkles" size={12} color={COLORS.textOnPrimary} />
                    </View>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary }}>LifeOS Advisor</Text>
                </View>
            )}
            <View
                style={{
                    backgroundColor: isUser ? COLORS.primary : COLORS.surfaceLowest,
                    borderRadius: 18,
                    borderTopRightRadius: isUser ? 4 : 18,
                    borderTopLeftRadius: isUser ? 18 : 4,
                    paddingHorizontal: SPACING.lg,
                    paddingVertical: SPACING.md,
                    shadowColor: 'rgba(0,0,0,0.5)',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isUser ? 0.1 : 0.04,
                    shadowRadius: 6,
                    elevation: isUser ? 2 : 1,
                }}
            >
                <Text
                    style={[TYPOGRAPHY.bodyLarge, { color: isUser ? COLORS.textOnPrimary : COLORS.textPrimary }]}
                >
                    {message.content}
                    {message.isStreaming && '\u258A'}
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
    <View style={{ alignSelf: 'flex-start', marginHorizontal: SPACING.lg, marginBottom: SPACING.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="sparkles" size={12} color={COLORS.textOnPrimary} />
            </View>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary }}>LifeOS Advisor</Text>
        </View>
        <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: 18, borderTopLeftRadius: 4, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, flexDirection: 'row', gap: 4, ...SHADOWS.card }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 }}>Thinking...</Text>
        </View>
    </View>
);

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ onSuggestionPress: (text: string) => void }> = ({ onSuggestionPress }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 100 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl }}>
            <Ionicons name="sparkles" size={32} color={COLORS.primary} />
        </View>
        <Text style={[TYPOGRAPHY.h2, { color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.sm }]}>
            Decision Advisor
        </Text>
        <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, textAlign: 'center' }]}>
            Ask me anything about your decisions. I'll use your history, patterns, and past outcomes to give personalized advice.
        </Text>
        <View style={{ marginTop: SPACING.xxl, gap: SPACING.sm, width: '100%' }}>
            {[
                'Should I invest in this opportunity?',
                'Am I being impulsive with this purchase?',
                'What patterns do you see in my decisions?',
            ].map((suggestion, i) => (
                <TouchableOpacity key={i} onPress={() => onSuggestionPress(suggestion)} activeOpacity={0.7} style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.surfaceLow }}>
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.primary }}>{suggestion}</Text>
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

    // Use ref to avoid stale closure in handleSend
    const inputRef = useRef(input);
    useEffect(() => { inputRef.current = input; }, [input]);
    const isLoadingRef = useRef(isLoading);
    useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
    const isStreamingRef = useRef(isStreaming);
    useEffect(() => { isStreamingRef.current = isStreaming; }, [isStreaming]);

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
        const currentInput = inputRef.current;
        if (isLoadingRef.current || isStreamingRef.current) return;
        const trimmed = (textOverride || currentInput).trim();
        if (!trimmed) return;

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
    }, [currentSessionId, decisionId, scrollToBottom, invalidateSessions]);

    const handleSendDirect = useCallback((text: string) => {
        handleSend(text);
    }, [handleSend]);

    const handleNewChat = () => {
        setMessages([]);
        setCurrentSessionId(undefined);
        setInput('');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

            {/* ── Header ── */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: SPACING.lg,
                    paddingVertical: SPACING.md,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F0F0F0',
                    backgroundColor: COLORS.surface,
                }}
            >
                <TouchableOpacity onPress={() => router.push('/(tabs)/ai/history')} style={{ padding: SPACING.sm }}>
                    <Ionicons name="time-outline" size={22} color={COLORS.textMuted} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary }]}>AI Advisor</Text>
                    {currentSessionId && (
                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#9CA3AF' }}>
                            Session active
                        </Text>
                    )}
                </View>
                <TouchableOpacity onPress={handleNewChat} style={{ padding: SPACING.sm }}>
                    <Ionicons name="add-circle-outline" size={22} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* ── Messages ── */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                {messages.length === 0 && !isLoading ? (
                    <EmptyState onSuggestionPress={handleSendDirect} />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <ChatBubble message={item} />}
                        contentContainerStyle={{ paddingTop: SPACING.lg, paddingBottom: SPACING.sm }}
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
                        paddingHorizontal: SPACING.md,
                        paddingVertical: 10,
                        paddingBottom: 14,
                        backgroundColor: COLORS.surfaceLowest,
                        borderTopWidth: 1,
                        borderTopColor: '#F0F0F0',
                        gap: SPACING.sm,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: COLORS.surface,
                            borderRadius: 22,
                            paddingHorizontal: 18,
                            paddingVertical: Platform.OS === 'ios' ? 12 : 8,
                            maxHeight: 120,
                            borderWidth: 1,
                            borderColor: COLORS.surfaceDim,
                        }}
                    >
                        <TextInput
                            style={[TYPOGRAPHY.bodyLarge, { maxHeight: 100, color: COLORS.textPrimary }]}
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
                            minWidth: 44,
                            minHeight: 44,
                            borderRadius: 22,
                            backgroundColor: input.trim() && !isLoading && !isStreaming ? COLORS.primary : COLORS.inputBorder,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: COLORS.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: input.trim() ? 0.2 : 0,
                            shadowRadius: 6,
                            elevation: input.trim() ? 3 : 0,
                        }}
                    >
                        <Ionicons name="send" size={18} color={COLORS.textOnPrimary} style={{ marginLeft: 2 }} />
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
