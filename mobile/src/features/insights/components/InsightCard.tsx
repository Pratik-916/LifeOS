import React from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { PrimaryCard, HeadingMD, BodyMD, Caption, Icon } from '../../../design-system';
import type { Insight } from '../api/insights.types';

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard = React.memo(({ insight }: InsightCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  
  // Translate structured data into natural language
  let title = '';
  let message = '';
  let iconName = 'Info';
  let iconColor = '#64748B'; // slate-500
  
  switch (insight.data.rule) {
    case 'GoalNeglectedRule':
      title = 'Needs Attention';
      message = `You've focused heavily on other things, but "${insight.data.goalTitle}" hasn't received attention recently.`;
      iconName = 'AlertCircle';
      iconColor = '#F59E0B'; // amber-500
      break;
    case 'HabitMomentumRule':
      title = 'Building Momentum';
      message = `This week your "${insight.data.habitTitle}" habit consistently supported your goal.`;
      iconName = 'TrendingUp';
      iconColor = '#10B981'; // emerald-500
      break;
    case 'MorningPlanningRule':
      title = 'Planning Works';
      message = `Morning planning increased your task completion. You have ${insight.data.taskCount} tasks planned while reflecting consistently.`;
      iconName = 'Sun';
      iconColor = '#6366F1'; // indigo-500
      break;
    default:
      title = 'Insight';
      message = 'An interesting pattern emerged in your routine.';
      break;
  }

  const handlePress = () => {
    if (insight.relatedGoalId) {
      navigation.navigate('GoalDetails', { id: insight.relatedGoalId });
    }
  };

  return (
    <PrimaryCard className="p-6 mb-4 shadow-sm border border-slate-100 dark:border-slate-800">
      <Pressable onPress={handlePress} disabled={!insight.relatedGoalId} accessible accessibilityRole={insight.relatedGoalId ? 'button' : 'text'} accessibilityLabel={message}>
        <View className="flex-row items-start">
          <View className="mr-4 mt-1">
            <Icon name={iconName} size={24} color={iconColor} />
          </View>
          <View className="flex-1">
            <HeadingMD className="text-text-light dark:text-text-dark mb-2">
              {title}
            </HeadingMD>
            <BodyMD className="text-slate-600 dark:text-slate-400 leading-6">
              {message}
            </BodyMD>
            
            {insight.relatedGoalId && (
              <View className="mt-4 flex-row items-center">
                <Caption className="text-indigo-600 dark:text-indigo-400 font-medium">
                  Review Goal
                </Caption>
                <Icon name="ChevronRight" size={16} color="#4F46E5" className="ml-1" />
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </PrimaryCard>
  );
});

InsightCard.displayName = 'InsightCard';
