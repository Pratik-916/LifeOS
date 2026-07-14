import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { CategoryBadge } from './CategoryBadge';
import { FavoriteBadge } from './FavoriteBadge';
import { PinnedBadge } from './PinnedBadge';
import type { TimelineEvent } from '../api/journey.types';
import { Activity, Book, Star, Target, CheckCircle } from 'lucide-react-native';

interface MemoryCardProps {
  event: TimelineEvent;
  onPress: () => void;
  onLongPress?: () => void;
}

const getIcon = (iconName: string, color: string) => {
  switch (iconName.toLowerCase()) {
    case 'book': return <Book size={20} color={color} />;
    case 'star': return <Star size={20} color={color} />;
    case 'target': return <Target size={20} color={color} />;
    case 'check': return <CheckCircle size={20} color={color} />;
    default: return <Activity size={20} color={color} />;
  }
};

export const MemoryCard = ({ event, onPress, onLongPress }: MemoryCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7} className="mb-4">
      <Card className="flex-row border-l-4" style={{ borderLeftColor: event.color }}>
        <View className="mr-3 mt-1">
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${event.color}15` }}>
            {getIcon(event.icon, event.color)}
          </View>
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <Typography variant="h3" className="flex-1 mr-2 text-base">{event.title}</Typography>
            {event.timestamp && (
              <Typography variant="caption" className="text-xs">{format(new Date(event.timestamp), 'MMM d')}</Typography>
            )}
          </View>
          
          {event.preview ? (
            <Typography variant="body" className="mb-2 text-gray-600 text-sm" numberOfLines={3}>
              {event.preview}
            </Typography>
          ) : null}

          <View className="flex-row flex-wrap mt-1">
            <PinnedBadge pinned={event.pinned} />
            <FavoriteBadge favorite={event.favorite} />
            {event.category ? <CategoryBadge category={event.category} /> : null}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
