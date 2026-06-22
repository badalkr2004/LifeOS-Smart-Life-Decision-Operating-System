/**
 * Outcome Check-in Screen — Form for recording decision outcomes.
 *
 * Fields: satisfaction score, actual results, reflections, lessons learned,
 * mood, stress, and whether they'd decide again.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDecision, useCreateOutcome } from '@/hooks/useDecisions';

const MOODS = [
    { value: 2, emoji: '😞', label: 'Low' },
    { value: 4, emoji: '😐', label: 'Okay' },
    { value: 6, emoji: '🙂', label: 'Good' },
    { value: 8, emoji: '😊', label: 'Great' },
    { value: 10, emoji: '🤩', label: 'Amazing' },
];

export default function CheckinScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: decision } = useDecision(id!);
    const createOutcome = useCreateOutcome();

    const [satisfaction, setSatisfaction] = useState(5);
    const [actualResults, setActualResults] = useState('');
    const [reflections, setReflections] = useState('');
    const [lessonsLearned, setLessonsLearned] = useState('');
    const [wouldDecideAgain, setWouldDecideAgain] = useState<boolean | null>(null);
    const [mood, setMood] = useState(6);
    const [stress, setStress] = useState(5);

    const canSubmit = actualResults.trim().length > 0;

    const handleSubmit = () => {
        if (!canSubmit) {
            Alert.alert('Required', 'Please describe the actual results of this decision.');
            return;
        }

        createOutcome.mutate(
            {
                decisionId: id!,
                satisfactionScore: satisfaction,
                actualResults: actualResults.trim(),
                reflections: reflections.trim() || undefined,
                lessonsLearned: lessonsLearned.trim() || undefined,
                wouldDecideAgain: wouldDecideAgain ?? undefined,
                moodAtCheckIn: mood,
                stressLevel: stress,
            },
            {
                onSuccess: () => {
                    Alert.alert('Check-in Recorded', 'Your outcome has been saved successfully.', [
                        { text: 'OK', onPress: () => router.back() },
                    ]);
                },
                onError: (error: any) => {
                    Alert.alert('Error', error?.response?.data?.error || 'Failed to save check-in.');
                },
            },
        );
    };

    // ─── Section Label ────────────────────────────────────────────────────────

    const SectionLabel = ({ icon, label }: { icon: string; label: string }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 24 }}>
            <Ionicons name={icon as any} size={16} color="#4F46E5" />
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {label}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* ── Header ── */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <Ionicons name="close" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#111827' }}>Check-in</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}>

                    {/* Decision title context */}
                    {decision && (
                        <View style={{ backgroundColor: '#E8E6FF', borderRadius: 16, padding: 16, marginBottom: 8 }}>
                            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Recording outcome for</Text>
                            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#111827' }}>{decision.title}</Text>
                        </View>
                    )}

                    {/* ── Satisfaction Score ── */}
                    <SectionLabel icon="star-outline" label="Satisfaction Score" />
                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: 'rgba(0,0,0,0.5)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                        <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 48, color: '#4F46E5', textAlign: 'center' }}>{satisfaction}</Text>
                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 16 }}>out of 10</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                                <TouchableOpacity
                                    key={v}
                                    onPress={() => setSatisfaction(v)}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 14,
                                        backgroundColor: v <= satisfaction ? '#4F46E5' : '#F3F4F6',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: v <= satisfaction ? '#FFFFFF' : '#9CA3AF' }}>{v}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* ── Actual Results (required) ── */}
                    <SectionLabel icon="checkmark-circle-outline" label="Actual Results *" />
                    <TextInput
                        value={actualResults}
                        onChangeText={setActualResults}
                        placeholder="What actually happened as a result of this decision?"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            padding: 16,
                            minHeight: 100,
                            fontFamily: 'Inter_400Regular',
                            fontSize: 15,
                            color: '#111827',
                            lineHeight: 22,
                            shadowColor: 'rgba(0,0,0,0.5)',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.03,
                            shadowRadius: 8,
                            elevation: 1,
                        }}
                    />

                    {/* ── Reflections ── */}
                    <SectionLabel icon="chatbubble-ellipses-outline" label="Reflections" />
                    <TextInput
                        value={reflections}
                        onChangeText={setReflections}
                        placeholder="Looking back, what are your thoughts?"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            padding: 16,
                            minHeight: 80,
                            fontFamily: 'Inter_400Regular',
                            fontSize: 15,
                            color: '#111827',
                            lineHeight: 22,
                            shadowColor: 'rgba(0,0,0,0.5)',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.03,
                            shadowRadius: 8,
                            elevation: 1,
                        }}
                    />

                    {/* ── Lessons Learned ── */}
                    <SectionLabel icon="school-outline" label="Lessons Learned" />
                    <TextInput
                        value={lessonsLearned}
                        onChangeText={setLessonsLearned}
                        placeholder="What would you do differently next time?"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            padding: 16,
                            minHeight: 80,
                            fontFamily: 'Inter_400Regular',
                            fontSize: 15,
                            color: '#111827',
                            lineHeight: 22,
                            shadowColor: 'rgba(0,0,0,0.5)',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.03,
                            shadowRadius: 8,
                            elevation: 1,
                        }}
                    />

                    {/* ── Would Decide Again ── */}
                    <SectionLabel icon="refresh-outline" label="Would you decide the same way again?" />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {([
                            { value: true, label: 'Yes', icon: 'thumbs-up-outline', color: '#10B981' },
                            { value: false, label: 'No', icon: 'thumbs-down-outline', color: '#EF4444' },
                        ] as const).map((opt) => {
                            const isSelected = wouldDecideAgain === opt.value;
                            return (
                                <TouchableOpacity
                                    key={opt.label}
                                    onPress={() => setWouldDecideAgain(isSelected ? null : opt.value)}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        paddingVertical: 14,
                                        borderRadius: 14,
                                        backgroundColor: isSelected ? opt.color + '15' : '#FFFFFF',
                                        borderWidth: 1.5,
                                        borderColor: isSelected ? opt.color : '#E5E7EB',
                                    }}
                                >
                                    <Ionicons name={opt.icon as any} size={20} color={isSelected ? opt.color : '#9CA3AF'} />
                                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: isSelected ? opt.color : '#6B7280' }}>{opt.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* ── Mood ── */}
                    <SectionLabel icon="happy-outline" label="Current Mood" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {MOODS.map((m) => {
                            const isSelected = mood === m.value;
                            return (
                                <TouchableOpacity
                                    key={m.value}
                                    onPress={() => setMood(m.value)}
                                    style={{
                                        alignItems: 'center',
                                        gap: 4,
                                        paddingVertical: 10,
                                        paddingHorizontal: 8,
                                        borderRadius: 12,
                                        backgroundColor: isSelected ? '#4F46E5' + '15' : 'transparent',
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
                                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color: isSelected ? '#4F46E5' : '#9CA3AF' }}>{m.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* ── Stress Level ── */}
                    <SectionLabel icon="pulse-outline" label={`Stress Level: ${stress}/10`} />
                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: 'rgba(0,0,0,0.5)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                                <TouchableOpacity
                                    key={v}
                                    onPress={() => setStress(v)}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 22,
                                        backgroundColor: v <= stress
                                            ? (stress <= 3 ? '#10B981' : stress <= 6 ? '#F59E0B' : '#EF4444')
                                            : '#F3F4F6',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: v <= stress ? '#FFFFFF' : '#9CA3AF' }}>{v}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#10B981' }}>Relaxed</Text>
                            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#EF4444' }}>Very Stressed</Text>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Submit Button ── */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16, backgroundColor: '#F9FAFB' }}>
                <TouchableOpacity
                    onPress={handleSubmit}
                    activeOpacity={0.85}
                    disabled={!canSubmit || createOutcome.isPending}
                >
                    <LinearGradient
                        colors={canSubmit ? ['#3525CD', '#4F46E5'] : ['#D1D5DB', '#D1D5DB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            paddingVertical: 16,
                            borderRadius: 14,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: canSubmit ? '#4F46E5' : 'transparent',
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                            elevation: canSubmit ? 6 : 0,
                        }}
                    >
                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#FFFFFF' }}>
                            {createOutcome.isPending ? 'Saving...' : 'Save Check-in'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
