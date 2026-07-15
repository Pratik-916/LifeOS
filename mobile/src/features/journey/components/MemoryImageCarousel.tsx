import React from 'react';
import { View, ScrollView } from 'react-native';
import { Icon, Caption } from '../../../design-system';
import type { MemoryImage } from '../api/journey.types';

interface MemoryImageCarouselProps {
  images?: MemoryImage[];
}

export const MemoryImageCarousel = ({ images }: MemoryImageCarouselProps) => {
  if (!images || images.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 mb-2">
      {images.map((img) => (
        <View key={img.id} className="w-48 h-32 bg-gray-200 rounded-xl mr-3 items-center justify-center border border-gray-300">
          <Icon name="Image" size={32} color="#9CA3AF" />
          <Caption className="text-xs text-gray-500 mt-2">{img.caption || 'Image Placeholder'}</Caption>
        </View>
      ))}
    </ScrollView>
  );
};
