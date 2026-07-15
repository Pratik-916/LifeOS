import { useTheme } from '../../../theme/ThemeProvider';
import React, { useState, useCallback } from 'react';
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
  const { theme } = useTheme();

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

  const renderItem = useCallback(({ item }: { item: Memory }) => (
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
  ), [navigation]);

  const listEmptyComponent = useCallback(() => (
    debouncedSearch && !isLoading ? (
      <JourneyEmptyState isSearch />
    ) : null
  ), [debouncedSearch, isLoading]);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="p-4 border-b border-secondary-100 dark:border-secondary-900 flex-row items-center bg-surface-light dark:bg-surface-dark">
        <Icon name="Search" size={20} color={theme.colors.gray[400]} />
        <TextInput
          className="flex-1 ml-2 text-base text-text-light dark:text-text-dark py-2"
          placeholder="Search memories, locations, tags..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>

      <FlatList
        data={memories}
        keyExtractor={(item: Memory) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={{ paddingVertical: 16 }}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};
