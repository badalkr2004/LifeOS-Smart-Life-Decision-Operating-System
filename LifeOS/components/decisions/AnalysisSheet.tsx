/**
 * AnalysisSheet — Bottom sheet showing the AI pre-decision analysis verdict.
 *
 * Displays: verdict badge, summary, risk factors, supporting evidence,
 * suggestions, blind spots, and historical context. Users can proceed
 * with creating the decision or go back to edit.
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { PreDecisionAnalysis } from '@/services/aiService';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const VERDICT_CONFIG = {
    proceed: {
        label: 'PROCEED',
        emoji: '🟢',
        color: '#10B981',
        bgColor: '#ECFDF5',
        borderColor: '#A7F3D0',
        gradient: ['#059669', '#10B981'] as [string, string],
    },
    caution: {
        label: 'CAUTION',
        emoji: '🟡',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        borderColor: '#FDE68A',
        gradient: ['#D97706', '#F59E0B'] as [string, string],
    },
    reconsider: {
        label: 'RECONSIDER',
        emoji: '🔴',
        color: '#EF4444',
        bgColor: '#FEF2F2',
        borderColor: '#FECACA',
        gradient: ['#DC2626', '#EF4444'] as [string, string],
    },
};

type AnalysisSheetProps = {
    visible: boolean;
    loading: boolean;
    analysis: PreDecisionAnalysis | null;
    onProceed: () => void;
    onEdit: () => void;
    onClose: () => void;
};

export const AnalysisSheet: React.FC<AnalysisSheetProps> = ({
    visible,
    loading,
    analysis,
    onProceed,
    onEdit,
    onClose,
}) => {
    if (!visible) return null;

    const config = analysis ? VERDICT_CONFIG[analysis.verdict] : VERDICT_CONFIG.proceed;

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View
                    style={{
                        backgroundColor: '#F9FAFB',
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        maxHeight: SCREEN_HEIGHT * 0.88,
                        paddingTop: 12,
                    }}
                >
                    {/* Handle bar */}
                    <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 12 }} />

                    {loading ? (
                        /* Loading State */
                        <View style={{ paddingVertical: 80, alignItems: 'center', gap: 16 }}>
                            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#E8E6FF', alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator size="large" color="#4F46E5" />
                            </View>
                            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: '#111827' }}>Analyzing Your Decision</Text>
                            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 }}>
                                Reviewing your past decisions, outcomes, and patterns to provide personalized guidance...
                            </Text>
                        </View>
                    ) : analysis ? (
                        /* Analysis Content */
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}>

                            {/* ── Verdict Badge ── */}
                            <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 8 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                    backgroundColor: config.bgColor,
                                    borderWidth: 1.5,
                                    borderColor: config.borderColor,
                                    borderRadius: 16,
                                    paddingHorizontal: 24,
                                    paddingVertical: 14,
                                }}>
                                    <Text style={{ fontSize: 24 }}>{config.emoji}</Text>
                                    <View>
                                        <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 20, color: config.color, letterSpacing: 1 }}>{config.label}</Text>
                                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#6B7280' }}>Confidence: {analysis.confidenceInVerdict}/10</Text>
                                    </View>
                                </View>
                            </View>

                            {/* ── Summary ── */}
                            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 16, shadowColor: 'rgba(0,0,0,0.5)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#374151', lineHeight: 22 }}>{analysis.summary}</Text>
                            </View>

                            {/* ── Historical Context Bar ── */}
                            {analysis.historicalContext.totalCategoryDecisions > 0 && (
                                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 20, color: '#4F46E5' }}>
                                            {analysis.historicalContext.totalCategoryDecisions}
                                        </Text>
                                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#6B7280' }}>Past Decisions</Text>
                                    </View>
                                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 20, color: analysis.historicalContext.avgSatisfaction && analysis.historicalContext.avgSatisfaction >= 6 ? '#10B981' : '#F59E0B' }}>
                                            {analysis.historicalContext.avgSatisfaction?.toFixed(1) ?? '—'}
                                        </Text>
                                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#6B7280' }}>Avg Satisfaction</Text>
                                    </View>
                                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 20, color: analysis.historicalContext.regretRate > 30 ? '#EF4444' : '#10B981' }}>
                                            {analysis.historicalContext.regretRate}%
                                        </Text>
                                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#6B7280' }}>Regret Rate</Text>
                                    </View>
                                </View>
                            )}

                            {/* ── Risk Factors ── */}
                            {analysis.riskFactors.length > 0 && (
                                <View style={{ marginBottom: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <Ionicons name="warning-outline" size={16} color="#EF4444" />
                                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.2, textTransform: 'uppercase' }}>Risk Factors</Text>
                                    </View>
                                    {analysis.riskFactors.map((risk, i) => (
                                        <View key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: risk.severity === 'high' ? '#EF4444' : risk.severity === 'medium' ? '#F59E0B' : '#6B7280' }}>
                                            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827', marginBottom: 4 }}>{risk.factor}</Text>
                                            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280', lineHeight: 18 }}>{risk.basedOn}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* ── Supporting Evidence ── */}
                            {analysis.supportingEvidence.length > 0 && (
                                <View style={{ marginBottom: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
                                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.2, textTransform: 'uppercase' }}>Supporting Evidence</Text>
                                    </View>
                                    {analysis.supportingEvidence.map((ev, i) => (
                                        <View key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#10B981' }}>
                                            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827', marginBottom: 4 }}>{ev.point}</Text>
                                            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280', lineHeight: 18 }}>{ev.source}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* ── Suggestions ── */}
                            {analysis.suggestions.length > 0 && (
                                <View style={{ marginBottom: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <Ionicons name="bulb-outline" size={16} color="#4F46E5" />
                                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.2, textTransform: 'uppercase' }}>Suggestions</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 }}>
                                        {analysis.suggestions.map((s, i) => (
                                            <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: i < analysis.suggestions.length - 1 ? 10 : 0 }}>
                                                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#4F46E5' }}>•</Text>
                                                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#374151', lineHeight: 20, flex: 1 }}>{s}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* ── Blind Spots ── */}
                            {analysis.blindSpots.length > 0 && (
                                <View style={{ marginBottom: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <Ionicons name="eye-off-outline" size={16} color="#F59E0B" />
                                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.2, textTransform: 'uppercase' }}>Blind Spots</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#FFF7ED', borderRadius: 14, padding: 14 }}>
                                        {analysis.blindSpots.map((b, i) => (
                                            <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: i < analysis.blindSpots.length - 1 ? 8 : 0 }}>
                                                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#F59E0B' }}>⚠</Text>
                                                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#92400E', lineHeight: 20, flex: 1 }}>{b}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* ── Timing ── */}
                            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.2, textTransform: 'uppercase' }}>Timing</Text>
                                </View>
                                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#374151', lineHeight: 20 }}>{analysis.timingAssessment}</Text>
                            </View>
                        </ScrollView>
                    ) : null}

                    {/* ── Bottom Actions ── */}
                    {!loading && analysis && (
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 36, paddingTop: 16, backgroundColor: '#F9FAFB', borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 10 }}>
                            <TouchableOpacity onPress={onProceed} activeOpacity={0.85}>
                                <LinearGradient
                                    colors={config.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        paddingVertical: 16,
                                        borderRadius: 14,
                                        shadowColor: config.color,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                        elevation: 4,
                                    }}
                                >
                                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#FFFFFF' }}>
                                        {analysis.verdict === 'proceed' ? 'Create Decision' : 'Proceed Anyway'}
                                    </Text>
                                    <Ionicons name={analysis.verdict === 'proceed' ? 'checkmark-circle' : 'arrow-forward'} size={18} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onEdit} activeOpacity={0.8} style={{ paddingVertical: 14, alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#6B7280' }}>
                                    {analysis.verdict === 'reconsider' ? 'Go Back & Reconsider' : 'Edit Decision'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
