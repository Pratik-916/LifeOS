import React from 'react';
import { View } from 'react-native';
import { Icon, PrimaryCard, HeadingMD, HeadingXL, BodyMD, Caption } from '../../../design-system';
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
    <PrimaryCard className="mb-8 bg-blue-600 border-0 p-5 rounded-[24px]" accessible={true} accessibilityLabel={`Productivity Score ${score}`}>
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Icon name="Flame" size={20} color="#FDE047" className="mr-2" />
            <HeadingMD className="text-white">Productivity</HeadingMD>
          </View>
          
          <HeadingXL className="text-white text-5xl mb-1">
            {score} <BodyMD className="text-blue-200 text-lg">/ 100</BodyMD>
          </HeadingXL>
          
          <View className="flex-row items-center mt-2">
            <Icon name="TrendingUp" size={16} color={trendColor} className="mr-1" />
            <Caption className="text-blue-100 font-medium">
              {trendText}
            </Caption>
          </View>
          
          <Caption className="text-blue-200 mt-3">
            "You're doing great."
          </Caption>
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
    </PrimaryCard>
  );
});
HeroProductivityCard.displayName = 'HeroProductivityCard';
