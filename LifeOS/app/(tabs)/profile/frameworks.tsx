/**
 * Frameworks Screen — Decision frameworks library
 *
 * Lists available decision-making frameworks, allows viewing details,
 * and creating new frameworks.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StatusBar, TouchableOpacity, Alert, TextInput, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFrameworks, useCreateFramework } from '@/hooks/useFrameworks';
import { FrameworkCard, FrameworkDetail } from '@/components/profile';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '@/utils/designTokens';
import type { DecisionFramework } from '@/services/frameworkService';

export default function FrameworksScreen() {
  const { data: frameworks = [], isLoading, isError, refetch } = useFrameworks();
  const createFramework = useCreateFramework();
  const [selectedFramework, setSelectedFramework] = useState<DecisionFramework | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handlePress = (fw: DecisionFramework) => {
    setSelectedFramework(fw);
    setShowDetail(true);
  };

  const handleCreate = () => {
    if (!newName.trim()) {
      Alert.alert('Required', 'Please enter a framework name.');
      return;
    }
    createFramework.mutate(
      {
        name: newName.trim(),
        description: newDesc.trim() || undefined,
        framework: {
          steps: [{ title: 'Step 1', description: 'Define the problem', questions: ['What is the decision?'] }],
        },
      },
      {
        onSuccess: () => {
          setShowCreate(false);
          setNewName('');
          setNewDesc('');
        },
        onError: (err: any) => {
          Alert.alert('Error', err?.response?.data?.error || 'Failed to create framework.');
        },
      },
    );
  };

  const isRefreshing = isLoading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md }}>
        <Text style={[TYPOGRAPHY.h1, { color: COLORS.textPrimary }]}>Frameworks</Text>
        <TouchableOpacity onPress={() => setShowCreate(true)} style={{ minWidth: 44, minHeight: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="add" size={24} color={COLORS.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {isError && !isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxl }}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
          <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, marginTop: SPACING.lg, textAlign: 'center' }]}>Could not load frameworks</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: SPACING.lg, backgroundColor: COLORS.primary, borderRadius: RADII.md, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.textOnPrimary }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: SPACING.xxl, paddingTop: SPACING.sm }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        >
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <View key={i} style={{ height: 120, backgroundColor: COLORS.surfaceContainer, borderRadius: RADII.xl, marginBottom: SPACING.md }} />
            ))
          ) : frameworks.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: SPACING.huge }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg }}>
                <Ionicons name="layers-outline" size={28} color={COLORS.primary} />
              </View>
              <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary, marginBottom: SPACING.sm }]}>No frameworks yet</Text>
              <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, textAlign: 'center' }]}>
                Create your first decision framework to standardize your thinking.
              </Text>
            </View>
          ) : (
            frameworks.map((fw) => (
              <FrameworkCard key={fw.id} framework={fw} onPress={handlePress} />
            ))
          )}
        </ScrollView>
      )}

      {/* Framework Detail Modal */}
      <FrameworkDetail framework={selectedFramework} visible={showDetail} onClose={() => setShowDetail(false)} />

      {/* Create Framework Modal */}
      <Modal visible={showCreate} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCreate(false)}>
        <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md }}>
            <TouchableOpacity onPress={() => setShowCreate(false)} style={{ padding: SPACING.sm }}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={[TYPOGRAPHY.heading, { color: COLORS.textPrimary }]}>New Framework</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={{ padding: SPACING.xxl }}>
            <Text style={[TYPOGRAPHY.label, { color: COLORS.textMuted, marginBottom: SPACING.sm }]}>Name</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g., Pros & Cons"
              placeholderTextColor="#9CA3AF"
              style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.md, padding: SPACING.lg, fontFamily: 'Inter_400Regular', fontSize: 15, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.inputBorder, marginBottom: SPACING.lg }}
            />

            <Text style={[TYPOGRAPHY.label, { color: COLORS.textMuted, marginBottom: SPACING.sm }]}>Description (optional)</Text>
            <TextInput
              value={newDesc}
              onChangeText={setNewDesc}
              placeholder="A brief description of this framework"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.md, padding: SPACING.lg, fontFamily: 'Inter_400Regular', fontSize: 15, color: COLORS.textPrimary, minHeight: 80, borderWidth: 1, borderColor: COLORS.inputBorder, marginBottom: SPACING.xxxl }}
            />

            <TouchableOpacity
              onPress={handleCreate}
              disabled={!newName.trim() || createFramework.isPending}
              style={{
                backgroundColor: newName.trim() ? COLORS.primary : COLORS.inputBorder,
                borderRadius: RADII.md,
                paddingVertical: SPACING.lg,
                alignItems: 'center',
                ...(newName.trim() ? SHADOWS.button : {}),
              }}
            >
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textOnPrimary }}>
                {createFramework.isPending ? 'Creating...' : 'Create Framework'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
