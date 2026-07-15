import React from 'react';
import { View, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Card, HeadingMD, Caption, BodyMD, Icon } from '../../../design-system';
import { CategoryBadge } from './CategoryBadge';
import { FavoriteBadge } from './FavoriteBadge';
import { PinnedBadge } from './PinnedBadge';
import type { TimelineEvent } from '../api/journey.types';

interface MemoryCardProps {
  event: TimelineEvent;
  onPress: () => void;
  onLongPress?: () => void;
}

const getIcon = (iconName: string, color: string) => {
  switch (iconName.toLowerCase()) {
    case 'book': return <Icon name="Book" size={20} color={color} />;
    case 'star': return <Icon name="Star" size={20} color={color} />;
    case 'target': return <Icon name="Target" size={20} color={color} />;
    case 'check': return <Icon name="CheckCircle" size={20} color={color} />;
    default: return <Icon name="Activity" size={20} color={color} />;
  }
};

export const MemoryCard = ({ event, onPress, onLongPress }: MemoryCardProps) => {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} className="mb-4">
      <Card className="flex-row border-l-4" style={{ borderLeftColor: event.color }}>
        <View className="mr-3 mt-1">
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${event.color}15` }}>
            {getIcon(event.icon, event.color)}
          </View>
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <HeadingMD className="flex-1 mr-2 text-base">{event.title}</HeadingMD>
            {event.timestamp && (
              <Caption className="text-xs">{format(new Date(event.timestamp), 'MMM d')}</Caption>
            )}
          </View>
          
          {event.preview ? (
            <BodyMD className="mb-2 text-gray-600 text-sm" numberOfLines={3}>
              {event.preview}
            </BodyMD>
          ) : null}

          <View className="flex-row flex-wrap mt-1">
            <PinnedBadge pinned={event.pinned} />
            <FavoriteBadge favorite={event.favorite} />
            {event.category ? <CategoryBadge category={event.category} /> : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
