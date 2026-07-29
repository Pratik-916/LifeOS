import React from 'react';
import { View, TouchableOpacity, Alert, Animated } from 'react-native';
import { HeadingMD, Caption, StatusBadge, Icon } from '../../../design-system';
import type { Goal } from '../api/goals.types';
import { differenceInDays, parseISO } from 'date-fns';
import { Swipeable } from 'react-native-gesture-handler';

interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
  onEdit?: () => void;
  onFavorite?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export const GoalCard = ({ goal, onPress, onEdit, onFavorite, onArchive, onDelete }: GoalCardProps) => {
  const daysRemaining = goal.targetDate ? differenceInDays(parseISO(goal.targetDate), new Date()) : null;

  const handleLongPress = () => {
    Alert.alert(goal.title, 'Goal Actions', [
      { text: 'Cancel', style: 'cancel' },
      ...(onEdit ? [{ text: 'Edit', onPress: onEdit }] : []),
      ...(onFavorite ? [{ text: goal.favorite ? 'Unfavorite' : 'Favorite', onPress: onFavorite }] : []),
      ...(onArchive ? [{ text: goal.status === 'archived' ? 'Unarchive' : 'Archive', onPress: onArchive }] : []),
      ...(onDelete ? [{ text: 'Delete', style: 'destructive' as const, onPress: onDelete }] : []),
    ]);
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <View className="flex-row items-center justify-center mb-4 mr-4 px-2">
        {onArchive && (
          <TouchableOpacity onPress={onArchive} className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center mr-2">
            <Animated.View style={{ transform: [{ scale }] }}>
              <Icon name="Archive" size={20} color="#64748B" />
            </Animated.View>
          </TouchableOpacity>
        )}
        {onFavorite && (
          <TouchableOpacity onPress={onFavorite} className="w-12 h-12 bg-rose-50 rounded-xl items-center justify-center">
            <Animated.View style={{ transform: [{ scale }] }}>
              <Icon name="Heart" size={20} color={goal.favorite ? '#E11D48' : '#F43F5E'} fill={goal.favorite ? '#E11D48' : 'none'} />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const completedMilestones = goal.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = goal.milestones?.length || 0;

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <TouchableOpacity onPress={onPress} onLongPress={handleLongPress} activeOpacity={0.7} className="mb-4 px-4">
        <View className="bg-white dark:bg-surface-dark p-5 rounded-2xl">
          <View className="flex-row justify-between items-start mb-1">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-1 space-x-2">
                <HeadingMD className="text-slate-900 dark:text-text-dark" numberOfLines={1}>
                  {goal.title}
                </HeadingMD>
                {goal.favorite && <Icon name="Heart" size={14} color="#E11D48" fill="#E11D48" />}
              </View>
              {!!goal.description && (
                <Caption className="text-slate-500 mb-3" numberOfLines={2}>
                  {goal.description}
                </Caption>
              )}
            </View>
            <StatusBadge label={goal.status} />
          </View>
          
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center">
              {totalMilestones > 0 ? (
                <Caption className="text-slate-600 font-medium">
                  {completedMilestones} of {totalMilestones} milestones completed
                </Caption>
              ) : (
                <Caption className="text-slate-400">
                  No milestones set
                </Caption>
              )}
            </View>
            
            <View className="flex-row items-center">
              {daysRemaining !== null && goal.status !== 'completed' && goal.status !== 'archived' && (
                <Caption className={`ml-2 ${daysRemaining < 0 ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                  {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}
                </Caption>
              )}
              {goal.status === 'completed' && (
                <Caption className="text-emerald-600 font-medium ml-2">Completed</Caption>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};
