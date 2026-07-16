/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainStackParamList } from '../../../navigation/types';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { useJournalMutations } from '../hooks/useJournalMutations';
import { JournalCard } from '../components/JournalCard';
import { JournalSkeleton } from '../components/JournalSkeleton';
import { BodyLG, IconButton, Icon } from '../../../design-system';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const JournalSearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useJournalEntries(debouncedTerm ? { search: debouncedTerm } : { search: '---none---' });
  const { favoriteJournalEntry, deleteJournalEntry, pinJournalEntry } = useJournalMutations();
  
  const entries = debouncedTerm ? (data?.results || []) : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderItem = useCallback(({ item }: any) => (
    <JournalCard
      entry={item}
      onPress={() => navigation.navigate('JournalDetails', { id: item.id })}
      onEdit={() => navigation.navigate('JournalEditor', { id: item.id })}
      onFavorite={() => favoriteJournalEntry(item.id)}
      onDelete={() => deleteJournalEntry(item.id)}
      onPin={() => pinJournalEntry(item.id)}
    />
  ), [navigation, favoriteJournalEntry, deleteJournalEntry, pinJournalEntry]);

  const listEmptyComponent = useCallback(() => (
    debouncedTerm ? (
      <View className="items-center justify-center p-8 mt-10">
        <BodyLG className="text-slate-500">No entries found for "{debouncedTerm}"</BodyLG>
      </View>
    ) : null
  ), [debouncedTerm]);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-2 py-2 border-b border-slate-200 bg-background-light dark:bg-background-dark">
        <IconButton leftIcon="ArrowLeft" onPress={() => navigation.goBack()} />
        <View className="flex-1 flex-row items-center bg-slate-100 rounded-lg px-3 py-2 mr-2">
          <Icon name="Search" size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-2 text-base text-slate-800"
            placeholder="Search journals..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus
          />
          {searchTerm.length > 0 && (
            <IconButton 
              leftIcon="X" 
              onPress={() => setSearchTerm('')} 
              size="sm"
            />
          )}
        </View>
      </View>

      {isLoading && debouncedTerm ? (
        <View className="pt-4"><JournalSkeleton /></View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          renderItem={renderItem}
          ListEmptyComponent={listEmptyComponent}
          initialNumToRender={10}
          windowSize={5}
          maxToRenderPerBatch={5}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
};
