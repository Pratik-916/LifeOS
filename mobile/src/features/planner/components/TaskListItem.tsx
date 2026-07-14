import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CheckCircle2, Circle, Trash2, Undo2 } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';
import { CategoryBadge } from './CategoryBadge';
import { PriorityPill } from './PriorityPill';
import type { Task } from '../api/planner.types';

interface TaskListItemProps {
  task: Task;
  onPress: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onPress,
  onToggleComplete,
  onDelete,
}) => {
  const isCompleted = task.status === 'completed';

  const renderRightActions = (progress: unknown, dragX: unknown) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        style={styles.deleteAction} 
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete task"
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Trash2 color="#FFFFFF" size={24} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (progress: unknown, dragX: unknown) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const actionColor = isCompleted ? '#F59E0B' : '#10B981';

    return (
      <TouchableOpacity 
        style={[styles.completeAction, { backgroundColor: actionColor }]} 
        onPress={onToggleComplete}
        accessibilityRole="button"
        accessibilityLabel={isCompleted ? "Mark incomplete" : "Mark complete"}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {isCompleted ? <Undo2 color="#FFFFFF" size={24} /> : <CheckCircle2 color="#FFFFFF" size={24} />}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={onPress} 
        style={styles.container}
      >
        <View style={styles.contentRow}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={onToggleComplete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isCompleted }}
          >
            {isCompleted ? (
              <CheckCircle2 color="#10B981" size={24} />
            ) : (
              <Circle color="#D1D5DB" size={24} />
            )}
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <Typography 
              variant="body" 
              className={`font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}
              numberOfLines={1}
            >
              {task.title}
            </Typography>
            
            {(task.dueDate || task.category) && (
              <View style={styles.metaRow}>
                {task.category && <CategoryBadge category={task.category} />}
                {task.priority !== 'low' && (
                  <View style={{ marginLeft: 6 }}>
                    <PriorityPill priority={task.priority} />
                  </View>
                )}
                {task.dueDate && (
                  <Typography variant="caption" className="text-gray-500 ml-2">
                    {task.dueDate}
                  </Typography>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
    width: 100,
  },
  completeAction: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 24,
    width: 100,
  }
});
