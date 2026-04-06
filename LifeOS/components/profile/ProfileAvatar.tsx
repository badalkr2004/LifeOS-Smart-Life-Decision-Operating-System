import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    firstName?: string;
    lastName?: string;
    email?: string;
    size?: number;
    onEdit?: () => void;
};

export const ProfileAvatar: React.FC<Props> = ({
    firstName,
    lastName,
    email,
    size = 100,
    onEdit,
}) => {
    const initials = [firstName?.charAt(0), lastName?.charAt(0)]
        .filter(Boolean)
        .join('')
        .toUpperCase() || '?';

    return (
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
            {/* Avatar ring */}
            <View style={{ position: 'relative', marginBottom: 16 }}>
                <View
                    style={{
                        width: size + 8,
                        height: size + 8,
                        borderRadius: (size + 8) / 2,
                        borderWidth: 2.5,
                        borderColor: '#C7C0FF',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor: '#E2DFFF',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Inter_800ExtraBold',
                                fontSize: size * 0.36,
                                color: '#4F46E5',
                            }}
                        >
                            {initials}
                        </Text>
                    </View>
                </View>

                {/* Edit badge */}
                {onEdit && (
                    <TouchableOpacity
                        onPress={onEdit}
                        style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: '#4F46E5',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2.5,
                            borderColor: '#F9FAFB',
                        }}
                    >
                        <Ionicons name="pencil" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Name + Email */}
            {(firstName || lastName) && (
                <Text
                    style={{
                        fontFamily: 'Inter_800ExtraBold',
                        fontSize: 22,
                        color: '#111827',
                        letterSpacing: -0.5,
                    }}
                >
                    {[firstName, lastName].filter(Boolean).join(' ')}
                </Text>
            )}
            {email && (
                <Text
                    style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        marginTop: 4,
                    }}
                >
                    {email}
                </Text>
            )}
        </View>
    );
};
