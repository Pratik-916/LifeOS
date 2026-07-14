import React from 'react';
import { View, TouchableOpacity, Animated, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2, Heart, Pin } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import type { JournalEntryModel } from '../api/journal.types';
import { format } from 'date-fns';

interface JournalCardProps {
  entry: JournalEntryModel;
  onPress: () => void;
  onEdit?: () => void;
  onFavorite?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
}

const getMoodEmoji = (mood: string) => {
  const map: Record<string, string> = {
    happy: '😀',
    good: '🙂',
    neutral: '😐',
    sad: '😔',
    'very-sad': '😢',
  };
  return map[mood?.toLowerCase()] || '📝';
};

export const JournalCard = ({ entry, onPress, onEdit, onFavorite, onDelete, onPin }: JournalCardProps) => {
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View className="flex-row items-center justify-end px-4">
        {onFavorite && (
          <TouchableOpacity onPress={onFavorite} className="w-12 h-12 bg-rose-500 rounded-full items-center justify-center mr-2">
            <Animated.View style={{ transform: [{ scale }] }}>
              <Heart color="white" size={20} fill={entry.isFavorite ? "white" : "transparent"} />
            </Animated.View>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} className="w-12 h-12 bg-red-500 rounded-full items-center justify-center">
            <Animated.View style={{ transform: [{ scale }] }}>
              <Trash2 color="white" size={20} />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleLongPress = () => {
    Alert.alert('Journal Entry', entry.title || 'Untitled', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit', onPress: onEdit },
      { text: entry.isFavorite ? 'Unfavorite' : 'Favorite', onPress: onFavorite },
      { text: entry.isPinned ? 'Unpin' : 'Pin', onPress: onPin },
      { text: 'Share (Coming Soon)', onPress: () => {} },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <TouchableOpacity onPress={onPress} onLongPress={handleLongPress} activeOpacity={0.7} className="mb-3 px-4">
        <Card className="p-4 flex-row justify-between items-start">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center mb-1">
              <Typography variant="h3" className="mr-2" numberOfLines={1}>{entry.title || 'Untitled Entry'}</Typography>
              {entry.isPinned && <Pin size={14} color="#64748B" />}
              {entry.isFavorite && <Heart size={14} color="#F43F5E" fill="#F43F5E" className="ml-1" />}
            </View>
            
            <Typography variant="body" className="text-slate-500 mb-2" numberOfLines={2}>
              {entry.content || 'No content...'}
            </Typography>
            
            <View className="flex-row items-center mt-1">
              <Typography variant="caption" className="text-slate-400 mr-3">
                {format(new Date(entry.createdAt), 'MMM d, yyyy')}
              </Typography>
              <Typography variant="caption" className="text-slate-400">
                {entry.wordCount} words
              </Typography>
            </View>
          </View>
          
          <View className="items-center justify-center bg-slate-100 rounded-full w-10 h-10">
            <Typography className="text-xl">{getMoodEmoji(entry.mood)}</Typography>
          </View>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );
};
