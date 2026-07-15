import React, { useLayoutEffect } from 'react';
import { View, ScrollView, Share, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useMemory } from '../hooks/useMemory';
import { useJourneyMutations } from '../hooks/useJourneyMutations';
import { HeadingXL, Caption, BodyMD, Icon, IconButton } from '../../../design-system';
import { CategoryBadge } from '../components/CategoryBadge';
import { FavoriteBadge } from '../components/FavoriteBadge';
import { PinnedBadge } from '../components/PinnedBadge';
import { LocationChip } from '../components/LocationChip';
import { MemoryImageCarousel } from '../components/MemoryImageCarousel';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

export const MemoryDetailsScreen = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'MemoryDetails'>>();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const { id } = route.params;
  const { data: memory, isLoading } = useMemory(id);
  const { deleteMemory } = useJourneyMutations();

  const handleShare = React.useCallback(async () => {
    if (!memory) return;
    try {
      await Share.share({
        message: `${memory.title}\n\n${memory.description}\n\nDate: ${memory.date ? format(new Date(memory.date), 'PP') : 'N/A'}${memory.location ? `\nLocation: ${memory.location}` : ''}`,
      });
    } catch (error) {
      console.error(error);
    }
  }, [memory]);

  const handleDelete = () => {
    deleteMemory.mutate(id, {
      onSuccess: () => navigation.goBack(),
    });
  };

  useLayoutEffect(() => {
    if (memory) {
      navigation.setOptions({
        title: 'Memory Details',
        headerRight: () => (
          <View className="flex-row">
            <IconButton leftIcon="Edit2" onPress={() => navigation.navigate('MemoryEditor', { id: memory.id })} />
            <IconButton leftIcon="Share" onPress={handleShare} />
          </View>
        ),
      });
    }
  }, [navigation, memory, handleShare]);

  if (isLoading || !memory) {
    return <View className="flex-1 bg-white" />;
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 20 }}>
      <HeadingXL className="mb-2 text-gray-900">{memory.title}</HeadingXL>
      
      <View className="flex-row items-center flex-wrap mb-4">
        {memory.date && <Caption className="mr-4">{format(new Date(memory.date), 'PPPP')}</Caption>}
        <LocationChip location={memory.location} />
      </View>

      <View className="flex-row flex-wrap mb-6">
        <PinnedBadge pinned={memory.pinned} />
        <FavoriteBadge favorite={memory.favorite} />
        {memory.category ? <CategoryBadge category={memory.category} /> : null}
      </View>

      {memory.images && memory.images.length > 0 && (
        <MemoryImageCarousel images={memory.images} />
      )}

      <View className="bg-gray-50 p-4 rounded-2xl mb-8">
        <BodyMD className="text-gray-800 leading-6">
          {memory.description}
        </BodyMD>
      </View>

      <Pressable 
        className="flex-row items-center justify-center p-4 bg-red-50 rounded-xl mt-4 mb-10"
        onPress={handleDelete}
      >
        <Icon name="Trash2" size={20} color="#EF4444" />
        <BodyMD className="text-red-600 font-medium ml-2">Delete Memory</BodyMD>
      </Pressable>
    </ScrollView>
  );
};
