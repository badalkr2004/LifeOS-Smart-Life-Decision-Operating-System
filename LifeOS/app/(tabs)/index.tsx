/**
 * Dashboard Screen — Home tab
 *
 * Thin compositor: fetches data via hooks and delegates
 * rendering to dedicated section components.
 */

import React, { useCallback } from 'react';
import { ScrollView, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
    useUser,
    usePendingCheckins,
    useTopInsight,
    useRecentDecisions,
    dashboardKeys,
} from '@/hooks/useDashboard';

import {
    DashboardHeader,
    Greeting,
    ActionRequired,
    QuickActions,
    AIReflection,
    RecentActivity,
} from '@/components/dashboard';

export default function DashboardScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: user, isLoading: userLoading } = useUser();
    const { data: checkins = [], isLoading: checkinsLoading } = usePendingCheckins();
    const { data: insight, isLoading: insightLoading } = useTopInsight();
    const { data: recentDecisions = [], isLoading: decisionsLoading } = useRecentDecisions();

    const isRefreshing = userLoading || checkinsLoading;

    const onRefresh = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: dashboardKeys.user });
        queryClient.invalidateQueries({ queryKey: dashboardKeys.pendingCheckins });
        queryClient.invalidateQueries({ queryKey: dashboardKeys.insights });
        queryClient.invalidateQueries({ queryKey: dashboardKeys.recentDecisions });
    }, [queryClient]);

    const handleNewDecision = () => router.push('/(tabs)/decisions/new');
    const handleAskAI = () => router.push('/(tabs)/ai');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor="#4F46E5"
                        colors={['#4F46E5']}
                    />
                }
            >
                <DashboardHeader firstName={user?.firstName} />
                <Greeting firstName={user?.firstName} isLoading={userLoading} />
                <ActionRequired checkins={checkins} isLoading={checkinsLoading} />
                <QuickActions onNewDecision={handleNewDecision} onAskAI={handleAskAI} />
                <AIReflection insight={insight} isLoading={insightLoading} />
                <RecentActivity decisions={recentDecisions} isLoading={decisionsLoading} />
            </ScrollView>
        </SafeAreaView>
    );
}