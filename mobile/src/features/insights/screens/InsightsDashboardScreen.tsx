import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadingXL, BodyMD } from '../../../design-system';
import { useInsights } from '../hooks/useInsights';
import { InsightCard } from '../components/InsightCard';
import { InsightsEmptyState } from '../components/InsightsEmptyState';

export const InsightsDashboardScreen = () => {
  const { insights, isLoading } = useInsights();

  return (
    <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
      <View className="px-4 py-4 bg-background-light dark:bg-background-dark border-b border-secondary-100 dark:border-secondary-900">
        <HeadingXL className="text-text-primary">Insights</HeadingXL>
        <BodyMD className="text-slate-500 mt-1">Understanding your patterns</BodyMD>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => {}} />
        }
      >
        <View className="pb-24">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          ) : (
            !isLoading && <InsightsEmptyState />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
