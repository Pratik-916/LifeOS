import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';
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
          <ImageIcon size={32} color="#9CA3AF" />
          <Text className="text-xs text-gray-500 mt-2">{img.caption || 'Image Placeholder'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};
