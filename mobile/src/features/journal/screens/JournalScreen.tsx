import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';

import { useJournalEntries } from '../hooks/useJournalEntries';
import { useJournalStats } from '../hooks/useJournalStats';
import { useJournalMutations } from '../hooks/useJournalMutations';
import { JournalCard } from '../components/JournalCard';
import { JournalStatisticsCard } from '../components/JournalStatisticsCard';
import { JournalSkeleton } from '../components/JournalSkeleton';
import { JournalEmptyState } from '../components/JournalEmptyState';
import { HeadingXL, IconButton, FloatingActionButton } from '../../../design-system';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const JournalScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data: paginatedData, isLoading, refetch, isRefetching } = useJournalEntries();
  const { data: statsData } = useJournalStats();
  const { favoriteJournalEntry, deleteJournalEntry, pinJournalEntry } = useJournalMutations();

  const entries = paginatedData?.results || [];
  
  const handleCreate = () => {
    navigation.navigate('JournalEditor', {});
  };

  const handleSearch = () => {
    navigation.navigate('JournalSearch');
  };

  const renderHeader = () => (
    <View>
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <HeadingXL>Journal</HeadingXL>
        <IconButton 
          leftIcon="Search" 
          onPress={handleSearch} 
        />
      </View>
      {statsData && <JournalStatisticsCard stats={statsData} />}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50">
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          isLoading ? <JournalSkeleton /> : <JournalEmptyState onAction={handleCreate} />
        }
        renderItem={({ item }) => (
          <JournalCard
            entry={item}
            onPress={() => navigation.navigate('JournalDetails', { id: item.id })}
            onEdit={() => navigation.navigate('JournalEditor', { id: item.id })}
            onFavorite={() => favoriteJournalEntry(item.id)}
            onDelete={() => deleteJournalEntry(item.id)}
            onPin={() => pinJournalEntry(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#4F46E5" />
        }
      />
      <FloatingActionButton
        leftIcon="Plus"
        onPress={handleCreate}
      />
    </SafeAreaView>
  );
};
