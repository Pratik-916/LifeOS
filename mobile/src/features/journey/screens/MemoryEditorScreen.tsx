import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList, MemoryEditorRouteProp } from '../../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useMemory, useJourneyMutations } from '../hooks';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Camera } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const CATEGORIES = [
  'achievement', 'career', 'education', 'health', 
  'fitness', 'travel', 'relationship', 'finance', 
  'project', 'personal', 'milestone', 'celebration', 'other'
];

export const MemoryEditorScreen = () => {
  const route = useRoute<MemoryEditorRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const id = route.params?.id;
  const isEditing = !!id;

  const { data: memory } = useMemory(id || '', isEditing);
  const { createMemory, updateMemory, isCreating, isUpdating } = useJourneyMutations();

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    location: '',
    category: 'other',
    visibility: 'private',
    favorite: false,
    pinned: false,
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const draftKey = `journey_draft_${id || 'new'}`;

  const loadDraft = useCallback(async () => {
    try {
      const draft = await AsyncStorage.getItem(draftKey);
      if (draft) {
        setForm(JSON.parse(draft));
      } else if (isEditing && memory) {
        setForm({
          title: memory.title,
          description: memory.description,
          date: memory.date,
          location: memory.location,
          category: memory.category,
          visibility: memory.visibility,
          favorite: memory.favorite,
          pinned: memory.pinned,
        });
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load draft:', error);
      setIsLoaded(true);
    }
  }, [draftKey, isEditing, memory]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDraft();
  }, [loadDraft]);

  const saveDraft = useCallback(async (currentForm: typeof form) => {
    try {
      await AsyncStorage.setItem(draftKey, JSON.stringify(currentForm));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [draftKey]);

  const updateForm = (key: keyof typeof form, value: any) => {
    const newForm = { ...form, [key]: value };
    setForm(newForm);
    saveDraft(newForm);
  };

  const handleBack = useCallback(() => {
    Alert.alert(
      'Discard Changes?',
      'You have unsaved changes. Draft will be saved automatically.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  }, [navigation]);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      Alert.alert('Validation Error', 'Title is required');
      return;
    }

    try {
      if (isEditing && id) {
        await updateMemory({ id, payload: form });
      } else {
        await createMemory(form);
      }
      await AsyncStorage.removeItem(draftKey);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save memory. Please try again.');
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="h-14 flex-row items-center px-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isLoading = isCreating || isUpdating;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="h-14 flex-row items-center justify-between px-4 border-b border-slate-100">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Typography variant="h3" className="font-semibold text-slate-900">
            {isEditing ? 'Edit Memory' : 'New Memory'}
          </Typography>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 p-4" keyboardShouldPersistTaps="handled">
          
          <View className="mb-6">
            <Typography variant="label" className="mb-2 text-slate-700">Title</Typography>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-lg font-medium"
              placeholder="A day to remember..."
              placeholderTextColor="#94A3B8"
              value={form.title}
              onChangeText={(text) => updateForm('title', text)}
            />
          </View>

          <View className="mb-6">
            <Typography variant="label" className="mb-2 text-slate-700">Date (YYYY-MM-DD)</Typography>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
              placeholder="e.g. 2024-05-12"
              placeholderTextColor="#94A3B8"
              value={form.date.split('T')[0]}
              onChangeText={(text) => updateForm('date', `${text}T12:00:00Z`)}
            />
          </View>

          <View className="mb-6">
            <Typography variant="label" className="mb-2 text-slate-700">Location</Typography>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
              placeholder="Where did this happen?"
              placeholderTextColor="#94A3B8"
              value={form.location}
              onChangeText={(text) => updateForm('location', text)}
            />
          </View>
          
          <View className="mb-6">
            <Typography variant="label" className="mb-2 text-slate-700">Category</Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => updateForm('category', cat)}
                  className={`px-4 py-2 rounded-full mr-2 border ${
                    form.category === cat 
                      ? 'bg-indigo-100 border-indigo-200' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <Typography variant="body" className={`capitalize ${form.category === cat ? 'text-indigo-700 font-semibold' : 'text-slate-600'}`}>
                    {cat}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="mb-6">
            <Typography variant="label" className="mb-2 text-slate-700">Photos (Coming Soon)</Typography>
            <TouchableOpacity className="h-32 border-2 border-dashed border-slate-300 rounded-xl items-center justify-center bg-slate-50">
              <Camera size={32} color="#94A3B8" />
              <Typography variant="caption" className="text-slate-500 mt-2">
                Tap to add photos
              </Typography>
            </TouchableOpacity>
          </View>

          <View className="mb-8">
            <Typography variant="label" className="mb-2 text-slate-700">Description</Typography>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 min-h-[120px]"
              placeholder="Write about this memory..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              value={form.description}
              onChangeText={(text) => updateForm('description', text)}
            />
          </View>
          
          <View className="pb-12">
            <Button 
              variant="primary" 
              title={isEditing ? 'Save Changes' : 'Create Memory'}
              onPress={handleSubmit}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
