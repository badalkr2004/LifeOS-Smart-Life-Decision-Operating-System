/**
 * RecentActivity — Decision feed on the dashboard.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SkeletonBlock } from '@/components/ui';
import { getCategoryIconOutline, getStatusColor, getStatusLabel, timeAgo } from '@/utils/helpers';
import type { Decision } from '@/services/dashboardService';

// ─── Single Activity Item ─────────────────────────────────────────────────────

const ActivityItem: React.FC<{ decision: Decision }> = ({ decision }) => (
    <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 24 }}
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
            <Ionicons name={getCategoryIconOutline(decision.category)} size={20} color="#464555" />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#111827' }} numberOfLines={1}>
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

// ─── Section Wrapper ──────────────────────────────────────────────────────────

type RecentActivityProps = {
    decisions: Decision[];
    isLoading: boolean;
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ decisions, isLoading }) => (
    <View style={{ marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 8 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#464555', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Recent Activity
            </Text>
            {decisions.length > 0 && (
                <TouchableOpacity>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#4F46E5' }}>View All</Text>
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
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827', marginTop: 10 }}>No decisions yet</Text>
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
