/**
 * WizardStep2 — Context & Alternatives: background, numbered inputs.
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WizardState, WizardAction } from './wizardReducer';

type Step2Props = {
    state: WizardState;
    dispatch: React.Dispatch<WizardAction>;
};

export const WizardStep2: React.FC<Step2Props> = ({ state, dispatch }) => (
    <View style={{ gap: 28 }}>
        {/* The Background */}
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8E6FF', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="ellipse" size={10} color="#4F46E5" />
                </View>
                <View>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#111827' }}>The Background</Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7280' }}>What led you to this crossroad?</Text>
                </View>
            </View>
            <View style={{ backgroundColor: '#F3F4F6', borderRadius: 16, padding: 16, minHeight: 120 }}>
                <TextInput
                    value={state.context}
                    onChangeText={(v) => dispatch({ type: 'SET_FIELD', field: 'context', value: v })}
                    placeholder="Describe the situation, emotions, and external factors influencing this choice..."
                    placeholderTextColor="#9CA3AF"
                    style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: '#374151', lineHeight: 24, textAlignVertical: 'top' }}
                    multiline
                />
            </View>
        </View>

        {/* Explore Alternatives */}
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8E6FF', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="git-branch-outline" size={16} color="#4F46E5" />
                </View>
                <View>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#111827' }}>Explore Alternatives</Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7280' }}>List every path you could take.</Text>
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
                    <View
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            backgroundColor: alt ? '#4F46E5' : '#E5E7EB',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        }}
                    >
                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: alt ? '#FFFFFF' : '#9CA3AF' }}>
                            {i + 1}
                        </Text>
                    </View>
                    <TextInput
                        value={alt}
                        onChangeText={(v) => dispatch({ type: 'UPDATE_ALTERNATIVE', index: i, value: v })}
                        placeholder="Add a new alternative..."
                        placeholderTextColor="#C7C4D8"
                        style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, color: '#111827', paddingVertical: 12 }}
                    />
                    {alt.length > 0 && state.alternatives.length > 1 && (
                        <TouchableOpacity onPress={() => dispatch({ type: 'REMOVE_ALTERNATIVE', index: i })} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#4F46E5' }}>Add Another Option</Text>
            </TouchableOpacity>
        </View>
    </View>
);
