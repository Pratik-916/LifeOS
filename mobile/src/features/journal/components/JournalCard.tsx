import React from 'react';
import { View, Animated, Alert, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Card, HeadingMD, BodySM, Caption, Icon } from '../../../design-system';
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
          <TouchableOpacity onPress={onFavorite} className="w-12 h-12 bg-danger rounded-full items-center justify-center mr-2">
            <Animated.View style={{ transform: [{ scale }] }}>
              <Icon name="Heart" color="white" size={20} fill={entry.isFavorite ? "white" : "transparent"} />
            </Animated.View>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} className="w-12 h-12 bg-danger rounded-full items-center justify-center">
            <Animated.View style={{ transform: [{ scale }] }}>
              <Icon name="Trash2" color="white" size={20} />
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
      <Card onPress={onPress} onLongPress={handleLongPress} className="mx-4 mb-3 p-4 flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-1">
            <HeadingMD className="mr-2" numberOfLines={1}>{entry.title || 'Untitled Entry'}</HeadingMD>
            {entry.isPinned && <Icon name="Pin" size={14} color="#64748B" />}
            {entry.isFavorite && <Icon name="Heart" size={14} color="#F43F5E" fill="#F43F5E" className="ml-1" />}
          </View>
          
          <BodySM className="text-slate-500 mb-2" numberOfLines={2}>
            {entry.content || 'No content...'}
          </BodySM>
          
          <View className="flex-row items-center mt-1">
            <Caption className="text-slate-400 mr-3">
              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
            </Caption>
            <Caption className="text-slate-400">
              {entry.wordCount} words
            </Caption>
          </View>
        </View>
        
        <View className="items-center justify-center bg-slate-100 rounded-full w-10 h-10">
          <HeadingMD className="text-xl">{getMoodEmoji(entry.mood)}</HeadingMD>
        </View>
      </Card>
    </Swipeable>
  );
};
