import { useTheme } from '../../../theme/ThemeProvider';
import React, { useState } from 'react';
import { View, LayoutAnimation } from 'react-native';
import { Card, HeadingMD, Icon } from '../../../design-system';

interface ReflectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const ReflectionCard = ({ title, icon, children, defaultExpanded = false }: ReflectionCardProps) => {
  const { theme } = useTheme();

  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Card 
      className="mb-3 overflow-hidden border-slate-200 shadow-none border p-4"
      onPress={toggleExpand}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {icon && <View className="mr-3">{icon}</View>}
          <HeadingMD>{title}</HeadingMD>
        </View>
        {expanded ? <Icon name="ChevronUp" size={20} color={theme.colors.text.secondary} /> : <Icon name="ChevronDown" size={20} color={theme.colors.text.secondary} />}
      </View>
      
      {expanded && (
        <View className="pt-3 mt-3 border-t border-slate-100">
          {children}
        </View>
      )}
    </Card>
  );
};
