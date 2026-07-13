import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import type { JournalImageModel } from '../api/journal.types';

interface ImageGalleryProps {
  images: JournalImageModel[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images || images.length === 0) return null;

  return (
    <View className="mb-4">
      <Typography variant="label" className="mb-2">Photos</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {images.map((img) => (
          <Image 
            key={img.id}
            source={{ uri: img.image }}
            style={styles.image}
            accessible={true}
            accessibilityLabel={img.altText || img.caption || "Journal Entry Image"}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
  }
});
