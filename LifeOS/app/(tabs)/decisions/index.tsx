/**
 * Decision List Screen
 *
 * Thin compositor: manages search/filter state, delegates
 * card rendering to DecisionCard and DecisionCardSkeleton.
 */

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
import { CATEGORY_FILTERS, STATUS_FILTERS } from '@/utils/constants';
import { DecisionCard, DecisionCardSkeleton } from '@/components/decisions';
import { EmptyState } from '@/components/ui';

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
        ? decisions.filter(
            (d) =>
                d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.description?.toLowerCase().includes(searchQuery.toLowerCase()),
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
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 24,
                    paddingTop: 8,
                    paddingBottom: 16,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Inter_800ExtraBold',
                        fontSize: 28,
                        color: '#111827',
                        letterSpacing: -1,
                    }}
                >
                    My Decisions
                </Text>
                <TouchableOpacity
                    onPress={() => {/* sort options */ }}
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
                <View
                    style={{
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
                    }}
                >
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
                contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
                style={{ maxHeight: 48, flexGrow: 0, marginBottom: 8 }}
            >
                {CATEGORY_FILTERS.map((cat) => {
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
                                borderWidth: 1,
                                borderColor: isActive ? '#4F46E5' : '#E5E7EB',
                            }}
                        >
                            <Ionicons name={cat.icon} size={15} color={isActive ? '#FFFFFF' : '#6B7280'} />
                            <Text
                                style={{
                                    fontFamily: 'Inter_600SemiBold',
                                    fontSize: 13,
                                    color: isActive ? '#FFFFFF' : '#374151',
                                }}
                            >
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* ── Status Filters ── */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 }}>
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
                            <Text
                                style={{
                                    fontFamily: 'Inter_600SemiBold',
                                    fontSize: 12,
                                    color: isActive ? '#FFFFFF' : '#6B7280',
                                }}
                            >
                                {sf.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                    {!isLoading && (
                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#9CA3AF' }}>
                            {filteredDecisions.length} decision{filteredDecisions.length !== 1 ? 's' : ''}
                        </Text>
                    )}
                </View>
            </View>

            {/* ── Decision List ── */}
            <View style={{ flex: 1 }}>
                {isLoading ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {[1, 2, 3, 4].map((i) => (
                            <DecisionCardSkeleton key={i} />
                        ))}
                    </ScrollView>
                ) : filteredDecisions.length === 0 ? (
                    <EmptyState
                        icon="scale-outline"
                        title="No decisions yet"
                        subtitle="Start tracking your life decisions to unlock AI-powered insights and patterns."
                        ctaLabel="Create Your First Decision"
                        onCta={handleNew}
                    />
                ) : (
                    <FlatList
                        data={filteredDecisions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <DecisionCard decision={item} onPress={() => handleDetail(item.id)} />
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
            </View>

            {/* ── FAB ── */}
            <TouchableOpacity
                onPress={handleNew}
                activeOpacity={0.85}
                style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10 }}
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
