import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, ArrowLeft, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MainStackParamList } from '../../../navigation/types';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { JournalCard } from '../components/JournalCard';
import { JournalSkeleton } from '../components/JournalSkeleton';
import { Typography } from '../../../components/ui/Typography';
import { IconButton } from '../../../components/ui/IconButton';

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
  
  const entries = debouncedTerm ? (data?.results || []) : [];

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-2 py-2 border-b border-slate-200 bg-white">
        <IconButton icon={<ArrowLeft size={24} color="#1E293B" />} onPress={() => navigation.goBack()} />
        <View className="flex-1 flex-row items-center bg-slate-100 rounded-lg px-3 py-2 mr-2">
          <Search size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-2 text-base text-slate-800"
            placeholder="Search journals..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus
          />
          {searchTerm.length > 0 && (
            <IconButton 
              icon={<X size={16} color="#94A3B8" />} 
              onPress={() => setSearchTerm('')} 
              style={{ padding: 4 }}
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
          renderItem={({ item }) => (
            <JournalCard
              entry={item}
              onPress={() => navigation.navigate('JournalDetails', { id: item.id })}
            />
          )}
          ListEmptyComponent={
            debouncedTerm ? (
              <View className="items-center justify-center p-8 mt-10">
                <Typography variant="body" className="text-slate-500">No entries found for "{debouncedTerm}"</Typography>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};
