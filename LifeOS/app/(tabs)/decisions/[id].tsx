import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ViewDecisionScreen() {
    const { id } = useLocalSearchParams();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Decision ID: {id}</Text>
        </View>
    );
}