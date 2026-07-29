import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { BodyMD, Caption, Icon } from '../../../design-system';
import type { Milestone } from '../api/goals.types';

interface MilestoneCardProps {
  milestone: Milestone;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  drag?: () => void;
  isActive?: boolean;
  isEditor?: boolean;
}

export const MilestoneCard = ({ milestone, onToggle, onEdit, onDelete, drag, isActive, isEditor }: MilestoneCardProps) => {
  const [opacityAnim] = useState(() => new Animated.Value(milestone.completed && !isEditor ? 0.6 : 1));

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: milestone.completed && !isEditor ? 0.5 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [milestone.completed, isEditor, opacityAnim]);

  return (
    <Animated.View style={{ opacity: opacityAnim }}>
      <View className={`flex-row items-center py-4 border-b border-slate-100 ${isActive ? 'bg-slate-50' : 'bg-transparent'}`}>
        {drag && (
          <TouchableOpacity onLongPress={drag} className="mr-3">
            <Icon name="GripVertical" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        )}

        {onToggle ? (
          <TouchableOpacity onPress={onToggle} className="mr-4 pl-1">
            {milestone.completed ? (
              <Icon name="CheckCircle2" size={26} color="#6366F1" />
            ) : (
              <Icon name="Circle" size={26} color="#CBD5E1" />
            )}
          </TouchableOpacity>
        ) : (
          <View className="mr-4 pl-1">
            {milestone.completed ? (
              <Icon name="CheckCircle2" size={26} color="#6366F1" />
            ) : (
              <Icon name="Circle" size={26} color="#CBD5E1" />
            )}
          </View>
        )}

        <TouchableOpacity onPress={onEdit} disabled={!onEdit} className="flex-1">
          <BodyMD 
            className={`${milestone.completed && !isEditor ? 'text-slate-500 line-through' : 'text-slate-800'}`}
          >
            {milestone.title}
          </BodyMD>
          {milestone.dueDate && (
            <Caption className="text-slate-400 mt-1">
              Due: {milestone.dueDate}
            </Caption>
          )}
        </TouchableOpacity>

        {onDelete && (
          <TouchableOpacity onPress={onDelete} className="ml-3 p-2">
            <Icon name="Trash2" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};
