import React from 'react';
import { View, ScrollView } from 'react-native';
import { InsightCard } from '../../analytics/components/InsightCard';
import { DashboardSectionTitle } from './DashboardSectionTitle';
import type { DashboardSummary } from '../../analytics/api/analytics.types';

interface InsightCarouselProps {
  summary?: DashboardSummary;
}

export const InsightCarousel = React.memo(({ summary }: InsightCarouselProps) => {
  if (!summary) return null;

  return (
    <View className="mb-8">
      <DashboardSectionTitle title="Quick Insights" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
        <View className="w-[280px] mr-4">
          <InsightCard 
            title={`${summary.currentHabitStreak} Day Streak`}
            message="Your current habit streak is going strong."
            type="positive"
          />
        </View>
        <View className="w-[280px] mr-4">
          <InsightCard 
            title={`Productivity ${summary.productivityScore}/100`}
            message="Your daily productivity score."
            type={summary.productivityScore > 70 ? 'positive' : 'neutral'}
          />
        </View>
        <View className="w-[280px] mr-4">
          <InsightCard 
            title={`${summary.journalEntriesThisWeek} Journal Entries`}
            message="Entries written this week."
            type="positive"
          />
        </View>
      </ScrollView>
    </View>
  );
});
InsightCarousel.displayName = 'InsightCarousel';
