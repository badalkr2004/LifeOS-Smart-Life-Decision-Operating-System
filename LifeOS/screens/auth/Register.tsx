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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types/navigation.types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

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
    flex?: number;
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
}) => {
    const [focused, setFocused] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setFocused(true);
        Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    };
    const handleBlur = () => {
        setFocused(false);
        Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    };

    const bgColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#F3F4F5', '#FFFFFF'],
    });

    return (
        <View className="mb-0 flex-1">
            {/* Label */}
            <Text
                className="text-[10px] font-bold uppercase mb-2 ml-1"
                style={{ color: '#464555', letterSpacing: 1.5 }}
            >
                {label}
            </Text>

            {/* Track */}
            <Animated.View
                style={{
                    backgroundColor: bgColor,
                    borderRadius: 16,
                    borderWidth: focused ? 1.5 : 0,
                    borderColor: focused ? 'rgba(79,70,229,0.25)' : 'transparent',
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
                    className="flex-1 text-sm"
                    style={{ color: '#111827', height: 56 }}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(119,117,135,0.5)"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
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

// ─── Step indicator ───────────────────────────────────────────────────────────

type StepDotProps = { active: boolean; completed: boolean };
const StepDot: React.FC<StepDotProps> = ({ active, completed }) => (
    <View
        style={{
            width: active ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: completed || active ? '#4F46E5' : '#E1E3E4',
            marginHorizontal: 3,
            // smooth transition is handled by conditional render; for animated version use Animated.Value
        }}
    />
);

// ─── Register Screen ──────────────────────────────────────────────────────────

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const [step, setStep] = useState(1); // 2-step form
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

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
            return;
        }
        // Step 2: submit
        handleSignUp();
    };

    const handleSignUp = async () => {
        setIsLoading(true);
        // TODO: call authService.register({ firstName, lastName, email, password })
        // On success, navigate to Login or directly to MainTabNav
        setTimeout(() => setIsLoading(false), 1500); // placeholder
    };

    const canProceedStep1 = firstName.trim() && lastName.trim();
    const canProceedStep2 =
        email.trim() && password.length >= 8 && password === confirmPassword;
    const canProceed = step === 1 ? canProceedStep1 : canProceedStep2;

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* ── Back button ── */}
            <TouchableOpacity
                onPress={() => (step === 2 ? setStep(1) : navigation.goBack())}
                className="mx-6 mt-2 self-start p-2 rounded-full"
                style={{ backgroundColor: '#EDEEEF' }}
            >
                <Ionicons name="arrow-back" size={20} color="#111827" />
            </TouchableOpacity>

            <KeyboardAvoidingView
                className="flex-1"
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
                    <View className="mb-10">
                        {/* Step indicator pills */}
                        <View className="flex-row items-center mb-6">
                            <StepDot active={step === 1} completed={step > 1} />
                            <StepDot active={step === 2} completed={false} />
                        </View>

                        <Text
                            className="text-3xl font-black tracking-tight mb-1"
                            style={{ color: '#111827', letterSpacing: -1 }}
                        >
                            {step === 1 ? "What's your name?" : 'Secure your account'}
                        </Text>
                        <Text className="text-sm font-medium" style={{ color: '#6B7280' }}>
                            {step === 1
                                ? 'Step 1 of 2 — Tell us who you are.'
                                : 'Step 2 of 2 — Set your login credentials.'}
                        </Text>
                    </View>

                    {/* ── Step 1: Name ── */}
                    {step === 1 && (
                        <View>
                            {/* Card surface — lifted white card on gray bg */}
                            <View
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 24,
                                    padding: 24,
                                    shadowColor: 'rgba(25,28,29,0.06)',
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 1,
                                    shadowRadius: 24,
                                    elevation: 4,
                                }}
                            >
                                {/* First & Last Name side by side */}
                                <View className="flex-row gap-4 mb-5">
                                    <InputField
                                        label="First Name"
                                        placeholder="Jane"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        icon="person-outline"
                                        autoCapitalize="words"
                                    />
                                    <View className="w-4" />
                                    <InputField
                                        label="Last Name"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        icon="person-outline"
                                        autoCapitalize="words"
                                    />
                                </View>

                                {/* Tagline inside card */}
                                <View
                                    className="flex-row items-center rounded-2xl p-4 mt-2"
                                    style={{ backgroundColor: 'rgba(79,70,229,0.05)' }}
                                >
                                    <Ionicons name="sparkles-outline" size={16} color="#4F46E5" />
                                    <Text
                                        className="ml-2 text-xs font-medium flex-1"
                                        style={{ color: '#4F46E5', lineHeight: 18 }}
                                    >
                                        LifeOS personalises your insights and AI interactions using your name.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* ── Step 2: Credentials ── */}
                    {step === 2 && (
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 24,
                                padding: 24,
                                shadowColor: 'rgba(25,28,29,0.06)',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 1,
                                shadowRadius: 24,
                                elevation: 4,
                            }}
                        >
                            {/* Email */}
                            <View className="mb-5">
                                <Text
                                    className="text-[10px] font-bold uppercase mb-2 ml-1"
                                    style={{ color: '#464555', letterSpacing: 1.5 }}
                                >
                                    Email Address
                                </Text>
                                <EmailInput value={email} onChangeText={setEmail} />
                            </View>

                            {/* Password */}
                            <View className="mb-5">
                                <InputField
                                    label="Password"
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChangeText={setPassword}
                                    icon="lock-closed-outline"
                                    secureTextEntry={!showPassword}
                                    rightElement={
                                        <TouchableOpacity onPress={() => setShowPassword(p => !p)} hitSlop={8}>
                                            <Ionicons
                                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                                size={17}
                                                color="#777587"
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                            </View>

                            {/* Confirm Password */}
                            <View>
                                <InputField
                                    label="Confirm Password"
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    icon="shield-checkmark-outline"
                                    secureTextEntry={!showConfirm}
                                    rightElement={
                                        <TouchableOpacity onPress={() => setShowConfirm(p => !p)} hitSlop={8}>
                                            <Ionicons
                                                name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                                                size={17}
                                                color="#777587"
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                            </View>

                            {/* Password strength hint */}
                            {password.length > 0 && (
                                <PasswordStrength password={password} />
                            )}
                        </View>
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
                                colors={
                                    canProceed
                                        ? ['#3525CD', '#4F46E5']
                                        : ['#D1D5DB', '#D1D5DB']
                                }
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
                                        <Text className="text-white font-bold text-base">
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
                    <View className="items-center mt-10">
                        <Text className="text-sm font-medium mb-3" style={{ color: '#6B7280' }}>
                            Already have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="px-8 py-3 rounded-full"
                            style={{ backgroundColor: 'rgba(79,70,229,0.06)' }}
                        >
                            <Text className="font-bold text-sm" style={{ color: '#4F46E5' }}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ─── Email Input (standalone for full-width row) ───────────────────────────────

const EmailInput: React.FC<{ value: string; onChangeText: (t: string) => void }> = ({
    value,
    onChangeText,
}) => {
    const [focused, setFocused] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;
    const bgColor = anim.interpolate({ inputRange: [0, 1], outputRange: ['#F3F4F5', '#FFFFFF'] });

    return (
        <Animated.View
            style={{
                backgroundColor: bgColor,
                borderRadius: 16,
                borderWidth: focused ? 1.5 : 0,
                borderColor: focused ? 'rgba(79,70,229,0.25)' : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                height: 56,
                paddingHorizontal: 16,
            }}
        >
            <Ionicons
                name="mail-outline"
                size={17}
                color={focused ? '#4F46E5' : '#777587'}
                style={{ marginRight: 10 }}
            />
            <TextInput
                className="flex-1 text-sm"
                style={{ color: '#111827', height: 56 }}
                placeholder="jane@example.com"
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
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
        </Animated.View>
    );
};

// ─── Password Strength Bar ────────────────────────────────────────────────────

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
    const getStrength = (): { score: number; label: string; color: string } => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        const map = [
            { label: 'Weak', color: '#EF4444' },
            { label: 'Fair', color: '#F59E0B' },
            { label: 'Good', color: '#10B981' },
            { label: 'Strong', color: '#10B981' },
        ];
        return { score, ...(map[Math.max(0, score - 1)] ?? map[0]) };
    };

    const { score, label, color } = getStrength();

    return (
        <View className="mt-4">
            <View className="flex-row gap-1 mb-1">
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
            <Text className="text-[10px] font-semibold mt-1" style={{ color, letterSpacing: 0.5 }}>
                {label} password
            </Text>
        </View>
    );
};

export default RegisterScreen;