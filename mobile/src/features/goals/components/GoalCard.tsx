import React from 'react';
import { View, TouchableOpacity, Alert, Animated } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import type { Goal } from '../api/goals.types';
import { StatusBadge, PriorityBadge, CategoryChip } from './GoalBadges';
import { GoalProgressBar } from './GoalProgressBar';
import { differenceInDays, parseISO } from 'date-fns';
import { Heart, Archive, Calendar, Target } from 'lucide-react-native';
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
      <View className="flex-row items-center justify-center bg-slate-100 mb-3 mr-4 rounded-xl px-4">
        {onArchive && (
          <TouchableOpacity onPress={onArchive} className="w-10 h-10 bg-slate-200 rounded-full items-center justify-center mr-2">
            <Animated.View style={{ transform: [{ scale }] }}>
              <Archive size={20} color="#64748B" />
            </Animated.View>
          </TouchableOpacity>
        )}
        {onFavorite && (
          <TouchableOpacity onPress={onFavorite} className="w-10 h-10 bg-rose-50 rounded-full items-center justify-center">
            <Animated.View style={{ transform: [{ scale }] }}>
              <Heart size={20} color={goal.favorite ? '#E11D48' : '#F43F5E'} fill={goal.favorite ? '#E11D48' : 'none'} />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <TouchableOpacity onPress={onPress} onLongPress={handleLongPress} activeOpacity={0.7} className="mb-3 px-4">
        <Card className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-2">
              <View className="flex-row items-center mb-1 space-x-2">
                <CategoryChip category={goal.category} />
                {goal.favorite && <Heart size={12} color="#E11D48" fill="#E11D48" />}
              </View>
              <Typography variant="h3" className="text-slate-900" numberOfLines={1}>
                {goal.title}
              </Typography>
            </View>
            <View className="items-end space-y-1">
              <StatusBadge status={goal.status} />
              <PriorityBadge priority={goal.priority} />
            </View>
          </View>
          
          <View className="mt-3 mb-2">
            <View className="flex-row justify-between items-end mb-2">
              <Typography variant="label" className="text-slate-500">Progress</Typography>
              <Typography variant="label" className="text-slate-700 font-bold">{Math.round(goal.progress)}%</Typography>
            </View>
            <GoalProgressBar progress={goal.progress} color={goal.color} />
          </View>

          <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <View className="flex-row items-center">
              <Calendar size={14} color="#64748B" />
              <Typography variant="caption" className="text-slate-500 ml-1">
                {goal.targetDate}
              </Typography>
            </View>
            
            {daysRemaining !== null && goal.status !== 'completed' && goal.status !== 'archived' && (
              <View className="flex-row items-center">
                <Target size={14} color={daysRemaining < 0 ? '#E11D48' : '#64748B'} />
                <Typography variant="caption" className={`ml-1 ${daysRemaining < 0 ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                  {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}
                </Typography>
              </View>
            )}
            
            {goal.status === 'completed' && (
              <Typography variant="caption" className="text-emerald-600 font-medium">Completed</Typography>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );
};
