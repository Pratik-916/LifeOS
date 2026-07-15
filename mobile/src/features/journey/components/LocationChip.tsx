import React from 'react';
import { View } from 'react-native';
import { BodyMD, Icon } from '../../../design-system';

export const LocationChip = ({ location }: { location?: string }) => {
  if (!location) return null;
  return (
    <View className="flex-row items-center">
      <Icon name="MapPin" size={14} color="#6B7280" />
      <BodyMD className="text-sm text-text-muted ml-1">{location}</BodyMD>
    </View>
  );
};
