import React, { useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Edit2, ArrowLeft, Heart, Archive, Trash2, Calendar, LayoutList } from 'lucide-react-native';

import { MainStackParamList } from '../../../navigation/types';
import { useGoal } from '../hooks/useGoal';
import { useGoalMutations } from '../hooks/useGoalMutations';
import { Typography } from '../../../components/ui/Typography';
import { StatusBadge, PriorityBadge, CategoryChip } from '../components/GoalBadges';
import { GoalProgressBar } from '../components/GoalProgressBar';
import { MilestoneCard } from '../components/MilestoneCard';
import { differenceInDays, parseISO } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type DetailsRouteProp = RouteProp<MainStackParamList, 'GoalDetails'>;

export const GoalDetailsScreen = () => {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { id } = route.params;

  const { data: goal, isLoading } = useGoal(id);
  const { favoriteGoal, archiveGoal, deleteGoal, updateGoal } = useGoalMutations();

  useEffect(() => {
    // Basic celebration if goal just reached 100
    // In a real app we'd use a robust celebration library like Lottie
  }, [goal?.progress]);

  if (isLoading || !goal) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Typography variant="body" className="text-slate-500">Loading goal...</Typography>
      </SafeAreaView>
    );
  }

  const daysRemaining = goal.targetDate ? differenceInDays(parseISO(goal.targetDate), new Date()) : null;

  const handleDelete = () => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => {
          deleteGoal(goal.id);
          navigation.goBack();
        }
      }
    ]);
  };

  const handleMilestoneToggle = (milestoneId: string, currentCompleted: boolean) => {
    // Quick optimistic milestone completion by updating the goal payload
    const updatedMilestones = goal.milestones.map((m) => 
      m.id === milestoneId ? { ...m, completed: !currentCompleted } : m
    );
    // Notice: we map back to DTO keys since the backend expects them
    const dtoMilestones = updatedMilestones.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      due_date: m.dueDate,
      is_completed: m.completed,
      completed_at: m.completedAt,
    }));
    
    updateGoal({ id: goal.id, payload: { milestones: dtoMilestones } });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity onPress={() => favoriteGoal({ id: goal.id, isFavorite: !goal.favorite })} className="p-2">
            <Heart size={22} color={goal.favorite ? '#E11D48' : '#64748B'} fill={goal.favorite ? '#E11D48' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => archiveGoal(goal.id)} className="p-2 ml-1">
            <Archive size={22} color={goal.status === 'archived' ? '#4F46E5' : '#64748B'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('GoalEditor', { id: goal.id })} className="p-2 ml-1">
            <Edit2 size={22} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="p-2 ml-1">
            <Trash2 size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-5">
        <View className="flex-row items-center mb-3 space-x-2">
          <CategoryChip category={goal.category} />
          <StatusBadge status={goal.status} />
          <PriorityBadge priority={goal.priority} />
        </View>

        <Typography variant="h1" className="text-2xl text-slate-900 mb-2">{goal.title}</Typography>
        
        {goal.description ? (
          <Typography variant="body" className="text-slate-600 mb-6 leading-6">
            {goal.description}
          </Typography>
        ) : <View className="mb-6" />}

        {/* Progress Card */}
        <View className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
          <View className="flex-row justify-between items-end mb-2">
            <Typography variant="body" className="font-medium text-slate-700">Overall Progress</Typography>
            <Typography variant="h3" className="text-indigo-600">{Math.round(goal.progress)}%</Typography>
          </View>
          <GoalProgressBar progress={goal.progress} color={goal.color || '#6366F1'} />
          
          <View className="flex-row justify-between mt-4">
            <View className="flex-row items-center">
              <Calendar size={16} color="#64748B" />
              <Typography variant="caption" className="text-slate-600 ml-2">
                Target: {goal.targetDate}
              </Typography>
            </View>
            {daysRemaining !== null && goal.status !== 'completed' && goal.status !== 'archived' && (
              <Typography variant="caption" className={daysRemaining < 0 ? 'text-rose-600 font-medium' : 'text-slate-600 font-medium'}>
                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
              </Typography>
            )}
          </View>
        </View>

        {/* Milestones */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <LayoutList size={20} color="#0F172A" />
            <Typography variant="h3" className="text-slate-900 ml-2">Milestones</Typography>
          </View>
          
          {goal.milestones.length === 0 ? (
            <View className="py-4 items-center">
              <Typography variant="body" className="text-slate-400">No milestones attached.</Typography>
            </View>
          ) : (
            goal.milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onToggle={() => handleMilestoneToggle(milestone.id, milestone.completed)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
