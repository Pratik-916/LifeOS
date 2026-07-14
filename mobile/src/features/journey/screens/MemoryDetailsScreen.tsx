import React, { useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Edit2, Share as ShareIcon, Trash2 } from 'lucide-react-native';
import { useMemory } from '../hooks/useMemory';
import { useJourneyMutations } from '../hooks/useJourneyMutations';
import { Typography } from '../../../components/ui/Typography';
import { IconButton } from '../../../components/ui/IconButton';
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
            <IconButton icon={<Edit2 size={22} color="#374151" />} onPress={() => navigation.navigate('MemoryEditor', { id: memory.id })} />
            <IconButton icon={<ShareIcon size={22} color="#374151" />} onPress={handleShare} />
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
      <Typography variant="h1" className="mb-2 text-gray-900">{memory.title}</Typography>
      
      <View className="flex-row items-center flex-wrap mb-4">
        {memory.date && <Typography variant="caption" className="mr-4">{format(new Date(memory.date), 'PPPP')}</Typography>}
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
        <Typography variant="body" className="text-gray-800 leading-6">
          {memory.description}
        </Typography>
      </View>

      <TouchableOpacity 
        className="flex-row items-center justify-center p-4 bg-red-50 rounded-xl mt-4 mb-10"
        onPress={handleDelete}
      >
        <Trash2 size={20} color="#EF4444" />
        <Typography variant="body" className="text-red-600 font-medium ml-2">Delete Memory</Typography>
      </TouchableOpacity>
    </ScrollView>
  );
};
