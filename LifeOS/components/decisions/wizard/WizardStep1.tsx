/**
 * WizardStep1 — Foundations: template, title, category, description.
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectionLabel } from './StepIndicator';
import { CATEGORIES, MOTIVATIONAL_QUOTES } from '@/utils/constants';
import { getCategoryColor } from '@/utils/helpers';
import type { WizardState, WizardAction } from './wizardReducer';

type Step1Props = {
    state: WizardState;
    dispatch: React.Dispatch<WizardAction>;
    onTemplatePress: () => void;
    showAllCategories: boolean;
    setShowAllCategories: (v: boolean) => void;
};

export const WizardStep1: React.FC<Step1Props> = ({
    state,
    dispatch,
    onTemplatePress,
    showAllCategories,
    setShowAllCategories,
}) => {
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
                <View
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: '#E8E6FF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                    }}
                >
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
                                <Ionicons name={cat.icon} size={16} color={isActive ? catColor : '#6B7280'} />
                                <Text
                                    style={{
                                        fontFamily: isActive ? 'Inter_700Bold' : 'Inter_500Medium',
                                        fontSize: 14,
                                        color: isActive ? catColor : '#374151',
                                    }}
                                >
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {!showAllCategories && (
                    <TouchableOpacity onPress={() => setShowAllCategories(true)} style={{ marginTop: 8 }}>
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#4F46E5' }}>
                            Show more categories...
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Context & Nuance */}
            <View>
                <SectionLabel text="Context & Nuance" />
                <View style={{ backgroundColor: '#F3F4F6', borderRadius: 16, padding: 16, minHeight: 120 }}>
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
            <View style={{ backgroundColor: '#E8E6FF', borderRadius: 20, padding: 24, alignItems: 'center' }}>
                <Ionicons name="compass-outline" size={32} color="#4F46E5" style={{ marginBottom: 12, opacity: 0.6 }} />
                <Text
                    style={{
                        fontFamily: 'Inter_500Medium',
                        fontSize: 14,
                        color: '#464555',
                        textAlign: 'center',
                        fontStyle: 'italic',
                        lineHeight: 22,
                    }}
                >
                    {MOTIVATIONAL_QUOTES[0]}
                </Text>
            </View>
        </View>
    );
};
