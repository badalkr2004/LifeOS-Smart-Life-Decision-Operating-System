import { Stack } from 'expo-router';

export default function AiLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="history" />
        </Stack>
    );
}
