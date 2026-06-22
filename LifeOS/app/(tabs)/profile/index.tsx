import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/authStore';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { SettingsGroup, SettingsRow } from '@/components/profile/SettingsGroup';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';

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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.xxxl }}>
                {/* Avatar + Name */}
                <View style={{ paddingTop: SPACING.xl }}>
                    <ProfileAvatar firstName={user?.firstName} lastName={user?.lastName} email={user?.email} onEdit={() => router.push('/(tabs)/profile/edit')} />
                </View>

                {/* Quick stats row */}
                <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xxl }}>
                    <View style={{ flex: 1, backgroundColor: COLORS.primaryFixed, borderRadius: RADII.md, padding: SPACING.md, alignItems: 'center' }}>
                        <Ionicons name="person-outline" size={20} color={COLORS.primary} />
                        <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.primary, marginTop: SPACING.xs }]}>Profile</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: COLORS.primaryFixed, borderRadius: RADII.md, padding: SPACING.md, alignItems: 'center' }}>
                        <Ionicons name="layers-outline" size={20} color={COLORS.primary} />
                        <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.primary, marginTop: SPACING.xs }]}>Decisions</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: COLORS.primaryFixed, borderRadius: RADII.md, padding: SPACING.md, alignItems: 'center' }}>
                        <Ionicons name="sparkles-outline" size={20} color={COLORS.primary} />
                        <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.primary, marginTop: SPACING.xs }]}>AI</Text>
                    </View>
                </View>

                {/* ACCOUNT */}
                <SettingsGroup title="Account">
                    <SettingsRow icon="person-outline" label="Edit Profile" onPress={() => router.push('/(tabs)/profile/edit')} />
                    <SettingsRow icon="notifications-outline" iconColor="#F59E0B" iconBg="#FEF3C7" label="Notification Preferences" onPress={() => router.push('/(tabs)/profile/edit')} isLast />
                </SettingsGroup>

                {/* LIBRARY */}
                <SettingsGroup title="Library">
                    <SettingsRow icon="grid-outline" iconColor={COLORS.primary} iconBg={COLORS.primaryFixed} label="Manage Frameworks" onPress={() => router.push('/(tabs)/profile/frameworks')} />
                    <SettingsRow icon="document-text-outline" iconColor={COLORS.primary} iconBg={COLORS.primaryFixed} label="Manage Templates" onPress={() => router.push('/(tabs)/profile/frameworks')} isLast />
                </SettingsGroup>

                {/* SYSTEM */}
                <SettingsGroup title="System">
                    <SettingsRow icon="moon-outline" iconColor="#6366F1" iconBg={COLORS.primaryFixed} label="Dark Mode" switchValue={darkMode} onSwitchChange={setDarkMode} />
                    <SettingsRow icon="log-out-outline" iconColor={COLORS.danger} iconBg={COLORS.dangerBg} label="Sign Out" labelColor={COLORS.danger} onPress={handleLogout} isLast />
                </SettingsGroup>

                {/* Footer */}
                <View style={{ alignItems: 'center', marginTop: SPACING.lg }}>
                    <Text style={[TYPOGRAPHY.label, { color: '#9CA3AF', letterSpacing: 1 }]}>
                        LifeOS
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
