import React from 'react';
import { View } from 'react-native';
import { Flame, TrendingUp } from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { ProgressRing } from '../../analytics/components/ProgressRing';

interface HeroProductivityCardProps {
  score: number;
  trend: string;
  completionPercentage: number;
}

export const HeroProductivityCard = React.memo(({ score, trend, completionPercentage }: HeroProductivityCardProps) => {
  const isPositive = trend === 'up';
  const trendColor = isPositive ? '#10B981' : '#F59E0B';
  const trendText = isPositive ? `↑ +${Math.round(completionPercentage / 10)} today` : `Keep pushing`;

  return (
    <Card className="mb-8 bg-blue-600 border-0 p-5 rounded-[24px]" accessible={true} accessibilityLabel={`Productivity Score ${score}`}>
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Flame size={20} color="#FDE047" className="mr-2" />
            <Typography variant="h3" className="text-white">Productivity</Typography>
          </View>
          
          <Typography variant="h1" className="text-white text-5xl mb-1">
            {score} <Typography variant="body" className="text-blue-200 text-lg">/ 100</Typography>
          </Typography>
          
          <View className="flex-row items-center mt-2">
            <TrendingUp size={16} color={trendColor} className="mr-1" />
            <Typography variant="caption" className="text-blue-100 font-medium">
              {trendText}
            </Typography>
          </View>
          
          <Typography variant="caption" className="text-blue-200 mt-3">
            "You're doing great."
          </Typography>
        </View>

        <View className="bg-white p-2 rounded-full shadow-sm">
          <ProgressRing 
            progress={completionPercentage} 
            size={90} 
             
            color="#2563EB" 
            label="Done" 
          />
        </View>
      </View>
    </Card>
  );
});
HeroProductivityCard.displayName = 'HeroProductivityCard';
