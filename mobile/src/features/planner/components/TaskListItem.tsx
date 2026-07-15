import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CheckCircle2, Circle, Trash2, Undo2 } from 'lucide-react-native';
import { BodyMD, Caption, ListCard } from '../../../design-system';
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

  const renderRightActions = (
    progress: import('react-native').Animated.AnimatedInterpolation<string | number>, 
    dragX: import('react-native').Animated.AnimatedInterpolation<string | number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Pressable 
        style={styles.deleteAction} 
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete task"
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Trash2 color={theme.colors.background.paper} size={24} />
        </Animated.View>
      </Pressable>
    );
  };

  const renderLeftActions = (
    progress: import('react-native').Animated.AnimatedInterpolation<string | number>, 
    dragX: import('react-native').Animated.AnimatedInterpolation<string | number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const actionColor = isCompleted ? '#F59E0B' : '#10B981';

    return (
      <Pressable 
        style={[styles.completeAction, { backgroundColor: actionColor }]} 
        onPress={onToggleComplete}
        accessibilityRole="button"
        accessibilityLabel={isCompleted ? "Mark incomplete" : "Mark complete"}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {isCompleted ? <Undo2 color={theme.colors.background.paper} size={24} /> : <CheckCircle2 color={theme.colors.background.paper} size={24} />}
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
      <ListCard 
        onPress={onPress} 
        style={styles.container}
      >
        <View style={styles.contentRow}>
          <Pressable 
            style={styles.checkbox} 
            onPress={onToggleComplete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isCompleted }}
          >
            {isCompleted ? (
              <CheckCircle2 color={theme.colors.success} size={24} />
            ) : (
              <Circle color="#D1D5DB" size={24} />
            )}
          </Pressable>

          <View style={styles.textContainer}>
            <BodyMD 
              className={`font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-text-light dark:text-text-dark'}`}
              numberOfLines={1}
            >
              {task.title}
            </BodyMD>
            
            {(task.dueDate || task.category) && (
              <View style={styles.metaRow}>
                {task.category && <CategoryBadge category={task.category} />}
                {task.priority !== 'low' && (
                  <View style={{ marginLeft: 6 }}>
                    <PriorityPill priority={task.priority} />
                  </View>
                )}
                {task.dueDate && (
                  <Caption className="text-text-muted ml-2">
                    {task.dueDate}
                  </Caption>
                )}
              </View>
            )}
          </View>
        </View>
      </ListCard>
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
