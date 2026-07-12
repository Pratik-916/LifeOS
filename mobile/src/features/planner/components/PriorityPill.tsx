import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';

interface PriorityPillProps {
  priority: 'low' | 'medium' | 'high';
}

export const PriorityPill: React.FC<PriorityPillProps> = ({ priority }) => {
  let bgColor = 'bg-blue-100';
  let textColor = 'text-blue-700';
  let label = 'Low';

  if (priority === 'high') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
    label = 'High';
  } else if (priority === 'medium') {
    bgColor = 'bg-orange-100';
    textColor = 'text-orange-700';
    label = 'Medium';
  }

  return (
    <View className={`${bgColor} px-2 py-1 rounded-full`}>
      <Typography variant="caption" className={`${textColor} font-medium`}>
        {label}
      </Typography>
    </View>
  );
};
