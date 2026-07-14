import React from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAnalyticsDashboard } from '../hooks/useAnalyticsDashboard';
import { AnalyticsSummaryCard } from '../components/AnalyticsSummaryCard';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { InsightCard } from '../components/InsightCard';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';

import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

export const AnalyticsDashboardScreen = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const { data: summary, isLoading, refetch, isRefetching } = useAnalyticsDashboard();

  if (isLoading) return <AnalyticsSkeleton />;
  if (!summary) return <AnalyticsEmptyState onAction={refetch} />;

  return (
    <ScrollView 
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <AnalyticsSummaryCard summary={summary} />

      <Typography variant="h3" className="mt-4 mb-2">Quick Insights</Typography>
      {summary.weeklyHighlights?.length > 0 ? (
        summary.weeklyHighlights.map((highlight, index) => (
          <InsightCard 
            key={index} 
            title="Weekly Highlight" 
            message={highlight} 
            type="positive" 
          />
        ))
      ) : (
        <InsightCard 
          message="Keep up the good work to generate more insights!" 
        />
      )}

      <Typography variant="h3" className="mt-4 mb-2">Deep Dives</Typography>
      <View className="flex-row flex-wrap justify-between">
        <Button 
          title="Productivity" 
          onPress={() => navigation.navigate('Productivity')} 
          className="w-[48%] mb-2"
          variant="secondary"
        />
        <Button 
          title="Habits" 
          onPress={() => navigation.navigate('HabitAnalytics')} 
          className="w-[48%] mb-2"
          variant="secondary"
        />
        <Button 
          title="Goals" 
          onPress={() => navigation.navigate('GoalAnalytics')} 
          className="w-[48%] mb-2"
          variant="secondary"
        />
        <Button 
          title="Journal" 
          onPress={() => navigation.navigate('JournalAnalytics')} 
          className="w-[48%] mb-2"
          variant="secondary"
        />
        <Button 
          title="Journey" 
          onPress={() => navigation.navigate('JourneyAnalytics')} 
          className="w-[48%] mb-2"
          variant="secondary"
        />
        <Button 
          title="Heatmap" 
          onPress={() => navigation.navigate('Heatmap')} 
          className="w-[48%] mb-2"
          variant="secondary"
        />
      </View>

      <Typography variant="h3" className="mt-4 mb-2">Export Data</Typography>
      <View className="flex-row flex-wrap justify-between mb-8">
        <Button 
          title="Share Report" 
          onPress={() => Alert.alert('Export', 'Share functionality coming soon!')} 
          className="w-[31%] mb-2"
          variant="ghost"
        />
        <Button 
          title="Export PDF" 
          onPress={() => Alert.alert('Export', 'PDF export coming soon!')} 
          className="w-[31%] mb-2"
          variant="ghost"
        />
        <Button 
          title="Export CSV" 
          onPress={() => Alert.alert('Export', 'CSV export coming soon!')} 
          className="w-[31%] mb-2"
          variant="ghost"
        />
      </View>
    </ScrollView>
  );
};
