import { useTheme } from '../../../theme/ThemeProvider';
import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MainStackParamList } from '../../../navigation/types';
import { useGoal } from '../hooks/useGoal';
import { useGoalMutations } from '../hooks/useGoalMutations';
import { HeadingMD, BodyMD, Label, Icon } from '../../../design-system';
import { MilestoneCard } from '../components/MilestoneCard';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type EditorRouteProp = RouteProp<MainStackParamList, 'GoalEditor'>;

const DRAFT_KEY = '@goal_draft';

export const GoalEditorScreen = () => {
  const { theme } = useTheme();

  const route = useRoute<EditorRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { id } = route.params;
  const isEditing = !!id;

  const { data: goal } = useGoal(id as string, isEditing);
  const { createGoal, updateGoal } = useGoalMutations();

  type EditorMilestone = { id?: string; title: string; is_completed: boolean; };
  const [milestones, setMilestones] = useState<EditorMilestone[]>([]);
  const [milestoneInput, setMilestoneInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Personal',
    priority: 'medium',
    targetDate: new Date().toISOString().split('T')[0],
  });

  const loadDraft = useCallback(async () => {
    try {
      const draftStr = await AsyncStorage.getItem(DRAFT_KEY);
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        setForm(draft.form);
        setMilestones(draft.milestones);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }, []);

  const saveDraft = async () => {
    if (isEditing) return;
    try {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ form, milestones }));
    } catch (e: unknown) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isEditing && goal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority,
        targetDate: goal.targetDate,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMilestones(goal.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        is_completed: m.completed,
      })));
    } else {
      loadDraft();
    }
  }, [goal, isEditing, loadDraft]);

  // Debounced auto draft logic removed for brevity, saveDraft can be called on blur/change

  const handleSave = async () => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority as 'low' | 'medium' | 'high',
        target_date: form.targetDate,
        milestones: milestones.map((m) => ({
          ...(m.id && !m.id.startsWith('temp_') ? { id: m.id } : {}),
          title: m.title,
          is_completed: m.is_completed || false,
        })),
      };

      if (isEditing && id) {
        await updateGoal({ id, payload });
      } else {
        await createGoal(payload);
        await AsyncStorage.removeItem(DRAFT_KEY);
      }
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  const addMilestone = () => {
    if (!milestoneInput.trim()) return;
    setMilestones([...milestones, { id: `temp_${Date.now()}`, title: milestoneInput.trim(), is_completed: false }]);
    setMilestoneInput('');
  };

  const removeMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <Icon name="ArrowLeft" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <HeadingMD className="text-text-light dark:text-text-dark">
            {isEditing ? 'Edit Goal' : 'New Goal'}
          </HeadingMD>
          <TouchableOpacity onPress={handleSave} className="p-2 -mr-2 flex-row items-center">
            <Icon name="Save" size={20} color={theme.colors.primary[500]} />
            <BodyMD className="text-indigo-600 font-medium ml-1">Save</BodyMD>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-5">
          <Label className="text-slate-700 mb-2">Title</Label>
          <TextInput
            value={form.title}
            onChangeText={(v) => { setForm({ ...form, title: v }); saveDraft(); }}
            placeholder="What do you want to achieve?"
            className="border border-slate-200 rounded-lg p-3 mb-6 bg-slate-50 text-text-light dark:text-text-dark font-medium"
            placeholderTextColor={theme.colors.text.disabled}
          />

          <Label className="text-slate-700 mb-2">Description</Label>
          <TextInput
            value={form.description}
            onChangeText={(v) => { setForm({ ...form, description: v }); saveDraft(); }}
            placeholder="Why is this important?"
            multiline
            numberOfLines={4}
            className="border border-slate-200 rounded-lg p-3 mb-6 bg-slate-50 text-text-light dark:text-text-dark h-24 text-top"
            textAlignVertical="top"
            placeholderTextColor={theme.colors.text.disabled}
          />

          <Label className="text-slate-700 mb-2">Target Date (YYYY-MM-DD)</Label>
          <TextInput
            value={form.targetDate}
            onChangeText={(v) => { setForm({ ...form, targetDate: v }); saveDraft(); }}
            placeholder="YYYY-MM-DD"
            className="border border-slate-200 rounded-lg p-3 mb-6 bg-slate-50 text-text-light dark:text-text-dark"
            placeholderTextColor={theme.colors.text.disabled}
          />

          <View className="mb-8">
            <HeadingMD className="text-text-light dark:text-text-dark mb-4">Milestones</HeadingMD>
            
            {milestones.map((ms, i) => (
              <MilestoneCard 
                key={ms.id || `temp-${i}`}
                milestone={{ id: ms.id as string, title: ms.title, completed: ms.is_completed, description: '' }}
                onDelete={() => removeMilestone(i)}
                isEditor
              />
            ))}
            
            <View className="flex-row items-center mt-3">
              <TextInput
                value={milestoneInput}
                onChangeText={setMilestoneInput}
                placeholder="Add a milestone..."
                className="flex-1 border border-slate-200 rounded-lg p-3 bg-slate-50 text-text-light dark:text-text-dark mr-2"
                placeholderTextColor={theme.colors.text.disabled}
                onSubmitEditing={addMilestone}
              />
              <TouchableOpacity onPress={addMilestone} className="w-12 h-12 bg-indigo-600 rounded-lg items-center justify-center">
                <Icon name="Plus" size={24} color={theme.colors.background.paper} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
