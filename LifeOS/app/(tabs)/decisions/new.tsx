import React, { useReducer, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Modal,
    FlatList,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCreateDecision, useTemplates } from '@/hooks/useDecisions';
import type { DecisionCreatePayload, Alternative, ExpectedOutcome, Template } from '@/services/decisionService';

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

const CATEGORIES = [
    { key: 'career', label: 'Career', icon: 'briefcase' as const },
    { key: 'health', label: 'Health', icon: 'heart' as const },
    { key: 'financial', label: 'Finance', icon: 'wallet' as const },
    { key: 'relationship', label: 'Interpersonal', icon: 'people' as const },
    { key: 'education', label: 'Education', icon: 'school' as const },
    { key: 'lifestyle', label: 'Lifestyle', icon: 'leaf' as const },
    { key: 'business', label: 'Business', icon: 'trending-up' as const },
    { key: 'personal_growth', label: 'Growth', icon: 'rocket' as const },
    { key: 'family', label: 'Family', icon: 'home' as const },
    { key: 'other', label: 'Other', icon: 'ellipse' as const },
];

const MOTIVATIONAL_QUOTES = [
    'Every great outcome starts with a clear intention.',
    'The quality of your decisions shapes the quality of your life.',
    'Precision is the sanctuary of the wise.',
];

// ─── Wizard State ─────────────────────────────────────────────────────────────

type WizardState = {
    title: string;
    category: string;
    description: string;
    context: string;
    reasoningProcess: string;
    alternatives: string[];
    expectedOutcomes: { outcome: string; metric: string; targetValue: string }[];
    expectedOutcomeDate: string;
    confidenceLevel: number;
    tags: string[];
};

type WizardAction =
    | { type: 'SET_FIELD'; field: keyof WizardState; value: any }
    | { type: 'ADD_ALTERNATIVE' }
    | { type: 'UPDATE_ALTERNATIVE'; index: number; value: string }
    | { type: 'REMOVE_ALTERNATIVE'; index: number }
    | { type: 'ADD_METRIC' }
    | { type: 'UPDATE_METRIC'; index: number; field: string; value: string }
    | { type: 'REMOVE_METRIC'; index: number }
    | { type: 'APPLY_TEMPLATE'; template: Template }
    | { type: 'RESET' };

const initialState: WizardState = {
    title: '',
    category: 'career',
    description: '',
    context: '',
    reasoningProcess: '',
    alternatives: ['', ''],
    expectedOutcomes: [],
    expectedOutcomeDate: '',
    confidenceLevel: 5,
    tags: [],
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'ADD_ALTERNATIVE':
            return { ...state, alternatives: [...state.alternatives, ''] };
        case 'UPDATE_ALTERNATIVE': {
            const alts = [...state.alternatives];
            alts[action.index] = action.value;
            return { ...state, alternatives: alts };
        }
        case 'REMOVE_ALTERNATIVE': {
            const alts = state.alternatives.filter((_, i) => i !== action.index);
            return { ...state, alternatives: alts };
        }
        case 'ADD_METRIC':
            return {
                ...state,
                expectedOutcomes: [
                    ...state.expectedOutcomes,
                    { outcome: '', metric: '', targetValue: '' },
                ],
            };
        case 'UPDATE_METRIC': {
            const metrics = [...state.expectedOutcomes];
            metrics[action.index] = { ...metrics[action.index], [action.field]: action.value };
            return { ...state, expectedOutcomes: metrics };
        }
        case 'REMOVE_METRIC': {
            const metrics = state.expectedOutcomes.filter((_, i) => i !== action.index);
            return { ...state, expectedOutcomes: metrics };
        }
        case 'APPLY_TEMPLATE': {
            const t = action.template;
            return {
                ...state,
                category: t.category || state.category,
                tags: t.template.suggestedTags || state.tags,
                description: t.template.descriptionPrompt || state.description,
            };
        }
        case 'RESET':
            return { ...initialState };
        default:
            return state;
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryColor(category: string): string {
    const map: Record<string, string> = {
        career: '#4F46E5', financial: '#059669', health: '#DC2626',
        relationship: '#7C3AED', education: '#2563EB', lifestyle: '#16A34A',
        business: '#EA580C', personal_growth: '#0891B2', family: '#DB2777',
    };
    return map[category] ?? '#6B7280';
}

// ─── Components ───────────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
    <Text style={{
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        color: '#464555',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 10,
    }}>
        {text}
    </Text>
);

const StepIndicator: React.FC<{ step: number; total: number }> = ({ step, total }) => {
    const progress = step / total;
    const labels = ['Foundations', 'Context &\nAlternatives', 'Final\nCalibration'];
    const subtitles = ['Step 1 of 3', 'Step 2 of 3', 'Step 3 of 3'];
    const phaseLabels = ['PHASE 01', 'STEP 2 OF 3', 'STEP 3 OF 3'];
    const rightLabels = [
        `Step ${step} of ${total}`,
        `${Math.round(progress * 100)}%\nComplete`,
        'Outcomes &\nConfidence',
    ];

    return (
        <View style={{ marginBottom: 24 }}>
            <Text style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 11,
                color: '#4F46E5',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                marginBottom: 6,
            }}>
                {phaseLabels[step - 1]}
            </Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 14,
            }}>
                <Text style={{
                    fontFamily: 'Inter_800ExtraBold',
                    fontSize: 28,
                    color: '#111827',
                    letterSpacing: -1,
                    lineHeight: 34,
                    flex: 1,
                }}>
                    {labels[step - 1]}
                </Text>
                <Text style={{
                    fontFamily: 'Inter_500Medium',
                    fontSize: 13,
                    color: '#6B7280',
                    textAlign: 'right',
                    lineHeight: 18,
                }}>
                    {rightLabels[step - 1]}
                </Text>
            </View>
            {/* Progress bar */}
            <View style={{
                height: 4,
                backgroundColor: '#E5E7EB',
                borderRadius: 2,
            }}>
                <View style={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#4F46E5',
                    width: `${progress * 100}%`,
                }} />
            </View>
        </View>
    );
};

// ─── Step 1: Foundations ───────────────────────────────────────────────────────

const Step1: React.FC<{
    state: WizardState;
    dispatch: React.Dispatch<WizardAction>;
    onTemplatePress: () => void;
    showAllCategories: boolean;
    setShowAllCategories: (v: boolean) => void;
}> = ({ state, dispatch, onTemplatePress, showAllCategories, setShowAllCategories }) => {
    const visibleCategories = showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 4);

    return (
        <View style={{ gap: 24 }}>
            {/* Autofill from Template */}
            <TouchableOpacity
                onPress={onTemplatePress}
                activeOpacity={0.7}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    padding: 16,
                    shadowColor: 'rgba(0,0,0,0.5)',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 1,
                }}
            >
                <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: '#E8E6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                }}>
                    <Ionicons name="sparkles" size={20} color="#4F46E5" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: '#111827' }}>
                        Autofill from Template
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                        Start with pre-defined frameworks
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C4D8" />
            </TouchableOpacity>

            {/* Decision Title */}
            <View>
                <SectionLabel text="Decision Title" />
                <TextInput
                    value={state.title}
                    onChangeText={(v) => dispatch({ type: 'SET_FIELD', field: 'title', value: v })}
                    placeholder="What is the choice ahead..."
                    placeholderTextColor="#C7C4D8"
                    style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 22,
                        color: '#111827',
                        letterSpacing: -0.5,
                        paddingVertical: 8,
                        borderBottomWidth: 0,
                    }}
                    multiline
                />
            </View>

            {/* Primary Category */}
            <View>
                <SectionLabel text="Primary Category" />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                    {visibleCategories.map((cat) => {
                        const isActive = state.category === cat.key;
                        const catColor = getCategoryColor(cat.key);
                        return (
                            <TouchableOpacity
                                key={cat.key}
                                onPress={() => dispatch({ type: 'SET_FIELD', field: 'category', value: cat.key })}
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8,
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderRadius: 14,
                                    borderWidth: 1.5,
                                    borderColor: isActive ? catColor : '#E5E7EB',
                                    backgroundColor: isActive ? catColor + '0D' : '#FFFFFF',
                                }}
                            >
                                <Ionicons
                                    name={cat.icon}
                                    size={16}
                                    color={isActive ? catColor : '#6B7280'}
                                />
                                <Text style={{
                                    fontFamily: isActive ? 'Inter_700Bold' : 'Inter_500Medium',
                                    fontSize: 14,
                                    color: isActive ? catColor : '#374151',
                                }}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {!showAllCategories && (
                    <TouchableOpacity
                        onPress={() => setShowAllCategories(true)}
                        style={{ marginTop: 8 }}
                    >
                        <Text style={{
                            fontFamily: 'Inter_600SemiBold',
                            fontSize: 13,
                            color: '#4F46E5',
                        }}>
                            Show more categories...
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Context & Nuance */}
            <View>
                <SectionLabel text="Context & Nuance" />
                <View style={{
                    backgroundColor: '#F3F4F6',
                    borderRadius: 16,
                    padding: 16,
                    minHeight: 120,
                }}>
                    <TextInput
                        value={state.description}
                        onChangeText={(v) => dispatch({ type: 'SET_FIELD', field: 'description', value: v })}
                        placeholder="Describe the stakes, the potential outcomes, and how you feel about this decision..."
                        placeholderTextColor="#9CA3AF"
                        style={{
                            fontFamily: 'Inter_400Regular',
                            fontSize: 15,
                            color: '#374151',
                            lineHeight: 24,
                            textAlignVertical: 'top',
                        }}
                        multiline
                    />
                </View>
            </View>

            {/* Motivational Card */}
            <View style={{
                backgroundColor: '#E8E6FF',
                borderRadius: 20,
                padding: 24,
                alignItems: 'center',
            }}>
                <Ionicons name="compass-outline" size={32} color="#4F46E5" style={{ marginBottom: 12, opacity: 0.6 }} />
                <Text style={{
                    fontFamily: 'Inter_500Medium',
                    fontSize: 14,
                    color: '#464555',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    lineHeight: 22,
                }}>
                    {MOTIVATIONAL_QUOTES[0]}
                </Text>
            </View>
        </View>
    );
};

// ─── Step 2: Context & Alternatives ───────────────────────────────────────────

const Step2: React.FC<{
    state: WizardState;
    dispatch: React.Dispatch<WizardAction>;
}> = ({ state, dispatch }) => (
    <View style={{ gap: 28 }}>
        {/* The Background */}
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#E8E6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Ionicons name="ellipse" size={10} color="#4F46E5" />
                </View>
                <View>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#111827' }}>
                        The Background
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7280' }}>
                        What led you to this crossroad?
                    </Text>
                </View>
            </View>
            <View style={{
                backgroundColor: '#F3F4F6',
                borderRadius: 16,
                padding: 16,
                minHeight: 120,
            }}>
                <TextInput
                    value={state.context}
                    onChangeText={(v) => dispatch({ type: 'SET_FIELD', field: 'context', value: v })}
                    placeholder="Describe the situation, emotions, and external factors influencing this choice..."
                    placeholderTextColor="#9CA3AF"
                    style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 15,
                        color: '#374151',
                        lineHeight: 24,
                        textAlignVertical: 'top',
                    }}
                    multiline
                />
            </View>
        </View>

        {/* Explore Alternatives */}
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#E8E6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Ionicons name="git-branch-outline" size={16} color="#4F46E5" />
                </View>
                <View>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#111827' }}>
                        Explore Alternatives
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7280' }}>
                        List every path you could take.
                    </Text>
                </View>
            </View>

            {state.alternatives.map((alt, i) => (
                <View
                    key={i}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 14,
                        paddingHorizontal: 14,
                        paddingVertical: 4,
                        marginBottom: 10,
                        shadowColor: 'rgba(0,0,0,0.5)',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.03,
                        shadowRadius: 6,
                        elevation: 1,
                    }}
                >
                    <View style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        backgroundColor: alt ? '#4F46E5' : '#E5E7EB',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                    }}>
                        <Text style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 13,
                            color: alt ? '#FFFFFF' : '#9CA3AF',
                        }}>
                            {i + 1}
                        </Text>
                    </View>
                    <TextInput
                        value={alt}
                        onChangeText={(v) => dispatch({ type: 'UPDATE_ALTERNATIVE', index: i, value: v })}
                        placeholder={alt ? '' : `Add a new alternative...`}
                        placeholderTextColor="#C7C4D8"
                        style={{
                            flex: 1,
                            fontFamily: 'Inter_500Medium',
                            fontSize: 15,
                            color: '#111827',
                            paddingVertical: 12,
                        }}
                    />
                    {alt.length > 0 && state.alternatives.length > 1 && (
                        <TouchableOpacity
                            onPress={() => dispatch({ type: 'REMOVE_ALTERNATIVE', index: i })}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            <TouchableOpacity
                onPress={() => dispatch({ type: 'ADD_ALTERNATIVE' })}
                activeOpacity={0.7}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    paddingVertical: 14,
                    backgroundColor: '#F3F4F6',
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: '#E5E7EB',
                    borderStyle: 'dashed',
                }}
            >
                <Ionicons name="add-circle-outline" size={20} color="#4F46E5" />
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#4F46E5' }}>
                    Add Another Option
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

// ─── Step 3: Final Calibration ────────────────────────────────────────────────

const Step3: React.FC<{
    state: WizardState;
    dispatch: React.Dispatch<WizardAction>;
}> = ({ state, dispatch }) => {
    const metricIcons: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
        growth: 'trending-up',
        satisfaction: 'happy-outline',
        revenue: 'cash-outline',
        performance: 'speedometer-outline',
    };

    return (
        <View style={{ gap: 28 }}>
            {/* Expected Metrics */}
            <View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                }}>
                    <SectionLabel text="Expected Metrics" />
                    <TouchableOpacity
                        onPress={() => dispatch({ type: 'ADD_METRIC' })}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    >
                        <Ionicons name="add" size={16} color="#4F46E5" />
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#4F46E5' }}>
                            Add Metric
                        </Text>
                    </TouchableOpacity>
                </View>

                {state.expectedOutcomes.length === 0 ? (
                    <TouchableOpacity
                        onPress={() => dispatch({ type: 'ADD_METRIC' })}
                        activeOpacity={0.7}
                        style={{
                            backgroundColor: '#F3F4F6',
                            borderRadius: 16,
                            padding: 24,
                            alignItems: 'center',
                            borderWidth: 1.5,
                            borderColor: '#E5E7EB',
                            borderStyle: 'dashed',
                        }}
                    >
                        <Ionicons name="stats-chart-outline" size={28} color="#C7C4D8" style={{ marginBottom: 8 }} />
                        <Text style={{
                            fontFamily: 'Inter_600SemiBold',
                            fontSize: 14,
                            color: '#6B7280',
                        }}>
                            Add expected metrics to track progress
                        </Text>
                    </TouchableOpacity>
                ) : (
                    state.expectedOutcomes.map((metric, i) => (
                        <View key={i} style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 10,
                            shadowColor: 'rgba(0,0,0,0.5)',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.03,
                            shadowRadius: 6,
                            elevation: 1,
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <View style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 12,
                                    backgroundColor: '#E8E6FF',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Ionicons name="trending-up" size={16} color="#4F46E5" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        value={metric.outcome}
                                        onChangeText={(v) => dispatch({ type: 'UPDATE_METRIC', index: i, field: 'outcome', value: v })}
                                        placeholder="Metric name (e.g. Revenue Growth)"
                                        placeholderTextColor="#C7C4D8"
                                        style={{
                                            fontFamily: 'Inter_600SemiBold',
                                            fontSize: 13,
                                            color: '#464555',
                                            letterSpacing: 0.5,
                                            textTransform: 'uppercase',
                                            paddingVertical: 2,
                                        }}
                                    />
                                    <TextInput
                                        value={metric.targetValue}
                                        onChangeText={(v) => dispatch({ type: 'UPDATE_METRIC', index: i, field: 'targetValue', value: v })}
                                        placeholder="Target (e.g. 15% Quarterly)"
                                        placeholderTextColor="#C7C4D8"
                                        style={{
                                            fontFamily: 'Inter_700Bold',
                                            fontSize: 16,
                                            color: '#111827',
                                            paddingVertical: 2,
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => dispatch({ type: 'REMOVE_METRIC', index: i })}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>

            {/* Target Date */}
            <View>
                <SectionLabel text="Target Date" />
                <View style={{
                    backgroundColor: '#F3F4F6',
                    borderRadius: 16,
                    padding: 16,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            value={state.expectedOutcomeDate}
                            onChangeText={(v) => dispatch({ type: 'SET_FIELD', field: 'expectedOutcomeDate', value: v })}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor="#C7C4D8"
                            style={{
                                flex: 1,
                                fontFamily: 'Inter_500Medium',
                                fontSize: 16,
                                color: '#111827',
                                paddingVertical: 4,
                            }}
                        />
                        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                    </View>
                    <Text style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 13,
                        color: '#9CA3AF',
                        marginTop: 8,
                        lineHeight: 18,
                    }}>
                        When do you expect these outcomes to be fully realized?
                    </Text>
                </View>
            </View>

            {/* Confidence Slider */}
            <View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                }}>
                    <SectionLabel text="Confidence" />
                    <View style={{
                        backgroundColor: '#4F46E5',
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    }}>
                        <Text style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 13,
                            color: '#FFFFFF',
                        }}>
                            {state.confidenceLevel} / 10
                        </Text>
                    </View>
                </View>

                {/* Slider Track */}
                <View style={{
                    flexDirection: 'row',
                    gap: 4,
                    marginBottom: 8,
                }}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                        <TouchableOpacity
                            key={level}
                            onPress={() => dispatch({ type: 'SET_FIELD', field: 'confidenceLevel', value: level })}
                            style={{
                                flex: 1,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: level <= state.confidenceLevel ? '#4F46E5' : '#E5E7EB',
                            }}
                        />
                    ))}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 11,
                        color: '#9CA3AF',
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                    }}>
                        Tentative
                    </Text>
                    <Text style={{
                        fontFamily: 'Inter_700Bold',
                        fontSize: 11,
                        color: state.confidenceLevel >= 7 ? '#4F46E5' : '#9CA3AF',
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                    }}>
                        Unshakeable
                    </Text>
                </View>
            </View>

            {/* Motivational footer */}
            <View style={{
                backgroundColor: '#E8E6FF',
                borderRadius: 20,
                padding: 24,
                alignItems: 'center',
            }}>
                <Ionicons name="bulb-outline" size={28} color="#4F46E5" style={{ marginBottom: 12, opacity: 0.6 }} />
                <Text style={{
                    fontFamily: 'Inter_500Medium',
                    fontSize: 14,
                    color: '#464555',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    lineHeight: 22,
                }}>
                    "{MOTIVATIONAL_QUOTES[2]}"
                </Text>
            </View>
        </View>
    );
};

// ─── Template Picker Modal ────────────────────────────────────────────────────

const TemplatePicker: React.FC<{
    visible: boolean;
    onClose: () => void;
    onSelect: (template: Template) => void;
}> = ({ visible, onClose, onSelect }) => {
    const { data: templates = [], isLoading } = useTemplates();

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'flex-end',
            }}>
                <View style={{
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    maxHeight: '70%',
                    paddingTop: 16,
                }}>
                    {/* Handle */}
                    <View style={{
                        width: 40,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#D1D5DB',
                        alignSelf: 'center',
                        marginBottom: 16,
                    }} />

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 24,
                        marginBottom: 16,
                    }}>
                        <Text style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 18,
                            color: '#111827',
                        }}>
                            Choose a Template
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={{ padding: 24, gap: 12 }}>
                            {[1, 2, 3].map((i) => (
                                <View key={i} style={{
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: 14,
                                    height: 72,
                                }} />
                            ))}
                        </View>
                    ) : templates.length === 0 ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Ionicons name="document-outline" size={32} color="#C7C4D8" />
                            <Text style={{
                                fontFamily: 'Inter_600SemiBold',
                                fontSize: 15,
                                color: '#6B7280',
                                marginTop: 12,
                            }}>
                                No templates available yet
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={templates}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => { onSelect(item); onClose(); }}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#F9FAFB',
                                        borderRadius: 14,
                                        padding: 16,
                                        marginBottom: 10,
                                    }}
                                >
                                    <View style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 12,
                                        backgroundColor: getCategoryColor(item.category) + '18',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 14,
                                    }}>
                                        <Ionicons name="document-text" size={18} color={getCategoryColor(item.category)} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            fontFamily: 'Inter_600SemiBold',
                                            fontSize: 15,
                                            color: '#111827',
                                        }}>
                                            {item.name}
                                        </Text>
                                        {item.description ? (
                                            <Text
                                                style={{
                                                    fontFamily: 'Inter_400Regular',
                                                    fontSize: 13,
                                                    color: '#6B7280',
                                                    marginTop: 2,
                                                }}
                                                numberOfLines={1}
                                            >
                                                {item.description}
                                            </Text>
                                        ) : null}
                                    </View>
                                    <View style={{
                                        backgroundColor: '#E5E7EB',
                                        borderRadius: 8,
                                        paddingHorizontal: 8,
                                        paddingVertical: 3,
                                    }}>
                                        <Text style={{
                                            fontFamily: 'Inter_500Medium',
                                            fontSize: 11,
                                            color: '#6B7280',
                                            textTransform: 'capitalize',
                                        }}>
                                            {item.category}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

// ─── Main Wizard Screen ───────────────────────────────────────────────────────

export default function NewDecisionScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [state, dispatch] = useReducer(wizardReducer, initialState);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);

    const createMutation = useCreateDecision();

    const canGoNext = (): boolean => {
        if (step === 1) return state.title.trim().length > 0;
        if (step === 2) return true;
        return true;
    };

    const handleNext = () => {
        if (step < TOTAL_STEPS) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleClose = () => {
        if (state.title.trim()) {
            Alert.alert(
                'Discard Decision?',
                'You have unsaved changes. Are you sure you want to discard?',
                [
                    { text: 'Keep Editing', style: 'cancel' },
                    { text: 'Discard', style: 'destructive', onPress: () => router.back() },
                ],
            );
        } else {
            router.back();
        }
    };

    const handleSubmit = () => {
        const alternatives: Alternative[] = state.alternatives
            .filter((a) => a.trim())
            .map((option) => ({ option }));

        const expectedOutcomes: ExpectedOutcome[] = state.expectedOutcomes
            .filter((m) => m.outcome.trim())
            .map((m) => ({
                outcome: m.outcome,
                metric: m.metric || m.outcome.toLowerCase().replace(/\s+/g, '_'),
                targetValue: parseFloat(m.targetValue) || undefined,
            }));

        // Parse date
        let expectedOutcomeDate: string | undefined;
        if (state.expectedOutcomeDate.trim()) {
            const d = new Date(state.expectedOutcomeDate);
            if (!isNaN(d.getTime())) {
                expectedOutcomeDate = d.toISOString().split('T')[0];
            }
        }

        const payload: DecisionCreatePayload = {
            title: state.title.trim(),
            category: state.category,
            description: state.description.trim() || undefined,
            context: state.context.trim() || undefined,
            reasoningProcess: state.reasoningProcess.trim() || undefined,
            alternativesConsidered: alternatives.length > 0 ? alternatives : undefined,
            expectedOutcomes: expectedOutcomes.length > 0 ? expectedOutcomes : undefined,
            confidenceLevel: state.confidenceLevel,
            expectedOutcomeDate,
            tags: state.tags.length > 0 ? state.tags : undefined,
            isPrivate: true,
        };

        createMutation.mutate(payload, {
            onSuccess: (data) => {
                router.replace(`/(tabs)/decisions/${data.id}`);
            },
            onError: (error: any) => {
                Alert.alert(
                    'Error',
                    error?.response?.data?.error || 'Failed to create decision',
                );
            },
        });
    };

    const handleTemplateSelect = (template: Template) => {
        dispatch({ type: 'APPLY_TEMPLATE', template });
    };

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
                <TouchableOpacity onPress={handleClose} style={{ padding: 8 }}>
                    <Ionicons name="close" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 17,
                    color: '#111827',
                }}>
                    Decision Wizard
                </Text>
                <TouchableOpacity style={{ padding: 8 }}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#464555" />
                </TouchableOpacity>
            </View>

            {/* ── Content ── */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <StepIndicator step={step} total={TOTAL_STEPS} />

                    {step === 1 && (
                        <Step1
                            state={state}
                            dispatch={dispatch}
                            onTemplatePress={() => setShowTemplates(true)}
                            showAllCategories={showAllCategories}
                            setShowAllCategories={setShowAllCategories}
                        />
                    )}
                    {step === 2 && <Step2 state={state} dispatch={dispatch} />}
                    {step === 3 && <Step3 state={state} dispatch={dispatch} />}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Bottom Bar ── */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 24,
                paddingVertical: 16,
                paddingBottom: 28,
                backgroundColor: '#F9FAFB',
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6',
                gap: 12,
            }}>
                {step === 1 ? (
                    <>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={{ paddingVertical: 12, paddingHorizontal: 20 }}
                        >
                            <Text style={{
                                fontFamily: 'Inter_600SemiBold',
                                fontSize: 15,
                                color: '#6B7280',
                            }}>
                                Save Draft
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleNext}
                            disabled={!canGoNext()}
                            activeOpacity={0.85}
                            style={{ flex: 1 }}
                        >
                            <LinearGradient
                                colors={canGoNext() ? ['#3525CD', '#4F46E5'] : ['#D1D5DB', '#D1D5DB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    paddingVertical: 15,
                                    borderRadius: 14,
                                }}
                            >
                                <Text style={{
                                    fontFamily: 'Inter_700Bold',
                                    fontSize: 15,
                                    color: '#FFFFFF',
                                }}>
                                    Continue
                                </Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                ) : step === 2 ? (
                    <>
                        <TouchableOpacity
                            onPress={handleBack}
                            activeOpacity={0.8}
                            style={{
                                paddingVertical: 15,
                                paddingHorizontal: 28,
                                borderRadius: 14,
                                borderWidth: 1.5,
                                borderColor: '#E5E7EB',
                                backgroundColor: '#FFFFFF',
                            }}
                        >
                            <Text style={{
                                fontFamily: 'Inter_700Bold',
                                fontSize: 15,
                                color: '#374151',
                            }}>
                                Back
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleNext}
                            activeOpacity={0.85}
                            style={{ flex: 1 }}
                        >
                            <LinearGradient
                                colors={['#3525CD', '#4F46E5']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    paddingVertical: 15,
                                    borderRadius: 14,
                                }}
                            >
                                <Text style={{
                                    fontFamily: 'Inter_700Bold',
                                    fontSize: 15,
                                    color: '#FFFFFF',
                                }}>
                                    Next
                                </Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={{ flex: 1, gap: 10 }}>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={createMutation.isPending || !canGoNext()}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={canGoNext() ? ['#3525CD', '#4F46E5'] : ['#D1D5DB', '#D1D5DB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    paddingVertical: 16,
                                    borderRadius: 14,
                                    shadowColor: '#4F46E5',
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.22,
                                    shadowRadius: 12,
                                    elevation: 6,
                                }}
                            >
                                {createMutation.isPending ? (
                                    <Text style={{
                                        fontFamily: 'Inter_700Bold',
                                        fontSize: 16,
                                        color: '#FFFFFF',
                                    }}>
                                        Creating...
                                    </Text>
                                ) : (
                                    <>
                                        <Text style={{
                                            fontFamily: 'Inter_700Bold',
                                            fontSize: 16,
                                            color: '#FFFFFF',
                                        }}>
                                            Create Decision
                                        </Text>
                                        <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleBack}
                            activeOpacity={0.8}
                            style={{
                                paddingVertical: 14,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{
                                fontFamily: 'Inter_600SemiBold',
                                fontSize: 15,
                                color: '#6B7280',
                            }}>
                                Back
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* ── Template Picker ── */}
            <TemplatePicker
                visible={showTemplates}
                onClose={() => setShowTemplates(false)}
                onSelect={handleTemplateSelect}
            />
        </SafeAreaView>
    );
}