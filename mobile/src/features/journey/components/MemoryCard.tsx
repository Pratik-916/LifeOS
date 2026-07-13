import React from 'react';
import { View, TouchableOpacity, Image, Animated } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import type { TimelineEventModel, MemoryModel } from '../api/journey.types';
import { CategoryChip, LocationBadge, FavoriteBadge, PinnedBadge } from './JourneyBadges';
import { Heart, Pin } from 'lucide-react-native';
// @ts-expect-error swipeable
import { Swipeable } from 'react-native-gesture-handler';

interface MemoryCardProps {
  event: TimelineEventModel | MemoryModel;
  onPress: () => void;
  onLongPress?: () => void;
  onFavorite?: () => void;
  onPin?: () => void;
}

export const MemoryCard = ({ event, onPress, onLongPress, onFavorite, onPin }: MemoryCardProps) => {
  // Map fields slightly depending on if it's a TimelineEventModel or a MemoryModel
  const title = event.title;
  const description = event.description;
  const category = event.category;
  const location = 'location' in event ? event.location : ''; // timeline event might not have location
  const favorite = event.favorite;
  const pinned = event.pinned;
  const image = 'image' in event ? event.image : ('images' in event && event.images?.length > 0 ? event.images[0].image : null);

  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0.5, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        className={`w-20 justify-center items-center rounded-l-2xl ${favorite ? 'bg-slate-200' : 'bg-rose-100'}`}
        onPress={onFavorite}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Heart size={24} color={favorite ? '#64748B' : '#E11D48'} fill={favorite ? 'none' : '#E11D48'} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        className={`w-20 justify-center items-center rounded-r-2xl ${pinned ? 'bg-slate-200' : 'bg-amber-100'}`}
        onPress={onPin}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pin size={24} color={pinned ? '#64748B' : '#D97706'} fill={pinned ? 'none' : '#D97706'} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const CardContent = (
    <Card className="mb-4 overflow-hidden border border-slate-100">
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        {image && (
          <Image 
            source={{ uri: image }} 
            className="w-full h-40 bg-slate-200"
            resizeMode="cover"
          />
        )}
        
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-2">
            <CategoryChip category={category} />
            <View className="flex-row">
              <FavoriteBadge isFavorite={favorite} />
              <PinnedBadge isPinned={pinned} />
            </View>
          </View>
          
          <Typography variant="h3" className="text-slate-900 mb-1 leading-6">
            {title}
          </Typography>
          
          {description ? (
            <Typography variant="body" className="text-slate-600 mb-3" numberOfLines={2}>
              {description}
            </Typography>
          ) : null}

          {location ? (
            <LocationBadge location={location} />
          ) : null}
        </View>
      </TouchableOpacity>
    </Card>
  );

  if (!onFavorite && !onPin) return CardContent;

  return (
    <Swipeable
      renderLeftActions={onFavorite ? renderLeftActions : undefined}
      renderRightActions={onPin ? renderRightActions : undefined}
      friction={2}
      rightThreshold={40}
      leftThreshold={40}
    >
      {CardContent}
    </Swipeable>
  );
};
