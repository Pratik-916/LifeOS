import React, { useCallback, useState } from 'react';
import { View, SectionList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, BarChart2, Plus } from 'lucide-react-native';
import { useJourneyTimeline } from '../hooks/useJourneyTimeline';
import { useJourneyMutations } from '../hooks/useJourneyMutations';
import { MemoryCard } from '../components/MemoryCard';
import { TimelineSection } from '../components/TimelineSection';
import { JourneySkeleton } from '../components/JourneySkeleton';
import { JourneyEmptyState } from '../components/JourneyEmptyState';
import { MemoryActionsSheet } from '../components/MemoryActionsSheet';
import { IconButton } from '../../../components/ui/IconButton';
import type { TimelineEvent } from '../api/journey.types';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

export const JourneyScreen = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } = useJourneyTimeline();
  const { favoriteMemory, pinMemory, deleteMemory } = useJourneyMutations();

  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row pr-4">
          <IconButton icon={<Search size={24} color="#374151" />} onPress={() => navigation.navigate('MemorySearch')} />
          <IconButton icon={<BarChart2 size={24} color="#374151" />} onPress={() => navigation.navigate('JourneyStatistics')} />
        </View>
      ),
    });
  }, [navigation]);

  const sections = React.useMemo(() => {
    if (!data?.pages) return [];
    
    // Grouping by "Year-Month" to avoid duplicate sections across pagination if backend returns same month across pages.
    // However, backend returns grouped by Year -> Month. We'll flatten to sections.
    const grouped: Record<string, { year: string, month: string, data: TimelineEvent[] }> = {};
    
    data.pages.forEach((page) => {
      page.results.forEach((yearGroup) => {
        yearGroup.months.forEach((monthGroup) => {
          const key = `${yearGroup.year}-${monthGroup.month}`;
          if (!grouped[key]) {
            grouped[key] = {
              year: yearGroup.year,
              month: monthGroup.month,
              data: [],
            };
          }
          grouped[key].data.push(...monthGroup.events);
        });
      });
    });

    return Object.values(grouped).map(group => ({
      title: group.month,
      year: group.year,
      data: group.data,
    }));
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLongPress = useCallback((event: TimelineEvent) => {
    if (event.entityType === 'memory') {
      setSelectedEvent(event);
      setActionSheetVisible(true);
    }
  }, []);

  const handlePress = useCallback((event: TimelineEvent) => {
    if (event.entityType === 'memory') {
      navigation.navigate('MemoryDetails', { id: event.entityId });
    }
  }, [navigation]);

  if (isLoading) return <JourneySkeleton />;

  return (
    <View className="flex-1 bg-white">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-4">
            <MemoryCard 
              event={item} 
              onPress={() => handlePress(item)} 
              onLongPress={() => handleLongPress(item)} 
            />
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View>
            {/* If it's the first month of the year shown, we could show TimelineHeader (year) */}
            <TimelineSection month={section.title} />
          </View>
        )}
        ListEmptyComponent={
          <JourneyEmptyState onAction={() => navigation.navigate('MemoryEditor', {})} />
        }
        contentContainerStyle={sections.length === 0 ? { flex: 1 } : { paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />

      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('MemoryEditor', {})}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {selectedEvent && (
        <MemoryActionsSheet
          visible={isActionSheetVisible}
          onClose={() => setActionSheetVisible(false)}
          isFavorite={selectedEvent.favorite}
          isPinned={selectedEvent.pinned}
          onToggleFavorite={() => favoriteMemory.mutate(selectedEvent.entityId)}
          onTogglePin={() => pinMemory.mutate(selectedEvent.entityId)}
          onDelete={() => deleteMemory.mutate(selectedEvent.entityId)}
        />
      )}
    </View>
  );
};
