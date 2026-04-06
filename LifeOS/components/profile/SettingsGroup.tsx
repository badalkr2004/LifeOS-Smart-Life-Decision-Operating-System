import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Settings Row ─────────────────────────────────────────────────────────────

type RowProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconColor?: string;
    iconBg?: string;
    label: string;
    labelColor?: string;
    onPress?: () => void;
    /** If provided, renders a Switch instead of chevron */
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    isLast?: boolean;
};

export const SettingsRow: React.FC<RowProps> = ({
    icon,
    iconColor = '#464555',
    iconBg = '#F3F4F5',
    label,
    labelColor = '#111827',
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
                paddingVertical: 16,
                paddingHorizontal: 18,
                borderBottomWidth: isLast ? 0 : 0.5,
                borderBottomColor: '#F0F0F2',
            }}
        >
            <View
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: iconBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                }}
            >
                <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <Text
                style={{
                    flex: 1,
                    fontFamily: 'Inter_500Medium',
                    fontSize: 15,
                    color: labelColor,
                }}
            >
                {label}
            </Text>
            {switchValue !== undefined && onSwitchChange ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: '#D1D5DB', true: '#C7C0FF' }}
                    thumbColor={switchValue ? '#4F46E5' : '#F3F4F5'}
                />
            ) : (
                <Ionicons name="chevron-forward" size={18} color="#C7C4D8" />
            )}
        </View>
    );

    if (onPress && switchValue === undefined) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

// ─── Settings Group ───────────────────────────────────────────────────────────

type GroupProps = {
    title: string;
    children: React.ReactNode;
};

export const SettingsGroup: React.FC<GroupProps> = ({ title, children }) => (
    <View style={{ marginBottom: 24 }}>
        <Text
            style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 11,
                color: '#464555',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 10,
                marginLeft: 4,
            }}
        >
            {title}
        </Text>
        <View
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                overflow: 'hidden',
            }}
        >
            {children}
        </View>
    </View>
);
