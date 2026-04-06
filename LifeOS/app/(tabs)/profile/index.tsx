import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/authStore';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { SettingsGroup, SettingsRow } from '@/components/profile/SettingsGroup';

export default function ProfileScreen() {
    const router = useRouter();
    const { data: user, isLoading } = useUser();
    const { clearTokens, refreshToken } = useAuthStore();
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        // Best-effort server logout
                        if (refreshToken) {
                            const { profileService } = await import('@/services/profileService');
                            await profileService.logout(refreshToken).catch(() => {});
                        }
                    } finally {
                        await clearTokens();
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 24,
                    paddingTop: 8,
                    paddingBottom: 12,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="menu-outline" size={24} color="#111827" />
                    <Text
                        style={{
                            fontFamily: 'Inter_800ExtraBold',
                            fontSize: 20,
                            color: '#111827',
                            letterSpacing: -0.5,
                        }}
                    >
                        LifeOS
                    </Text>
                </View>
                <Ionicons name="settings-outline" size={22} color="#111827" />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
            >
                {/* Avatar + Name + Email */}
                <View style={{ paddingTop: 20 }}>
                    <ProfileAvatar
                        firstName={user?.firstName}
                        lastName={user?.lastName}
                        email={user?.email}
                        onEdit={() => router.push('/(tabs)/profile/edit')}
                    />
                </View>

                {/* ACCOUNT */}
                <SettingsGroup title="Account">
                    <SettingsRow
                        icon="person-outline"
                        label="Edit Profile"
                        onPress={() => router.push('/(tabs)/profile/edit')}
                    />
                    <SettingsRow
                        icon="notifications-outline"
                        iconColor="#F59E0B"
                        iconBg="#FEF3C7"
                        label="Notification Preferences"
                        onPress={() => {}}
                        isLast
                    />
                </SettingsGroup>

                {/* LIBRARY */}
                <SettingsGroup title="Library">
                    <SettingsRow
                        icon="grid-outline"
                        iconColor="#4F46E5"
                        iconBg="#E2DFFF"
                        label="Manage Frameworks"
                        onPress={() => router.push('/(tabs)/profile/frameworks')}
                    />
                    <SettingsRow
                        icon="document-text-outline"
                        iconColor="#4F46E5"
                        iconBg="#E2DFFF"
                        label="Manage Templates"
                        onPress={() => {}}
                        isLast
                    />
                </SettingsGroup>

                {/* SYSTEM */}
                <SettingsGroup title="System">
                    <SettingsRow
                        icon="moon-outline"
                        iconColor="#6366F1"
                        iconBg="#E2DFFF"
                        label="Theme"
                        switchValue={darkMode}
                        onSwitchChange={setDarkMode}
                    />
                    <SettingsRow
                        icon="log-out-outline"
                        iconColor="#EF4444"
                        iconBg="#FEE2E2"
                        label="Logout"
                        labelColor="#EF4444"
                        onPress={handleLogout}
                        isLast
                    />
                </SettingsGroup>

                {/* Footer */}
                <View style={{ alignItems: 'center', marginTop: 12 }}>
                    <Text
                        style={{
                            fontFamily: 'Inter_600SemiBold',
                            fontSize: 10,
                            color: '#9CA3AF',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                        }}
                    >
                        LifeOS Version 1.0.0
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Inter_400Regular',
                            fontSize: 10,
                            color: '#D1D5DB',
                            marginTop: 2,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                        }}
                    >
                        Made for Digital Focus
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
