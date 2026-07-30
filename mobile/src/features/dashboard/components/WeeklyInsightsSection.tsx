import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryCard, HeadingMD, BodyMD, SecondaryButton, Icon } from '../../../design-system';
import { DashboardSectionTitle } from './DashboardSectionTitle';
import { MainStackParamList } from '../../../navigation/types';
import { useInsights } from '../../insights/hooks/useInsights';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const WeeklyInsightsSection = React.memo(() => {
  const navigation = useNavigation<NavigationProp>();
  const { insights } = useInsights();
  
  // Pick the most severe insight, or just the first one
  const topInsight = insights.length > 0 ? insights[0] : null;

  return (
    <View className="mb-8">
      <DashboardSectionTitle title="This week's insight" />
      <PrimaryCard className="p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <View className="flex-row items-start mb-4">
          <View className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 items-center justify-center mr-4">
            <Icon name="Lightbulb" size={24} color="#4F46E5" />
          </View>
          <View className="flex-1 mt-1">
            {topInsight ? (
              <>
                <HeadingMD className="text-text-light dark:text-text-dark mb-1">
                  Pattern Identified
                </HeadingMD>
                <BodyMD className="text-slate-600 dark:text-slate-400 leading-6">
                  {/* Simplistic preview of the insight. Ideally InsightCard logic could be shared. */}
                  You have a new insight regarding your goals and habits.
                </BodyMD>
              </>
            ) : (
              <>
                <HeadingMD className="text-text-light dark:text-text-dark mb-1">
                  Gathering Insights
                </HeadingMD>
                <BodyMD className="text-slate-600 dark:text-slate-400 leading-6">
                  As you complete tasks and habits, meaningful patterns will appear here.
                </BodyMD>
              </>
            )}
          </View>
        </View>

        <SecondaryButton 
          title={topInsight ? "Read Full Insight" : "View Insights"} 
          onPress={() => navigation.navigate('InsightsDashboard')}
        />
      </PrimaryCard>
    </View>
  );
});

WeeklyInsightsSection.displayName = 'WeeklyInsightsSection';
