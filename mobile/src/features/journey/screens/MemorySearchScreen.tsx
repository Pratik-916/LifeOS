import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../../navigation/types';
import { useMemories, useJourneyMutations } from '../hooks';
import { MemoryCard } from '../components/MemoryCard';
import { JourneySkeleton } from '../components/JourneySkeleton';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const MemorySearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { favoriteMemory, pinMemory } = useJourneyMutations();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: memoriesPaginated, isLoading } = useMemories({
    search: debouncedQuery,
  });

  const handleMemoryPress = useCallback((id: string) => {
    navigation.navigate('MemoryDetails', { id });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-4 py-2 border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-1">
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        
        <View className="flex-1 flex-row items-center bg-slate-100 rounded-xl px-3 py-2">
          <Search size={18} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-slate-900 text-base"
            placeholder="Search memories..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-1 bg-slate-50">
        {isLoading ? (
          <View className="p-4">
            <JourneySkeleton />
            <JourneySkeleton />
          </View>
        ) : (
          <FlatList
            data={memoriesPaginated?.results || []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <MemoryCard
                event={item}
                onPress={() => handleMemoryPress(item.id)}
                onFavorite={() => favoriteMemory(item.id)}
                onPin={() => pinMemory(item.id)}
              />
            )}
            ListEmptyComponent={
              debouncedQuery.length > 0 ? (
                <View className="py-12 items-center">
                  <Search size={48} color="#CBD5E1" />
                  <Typography variant="h3" className="mt-4 text-slate-500">
                    No memories found
                  </Typography>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};
