import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Dashboard — Tab 1
 * Placeholder until DashboardScreen is built.
 */
export default function DashboardScreen() {
    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
            <View className="flex-1 items-center justify-center">
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: '#111827' }}>
                    Dashboard
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', color: '#6B7280', marginTop: 8 }}>
                    Coming soon
                </Text>
            </View>
        </SafeAreaView>
    );
}