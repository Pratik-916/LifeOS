import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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
  const { theme } = useTheme();

  return (
    <View className={`flex-row items-center py-3 border-b border-slate-100 ${isActive ? 'bg-slate-50 opacity-70' : 'bg-background-light dark:bg-background-dark'}`}>
      {drag && (
        <TouchableOpacity onLongPress={drag} className="mr-2">
          <Icon name="GripVertical" size={20} color={theme.colors.border} />
        </TouchableOpacity>
      )}

      {onToggle ? (
        <TouchableOpacity onPress={onToggle} className="mr-3">
          {milestone.completed ? (
            <Icon name="CheckCircle2" size={24} color={theme.colors.success} />
          ) : (
            <Icon name="Circle" size={24} color={theme.colors.border} />
          )}
        </TouchableOpacity>
      ) : (
        <View className="mr-3">
          {milestone.completed ? (
            <Icon name="CheckCircle2" size={24} color={theme.colors.success} />
          ) : (
            <Icon name="Circle" size={24} color={theme.colors.border} />
          )}
        </View>
      )}

      <TouchableOpacity onPress={onEdit} disabled={!onEdit} className="flex-1">
        <BodyMD 
          className={milestone.completed && !isEditor ? 'text-slate-400 line-through' : 'text-slate-800'}
        >
          {milestone.title}
        </BodyMD>
        {milestone.dueDate && (
          <Caption className="text-slate-500 mt-1">
            Due: {milestone.dueDate}
          </Caption>
        )}
      </TouchableOpacity>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} className="ml-2 p-2">
          <Icon name="Trash2" size={18} color={theme.colors.danger} />
        </TouchableOpacity>
      )}
    </View>
  );
};
