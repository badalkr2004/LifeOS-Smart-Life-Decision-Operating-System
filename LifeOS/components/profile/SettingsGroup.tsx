import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '@/utils/designTokens';

// ─── Settings Row ─────────────────────────────────────────────────────────────

type RowProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconColor?: string;
    iconBg?: string;
    label: string;
    labelColor?: string;
    onPress?: () => void;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    isLast?: boolean;
};

export const SettingsRow: React.FC<RowProps> = ({
    icon,
    iconColor = COLORS.textMuted,
    iconBg = COLORS.surfaceLow,
    label,
    labelColor = COLORS.textPrimary,
    onPress,
    switchValue,
    onSwitchChange,
    isLast = false,
}) => {
    const content = (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: SPACING.lg,
                paddingHorizontal: 18,
                borderBottomWidth: isLast ? 0 : 0.5,
                borderBottomColor: '#F0F0F2',
            }}
        >
            <View
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: RADII.md,
                    backgroundColor: iconBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: SPACING.md,
                }}
            >
                <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: labelColor, flex: 1 }}>{label}</Text>
            {switchValue !== undefined && onSwitchChange ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: COLORS.inputBorder, true: COLORS.outlineVariant }}
                    thumbColor={switchValue ? COLORS.primary : COLORS.surfaceLow}
                />
            ) : (
                <Ionicons name="chevron-forward" size={18} color={COLORS.outlineVariant} />
            )}
        </View>
    );

    if (onPress && switchValue === undefined) {
        return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
    }
    return content;
};

// ─── Settings Group ───────────────────────────────────────────────────────────

type GroupProps = {
    title: string;
    children: React.ReactNode;
};

export const SettingsGroup: React.FC<GroupProps> = ({ title, children }) => (
    <View style={{ marginBottom: SPACING.xxl }}>
        <Text style={[TYPOGRAPHY.label, { color: COLORS.textMuted, marginBottom: 10, marginLeft: 4 }]}>{title}</Text>
        <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, overflow: 'hidden' }}>{children}</View>
    </View>
);
