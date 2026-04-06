import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDecision, useDecisionOutcomes, useDeleteDecision } from '@/hooks/useDecisions';
import type { Outcome } from '@/services/decisionService';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryColor(category: string): string {
    const map: Record<string, string> = {
        career: '#4F46E5', financial: '#059669', health: '#DC2626',
        relationship: '#7C3AED', education: '#2563EB', lifestyle: '#16A34A',
        business: '#EA580C', personal_growth: '#0891B2', family: '#DB2777',
    };
    return map[category] ?? '#6B7280';
}

function getStatusColor(status: string): string {
    const map: Record<string, string> = {
        active: '#10B981', archived: '#6B7280',
        superseded: '#F59E0B', completed: '#4F46E5',
    };
    return map[status] ?? '#6B7280';
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

function getConfidenceText(level: number): string {
    if (level >= 9) return 'Extremely confident';
    if (level >= 7) return 'Strongly leaning towards acceptance';
    if (level >= 5) return 'Moderately confident';
    if (level >= 3) return 'Somewhat uncertain';
    return 'Very uncertain';
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBlock: React.FC<{ width: number | string; height: number; radius?: number; style?: any }> = ({
    width, height, radius = 12, style,
}) => (
    <View style={[{ width, height, borderRadius: radius, backgroundColor: '#EDEEEF' }, style]} />
);

const DetailSkeleton = () => (
    <View style={{ padding: 24, gap: 20 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
            <SkeletonBlock width={80} height={28} radius={8} />
            <SkeletonBlock width={80} height={28} radius={8} />
        </View>
        <SkeletonBlock width="90%" height={36} />
        <SkeletonBlock width="60%" height={36} />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <SkeletonBlock width="48%" height={44} radius={12} />
            <SkeletonBlock width="48%" height={44} radius={12} />
        </View>
        <SkeletonBlock width="100%" height={140} radius={20} />
        <SkeletonBlock width="100%" height={100} radius={20} />
        <SkeletonBlock width="100%" height={100} radius={20} />
    </View>
);

// ─── Confidence Ring ──────────────────────────────────────────────────────────

const ConfidenceRing: React.FC<{ value: number }> = ({ value }) => {
    const percentage = value * 10;
    const size = 72;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (percentage / 100) * circumference;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#4F46E5"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                />
            </Svg>
            <View style={{
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{
                    fontFamily: 'Inter_800ExtraBold',
                    fontSize: 18,
                    color: '#111827',
                }}>
                    {percentage}%
                </Text>
            </View>
        </View>
    );
};

// ─── Info Card ────────────────────────────────────────────────────────────────

const InfoCard: React.FC<{
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    content: string;
}> = ({ icon, label, content }) => (
    <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: 'rgba(25,28,29,0.8)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 1,
    }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Ionicons name={icon} size={16} color="#4F46E5" />
            <Text style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 11,
                color: '#464555',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
            }}>
                {label}
            </Text>
        </View>
        <Text style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 15,
            color: '#374151',
            lineHeight: 24,
        }}>
            {content}
        </Text>
    </View>
);

// ─── Outcome Timeline Item ───────────────────────────────────────────────────

const OutcomeTimelineItem: React.FC<{ outcome: Outcome; isLast: boolean }> = ({ outcome, isLast }) => (
    <View style={{ flexDirection: 'row', marginBottom: isLast ? 0 : 8 }}>
        {/* Timeline line + dot */}
        <View style={{ width: 24, alignItems: 'center', marginRight: 14 }}>
            <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#4F46E5',
                zIndex: 1,
                marginTop: 6,
            }} />
            {!isLast && (
                <View style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: '#E5E7EB',
                    marginTop: 4,
                }} />
            )}
        </View>

        {/* Content card */}
        <View style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            shadowColor: 'rgba(0,0,0,0.5)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 1,
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 13,
                    color: '#6B7280',
                }}>
                    {formatDate(outcome.createdAt)}
                </Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: '#E8E6FF',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 9999,
                }}>
                    <Ionicons name="happy-outline" size={12} color="#4F46E5" />
                    <Text style={{
                        fontFamily: 'Inter_700Bold',
                        fontSize: 12,
                        color: '#4F46E5',
                    }}>
                        {outcome.satisfactionScore}/10
                    </Text>
                </View>
            </View>
            <Text style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                color: '#374151',
                lineHeight: 22,
            }}>
                {outcome.actualResults}
            </Text>
            {outcome.reflections ? (
                <Text style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    color: '#6B7280',
                    fontStyle: 'italic',
                    marginTop: 8,
                    lineHeight: 20,
                }}>
                    "{outcome.reflections}"
                </Text>
            ) : null}
            {/* Mood & Stress */}
            {(outcome.moodAtCheckIn || outcome.stressLevel) ? (
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                    {outcome.moodAtCheckIn ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="heart" size={12} color="#10B981" />
                            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#6B7280' }}>
                                Mood: {outcome.moodAtCheckIn}/10
                            </Text>
                        </View>
                    ) : null}
                    {outcome.stressLevel ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="flash" size={12} color="#F59E0B" />
                            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#6B7280' }}>
                                Stress: {outcome.stressLevel}/10
                            </Text>
                        </View>
                    ) : null}
                </View>
            ) : null}
        </View>
    </View>
);

// ─── Decision Detail Screen ───────────────────────────────────────────────────

export default function DecisionDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'context' | 'outcomes'>('context');
    const [showMenu, setShowMenu] = useState(false);

    const { data: decision, isLoading } = useDecision(id!);
    const { data: outcomes = [], isLoading: outcomesLoading } = useDecisionOutcomes(id!);
    const deleteMutation = useDeleteDecision();

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
                        deleteMutation.mutate(id!, {
                            onSuccess: () => router.back(),
                        });
                    },
                },
            ],
        );
    };

    const handleAnalyzeAI = () => {
        router.push(`/(tabs)/ai?decisionId=${id}`);
    };

    if (isLoading || !decision) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
                <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={{
                        flex: 1,
                        fontFamily: 'Inter_700Bold',
                        fontSize: 17,
                        color: '#111827',
                        textAlign: 'center',
                    }}>
                        Decision Detail
                    </Text>
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
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 12,
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 17,
                    color: '#111827',
                }}>
                    Decision Detail
                </Text>
                <TouchableOpacity
                    onPress={() => setShowMenu(!showMenu)}
                    style={{ padding: 8 }}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="#464555" />
                </TouchableOpacity>
            </View>

            {/* ── Dropdown Menu ── */}
            {showMenu && (
                <View style={{
                    position: 'absolute',
                    top: 100,
                    right: 20,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 14,
                    padding: 6,
                    zIndex: 100,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.12,
                    shadowRadius: 20,
                    elevation: 10,
                    minWidth: 160,
                }}>
                    <TouchableOpacity
                        onPress={() => { setShowMenu(false); handleDelete(); }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                            padding: 12,
                            borderRadius: 10,
                        }}
                    >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#EF4444' }}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                onScrollBeginDrag={() => showMenu && setShowMenu(false)}
            >
                {/* ── Badges ── */}
                <View style={{
                    flexDirection: 'row',
                    gap: 8,
                    paddingHorizontal: 24,
                    marginBottom: 12,
                    marginTop: 4,
                }}>
                    <View style={{
                        backgroundColor: catColor + '18',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                    }}>
                        <Text style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 11,
                            color: catColor,
                            textTransform: 'uppercase',
                            letterSpacing: 0.8,
                        }}>
                            {decision.category}
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: statusColor + '18',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                    }}>
                        <View style={{
                            width: 7,
                            height: 7,
                            borderRadius: 3.5,
                            backgroundColor: statusColor,
                        }} />
                        <Text style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 11,
                            color: statusColor,
                            textTransform: 'uppercase',
                            letterSpacing: 0.8,
                        }}>
                            {decision.status}
                        </Text>
                    </View>
                </View>

                {/* ── Title ── */}
                <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
                    <Text style={{
                        fontFamily: 'Inter_800ExtraBold',
                        fontSize: 28,
                        color: '#111827',
                        letterSpacing: -1,
                        lineHeight: 34,
                    }}>
                        {decision.title}
                    </Text>
                </View>

                {/* ── Segmented Control ── */}
                <View style={{
                    flexDirection: 'row',
                    marginHorizontal: 24,
                    marginBottom: 24,
                    borderRadius: 12,
                    backgroundColor: '#F3F4F6',
                    padding: 4,
                }}>
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
                                <Text style={{
                                    fontFamily: isActive ? 'Inter_700Bold' : 'Inter_500Medium',
                                    fontSize: 14,
                                    color: isActive ? '#111827' : '#6B7280',
                                }}>
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
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 20,
                            padding: 24,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            shadowColor: 'rgba(25,28,29,0.8)',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.03,
                            shadowRadius: 12,
                            elevation: 1,
                        }}>
                            <View style={{ flex: 1, marginRight: 16 }}>
                                <Text style={{
                                    fontFamily: 'Inter_700Bold',
                                    fontSize: 10,
                                    color: '#464555',
                                    letterSpacing: 1.2,
                                    textTransform: 'uppercase',
                                    marginBottom: 6,
                                }}>
                                    Decision Confidence
                                </Text>
                                <Text style={{
                                    fontFamily: 'Inter_600SemiBold',
                                    fontSize: 16,
                                    color: '#111827',
                                    lineHeight: 22,
                                }}>
                                    {getConfidenceText(decision.confidenceLevel)}
                                </Text>
                            </View>
                            <ConfidenceRing value={decision.confidenceLevel} />
                        </View>

                        {/* Description */}
                        {decision.description ? (
                            <InfoCard
                                icon="document-text-outline"
                                label="Description"
                                content={decision.description}
                            />
                        ) : null}

                        {/* Reasoning */}
                        {decision.reasoningProcess ? (
                            <InfoCard
                                icon="bulb-outline"
                                label="Reasoning"
                                content={decision.reasoningProcess}
                            />
                        ) : null}

                        {/* Context */}
                        {decision.context ? (
                            <InfoCard
                                icon="information-circle-outline"
                                label="Context"
                                content={decision.context}
                            />
                        ) : null}

                        {/* Expected Outcomes / Metrics */}
                        {decision.expectedOutcomes && decision.expectedOutcomes.length > 0 ? (
                            <View style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 20,
                                padding: 20,
                                shadowColor: 'rgba(25,28,29,0.8)',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.03,
                                shadowRadius: 12,
                                elevation: 1,
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                    <Ionicons name="stats-chart-outline" size={16} color="#4F46E5" />
                                    <Text style={{
                                        fontFamily: 'Inter_700Bold',
                                        fontSize: 11,
                                        color: '#464555',
                                        letterSpacing: 1.2,
                                        textTransform: 'uppercase',
                                    }}>
                                        Metrics
                                    </Text>
                                </View>
                                {decision.expectedOutcomes.map((eo, i) => (
                                    <View key={i} style={{
                                        marginBottom: i < decision.expectedOutcomes!.length - 1 ? 16 : 0,
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 6,
                                        }}>
                                            <Text style={{
                                                fontFamily: 'Inter_500Medium',
                                                fontSize: 14,
                                                color: '#374151',
                                                textTransform: 'capitalize',
                                            }}>
                                                {eo.outcome || eo.metric || `Metric ${i + 1}`}
                                            </Text>
                                            <Text style={{
                                                fontFamily: 'Inter_700Bold',
                                                fontSize: 14,
                                                color: '#111827',
                                            }}>
                                                {eo.targetValue != null ? eo.targetValue : `${eo.importance ?? 0}/5`}
                                            </Text>
                                        </View>
                                        <View style={{
                                            height: 6,
                                            backgroundColor: '#E5E7EB',
                                            borderRadius: 3,
                                        }}>
                                            <View style={{
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: '#4F46E5',
                                                width: `${Math.min(((eo.importance ?? 3) / 5) * 100, 100)}%`,
                                            }} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : null}

                        {/* Alternatives */}
                        {decision.alternativesConsidered && decision.alternativesConsidered.length > 0 ? (
                            <View style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 20,
                                padding: 20,
                                shadowColor: 'rgba(25,28,29,0.8)',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.03,
                                shadowRadius: 12,
                                elevation: 1,
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                    <Ionicons name="git-branch-outline" size={16} color="#4F46E5" />
                                    <Text style={{
                                        fontFamily: 'Inter_700Bold',
                                        fontSize: 11,
                                        color: '#464555',
                                        letterSpacing: 1.2,
                                        textTransform: 'uppercase',
                                    }}>
                                        Alternatives
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {decision.alternativesConsidered.map((alt, i) => (
                                        <View key={i} style={{
                                            backgroundColor: '#F3F4F6',
                                            borderRadius: 10,
                                            paddingHorizontal: 14,
                                            paddingVertical: 8,
                                        }}>
                                            <Text style={{
                                                fontFamily: 'Inter_500Medium',
                                                fontSize: 13,
                                                color: '#374151',
                                            }}>
                                                {alt.option}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ) : null}

                        {/* Tags */}
                        {decision.tags && decision.tags.length > 0 ? (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {decision.tags.map((tag, i) => (
                                    <View key={i} style={{
                                        backgroundColor: '#E8E6FF',
                                        borderRadius: 8,
                                        paddingHorizontal: 12,
                                        paddingVertical: 5,
                                    }}>
                                        <Text style={{
                                            fontFamily: 'Inter_500Medium',
                                            fontSize: 12,
                                            color: '#4F46E5',
                                        }}>
                                            #{tag}
                                        </Text>
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
                            <View style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 20,
                                padding: 32,
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    backgroundColor: '#F3F4F6',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 14,
                                }}>
                                    <Ionicons name="time-outline" size={28} color="#C7C4D8" />
                                </View>
                                <Text style={{
                                    fontFamily: 'Inter_700Bold',
                                    fontSize: 16,
                                    color: '#111827',
                                    marginBottom: 6,
                                }}>
                                    No outcomes yet
                                </Text>
                                <Text style={{
                                    fontFamily: 'Inter_400Regular',
                                    fontSize: 14,
                                    color: '#6B7280',
                                    textAlign: 'center',
                                    lineHeight: 20,
                                }}>
                                    Check-in outcomes will appear here once you record them.
                                </Text>
                            </View>
                        ) : (
                            outcomes.map((outcome, i) => (
                                <OutcomeTimelineItem
                                    key={outcome.id}
                                    outcome={outcome}
                                    isLast={i === outcomes.length - 1}
                                />
                            ))
                        )}
                    </View>
                )}
            </ScrollView>

            {/* ── CTA: Analyze with AI ── */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: 24,
                paddingBottom: 32,
                paddingTop: 16,
                backgroundColor: '#F9FAFB',
            }}>
                <TouchableOpacity onPress={handleAnalyzeAI} activeOpacity={0.85}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        backgroundColor: '#FFFFFF',
                        borderWidth: 1.5,
                        borderColor: '#E1E3E4',
                        borderRadius: 14,
                        paddingVertical: 15,
                        shadowColor: 'rgba(0,0,0,0.5)',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        elevation: 1,
                    }}>
                        <Ionicons name="sparkles" size={18} color="#4F46E5" />
                        <Text style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 15,
                            color: '#111827',
                        }}>
                            Analyze with AI
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}