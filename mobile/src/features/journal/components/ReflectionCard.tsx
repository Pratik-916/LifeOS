import React, { useState } from 'react';
import { View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';

interface ReflectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const ReflectionCard = ({ title, icon, children, defaultExpanded = false }: ReflectionCardProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Card className="mb-3 overflow-hidden border-slate-200 shadow-none border">
      <TouchableOpacity 
        className="p-4 flex-row items-center justify-between"
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          {icon && <View className="mr-3">{icon}</View>}
          <Typography variant="h3">{title}</Typography>
        </View>
        {expanded ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
      </TouchableOpacity>
      
      {expanded && (
        <View className="px-4 pb-4 pt-1 border-t border-slate-100">
          {children}
        </View>
      )}
    </Card>
  );
};
