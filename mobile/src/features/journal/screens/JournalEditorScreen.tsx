import { useTheme } from '../../../theme/ThemeProvider';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MainStackParamList } from '../../../navigation/types';
import { useJournalEntry } from '../hooks/useJournalEntry';
import { useJournalMutations } from '../hooks/useJournalMutations';
import { HeadingMD, Icon, IconButton, Button } from '../../../design-system';
import { MoodSelector } from '../components/MoodSelector';
import { AutosaveIndicator } from '../components/AutosaveIndicator';
import { ReflectionCard } from '../components/ReflectionCard';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RouteProps = RouteProp<MainStackParamList, 'JournalEditor'>;

const DRAFT_STORAGE_KEY = '@journal_draft';

const journalSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Entry content is required'),
  mood: z.string().optional(),
  todays_wins: z.string().optional(),
  challenges: z.string().optional(),
  lessons_learned: z.string().optional(),
  tomorrow_focus: z.string().optional(),
  gratitude: z.string().optional(),
});

type JournalFormData = z.infer<typeof journalSchema>;

export const JournalEditorScreen = () => {
  const { theme } = useTheme();

  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const id = route.params?.id;

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'offline'>('idle');
  const [isInitializing, setIsInitializing] = useState(true);

  const { data: existingEntry, isLoading: isFetching } = useJournalEntry(id as string, !!id);
  const { createJournalEntry, updateJournalEntry } = useJournalMutations();

  const { control, handleSubmit, reset, watch, formState: { isDirty } } = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: '',
      content: '',
      mood: 'neutral',
      todays_wins: '',
      challenges: '',
      lessons_learned: '',
      tomorrow_focus: '',
      gratitude: '',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = watch();

  // 1. Initialize Form
  useEffect(() => {
    const initializeForm = async () => {
      try {
        if (id && existingEntry) {
          // Editing existing
          reset({
            title: existingEntry.title || '',
            content: existingEntry.content || '',
            mood: existingEntry.mood || 'neutral',
            todays_wins: existingEntry.todaysWins || '',
            challenges: existingEntry.challenges || '',
            lessons_learned: existingEntry.lessonsLearned || '',
            tomorrow_focus: existingEntry.tomorrowFocus || '',
            gratitude: existingEntry.gratitude || '',
          });
        } else if (!id) {
          // Creating new - check for drafts
          const savedDraft = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
          if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            reset(parsed);
            setSaveStatus('offline');
          }
        }
      } catch (e) {
        console.error("Draft load error", e);
      } finally {
        setIsInitializing(false);
      }
    };
    
    if (!isFetching) {
      initializeForm();
    }
  }, [id, existingEntry, isFetching, reset]);

  // 2. Draft Persistence & Autosave (Debounced)
  useEffect(() => {
    if (isInitializing || !isDirty) return;

    const timer = setTimeout(async () => {
      try {
        if (!id) {
          // Local Draft Persistence
          await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formValues));
          setSaveStatus('offline');
        } else if (formValues.content) {
          // Server Autosave
          setSaveStatus('saving');
          await updateJournalEntry({ 
            id, 
            payload: formValues 
          });
          setSaveStatus('saved');
        }
      } catch {
        setSaveStatus('error');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formValues, id, isInitializing, isDirty, updateJournalEntry]);

  // 3. Final Submit
  const onSubmit = async (data: JournalFormData) => {
    try {
      setSaveStatus('saving');
      if (id) {
        await updateJournalEntry({ id, payload: data });
      } else {
        await createJournalEntry(data);
        await AsyncStorage.removeItem(DRAFT_STORAGE_KEY); // Clear draft on successful creation
      }
      setSaveStatus('saved');
      navigation.goBack();
    } catch {
      setSaveStatus('error');
      Alert.alert('Error', 'Failed to save entry. It has been saved as a draft locally.');
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background-light dark:bg-background-dark">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-row items-center justify-between px-2 py-2 border-b border-slate-100 bg-background-light dark:bg-background-dark z-10">
          <View className="flex-row items-center">
            <IconButton accessibilityRole="button" accessibilityLabel="Icon Button" leftIcon="ArrowLeft" onPress={() => navigation.goBack()} />
            <AutosaveIndicator status={saveStatus} />
          </View>
          <Button 
            variant="primary" 
            onPress={handleSubmit(onSubmit)} 
            disabled={saveStatus === 'saving' || isFetching || isInitializing}
            className="mr-2 px-4 py-2"
            title={id ? 'Done' : 'Publish'}
          />
        </View>

        <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 60 }}>
          
          <Controller
            control={control}
            name="mood"
            render={({ field: { onChange, value } }) => (
              <MoodSelector value={value || 'neutral'} onChange={onChange} />
            )}
          />

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Entry Title (Optional)"
                value={value}
                onChangeText={onChange}
                className="text-2xl font-bold text-slate-800 mb-4"
                placeholderTextColor={theme.colors.text.disabled}
              />
            )}
          />

          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="What's on your mind?..."
                value={value}
                onChangeText={onChange}
                multiline
                className="text-base text-slate-700 min-h-[200px] mb-8"
                textAlignVertical="top"
                placeholderTextColor={theme.colors.text.disabled}
                style={{ lineHeight: 28 }}
              />
            )}
          />

          <View className="mb-4 flex-row items-center">
            <Icon name="Sparkles" size={18} color={theme.colors.primary[500]} className="mr-2" />
            <HeadingMD className="text-indigo-600">Reflection</HeadingMD>
          </View>

          <ReflectionCard title="Today's Wins">
            <Controller
              control={control}
              name="todays_wins"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="What went well today?"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  className="text-sm text-slate-700 min-h-[60px]"
                  textAlignVertical="top"
                />
              )}
            />
          </ReflectionCard>

          <ReflectionCard title="Challenges">
            <Controller
              control={control}
              name="challenges"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="What was difficult?"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  className="text-sm text-slate-700 min-h-[60px]"
                  textAlignVertical="top"
                />
              )}
            />
          </ReflectionCard>

          <ReflectionCard title="Lessons Learned">
            <Controller
              control={control}
              name="lessons_learned"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="What did you learn?"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  className="text-sm text-slate-700 min-h-[60px]"
                  textAlignVertical="top"
                />
              )}
            />
          </ReflectionCard>

          <ReflectionCard title="Tomorrow's Focus">
            <Controller
              control={control}
              name="tomorrow_focus"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="What will you focus on?"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  className="text-sm text-slate-700 min-h-[60px]"
                  textAlignVertical="top"
                />
              )}
            />
          </ReflectionCard>

          <ReflectionCard title="Gratitude">
            <Controller
              control={control}
              name="gratitude"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="What are you grateful for?"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  className="text-sm text-slate-700 min-h-[60px]"
                  textAlignVertical="top"
                />
              )}
            />
          </ReflectionCard>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
