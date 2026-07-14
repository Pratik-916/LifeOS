import React from 'react';
import { View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { Lightbulb } from 'lucide-react-native';

interface InsightCardProps {
  title?: string;
  message: string;
  type?: 'positive' | 'negative' | 'neutral';
}

export const InsightCard = ({ title = "Insight", message, type = 'neutral' }: InsightCardProps) => {
  const bgColor = type === 'positive' ? 'bg-green-50' : type === 'negative' ? 'bg-red-50' : 'bg-blue-50';
  const iconColor = type === 'positive' ? '#16A34A' : type === 'negative' ? '#DC2626' : '#2563EB';

  return (
    <Card className={`flex-row items-start p-4 mb-3 border-l-4 ${type === 'positive' ? 'border-green-500' : type === 'negative' ? 'border-red-500' : 'border-blue-500'} ${bgColor}`}>
      <View className="mr-3 mt-1">
        <Lightbulb size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Typography variant="h3" className="text-gray-900 text-sm mb-1">{title}</Typography>
        <Typography variant="body" className="text-gray-700 text-sm">{message}</Typography>
      </View>
    </Card>
  );
};
