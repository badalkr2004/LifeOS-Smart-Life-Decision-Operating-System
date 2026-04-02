import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * MainTabNav — Bottom Tab Layout
 * Screens are lazy-loaded by Expo Router from the (tabs)/ folder.
 */
export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 64,
                    paddingBottom: 10,
                },
                tabBarActiveTintColor: '#4F46E5',
                tabBarInactiveTintColor: '#777587',
                tabBarLabelStyle: {
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 10,
                    letterSpacing: 0.5,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="decisions"
                options={{
                    title: 'Decisions',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="scale-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="ai"
                options={{
                    title: 'AI Advisor',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="sparkles-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Analytics',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bar-chart-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}