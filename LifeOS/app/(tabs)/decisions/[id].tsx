/**
 * Decision Detail Screen
 *
 * Thin compositor: fetches decision & outcomes, manages tab state,
 * delegates rendering to InfoCard, OutcomeTimelineItem, ConfidenceRing, etc.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDecision, useDecisionOutcomes, useDeleteDecision, useUpdateDecision } from '@/hooks/useDecisions';

import { ConfidenceRing, SkeletonBlock } from '@/components/ui';
import {
    InfoCard,
    OutcomeTimelineItem,
    DetailSkeleton,
} from '@/components/decisions';
import {
    getCategoryColor,
    getStatusColor,
    getConfidenceText,
} from '@/utils/helpers';

export default function DecisionDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'context' | 'outcomes'>('context');
    const [showMenu, setShowMenu] = useState(false);

    const { data: decision, isLoading } = useDecision(id!);
    const { data: outcomes = [], isLoading: outcomesLoading } = useDecisionOutcomes(id!);
    const deleteMutation = useDeleteDecision();
    const updateMutation = useUpdateDecision();

    const handleDelete = () => {
        Alert.alert(
            'Delete Decision',
            'This will archive this decision. You can still view it later.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteMutation.mutate(id!, { onSuccess: () => router.back() });
                    },
                },
            ],
        );
    };

    const handleCheckin = () => {
        setShowMenu(false);
        router.push(`/(tabs)/decisions/checkin?id=${id}`);
    };

    const handleEdit = () => {
        setShowMenu(false);
        router.push(`/(tabs)/decisions/new?editId=${id}`);
    };

    const handleStatusChange = (newStatus: string) => {
        setShowMenu(false);
        const labels: Record<string, string> = {
            archived: 'Archive',
            active: 'Reactivate',
        };
        Alert.alert(
            `${labels[newStatus] || 'Update'} Decision`,
            `Are you sure you want to ${(labels[newStatus] || newStatus).toLowerCase()} this decision?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: labels[newStatus] || 'Confirm',
                    onPress: () => {
                        updateMutation.mutate({ id: id!, payload: { status: newStatus } });
                    },
                },
            ],
        );
    };

    const handleAnalyzeAI = () => {
        router.push(`/(tabs)/ai?decisionId=${id}`);
    };

    // ── Loading state ──
    if (isLoading || !decision) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
                <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, fontFamily: 'Inter_700Bold', fontSize: 17, color: '#111827', textAlign: 'center' }}>Decision Detail</Text>
                    <View style={{ width: 40 }} />
                </View>
                <DetailSkeleton />
            </SafeAreaView>
        );
    }

    const catColor = getCategoryColor(decision.category);
    const statusColor = getStatusColor(decision.status);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* ── Header ── */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#111827' }}>Decision Detail</Text>
                <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={{ padding: 8 }}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#464555" />
                </TouchableOpacity>
            </View>

            {/* ── Dropdown Menu ── */}
            {showMenu && (
                <View style={{ position: 'absolute', top: 100, right: 20, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 6, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 10, minWidth: 190 }}>
                    <TouchableOpacity onPress={handleEdit} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10 }}>
                        <Ionicons name="create-outline" size={18} color="#4F46E5" />
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827' }}>Edit Decision</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCheckin} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10 }}>
                        <Ionicons name="checkbox-outline" size={18} color="#10B981" />
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827' }}>Record Check-in</Text>
                    </TouchableOpacity>
                    {decision.status === 'active' ? (
                        <TouchableOpacity onPress={() => handleStatusChange('archived')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10 }}>
                            <Ionicons name="archive-outline" size={18} color="#F59E0B" />
                            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827' }}>Archive</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => handleStatusChange('active')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10 }}>
                            <Ionicons name="refresh-outline" size={18} color="#10B981" />
                            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827' }}>Reactivate</Text>
                        </TouchableOpacity>
                    )}
                    <View style={{ height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 8, marginVertical: 4 }} />
                    <TouchableOpacity onPress={() => { setShowMenu(false); handleDelete(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10 }}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#EF4444' }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }} onScrollBeginDrag={() => showMenu && setShowMenu(false)}>
                {/* ── Badges ── */}
                <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 24, marginBottom: 12, marginTop: 4 }}>
                    <View style={{ backgroundColor: catColor + '18', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}>
                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: catColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>{decision.category}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: statusColor + '18', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}>
                        <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: statusColor }} />
                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: statusColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>{decision.status}</Text>
                    </View>
                </View>

                {/* ── Title ── */}
                <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
                    <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 28, color: '#111827', letterSpacing: -1, lineHeight: 34 }}>{decision.title}</Text>
                </View>

                {/* ── Segmented Control ── */}
                <View style={{ flexDirection: 'row', marginHorizontal: 24, marginBottom: 24, borderRadius: 12, backgroundColor: '#F3F4F6', padding: 4 }}>
                    {(['context', 'outcomes'] as const).map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                activeOpacity={0.8}
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                                    shadowColor: isActive ? 'rgba(0,0,0,0.5)' : 'transparent',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: isActive ? 0.05 : 0,
                                    shadowRadius: 4,
                                    elevation: isActive ? 1 : 0,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontFamily: isActive ? 'Inter_700Bold' : 'Inter_500Medium', fontSize: 14, color: isActive ? '#111827' : '#6B7280' }}>
                                    {tab === 'context' ? 'Context' : 'Outcomes'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* ── Tab Content ── */}
                {activeTab === 'context' ? (
                    <View style={{ paddingHorizontal: 24, gap: 16 }}>
                        {/* Confidence Card */}
                        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: 'rgba(25,28,29,0.8)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 1 }}>
                            <View style={{ flex: 1, marginRight: 16 }}>
                                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 10, color: '#464555', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>Decision Confidence</Text>
                                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#111827', lineHeight: 22 }}>{getConfidenceText(decision.confidenceLevel)}</Text>
                            </View>
                            <ConfidenceRing value={decision.confidenceLevel} />
                        </View>

                        {decision.description ? <InfoCard icon="document-text-outline" label="Description" content={decision.description} /> : null}
                        {decision.reasoningProcess ? <InfoCard icon="bulb-outline" label="Reasoning" content={decision.reasoningProcess} /> : null}
                        {decision.context ? <InfoCard icon="information-circle-outline" label="Context" content={decision.context} /> : null}

                        {/* Expected Outcomes / Metrics */}
                        {decision.expectedOutcomes && decision.expectedOutcomes.length > 0 ? (
                            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: 'rgba(25,28,29,0.8)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                    <Ionicons name="stats-chart-outline" size={16} color="#4F46E5" />
                                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.2, textTransform: 'uppercase' }}>Metrics</Text>
                                </View>
                                {decision.expectedOutcomes.map((eo, i) => (
                                    <View key={i} style={{ marginBottom: i < decision.expectedOutcomes!.length - 1 ? 16 : 0 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#374151', textTransform: 'capitalize' }}>{eo.outcome || eo.metric || `Metric ${i + 1}`}</Text>
                                            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#111827' }}>{eo.targetValue != null ? eo.targetValue : `${eo.importance ?? 0}/5`}</Text>
                                        </View>
                                        <View style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 3 }}>
                                            <View style={{ height: 6, borderRadius: 3, backgroundColor: '#4F46E5', width: `${Math.min(((eo.importance ?? 3) / 5) * 100, 100)}%` }} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : null}

                        {/* Alternatives */}
                        {decision.alternativesConsidered && decision.alternativesConsidered.length > 0 ? (
                            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: 'rgba(25,28,29,0.8)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                    <Ionicons name="git-branch-outline" size={16} color="#4F46E5" />
                                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.2, textTransform: 'uppercase' }}>Alternatives</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {decision.alternativesConsidered.map((alt, i) => (
                                        <View key={i} style={{ backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                                            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#374151' }}>{alt.option}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ) : null}

                        {/* Tags */}
                        {decision.tags && decision.tags.length > 0 ? (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {decision.tags.map((tag, i) => (
                                    <View key={i} style={{ backgroundColor: '#E8E6FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}>
                                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#4F46E5' }}>#{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : null}
                    </View>
                ) : (
                    /* ── Outcomes Tab ── */
                    <View style={{ paddingHorizontal: 24 }}>
                        {outcomesLoading ? (
                            <View style={{ gap: 12 }}>
                                {[1, 2, 3].map((i) => (
                                    <SkeletonBlock key={i} width="100%" height={100} radius={16} />
                                ))}
                            </View>
                        ) : outcomes.length === 0 ? (
                            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 32, alignItems: 'center' }}>
                                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                                    <Ionicons name="time-outline" size={28} color="#C7C4D8" />
                                </View>
                                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#111827', marginBottom: 6 }}>No outcomes yet</Text>
                                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 }}>
                                    Check-in outcomes will appear here once you record them.
                                </Text>
                            </View>
                        ) : (
                            outcomes.map((outcome, i) => (
                                <OutcomeTimelineItem key={outcome.id} outcome={outcome} isLast={i === outcomes.length - 1} />
                            ))
                        )}
                    </View>
                )}
            </ScrollView>

            {/* ── Bottom CTAs ── */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16, backgroundColor: '#F9FAFB', gap: 10 }}>
                {decision.status === 'active' && (
                    <TouchableOpacity onPress={handleCheckin} activeOpacity={0.85}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4F46E5', borderRadius: 14, paddingVertical: 15, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 }}>
                            <Ionicons name="checkbox-outline" size={18} color="#FFFFFF" />
                            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: '#FFFFFF' }}>Record Check-in</Text>
                        </View>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleAnalyzeAI} activeOpacity={0.85}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E1E3E4', borderRadius: 14, paddingVertical: 15, shadowColor: 'rgba(0,0,0,0.5)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
                        <Ionicons name="sparkles" size={18} color="#4F46E5" />
                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: '#111827' }}>Analyze with AI</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}