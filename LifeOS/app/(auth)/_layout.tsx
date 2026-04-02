import { Stack } from 'expo-router';

/**
 * Auth Stack Layout
 * Wraps /login and /register.
 * No header — screens self-manage navigation chrome.
 */
export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    );
}