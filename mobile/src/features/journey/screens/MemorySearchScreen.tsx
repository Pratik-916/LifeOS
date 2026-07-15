import React, { useState } from 'react';
import { View, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../../../design-system';
import { useMemories } from '../hooks/useMemories';
import { MemoryCard } from '../components/MemoryCard';
import { JourneyEmptyState } from '../components/JourneyEmptyState';
import type { Memory } from '../api/journey.types';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

export const MemorySearchScreen = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [debouncedSearch, setDebouncedSearch] = useState('');
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading } = useMemories({ search: debouncedSearch });

  const memories = data?.pages.flatMap(page => page.results) || [];

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-100 flex-row items-center bg-gray-50">
        <Icon name="Search" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-2 text-base text-gray-900 py-2"
          placeholder="Search memories, locations, tags..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>

      <FlatList
        data={memories}
        keyExtractor={(item: Memory) => item.id}
        renderItem={({ item }) => (
          <View className="px-4">
            <MemoryCard 
              event={{
                id: `mem_${item.id}`,
                entityType: 'memory',
                entityId: item.id,
                title: item.title,
                description: item.description,
                timestamp: item.date,
                icon: item.icon,
                color: item.color,
                category: item.category,
                tags: item.tags,
                sourceModule: 'journey',
                visibility: item.visibility,
                favorite: item.favorite,
                pinned: item.pinned,
                preview: item.description,
                image: item.images?.[0]?.image || null,
                actionUrl: '',
                entityStatus: 'active'
              }} 
              onPress={() => navigation.navigate('MemoryDetails', { id: item.id })} 
            />
          </View>
        )}
        ListEmptyComponent={
          debouncedSearch && !isLoading ? (
            <JourneyEmptyState isSearch />
          ) : null
        }
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
};
