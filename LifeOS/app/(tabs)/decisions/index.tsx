import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    TextInput,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useDecisions, decisionKeys } from '@/hooks/useDecisions';
import type { Decision } from '@/services/decisionService';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
    { key: '', label: 'All', icon: 'apps-outline' as const },
    { key: 'career', label: 'Career', icon: 'briefcase-outline' as const },
    { key: 'health', label: 'Health', icon: 'heart-outline' as const },
    { key: 'financial', label: 'Finance', icon: 'wallet-outline' as const },
    { key: 'relationship', label: 'Relations', icon: 'people-outline' as const },
    { key: 'education', label: 'Education', icon: 'school-outline' as const },
    { key: 'lifestyle', label: 'Lifestyle', icon: 'leaf-outline' as const },
    { key: 'business', label: 'Business', icon: 'trending-up-outline' as const },
    { key: 'personal_growth', label: 'Growth', icon: 'rocket-outline' as const },
];

const STATUS_FILTERS = [
    { key: '', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'archived', label: 'Archived' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryIcon(category: string): React.ComponentProps<typeof Ionicons>['name'] {
    const map: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
        career: 'briefcase',
        financial: 'wallet',
        health: 'heart',
        relationship: 'people',
        education: 'school',
        lifestyle: 'leaf',
        technology: 'hardware-chip',
        business: 'trending-up',
        personal_growth: 'rocket',
        family: 'home',
    };
    return map[category] ?? 'ellipse';
}

function getCategoryColor(category: string): string {
    const map: Record<string, string> = {
        career: '#4F46E5',
        financial: '#059669',
        health: '#DC2626',
        relationship: '#7C3AED',
        education: '#2563EB',
        lifestyle: '#16A34A',
        business: '#EA580C',
        personal_growth: '#0891B2',
        family: '#DB2777',
    };
    return map[category] ?? '#6B7280';
}

function getStatusLabel(status: string): string {
    const map: Record<string, string> = {
        active: 'Active',
        archived: 'Archived',
        superseded: 'Superseded',
        completed: 'Completed',
    };
    return map[status] ?? status;
}

function getStatusColor(status: string): string {
    const map: Record<string, string> = {
        active: '#10B981',
        archived: '#6B7280',
        superseded: '#F59E0B',
        completed: '#4F46E5',
    };
    return map[status] ?? '#6B7280';
}

function getConfidenceColor(level: number): string {
    if (level >= 8) return '#10B981';
    if (level >= 5) return '#F59E0B';
    return '#EF4444';
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBlock: React.FC<{ width: number | string; height: number; radius?: number; style?: any }> = ({
    width, height, radius = 12, style,
}) => (
    <View style={[{ width, height, borderRadius: radius, backgroundColor: '#EDEEEF' }, style]} />
);

const CardSkeleton = () => (
    <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        marginHorizontal: 20,
    }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <SkeletonBlock width={40} height={40} radius={12} />
            <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBlock width="75%" height={18} />
                <SkeletonBlock width="50%" height={13} />
            </View>
        </View>
        <SkeletonBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <SkeletonBlock width="60%" height={14} />
    </View>
);

// ─── Decision Card ────────────────────────────────────────────────────────────

const DecisionCard: React.FC<{ decision: Decision; onPress: () => void }> = ({ decision, onPress }) => {
    const catColor = getCategoryColor(decision.category);
    const statusColor = getStatusColor(decision.status);
    const confColor = getConfidenceColor(decision.confidenceLevel);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 20,
                marginBottom: 12,
                marginHorizontal: 20,
                shadowColor: 'rgba(25,28,29,0.8)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 16,
                elevation: 2,
            }}
        >
            {/* Top row: icon + title + confidence */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                <View style={{
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    backgroundColor: catColor + '14',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Ionicons name={getCategoryIcon(decision.category)} size={20} color={catColor} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: 'Inter_700Bold',
                            fontSize: 16,
                            color: '#111827',
                            lineHeight: 22,
                            letterSpacing: -0.3,
                        }}
                        numberOfLines={2}
                    >
                        {decision.title}
                    </Text>
                    {decision.description ? (
                        <Text
                            style={{
                                fontFamily: 'Inter_400Regular',
                                fontSize: 13,
                                color: '#6B7280',
                                marginTop: 4,
                                lineHeight: 18,
                            }}
                            numberOfLines={2}
                        >
                            {decision.description}
                        </Text>
                    ) : null}
                </View>
                {/* Confidence indicator */}
                <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: 2.5,
                    borderColor: confColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                }}>
                    <Text style={{
                        fontFamily: 'Inter_700Bold',
                        fontSize: 11,
                        color: confColor,
                    }}>
                        {decision.confidenceLevel}
                    </Text>
                </View>
            </View>

            {/* Bottom row: badges + time */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 4,
            }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    {/* Category badge */}
                    <View style={{
                        backgroundColor: catColor + '14',
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    }}>
                        <Text style={{
                            fontFamily: 'Inter_600SemiBold',
                            fontSize: 11,
                            color: catColor,
                            textTransform: 'capitalize',
                        }}>
                            {decision.category}
                        </Text>
                    </View>
                    {/* Status badge */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        backgroundColor: statusColor + '14',
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    }}>
                        <View style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: statusColor,
                        }} />
                        <Text style={{
                            fontFamily: 'Inter_600SemiBold',
                            fontSize: 11,
                            color: statusColor,
                        }}>
                            {getStatusLabel(decision.status)}
                        </Text>
                    </View>
                </View>
                <Text style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    color: '#9CA3AF',
                }}>
                    {timeAgo(decision.updatedAt)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ onCreateNew: () => void }> = ({ onCreateNew }) => (
    <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingTop: 60,
    }}>
        <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#E8E6FF',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
        }}>
            <Ionicons name="scale-outline" size={36} color="#4F46E5" />
        </View>
        <Text style={{
            fontFamily: 'Inter_700Bold',
            fontSize: 20,
            color: '#111827',
            textAlign: 'center',
            marginBottom: 8,
        }}>
            No decisions yet
        </Text>
        <Text style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 15,
            color: '#6B7280',
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: 28,
        }}>
            Start tracking your life decisions to unlock AI-powered insights and patterns.
        </Text>
        <TouchableOpacity onPress={onCreateNew} activeOpacity={0.85}>
            <LinearGradient
                colors={['#3525CD', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingHorizontal: 28,
                    paddingVertical: 14,
                    borderRadius: 9999,
                    shadowColor: '#4F46E5',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.22,
                    shadowRadius: 12,
                    elevation: 6,
                }}
            >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 15,
                    color: '#FFFFFF',
                }}>
                    Create Your First Decision
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

// ─── Decision List Screen ─────────────────────────────────────────────────────

export default function DecisionListScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const params = {
        page: 1,
        limit: 50,
        ...(selectedCategory ? { category: selectedCategory } : {}),
        ...(selectedStatus ? { status: selectedStatus } : {}),
        sortBy: 'decisionDate' as const,
        sortOrder: 'desc' as const,
    };

    const { data, isLoading, isRefetching } = useDecisions(params);

    const decisions = data?.data ?? [];
    const filteredDecisions = searchQuery
        ? decisions.filter((d) =>
            d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : decisions;

    const onRefresh = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: decisionKeys.lists() });
    }, [queryClient]);

    const handleNew = () => router.push('/(tabs)/decisions/new');
    const handleDetail = (id: string) => router.push(`/(tabs)/decisions/${id}`);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* ── Header ── */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 24,
                paddingTop: 8,
                paddingBottom: 16,
            }}>
                <Text style={{
                    fontFamily: 'Inter_800ExtraBold',
                    fontSize: 28,
                    color: '#111827',
                    letterSpacing: -1,
                }}>
                    My Decisions
                </Text>
                <TouchableOpacity
                    onPress={() => {/* sort options */}}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: 'rgba(0,0,0,0.5)',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        elevation: 1,
                    }}
                >
                    <Ionicons name="options-outline" size={20} color="#464555" />
                </TouchableOpacity>
            </View>

            {/* ── Search Bar ── */}
            <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    height: 48,
                    shadowColor: 'rgba(0,0,0,0.5)',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.03,
                    shadowRadius: 8,
                    elevation: 1,
                }}>
                    <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search decisions..."
                        placeholderTextColor="#9CA3AF"
                        style={{
                            flex: 1,
                            fontFamily: 'Inter_400Regular',
                            fontSize: 15,
                            color: '#111827',
                            marginLeft: 10,
                            height: 48,
                        }}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#C7C4D8" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* ── Category Filters ── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 6 }}
                style={{ flexGrow: 0, marginBottom: 8 }}
            >
                {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.key;
                    return (
                        <TouchableOpacity
                            key={cat.key}
                            onPress={() => setSelectedCategory(isActive ? '' : cat.key)}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                paddingHorizontal: 14,
                                paddingVertical: 9,
                                borderRadius: 12,
                                backgroundColor: isActive ? '#4F46E5' : '#FFFFFF',
                                borderWidth: isActive ? 0 : 1,
                                borderColor: '#E5E7EB',
                            }}
                        >
                            <Ionicons
                                name={cat.icon}
                                size={15}
                                color={isActive ? '#FFFFFF' : '#6B7280'}
                            />
                            <Text style={{
                                fontFamily: 'Inter_600SemiBold',
                                fontSize: 13,
                                color: isActive ? '#FFFFFF' : '#374151',
                            }}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* ── Status Filters ── */}
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                gap: 8,
                marginBottom: 16,
            }}>
                {STATUS_FILTERS.map((sf) => {
                    const isActive = selectedStatus === sf.key;
                    return (
                        <TouchableOpacity
                            key={sf.key}
                            onPress={() => setSelectedStatus(isActive ? '' : sf.key)}
                            activeOpacity={0.8}
                            style={{
                                paddingHorizontal: 14,
                                paddingVertical: 7,
                                borderRadius: 9999,
                                backgroundColor: isActive ? '#111827' : 'transparent',
                                borderWidth: isActive ? 0 : 1,
                                borderColor: '#E5E7EB',
                            }}
                        >
                            <Text style={{
                                fontFamily: 'Inter_600SemiBold',
                                fontSize: 12,
                                color: isActive ? '#FFFFFF' : '#6B7280',
                            }}>
                                {sf.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
                {/* Count badge */}
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                    {!isLoading && (
                        <Text style={{
                            fontFamily: 'Inter_500Medium',
                            fontSize: 13,
                            color: '#9CA3AF',
                        }}>
                            {filteredDecisions.length} decision{filteredDecisions.length !== 1 ? 's' : ''}
                        </Text>
                    )}
                </View>
            </View>

            {/* ── Decision List ── */}
            {isLoading ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
                </ScrollView>
            ) : filteredDecisions.length === 0 ? (
                <EmptyState onCreateNew={handleNew} />
            ) : (
                <FlatList
                    data={filteredDecisions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <DecisionCard
                            decision={item}
                            onPress={() => handleDetail(item.id)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={onRefresh}
                            tintColor="#4F46E5"
                            colors={['#4F46E5']}
                        />
                    }
                />
            )}

            {/* ── FAB ── */}
            <TouchableOpacity
                onPress={handleNew}
                activeOpacity={0.85}
                style={{
                    position: 'absolute',
                    bottom: 24,
                    right: 24,
                    zIndex: 10,
                }}
            >
                <LinearGradient
                    colors={['#3525CD', '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        width: 58,
                        height: 58,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#4F46E5',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.35,
                        shadowRadius: 16,
                        elevation: 8,
                    }}
                >
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
