import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from "@/store/authStore";
import '../global.css';

// ─── Keep splash visible until everything is ready ───────────────────────────
SplashScreen.preventAutoHideAsync();

// ─── React Query client ───────────────────────────────────────────────────────
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5,
        },
    },
});

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout() {
    const { accessToken, isHydrated, hydrate } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });

    // Hydrate auth tokens from SecureStore on mount
    useEffect(() => {
        hydrate();
    }, []);

    // Hide splash once fonts + auth state are ready
    useEffect(() => {
        if (fontsLoaded && isHydrated) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, isHydrated]);

    // Auth redirect — only runs after hydration completes
    useEffect(() => {
        if (!isHydrated) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!accessToken && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (accessToken && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [accessToken, segments, isHydrated]);

    // ⚠️ Always render the Stack — expo-router breaks if you return null
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                </Stack>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}