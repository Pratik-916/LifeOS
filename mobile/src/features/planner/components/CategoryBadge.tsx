import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <View className="bg-gray-100 px-2 py-1 rounded-md">
      <Typography variant="caption" className="text-gray-600 font-medium">
        {category}
      </Typography>
    </View>
  );
};
