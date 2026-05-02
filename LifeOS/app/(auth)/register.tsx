import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    StatusBar,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

// ─── Reusable Input ───────────────────────────────────────────────────────────

type InputFieldProps = {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    secureTextEntry?: boolean;
    keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
    autoCapitalize?: React.ComponentProps<typeof TextInput>['autoCapitalize'];
    rightElement?: React.ReactNode;
    pill?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    icon,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'none',
    rightElement,
    pill = false,
}) => {
    const [focused, setFocused] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;
    const bgColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#F3F4F5', '#FFFFFF'],
    });

    return (
        <View style={{ flex: 1 }}>
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
            <Animated.View
                style={{
                    backgroundColor: bgColor,
                    borderRadius: pill ? 9999 : 16,
                    borderWidth: focused ? 1.5 : 0,
                    borderColor: 'rgba(79,70,229,0.25)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 56,
                    paddingHorizontal: 16,
                }}
            >
                <Ionicons
                    name={icon}
                    size={17}
                    color={focused ? '#4F46E5' : '#777587'}
                    style={{ marginRight: 10 }}
                />
                <TextInput
                    style={{
                        flex: 1,
                        fontSize: 14,
                        color: '#111827',
                        height: 56,
                        fontFamily: 'Inter_400Regular',
                    }}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(119,117,135,0.5)"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => {
                        setFocused(true);
                        Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
                    }}
                    onBlur={() => {
                        setFocused(false);
                        Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
                    }}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                />
                {rightElement}
            </Animated.View>
        </View>
    );
};

// ─── Step Dots ────────────────────────────────────────────────────────────────

const StepDots: React.FC<{ step: number; total: number }> = ({ step, total }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        {Array.from({ length: total }).map((_, i) => (
            <View
                key={i}
                style={{
                    width: i + 1 === step ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i + 1 <= step ? '#4F46E5' : '#E1E3E4',
                    marginRight: 6,
                }}
            />
        ))}
    </View>
);

// ─── Password Strength ────────────────────────────────────────────────────────

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
    const getStrength = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        const labels = ['Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['#EF4444', '#F59E0B', '#10B981', '#10B981'];
        return { score, label: labels[score - 1] ?? 'Weak', color: colors[score - 1] ?? '#EF4444' };
    };

    const { score, label, color } = getStrength();

    return (
        <View style={{ marginTop: 12, marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map(i => (
                    <View
                        key={i}
                        style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            backgroundColor: i <= score ? color : '#E1E3E4',
                        }}
                    />
                ))}
            </View>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color, letterSpacing: 0.5 }}>
                {label} password
            </Text>
        </View>
    );
};

// ─── Card wrapper (lifted white surface) ──────────────────────────────────────

const SurfaceCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <View
        style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 24,
            shadowColor: 'rgba(25,28,29,1)',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.06,
            shadowRadius: 24,
            elevation: 4,
        }}
    >
        {children}
    </View>
);

// ─── Register Screen ──────────────────────────────────────────────────────────

export default function RegisterScreen() {
    const router = useRouter();
    const { setTokens } = useAuthStore();

    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const buttonScale = useRef(new Animated.Value(1)).current;
    const handlePressIn = () =>
        Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start();
    const handlePressOut = () =>
        Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

    const canProceedStep1 = firstName.trim().length > 0 && lastName.trim().length > 0;
    const canProceedStep2 =
        email.trim().length > 0 &&
        password.length >= 8 &&
        password === confirmPassword;

    const canProceed = step === 1 ? canProceedStep1 : canProceedStep2;

    const handleNext = async () => {
        if (!canProceed || isLoading) return;
        if (step === 1) {
            setStep(2);
            return;
        }
        // Step 2: submit
        setIsLoading(true);
        try {
            const { accessToken, refreshToken } = await authService.register({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
            });
            // AuthGuard will auto-redirect to /(tabs) once tokens are set
            await setTokens(accessToken, refreshToken);
        } catch (error: any) {
            Alert.alert(
                'Registration Failed',
                error?.response?.data?.message ?? 'Something went wrong. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Back button */}
            <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={{ alignSelf: 'flex-start', padding: 8, borderRadius: 9999, backgroundColor: '#EDEEEF' }}
                >
                    <Ionicons name="arrow-back" size={20} color="#111827" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 28,
                        paddingTop: 28,
                        paddingBottom: 48,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Header ── */}
                    <View style={{ marginBottom: 32 }}>
                        <StepDots step={step} total={2} />

                        <Text
                            style={{
                                fontFamily: 'Inter_900Black',
                                fontSize: 30,
                                color: '#111827',
                                letterSpacing: -1,
                                marginBottom: 6,
                            }}
                        >
                            {step === 1 ? "What's your name?" : 'Secure your account'}
                        </Text>
                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#6B7280' }}>
                            {step === 1
                                ? 'Step 1 of 2 — Tell us who you are.'
                                : 'Step 2 of 2 — Set your login credentials.'}
                        </Text>
                    </View>

                    {/* ── Step 1: Name ── */}
                    {step === 1 && (
                        <SurfaceCard>
                            {/* First + Last Name row */}
                            <View style={{ flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                                <InputField
                                    label="First"
                                    placeholder="Jane"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    icon="person-outline"
                                    autoCapitalize="words"
                                />
                                <View style={{ width: 12 }} />
                                <InputField
                                    label="Last"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    icon="person-outline"
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Info chip */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 16,
                                    padding: 16,
                                    backgroundColor: 'rgba(79,70,229,0.05)',
                                }}
                            >
                                <Ionicons name="sparkles-outline" size={15} color="#4F46E5" />
                                <Text
                                    style={{
                                        fontFamily: 'Inter_500Medium',
                                        fontSize: 12,
                                        color: '#4F46E5',
                                        marginLeft: 8,
                                        flex: 1,
                                        lineHeight: 18,
                                    }}
                                >
                                    LifeOS uses your name to personalise AI insights and check-in reminders.
                                </Text>
                            </View>
                        </SurfaceCard>
                    )}

                    {/* ── Step 2: Credentials ── */}
                    {step === 2 && (
                        <SurfaceCard>
                            {/* Email */}
                            <View style={{ marginBottom: 20 }}>
                                <InputField
                                    label="Email Address"
                                    placeholder="jane@example.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    icon="mail-outline"
                                    keyboardType="email-address"
                                />
                            </View>

                            {/* Password */}
                            <View style={{ marginBottom: 8 }}>
                                <InputField
                                    label="Password"
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChangeText={setPassword}
                                    icon="lock-closed-outline"
                                    secureTextEntry={!showPassword}
                                    rightElement={
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(p => !p)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        >
                                            <Ionicons
                                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                                size={17}
                                                color="#777587"
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                                {password.length > 0 && <PasswordStrength password={password} />}
                            </View>

                            {/* Confirm */}
                            <View style={{ marginTop: 12 }}>
                                <InputField
                                    label="Confirm Password"
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    icon="shield-checkmark-outline"
                                    secureTextEntry={!showConfirm}
                                    rightElement={
                                        <TouchableOpacity
                                            onPress={() => setShowConfirm(p => !p)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        >
                                            <Ionicons
                                                name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                                                size={17}
                                                color="#777587"
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                                {/* Mismatch hint */}
                                {confirmPassword.length > 0 && password !== confirmPassword && (
                                    <Text
                                        style={{
                                            fontFamily: 'Inter_500Medium',
                                            fontSize: 11,
                                            color: '#EF4444',
                                            marginTop: 6,
                                            marginLeft: 4,
                                        }}
                                    >
                                        Passwords do not match
                                    </Text>
                                )}
                            </View>
                        </SurfaceCard>
                    )}

                    {/* ── CTA ── */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 28 }}>
                        <TouchableOpacity
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleNext}
                            disabled={!canProceed || isLoading}
                            activeOpacity={1}
                        >
                            <LinearGradient
                                colors={canProceed ? ['#3525CD', '#4F46E5'] : ['#D1D5DB', '#D1D5DB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    height: 58,
                                    borderRadius: 9999,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: 8,
                                    shadowColor: canProceed ? '#4F46E5' : 'transparent',
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.28,
                                    shadowRadius: 16,
                                    elevation: canProceed ? 8 : 0,
                                }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Text
                                            style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#FFFFFF' }}
                                        >
                                            {step === 1 ? 'Continue' : 'Create Account'}
                                        </Text>
                                        <Ionicons
                                            name={step === 1 ? 'arrow-forward' : 'checkmark'}
                                            size={18}
                                            color="#FFFFFF"
                                        />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* ── Footer ── */}
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <Text
                            style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#6B7280', marginBottom: 12 }}
                        >
                            Already have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ paddingHorizontal: 32, paddingVertical: 12, borderRadius: 9999, backgroundColor: 'rgba(79,70,229,0.06)' }}
                        >
                            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#4F46E5' }}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}