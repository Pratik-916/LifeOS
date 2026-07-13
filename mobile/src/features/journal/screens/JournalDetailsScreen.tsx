import React from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Edit2, ArrowLeft, Heart, Pin, Trash2, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';

import { MainStackParamList } from '../../../navigation/types';
import { useJournalEntry } from '../hooks/useJournalEntry';
import { useJournalMutations } from '../hooks/useJournalMutations';
import { Typography } from '../../../components/ui/Typography';
import { IconButton } from '../../../components/ui/IconButton';
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
          <IconButton icon={<ArrowLeft size={24} color="#1E293B" />} onPress={() => navigation.goBack()} />
        </View>
        <View className="flex-row items-center">
          <IconButton 
            icon={<Pin size={22} color={entry.isPinned ? "#64748B" : "#CBD5E1"} fill={entry.isPinned ? "#64748B" : "transparent"} />} 
            onPress={() => pinJournalEntry(id)} 
          />
          <IconButton 
            icon={<Heart size={22} color={entry.isFavorite ? "#F43F5E" : "#CBD5E1"} fill={entry.isFavorite ? "#F43F5E" : "transparent"} />} 
            onPress={() => favoriteJournalEntry(id)} 
          />
          <IconButton icon={<Edit2 size={22} color="#1E293B" />} onPress={() => navigation.navigate('JournalEditor', { id })} />
          <IconButton icon={<Trash2 size={22} color="#EF4444" />} onPress={handleDelete} />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row items-center mb-2">
          <Typography className="text-3xl mr-3">{getMoodEmoji(entry.mood)}</Typography>
          <View>
            <Typography variant="caption" className="text-slate-400 uppercase tracking-widest">
              {format(new Date(entry.createdAt), 'EEEE, MMMM d, yyyy')}
            </Typography>
            <Typography variant="caption" className="text-slate-400">
              {entry.wordCount} words • {Math.ceil(entry.readingTime / 60)} min read
            </Typography>
          </View>
        </View>
        
        <Typography variant="h2" className="mb-6 mt-2">{entry.title || 'Untitled'}</Typography>
        
        <Typography variant="body" className="mb-10 text-lg leading-8 text-slate-800">
          {entry.content}
        </Typography>

        <ImageGallery images={entry.images} />

        {entry.todaysWins && (
          <ReflectionCard title="Today's Wins" defaultExpanded>
            <Typography variant="body" className="text-slate-700">{entry.todaysWins}</Typography>
          </ReflectionCard>
        )}
        {entry.challenges && (
          <ReflectionCard title="Challenges">
            <Typography variant="body" className="text-slate-700">{entry.challenges}</Typography>
          </ReflectionCard>
        )}
        {entry.lessonsLearned && (
          <ReflectionCard title="Lessons Learned">
            <Typography variant="body" className="text-slate-700">{entry.lessonsLearned}</Typography>
          </ReflectionCard>
        )}
        {entry.tomorrowFocus && (
          <ReflectionCard title="Tomorrow's Focus">
            <Typography variant="body" className="text-slate-700">{entry.tomorrowFocus}</Typography>
          </ReflectionCard>
        )}
        {entry.gratitude && (
          <ReflectionCard title="Gratitude">
            <Typography variant="body" className="text-slate-700">{entry.gratitude}</Typography>
          </ReflectionCard>
        )}

        <ReflectionCard title="AI Insights" icon={<Sparkles size={18} color="#6366F1" />}>
          <View className="py-2 items-center justify-center">
            <Typography variant="body" className="text-slate-400 italic">
              Coming Soon
            </Typography>
          </View>
        </ReflectionCard>

        <View className="mt-8 pt-4 border-t border-slate-100 flex-row justify-between">
          {entry.writingScore != null && (
            <View>
              <Typography variant="caption" className="text-slate-400">Writing Score</Typography>
              <Typography variant="h3" className="text-indigo-600">{entry.writingScore}/100</Typography>
            </View>
          )}
          {entry.sentimentScore != null && (
            <View className="items-end">
              <Typography variant="caption" className="text-slate-400">Sentiment</Typography>
              <Typography variant="h3" className="text-emerald-600">{entry.sentimentScore}/100</Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
