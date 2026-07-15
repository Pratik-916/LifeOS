import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View } from 'react-native';
import { Caption, Icon } from '../../../design-system';

export const CategoryChip = ({ category }: { category: string }) => {
  const { theme } = useTheme();

  const config: Record<string, { bg: string, text: string }> = {
    achievement: { bg: 'bg-amber-100', text: 'text-amber-800' },
    career: { bg: 'bg-blue-100', text: 'text-blue-800' },
    education: { bg: 'bg-purple-100', text: 'text-purple-800' },
    health: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    travel: { bg: 'bg-sky-100', text: 'text-sky-800' },
    relationship: { bg: 'bg-rose-100', text: 'text-rose-800' },
    milestone: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    celebration: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    other: { bg: 'bg-slate-100', text: 'text-slate-800' },
  };

  const style = config[category] || config.other;

  return (
    <View className={`px-2 py-1 rounded-full ${style.bg}`}>
      <Caption className={`font-medium capitalize ${style.text}`}>
        {category}
      </Caption>
    </View>
  );
};

export const LocationBadge = ({ location }: { location: string }) => {
  if (!location) return null;
  return (
    <View className="flex-row items-center">
      <Icon name="MapPin" size={12} color={theme.colors.text.secondary} />
      <Caption className="text-slate-500 ml-1">
        {location}
      </Caption>
    </View>
  );
};

export const FavoriteBadge = ({ isFavorite }: { isFavorite: boolean }) => {
  if (!isFavorite) return null;
  return (
    <View className="bg-rose-50 p-1 rounded-full ml-1">
      <Icon name="Heart" size={14} color={theme.colors.rose[600]} />
    </View>
  );
};

export const PinnedBadge = ({ isPinned }: { isPinned: boolean }) => {
  if (!isPinned) return null;
  return (
    <View className="bg-amber-50 p-1 rounded-full ml-1">
      <Icon name="Pin" size={14} color="#D97706" />
    </View>
  );
};
