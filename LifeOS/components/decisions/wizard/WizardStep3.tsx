/**
 * WizardStep3 — Final Calibration: metrics, date, confidence slider.
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectionLabel } from './StepIndicator';
import { MOTIVATIONAL_QUOTES } from '@/utils/constants';
import type { WizardState, WizardAction } from './wizardReducer';

type Step3Props = {
    state: WizardState;
    dispatch: React.Dispatch<WizardAction>;
};

export const WizardStep3: React.FC<Step3Props> = ({ state, dispatch }) => (
    <View style={{ gap: 28 }}>
        {/* Expected Metrics */}
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <SectionLabel text="Expected Metrics" />
                <TouchableOpacity onPress={() => dispatch({ type: 'ADD_METRIC' })} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="add" size={16} color="#4F46E5" />
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#4F46E5' }}>Add Metric</Text>
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
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#6B7280' }}>
                        Add expected metrics to track progress
                    </Text>
                </TouchableOpacity>
            ) : (
                state.expectedOutcomes.map((metric, i) => (
                    <View
                        key={i}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 10,
                            shadowColor: 'rgba(0,0,0,0.5)',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.03,
                            shadowRadius: 6,
                            elevation: 1,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#E8E6FF', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="trending-up" size={16} color="#4F46E5" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    value={metric.outcome}
                                    onChangeText={(v) => dispatch({ type: 'UPDATE_METRIC', index: i, field: 'outcome', value: v })}
                                    placeholder="Metric name (e.g. Revenue Growth)"
                                    placeholderTextColor="#C7C4D8"
                                    style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#464555', letterSpacing: 0.5, textTransform: 'uppercase', paddingVertical: 2 }}
                                />
                                <TextInput
                                    value={metric.targetValue}
                                    onChangeText={(v) => dispatch({ type: 'UPDATE_METRIC', index: i, field: 'targetValue', value: v })}
                                    placeholder="Target (e.g. 15% Quarterly)"
                                    placeholderTextColor="#C7C4D8"
                                    style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#111827', paddingVertical: 2 }}
                                />
                            </View>
                            <TouchableOpacity onPress={() => dispatch({ type: 'REMOVE_METRIC', index: i })} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
            <View style={{ backgroundColor: '#F3F4F6', borderRadius: 16, padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        value={state.expectedOutcomeDate}
                        onChangeText={(v) => dispatch({ type: 'SET_FIELD', field: 'expectedOutcomeDate', value: v })}
                        placeholder="MM/DD/YYYY"
                        placeholderTextColor="#C7C4D8"
                        style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 16, color: '#111827', paddingVertical: 4 }}
                    />
                    <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                </View>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#9CA3AF', marginTop: 8, lineHeight: 18 }}>
                    When do you expect these outcomes to be fully realized?
                </Text>
            </View>
        </View>

        {/* Confidence Slider */}
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <SectionLabel text="Confidence" />
                <View style={{ backgroundColor: '#4F46E5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: '#FFFFFF' }}>{state.confidenceLevel} / 10</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 8 }}>
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
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#9CA3AF', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Tentative
                </Text>
                <Text
                    style={{
                        fontFamily: 'Inter_700Bold',
                        fontSize: 11,
                        color: state.confidenceLevel >= 7 ? '#4F46E5' : '#9CA3AF',
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                    }}
                >
                    Unshakeable
                </Text>
            </View>
        </View>

        {/* Motivational footer */}
        <View style={{ backgroundColor: '#E8E6FF', borderRadius: 20, padding: 24, alignItems: 'center' }}>
            <Ionicons name="bulb-outline" size={28} color="#4F46E5" style={{ marginBottom: 12, opacity: 0.6 }} />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#464555', textAlign: 'center', fontStyle: 'italic', lineHeight: 22 }}>
                "{MOTIVATIONAL_QUOTES[2]}"
            </Text>
        </View>
    </View>
);
