/**
 * Decision Wizard Screen — 3-step form for creating or editing a decision.
 *
 * Create mode: Shows AI pre-decision analysis before final creation.
 * Edit mode: pass ?editId=<id> to pre-populate from existing decision.
 */

import React, { useReducer, useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
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
import { useCreateDecision, useUpdateDecision, useDecision } from '@/hooks/useDecisions';
import { usePreDecisionAnalysis } from '@/hooks/useAI';
import type { DecisionCreatePayload, Alternative, ExpectedOutcome, Template } from '@/services/decisionService';
import type { PreDecisionAnalysis } from '@/services/aiService';

import {
    StepIndicator,
    WizardStep1,
    WizardStep2,
    WizardStep3,
    TemplatePicker,
    AnalysisSheet,
    wizardReducer,
    initialWizardState,
} from '@/components/decisions';

const TOTAL_STEPS = 3;

export default function NewDecisionScreen() {
    const router = useRouter();
    const { editId } = useLocalSearchParams<{ editId?: string }>();
    const isEditMode = !!editId;

    const [step, setStep] = useState(1);
    const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Analysis state
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<PreDecisionAnalysis | null>(null);
    const [pendingPayload, setPendingPayload] = useState<DecisionCreatePayload | null>(null);

    const createMutation = useCreateDecision();
    const updateMutation = useUpdateDecision();
    const analysisMutation = usePreDecisionAnalysis();
    const { data: existingDecision } = useDecision(editId || '');

    // Pre-populate form when editing
    useEffect(() => {
        if (isEditMode && existingDecision && !loaded) {
            dispatch({ type: 'LOAD_DECISION', decision: existingDecision });
            setLoaded(true);
        }
    }, [isEditMode, existingDecision, loaded]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    // ── Validation ──
    const canGoNext = (): boolean => {
        if (step === 1) return state.title.trim().length > 0;
        return true;
    };

    // ── Navigation handlers ──
    const handleNext = () => {
        if (step < TOTAL_STEPS) setStep(step + 1);
    };
    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };
    const handleClose = () => {
        if (state.title.trim()) {
            Alert.alert(
                'Discard Changes?',
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

    // ── Build payload from form state ──
    const buildPayload = (): DecisionCreatePayload => {
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

        let expectedOutcomeDate: string | undefined;
        if (state.expectedOutcomeDate.trim()) {
            const d = new Date(state.expectedOutcomeDate);
            if (!isNaN(d.getTime())) {
                expectedOutcomeDate = d.toISOString().split('T')[0];
            }
        }

        return {
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
    };

    // ── Submit: triggers analysis for create, direct update for edit ──
    const handleSubmit = () => {
        const payload = buildPayload();

        if (isEditMode) {
            updateMutation.mutate(
                { id: editId!, payload },
                {
                    onSuccess: () => router.back(),
                    onError: (error: any) => {
                        Alert.alert('Error', error?.response?.data?.error || 'Failed to update decision');
                    },
                },
            );
        } else {
            // Create mode: run pre-decision analysis first
            setPendingPayload(payload);
            setShowAnalysis(true);
            setAnalysisResult(null);

            analysisMutation.mutate(
                {
                    title: payload.title,
                    category: payload.category || 'other',
                    description: payload.description,
                    context: payload.context,
                    confidenceLevel: payload.confidenceLevel,
                    expectedOutcomes: payload.expectedOutcomes,
                    alternativesConsidered: payload.alternativesConsidered,
                },
                {
                    onSuccess: (data) => setAnalysisResult(data),
                    onError: () => {
                        // If analysis fails, proceed directly
                        setShowAnalysis(false);
                        confirmCreate(payload);
                    },
                },
            );
        }
    };

    // ── Confirm creation after analysis ──
    const confirmCreate = (payload: DecisionCreatePayload) => {
        setShowAnalysis(false);
        createMutation.mutate(payload, {
            onSuccess: (data) => {
                router.replace(`/(tabs)/decisions/${data.id}`);
            },
            onError: (error: any) => {
                Alert.alert('Error', error?.response?.data?.error || 'Failed to create decision');
            },
        });
    };

    const handleAnalysisProceed = () => {
        if (pendingPayload) confirmCreate(pendingPayload);
    };

    const handleAnalysisEdit = () => {
        setShowAnalysis(false);
        setAnalysisResult(null);
    };

    const handleTemplateSelect = (template: Template) => {
        dispatch({ type: 'APPLY_TEMPLATE', template });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* ── Header ── */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                }}
            >
                <TouchableOpacity onPress={handleClose} style={{ padding: 8 }}>
                    <Ionicons name="close" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#111827' }}>{isEditMode ? 'Edit Decision' : 'Decision Wizard'}</Text>
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
                        <WizardStep1
                            state={state}
                            dispatch={dispatch}
                            onTemplatePress={() => setShowTemplates(true)}
                            showAllCategories={showAllCategories}
                            setShowAllCategories={setShowAllCategories}
                        />
                    )}
                    {step === 2 && <WizardStep2 state={state} dispatch={dispatch} />}
                    {step === 3 && <WizardStep3 state={state} dispatch={dispatch} />}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Bottom Bar ── */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    paddingBottom: 28,
                    backgroundColor: '#F9FAFB',
                    borderTopWidth: 1,
                    borderTopColor: '#F3F4F6',
                    gap: 12,
                }}
            >
                {step === 1 ? (
                    <>
                        <TouchableOpacity onPress={handleClose} style={{ paddingVertical: 12, paddingHorizontal: 20 }}>
                            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#6B7280' }}>Save Draft</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNext} disabled={!canGoNext()} activeOpacity={0.85} style={{ flex: 1 }}>
                            <LinearGradient
                                colors={canGoNext() ? ['#3525CD', '#4F46E5'] : ['#D1D5DB', '#D1D5DB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 15, borderRadius: 14 }}
                            >
                                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: '#FFFFFF' }}>Continue</Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                ) : step === 2 ? (
                    <>
                        <TouchableOpacity
                            onPress={handleBack}
                            activeOpacity={0.8}
                            style={{ paddingVertical: 15, paddingHorizontal: 28, borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                        >
                            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: '#374151' }}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNext} activeOpacity={0.85} style={{ flex: 1 }}>
                            <LinearGradient
                                colors={['#3525CD', '#4F46E5']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 15, borderRadius: 14 }}
                            >
                                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: '#FFFFFF' }}>Next</Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={{ flex: 1, gap: 10 }}>
                        <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting || analysisMutation.isPending || !canGoNext()} activeOpacity={0.85}>
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
                                {isSubmitting ? (
                                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#FFFFFF' }}>{isEditMode ? 'Saving...' : 'Creating...'}</Text>
                                ) : (
                                    <>
                                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#FFFFFF' }}>{isEditMode ? 'Save Changes' : 'Create Decision'}</Text>
                                        <Ionicons name={isEditMode ? 'checkmark-circle' : 'sparkles'} size={18} color="#FFFFFF" />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleBack} activeOpacity={0.8} style={{ paddingVertical: 14, alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#6B7280' }}>Back</Text>
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

            {/* ── Pre-Decision Analysis Sheet ── */}
            <AnalysisSheet
                visible={showAnalysis}
                loading={analysisMutation.isPending}
                analysis={analysisResult}
                onProceed={handleAnalysisProceed}
                onEdit={handleAnalysisEdit}
                onClose={handleAnalysisEdit}
            />
        </SafeAreaView>
    );
}