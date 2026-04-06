import { Stack } from 'expo-router';

export default function DecisionsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="new"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    animation: 'slide_from_right',
                }}
            />
        </Stack>
    );
}
