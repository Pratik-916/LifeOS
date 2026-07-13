import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { CheckCircle2, Circle, GripVertical, Trash2 } from 'lucide-react-native';
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
  return (
    <View className={`flex-row items-center py-3 border-b border-slate-100 ${isActive ? 'bg-slate-50 opacity-70' : 'bg-white'}`}>
      {drag && (
        <TouchableOpacity onLongPress={drag} className="mr-2">
          <GripVertical size={20} color="#CBD5E1" />
        </TouchableOpacity>
      )}

      {onToggle ? (
        <TouchableOpacity onPress={onToggle} className="mr-3">
          {milestone.completed ? (
            <CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#CBD5E1" />
          )}
        </TouchableOpacity>
      ) : (
        <View className="mr-3">
          {milestone.completed ? (
            <CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#CBD5E1" />
          )}
        </View>
      )}

      <TouchableOpacity onPress={onEdit} disabled={!onEdit} className="flex-1">
        <Typography 
          variant="body" 
          className={milestone.completed && !isEditor ? 'text-slate-400 line-through' : 'text-slate-800'}
        >
          {milestone.title}
        </Typography>
        {milestone.dueDate && (
          <Typography variant="caption" className="text-slate-500 mt-1">
            Due: {milestone.dueDate}
          </Typography>
        )}
      </TouchableOpacity>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} className="ml-2 p-2">
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  );
};
