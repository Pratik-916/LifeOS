import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, Animated } from 'react-native';
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
import { HeadingXL, HeadingMD, BodyMD, IconButton, Button } from '../../../design-system';
import { MoodSelector } from '../components/MoodSelector';
import { ReflectionSummary } from '../components/ReflectionSummary';
import { ReflectionStreak } from '../components/ReflectionStreak';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RouteProps = RouteProp<MainStackParamList, 'JournalEditor'>;

const DRAFT_STORAGE_KEY = '@reflection_draft';

const reflectionSchema = z.object({
  mood: z.string().optional(),
  todays_wins: z.string().optional(),
  gratitude: z.string().optional(),
  tomorrow_focus: z.string().optional(),
});

type ReflectionFormData = z.infer<typeof reflectionSchema>;

export const JournalEditorScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const id = route.params?.id;

  const [isInitializing, setIsInitializing] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [fadeAnim] = useState(() => new Animated.Value(0)); // For screen mount
  const [completionAnim] = useState(() => new Animated.Value(0)); // For completion moment

  const { data: existingEntry, isLoading: isFetching } = useJournalEntry(id as string, !!id);
  const { createJournalEntry, updateJournalEntry } = useJournalMutations();

  const { control, handleSubmit, reset, watch, formState: { isDirty } } = useForm<ReflectionFormData>({
    resolver: zodResolver(reflectionSchema),
    defaultValues: {
      mood: 'good',
      todays_wins: '',
      gratitude: '',
      tomorrow_focus: '',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = watch();

  useEffect(() => {
    // Gentle screen fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        if (id && existingEntry) {
          reset({
            mood: existingEntry.mood || 'good',
            todays_wins: existingEntry.todaysWins || '',
            gratitude: existingEntry.gratitude || '',
            tomorrow_focus: existingEntry.tomorrowFocus || '',
          });
        } else if (!id) {
          const savedDraft = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
          if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            reset(parsed);
          }
        }
      } catch {
        console.error("Draft load error");
      } finally {
        setIsInitializing(false);
      }
    };
    
    if (!isFetching && isInitializing) {
      initializeForm();
    }
  }, [id, existingEntry, isFetching, reset, isInitializing]);

  useEffect(() => {
    if (isInitializing || !isDirty || isCompleting) return;
    const timer = setTimeout(async () => {
      try {
        if (!id) {
          await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formValues));
        }
      } catch {
        // Ignore
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [formValues, id, isInitializing, isDirty, isCompleting]);

  const onSubmit = async (data: ReflectionFormData) => {
    try {
      // Full payload mapped to JournalEntry requirements. Hidden fields are empty strings.
      const payload = {
        title: 'Evening Reflection',
        content: '',
        challenges: '',
        lessons_learned: '',
        ...data,
      };

      if (id) {
        await updateJournalEntry({ id, payload });
      } else {
        await createJournalEntry(payload);
        await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
      }

      // Trigger completion moment
      setIsCompleting(true);
      Animated.timing(completionAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      });
    } catch {
      Alert.alert('Error', 'Failed to save reflection.');
    }
  };

  if (isCompleting) {
    return (
      <View className="flex-1 bg-surface-evening items-center justify-center">
        <Animated.View style={{ opacity: completionAnim, alignItems: 'center' }}>
          <HeadingXL className="mb-4">🌙</HeadingXL>
          <HeadingMD className="text-slate-800 mb-2">Reflection Complete</HeadingMD>
          <BodyMD className="text-slate-600 mb-1">Great work today.</BodyMD>
          <BodyMD className="text-slate-600">See you tomorrow.</BodyMD>
        </Animated.View>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface-evening">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <View className="flex-row items-center justify-between px-4 py-2 z-10">
            <IconButton leftIcon="X" onPress={() => navigation.goBack()} />
            <Button 
              variant="ghost" 
              onPress={handleSubmit(onSubmit)} 
              disabled={isFetching || isInitializing}
              title="Save"
            />
          </View>

          <ScrollView 
            className="flex-1 px-4 pt-2" 
            keyboardShouldPersistTaps="handled" 
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <ReflectionSummary />
            <ReflectionStreak />

            <Controller
              control={control}
              name="mood"
              render={({ field: { onChange, value } }) => (
                <MoodSelector value={value || 'good'} onChange={onChange} />
              )}
            />

            <View className="mb-8 px-2">
              <BodyMD className="text-slate-800 font-bold mb-3">What did I accomplish today?</BodyMD>
              <Controller
                control={control}
                name="todays_wins"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Type a few words..."
                    value={value}
                    onChangeText={onChange}
                    multiline
                    className="text-base text-slate-700 min-h-[60px]"
                    textAlignVertical="top"
                    placeholderTextColor="#94A3B8"
                  />
                )}
              />
            </View>

            <View className="mb-8 px-2">
              <BodyMD className="text-slate-800 font-bold mb-3">What made me smile today?</BodyMD>
              <Controller
                control={control}
                name="gratitude"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Type a few words..."
                    value={value}
                    onChangeText={onChange}
                    multiline
                    className="text-base text-slate-700 min-h-[60px]"
                    textAlignVertical="top"
                    placeholderTextColor="#94A3B8"
                  />
                )}
              />
            </View>

            <View className="mb-10 px-2">
              <BodyMD className="text-slate-800 font-bold mb-3">What is the one priority for tomorrow?</BodyMD>
              <Controller
                control={control}
                name="tomorrow_focus"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Type a few words..."
                    value={value}
                    onChangeText={onChange}
                    multiline
                    className="text-base text-slate-700 min-h-[60px]"
                    textAlignVertical="top"
                    placeholderTextColor="#94A3B8"
                  />
                )}
              />
            </View>

            <View className="px-2">
              <Button 
                variant="primary" 
                size="lg"
                onPress={handleSubmit(onSubmit)} 
                title="Complete Reflection"
              />
            </View>

          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

