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
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

// ─── Focusable Input ──────────────────────────────────────────────────────────

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
        <View className="mb-5">
            {/* Label */}
            <Text
                className="text-[10px] font-bold uppercase tracking-widest mb-2 ml-4"
                style={{ color: '#464555', letterSpacing: 1.5 }}
            >
                {label}
            </Text>

            {/* Input Track */}
            <Animated.View
                style={{
                    backgroundColor: bgColor,
                    borderRadius: 9999,
                    borderWidth: focused ? 1.5 : 0,
                    borderColor: focused ? 'rgba(79, 70, 229, 0.25)' : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 56,
                    paddingHorizontal: 18,
                }}
            >
                <Ionicons
                    name={icon}
                    size={18}
                    color={focused ? '#4F46E5' : '#777587'}
                    style={{ marginRight: 10 }}
                />
                <TextInput
                    className="flex-1 text-base"
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

// ─── Login Screen ─────────────────────────────────────────────────────────────

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Subtle button press animation
    const buttonScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () =>
        Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start();
    const handlePressOut = () =>
        Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

    const handleSignIn = async () => {
        setIsLoading(true);
        // TODO: call authService.login({ email, password })
        // On success, authStore.setTokens(...) and navigate to MainTabNav
        setTimeout(() => setIsLoading(false), 1500); // placeholder
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 48 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Logo Section ── */}
                    <View className="items-center mb-14">
                        {/* Gradient icon badge */}
                        <LinearGradient
                            colors={['#3525CD', '#4F46E5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 22,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 22,
                                shadowColor: '#4F46E5',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.25,
                                shadowRadius: 20,
                                elevation: 8,
                            }}
                        >
                            <Ionicons name="layers" size={40} color="#FFFFFF" />
                        </LinearGradient>

                        <Text
                            className="text-5xl font-black tracking-tighter"
                            style={{ color: '#111827', letterSpacing: -2 }}
                        >
                            LifeOS
                        </Text>
                        <Text
                            className="text-[10px] font-semibold uppercase mt-1"
                            style={{ color: '#6B7280', letterSpacing: 3 }}
                        >
                            The Digital Sanctuary
                        </Text>
                    </View>

                    {/* ── Form ── */}
                    <View>
                        <InputField
                            label="Email Address"
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={setEmail}
                            icon="mail-outline"
                            keyboardType="email-address"
                        />

                        <InputField
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            icon="lock-closed-outline"
                            secureTextEntry={!showPassword}
                            rightElement={
                                <TouchableOpacity onPress={() => setShowPassword(p => !p)} hitSlop={8}>
                                    <Ionicons
                                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                        size={18}
                                        color="#777587"
                                    />
                                </TouchableOpacity>
                            }
                        />

                        {/* Forgot password */}
                        <TouchableOpacity className="self-end -mt-2 mb-8 pr-2">
                            <Text className="text-xs font-semibold" style={{ color: 'rgba(79,70,229,0.75)' }}>
                                Forgot password?
                            </Text>
                        </TouchableOpacity>

                        {/* CTA */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={handleSignIn}
                                disabled={isLoading}
                                activeOpacity={1}
                            >
                                <LinearGradient
                                    colors={['#3525CD', '#4F46E5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        height: 58,
                                        borderRadius: 9999,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        gap: 8,
                                        shadowColor: '#4F46E5',
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.28,
                                        shadowRadius: 16,
                                        elevation: 8,
                                    }}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Text className="text-white font-bold text-base">Sign In</Text>
                                            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {/* ── Footer ── */}
                    <View className="items-center mt-14">
                        <Text className="text-sm font-medium mb-3" style={{ color: '#6B7280' }}>
                            New to the sanctuary?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            className="px-8 py-3 rounded-full"
                            style={{ backgroundColor: 'rgba(79,70,229,0.06)' }}
                        >
                            <Text className="font-bold text-sm" style={{ color: '#4F46E5' }}>
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── Ambient glow (decorative) ── */}
                    <View
                        className="absolute -bottom-20 self-center"
                        style={{
                            width: 300,
                            height: 300,
                            borderRadius: 150,
                            backgroundColor: 'rgba(79,70,229,0.05)',
                            // blur is not supported in RN without a library; this creates a soft tint
                        }}
                        pointerEvents="none"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;