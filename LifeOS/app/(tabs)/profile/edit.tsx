import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser, useUserProfile, useUpdateUser, useUpdateProfile } from '@/hooks/useProfile';

// ─── Reusable Input ───────────────────────────────────────────────────────────

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
    autoCapitalize?: React.ComponentProps<typeof TextInput>['autoCapitalize'];
};

const FormField: React.FC<FieldProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
}) => (
    <View style={{ marginBottom: 20 }}>
        <Text
            style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 10,
                color: '#464555',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 8,
                marginLeft: 4,
            }}
        >
            {label}
        </Text>
        <TextInput
            style={{
                backgroundColor: '#F3F4F5',
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: multiline ? 14 : 0,
                height: multiline ? 100 : 52,
                fontSize: 15,
                fontFamily: 'Inter_400Regular',
                color: '#111827',
                textAlignVertical: multiline ? 'top' : 'center',
            }}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            multiline={multiline}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
        />
    </View>
);

// ─── Edit Profile Screen ──────────────────────────────────────────────────────

export default function EditProfileScreen() {
    const router = useRouter();

    const { data: user, isLoading: userLoading } = useUser();
    const { data: profile, isLoading: profileLoading } = useUserProfile();
    const updateUser = useUpdateUser();
    const updateProfile = useUpdateProfile();

    // ─── Form State ───────────────────────────────────────────────────────
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [occupation, setOccupation] = useState('');
    const [location, setLocation] = useState('');

    // Populate form when data loads
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName ?? '');
            setLastName(user.lastName ?? '');
            setDisplayName(user.displayName ?? '');
        }
    }, [user]);

    useEffect(() => {
        if (profile) {
            setBio(profile.bio ?? '');
            setOccupation(profile.occupation ?? '');
            setLocation(profile.location ?? '');
        }
    }, [profile]);

    const isLoading = userLoading || profileLoading;
    const isSaving = updateUser.isPending || updateProfile.isPending;

    const handleSave = async () => {
        if (isSaving) return;

        try {
            // Update user info and profile in parallel
            await Promise.all([
                updateUser.mutateAsync({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    displayName: displayName.trim() || `${firstName.trim()} ${lastName.trim()}`.trim(),
                }),
                updateProfile.mutateAsync({
                    bio: bio.trim() || null,
                    occupation: occupation.trim() || null,
                    location: location.trim() || null,
                }),
            ]);

            Alert.alert('Success', 'Profile updated successfully.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (error: any) {
            Alert.alert(
                'Update Failed',
                error?.response?.data?.error ?? 'Something went wrong. Please try again.',
            );
        }
    };

    const hasChanges =
        firstName !== (user?.firstName ?? '') ||
        lastName !== (user?.lastName ?? '') ||
        displayName !== (user?.displayName ?? '') ||
        bio !== (profile?.bio ?? '') ||
        occupation !== (profile?.occupation ?? '') ||
        location !== (profile?.location ?? '');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        padding: 8,
                        borderRadius: 9999,
                        backgroundColor: '#EDEEEF',
                    }}
                >
                    <Ionicons name="arrow-back" size={20} color="#111827" />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: 'Inter_700Bold',
                        fontSize: 17,
                        color: '#111827',
                    }}
                >
                    Edit Profile
                </Text>
                <View style={{ width: 36 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 16,
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {isLoading ? (
                        <View style={{ paddingTop: 60, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#4F46E5" />
                        </View>
                    ) : (
                        <>
                            {/* Personal Info Card */}
                            <View
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 24,
                                    padding: 24,
                                    marginBottom: 20,
                                    shadowColor: 'rgba(25,28,29,0.8)',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.03,
                                    shadowRadius: 16,
                                    elevation: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Inter_700Bold',
                                        fontSize: 11,
                                        color: '#464555',
                                        letterSpacing: 1.5,
                                        textTransform: 'uppercase',
                                        marginBottom: 18,
                                    }}
                                >
                                    Personal Info
                                </Text>

                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <View style={{ flex: 1 }}>
                                        <FormField
                                            label="First Name"
                                            value={firstName}
                                            onChangeText={setFirstName}
                                            placeholder="Jane"
                                            autoCapitalize="words"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <FormField
                                            label="Last Name"
                                            value={lastName}
                                            onChangeText={setLastName}
                                            placeholder="Doe"
                                            autoCapitalize="words"
                                        />
                                    </View>
                                </View>

                                <FormField
                                    label="Display Name"
                                    value={displayName}
                                    onChangeText={setDisplayName}
                                    placeholder="How should we call you?"
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Profile Details Card */}
                            <View
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 24,
                                    padding: 24,
                                    marginBottom: 28,
                                    shadowColor: 'rgba(25,28,29,0.8)',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.03,
                                    shadowRadius: 16,
                                    elevation: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Inter_700Bold',
                                        fontSize: 11,
                                        color: '#464555',
                                        letterSpacing: 1.5,
                                        textTransform: 'uppercase',
                                        marginBottom: 18,
                                    }}
                                >
                                    About You
                                </Text>

                                <FormField
                                    label="Bio"
                                    value={bio}
                                    onChangeText={setBio}
                                    placeholder="Tell us about yourself..."
                                    multiline
                                />

                                <FormField
                                    label="Occupation"
                                    value={occupation}
                                    onChangeText={setOccupation}
                                    placeholder="e.g. Software Engineer"
                                    autoCapitalize="words"
                                />

                                <FormField
                                    label="Location"
                                    value={location}
                                    onChangeText={setLocation}
                                    placeholder="e.g. San Francisco, CA"
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Save Button */}
                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={!hasChanges || isSaving}
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={hasChanges ? ['#3525CD', '#4F46E5'] : ['#D1D5DB', '#D1D5DB']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        height: 56,
                                        borderRadius: 9999,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        gap: 8,
                                        shadowColor: hasChanges ? '#4F46E5' : 'transparent',
                                        shadowOffset: { width: 0, height: 6 },
                                        shadowOpacity: 0.22,
                                        shadowRadius: 12,
                                        elevation: hasChanges ? 6 : 0,
                                    }}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                            <Text
                                                style={{
                                                    fontFamily: 'Inter_700Bold',
                                                    fontSize: 16,
                                                    color: '#FFFFFF',
                                                }}
                                            >
                                                Save Changes
                                            </Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
