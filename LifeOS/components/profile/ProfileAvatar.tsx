import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/utils/designTokens';

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
        <View style={{ alignItems: 'center', marginBottom: SPACING.xxl }}>
            <View style={{ position: 'relative', marginBottom: SPACING.lg }}>
                <View
                    style={{
                        width: size + 8,
                        height: size + 8,
                        borderRadius: (size + 8) / 2,
                        borderWidth: 2.5,
                        borderColor: COLORS.outlineVariant,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor: COLORS.primaryFixed,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: size * 0.36, color: COLORS.primary }}>
                            {initials}
                        </Text>
                    </View>
                </View>

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
                            backgroundColor: COLORS.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2.5,
                            borderColor: COLORS.surface,
                        }}
                    >
                        <Ionicons name="pencil" size={14} color={COLORS.textOnPrimary} />
                    </TouchableOpacity>
                )}
            </View>

            {(firstName || lastName) && (
                <Text style={[TYPOGRAPHY.h2, { color: COLORS.textPrimary, letterSpacing: -0.5 }]}>
                    {[firstName, lastName].filter(Boolean).join(' ')}
                </Text>
            )}
            {email && (
                <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: SPACING.xs }]}>
                    {email}
                </Text>
            )}
        </View>
    );
};
