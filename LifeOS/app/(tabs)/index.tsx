import React, { useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
    useUser,
    usePendingCheckins,
    useTopInsight,
    useRecentDecisions,
    dashboardKeys,
} from '@/hooks/useDashboard';
import type { PendingCheckin, Decision } from '@/services/dashboardService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ACTION_CARD_WIDTH = SCREEN_WIDTH * 0.62;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
}

function daysUntil(dateStr: string): string {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Overdue';
    if (days === 1) return 'Expires in 1d';
    return `Expires in ${days}d`;
}

function getCategoryIcon(category: string): React.ComponentProps<typeof Ionicons>['name'] {
    const map: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
        career: 'briefcase-outline',
        financial: 'wallet-outline',
        health: 'heart-outline',
        relationship: 'people-outline',
        education: 'school-outline',
        lifestyle: 'leaf-outline',
        technology: 'hardware-chip-outline',
    };
    return map[category] ?? 'ellipse-outline';
}

function getStatusLabel(status: string): string {
    const map: Record<string, string> = {
        active: 'In Progress',
        completed: 'Completed',
        archived: 'Archived',
        resolved: 'Resolved',
    };
    return map[status] ?? status;
}

function getStatusColor(status: string): string {
    const map: Record<string, string> = {
        active: '#F59E0B',
        completed: '#10B981',
        archived: '#6B7280',
        resolved: '#10B981',
    };
    return map[status] ?? '#6B7280';
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

const SkeletonBlock: React.FC<{ width: number | string; height: number; radius?: number; style?: any }> = ({
    width,
    height,
    radius = 12,
    style,
}) => (
    <View
        style={[
            {
                width,
                height,
                borderRadius: radius,
                backgroundColor: '#EDEEEF',
            },
            style,
        ]}
    />
);

// ─── Section: Header ──────────────────────────────────────────────────────────

const DashboardHeader: React.FC<{ firstName?: string }> = ({ firstName }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="menu-outline" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 20, color: '#111827', letterSpacing: -0.5 }}>
                LifeOS
            </Text>
        </View>
        <TouchableOpacity
            style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: '#E2DFFF',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#4F46E5' }}>
                {firstName ? firstName.charAt(0).toUpperCase() : '?'}
            </Text>
        </TouchableOpacity>
    </View>
);

// ─── Section: Greeting ────────────────────────────────────────────────────────

const Greeting: React.FC<{ firstName?: string; isLoading: boolean }> = ({ firstName, isLoading }) => (
    <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
        {isLoading ? (
            <>
                <SkeletonBlock width={220} height={36} style={{ marginBottom: 8 }} />
                <SkeletonBlock width={180} height={18} />
            </>
        ) : (
            <>
                <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 32, color: '#111827', letterSpacing: -1.5, lineHeight: 38 }}>
                    {getGreeting()}, {firstName ?? 'there'}
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: '#6B7280', marginTop: 4 }}>
                    Ready to optimize your day?
                </Text>
            </>
        )}
    </View>
);

// ─── Section: Action Required ─────────────────────────────────────────────────

const ActionCard: React.FC<{ item: PendingCheckin }> = ({ item }) => (
    <View
        style={{
            width: ACTION_CARD_WIDTH,
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 20,
            marginRight: 14,
            shadowColor: 'rgba(25,28,29,0.8)',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.04,
            shadowRadius: 16,
            elevation: 2,
            justifyContent: 'space-between',
            minHeight: 140,
        }}
    >
        <Text
            style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#111827', lineHeight: 22 }}
            numberOfLines={2}
        >
            {item.customMessage || 'Check-in Required'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#6B7280' }}>
                {daysUntil(item.scheduledDate)}
            </Text>
            <TouchableOpacity
                style={{
                    backgroundColor: '#111827',
                    borderRadius: 9999,
                    paddingHorizontal: 18,
                    paddingVertical: 8,
                }}
            >
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#FFFFFF' }}>
                    Review
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

const ActionRequired: React.FC<{ checkins: PendingCheckin[]; isLoading: boolean }> = ({ checkins, isLoading }) => (
    <View style={{ marginBottom: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 14 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Action Required
            </Text>
            {checkins.length > 0 && (
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#4F46E5' }}>
                    {checkins.length} item{checkins.length > 1 ? 's' : ''}
                </Text>
            )}
        </View>

        {isLoading ? (
            <View style={{ flexDirection: 'row', paddingLeft: 24 }}>
                <SkeletonBlock width={ACTION_CARD_WIDTH} height={140} style={{ marginRight: 14 }} />
                <SkeletonBlock width={ACTION_CARD_WIDTH} height={140} />
            </View>
        ) : checkins.length === 0 ? (
            <View style={{ paddingHorizontal: 24 }}>
                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center' }}>
                    <Ionicons name="checkmark-circle-outline" size={32} color="#10B981" />
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827', marginTop: 10 }}>
                        All caught up!
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                        No pending check-ins right now.
                    </Text>
                </View>
            </View>
        ) : (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 24, paddingRight: 10 }}
            >
                {checkins.map((item) => (
                    <ActionCard key={item.id} item={item} />
                ))}
            </ScrollView>
        )}
    </View>
);

// ─── Section: Quick Actions ───────────────────────────────────────────────────

const QuickActions: React.FC<{ onNewDecision: () => void; onAskAI: () => void }> = ({ onNewDecision, onAskAI }) => (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginBottom: 28 }}>
        <TouchableOpacity onPress={onNewDecision} style={{ flex: 1 }} activeOpacity={0.85}>
            <LinearGradient
                colors={['#3525CD', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    height: 50,
                    borderRadius: 9999,
                    shadowColor: '#4F46E5',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.22,
                    shadowRadius: 12,
                    elevation: 6,
                }}
            >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#FFFFFF' }}>
                    New Decision
                </Text>
            </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={onAskAI}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 50,
                borderRadius: 9999,
                borderWidth: 1.5,
                borderColor: '#E1E3E4',
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 22,
            }}
            activeOpacity={0.85}
        >
            <Ionicons name="sparkles-outline" size={18} color="#4F46E5" />
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#111827' }}>
                Ask AI
            </Text>
        </TouchableOpacity>
    </View>
);

// ─── Section: AI Reflection ───────────────────────────────────────────────────

const AIReflection: React.FC<{ insight: any | null; isLoading: boolean }> = ({ insight, isLoading }) => {
    if (isLoading) {
        return (
            <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
                <SkeletonBlock width="100%" height={160} radius={24} />
            </View>
        );
    }

    // Default content when no insights exist
    const title = insight?.title ?? 'Start making decisions to unlock AI insights';
    const description = insight?.description ?? 'Your personal AI advisor will analyze your decision patterns and provide personalized reflections here.';
    const dataPoints = insight?.dataPoints;

    return (
        <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
            <View
                style={{
                    backgroundColor: '#E8E6FF',
                    borderRadius: 24,
                    padding: 24,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <View
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: 'rgba(79,70,229,0.15)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="sparkles" size={14} color="#4F46E5" />
                    </View>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 10, color: '#4F46E5', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                        AI Reflection
                    </Text>
                </View>

                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, color: '#111827', lineHeight: 26, marginBottom: 14 }}>
                    {description}
                </Text>

                {dataPoints != null && (
                    <View
                        style={{
                            alignSelf: 'flex-start',
                            backgroundColor: 'rgba(79,70,229,0.1)',
                            borderRadius: 9999,
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                        }}
                    >
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#4F46E5' }}>
                            Based on {dataPoints} data points
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

// ─── Section: Recent Activity ─────────────────────────────────────────────────

const ActivityItem: React.FC<{ decision: Decision }> = ({ decision }) => (
    <TouchableOpacity
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 24,
        }}
        activeOpacity={0.7}
    >
        <View
            style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: '#F3F4F5',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
            }}
        >
            <Ionicons name={getCategoryIcon(decision.category)} size={20} color="#464555" />
        </View>
        <View style={{ flex: 1 }}>
            <Text
                style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#111827' }}
                numberOfLines={1}
            >
                {decision.title}
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                <Text style={{ color: getStatusColor(decision.status) }}>{getStatusLabel(decision.status)}</Text>
                {'  •  '}
                {timeAgo(decision.updatedAt)}
            </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C7C4D8" />
    </TouchableOpacity>
);

const RecentActivity: React.FC<{ decisions: Decision[]; isLoading: boolean }> = ({ decisions, isLoading }) => (
    <View style={{ marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 8 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Recent Activity
            </Text>
            {decisions.length > 0 && (
                <TouchableOpacity>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#4F46E5' }}>
                        View All
                    </Text>
                </TouchableOpacity>
            )}
        </View>

        {isLoading ? (
            <View style={{ paddingHorizontal: 24, gap: 12 }}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                        <SkeletonBlock width={42} height={42} radius={14} />
                        <View style={{ flex: 1, gap: 6 }}>
                            <SkeletonBlock width="70%" height={16} />
                            <SkeletonBlock width="50%" height={12} />
                        </View>
                    </View>
                ))}
            </View>
        ) : decisions.length === 0 ? (
            <View style={{ paddingHorizontal: 24 }}>
                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center' }}>
                    <Ionicons name="layers-outline" size={32} color="#C7C4D8" />
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827', marginTop: 10 }}>
                        No decisions yet
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7280', marginTop: 4, textAlign: 'center' }}>
                        Tap "New Decision" above to get started.
                    </Text>
                </View>
            </View>
        ) : (
            decisions.map((d) => <ActivityItem key={d.id} decision={d} />)
        )}
    </View>
);

// ─── Dashboard Screen ─────────────────────────────────────────────────────────

export default function DashboardScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: user, isLoading: userLoading } = useUser();
    const { data: checkins = [], isLoading: checkinsLoading } = usePendingCheckins();
    const { data: insight, isLoading: insightLoading } = useTopInsight();
    const { data: recentDecisions = [], isLoading: decisionsLoading } = useRecentDecisions();

    const isRefreshing = userLoading && checkinsLoading;

    const onRefresh = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: dashboardKeys.user });
        queryClient.invalidateQueries({ queryKey: dashboardKeys.pendingCheckins });
        queryClient.invalidateQueries({ queryKey: dashboardKeys.insights });
        queryClient.invalidateQueries({ queryKey: dashboardKeys.recentDecisions });
    }, [queryClient]);

    const handleNewDecision = () => {
        router.push('/(tabs)/decisions/new');
    };

    const handleAskAI = () => {
        router.push('/(tabs)/ai');
    };

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
                {/* Header */}
                <DashboardHeader firstName={user?.firstName} />

                {/* Greeting */}
                <Greeting firstName={user?.firstName} isLoading={userLoading} />

                {/* Action Required */}
                <ActionRequired checkins={checkins} isLoading={checkinsLoading} />

                {/* Quick Actions */}
                <QuickActions onNewDecision={handleNewDecision} onAskAI={handleAskAI} />

                {/* AI Reflection Card */}
                <AIReflection insight={insight} isLoading={insightLoading} />

                {/* Recent Activity Feed */}
                <RecentActivity decisions={recentDecisions} isLoading={decisionsLoading} />
            </ScrollView>
        </SafeAreaView>
    );
}