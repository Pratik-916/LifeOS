import React, { useCallback, useMemo } from 'react';
import { View, SectionList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../../navigation/types';
import { useJourneyTimeline, useJourneyStatistics, useJourneyMutations } from '../hooks';
import { MemoryCard } from '../components/MemoryCard';
import { YearHeader, MonthHeader } from '../components/TimelineHeaders';
import { JourneyStatisticsCard } from '../components/JourneyStatisticsCard';
import { JourneySkeleton } from '../components/JourneySkeleton';
import { JourneyEmptyState } from '../components/JourneyEmptyState';
import { Plus, Search } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const JourneyScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const { data: timeline, isLoading, isFetching, refetch } = useJourneyTimeline();
  const { data: stats, isLoading: statsLoading } = useJourneyStatistics();
  const { favoriteMemory, pinMemory } = useJourneyMutations();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCreate = useCallback(() => {
    navigation.navigate('MemoryEditor', {});
  }, [navigation]);

  const handleSearch = useCallback(() => {
    navigation.navigate('MemorySearch');
  }, [navigation]);

  const handleMemoryPress = useCallback((id: string) => {
    navigation.navigate('MemoryDetails', { id });
  }, [navigation]);

  // Flatten the nested Timeline structure for SectionList
  const sections = useMemo(() => {
    if (!timeline?.results) return [];
    const flattened: any[] = [];
    
    timeline.results.forEach(yearGroup => {
      yearGroup.months.forEach((monthGroup, index) => {
        flattened.push({
          year: index === 0 ? yearGroup.year : null,
          month: monthGroup.month,
          data: monthGroup.events,
        });
      });
    });
    
    return flattened;
  }, [timeline]);

  const renderHeader = () => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-6">
        <Typography variant="h1" className="text-3xl text-slate-900 font-extrabold tracking-tight">
          Journey
        </Typography>
        <TouchableOpacity 
          className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
          onPress={handleSearch}
        >
          <Search size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
      <JourneyStatisticsCard stats={stats} isLoading={statsLoading} />
    </View>
  );

  const renderSectionHeader = ({ section }: any) => (
    <View className="bg-white pb-2">
      {section.year && <YearHeader year={section.year} />}
      <MonthHeader month={section.month} />
    </View>
  );

  const renderItem = ({ item }: any) => (
    <MemoryCard 
      event={item}
      onPress={() => handleMemoryPress(item.entityId)}
      onFavorite={() => favoriteMemory(item.entityId)}
      onPin={() => pinMemory(item.entityId)}
    />
  );

  if (isLoading && !timeline) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="px-4 py-6">
          <JourneySkeleton />
          <JourneySkeleton />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={<JourneyEmptyState onAction={handleCreate} />}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={handleRefresh} tintColor="#4F46E5" />
        }
      />
      
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg shadow-indigo-200"
        onPress={handleCreate}
      >
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
