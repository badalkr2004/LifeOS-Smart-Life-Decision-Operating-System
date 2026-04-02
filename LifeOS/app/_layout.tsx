import { Stack } from 'expo-router';
import '../global.css';

// ─── DIAGNOSTIC: Minimal layout to isolate blank screen ───────────────────────
// If this STILL shows blank → the issue is in child screens or global.css
// If this WORKS → the issue is in providers/auth/fonts

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
        </Stack>
    );
}