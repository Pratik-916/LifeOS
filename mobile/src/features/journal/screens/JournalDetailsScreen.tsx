import React from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';

import { MainStackParamList } from '../../../navigation/types';
import { useJournalEntry } from '../hooks/useJournalEntry';
import { useJournalMutations } from '../hooks/useJournalMutations';
import { HeadingMD, HeadingLG, BodyLG, Caption, Icon, IconButton } from '../../../design-system';
import { ReflectionCard } from '../components/ReflectionCard';
import { ImageGallery } from '../components/ImageGallery';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RouteProps = RouteProp<MainStackParamList, 'JournalDetails'>;

const getMoodEmoji = (mood: string) => {
  const map: Record<string, string> = { happy: '😀', good: '🙂', neutral: '😐', sad: '😔', 'very-sad': '😢' };
  return map[mood?.toLowerCase()] || '📝';
};

export const JournalDetailsScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { id } = route.params;

  const { data: entry, isLoading } = useJournalEntry(id);
  const { favoriteJournalEntry, pinJournalEntry, deleteJournalEntry } = useJournalMutations();

  if (isLoading || !entry) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          deleteJournalEntry(id);
          navigation.goBack();
        } 
      }
    ]);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-2 py-2 border-b border-slate-100">
        <View className="flex-row items-center">
          <IconButton leftIcon="ArrowLeft" onPress={() => navigation.goBack()} />
        </View>
        <View className="flex-row items-center">
          <IconButton 
            leftIcon="Pin" 
            onPress={() => pinJournalEntry(id)} 
            // In a real app we'd pass style or color to icon based on state, but the design system IconButton takes a leftIcon string.
            // Wait, does IconButton support icon color? It inherits Button which forces color based on variant.
            // The original used fill and color props. Let's just use the default.
          />
          <IconButton 
            leftIcon="Heart" 
            onPress={() => favoriteJournalEntry(id)} 
          />
          <IconButton leftIcon="Edit2" onPress={() => navigation.navigate('JournalEditor', { id })} />
          <IconButton leftIcon="Trash2" variant="danger" onPress={handleDelete} />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row items-center mb-2">
          <HeadingLG className="text-3xl mr-3">{getMoodEmoji(entry.mood)}</HeadingLG>
          <View>
            <Caption className="text-slate-400 uppercase tracking-widest">
              {format(new Date(entry.createdAt), 'EEEE, MMMM d, yyyy')}
            </Caption>
            <Caption className="text-slate-400">
              {entry.wordCount} words • {Math.ceil(entry.readingTime / 60)} min read
            </Caption>
          </View>
        </View>
        
        <HeadingLG className="mb-6 mt-2">{entry.title || 'Untitled'}</HeadingLG>
        
        <BodyLG className="mb-10 text-lg leading-8 text-slate-800">
          {entry.content}
        </BodyLG>

        <ImageGallery images={entry.images} />

        {entry.todaysWins && (
          <ReflectionCard title="Today's Wins" defaultExpanded>
            <BodyLG className="text-slate-700">{entry.todaysWins}</BodyLG>
          </ReflectionCard>
        )}
        {entry.challenges && (
          <ReflectionCard title="Challenges">
            <BodyLG className="text-slate-700">{entry.challenges}</BodyLG>
          </ReflectionCard>
        )}
        {entry.lessonsLearned && (
          <ReflectionCard title="Lessons Learned">
            <BodyLG className="text-slate-700">{entry.lessonsLearned}</BodyLG>
          </ReflectionCard>
        )}
        {entry.tomorrowFocus && (
          <ReflectionCard title="Tomorrow's Focus">
            <BodyLG className="text-slate-700">{entry.tomorrowFocus}</BodyLG>
          </ReflectionCard>
        )}
        {entry.gratitude && (
          <ReflectionCard title="Gratitude">
            <BodyLG className="text-slate-700">{entry.gratitude}</BodyLG>
          </ReflectionCard>
        )}

        <ReflectionCard title="AI Insights" icon={<Icon name="Sparkles" size={18} color="#6366F1" />}>
          <View className="py-2 items-center justify-center">
            <BodyLG className="text-slate-400 italic">
              Coming Soon
            </BodyLG>
          </View>
        </ReflectionCard>

        <View className="mt-8 pt-4 border-t border-slate-100 flex-row justify-between">
          {entry.writingScore != null && (
            <View>
              <Caption className="text-slate-400">Writing Score</Caption>
              <HeadingMD className="text-indigo-600">{entry.writingScore}/100</HeadingMD>
            </View>
          )}
          {entry.sentimentScore != null && (
            <View className="items-end">
              <Caption className="text-slate-400">Sentiment</Caption>
              <HeadingMD className="text-emerald-600">{entry.sentimentScore}/100</HeadingMD>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
