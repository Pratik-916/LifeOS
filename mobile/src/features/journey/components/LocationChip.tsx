import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View } from 'react-native';
import { BodyMD, Icon } from '../../../design-system';

export const LocationChip = ({ location }: { location?: string }) => {
  const { theme } = useTheme();

  if (!location) return null;
  return (
    <View className="flex-row items-center">
      <Icon name="MapPin" size={14} color={theme.colors.gray[500]} />
      <BodyMD className="text-sm text-text-muted ml-1">{location}</BodyMD>
    </View>
  );
};
