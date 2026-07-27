import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react-native';
import { BodyMD, Caption, ListCard } from '../../../design-system';
import type { Task } from '../api/planner.types';

interface TaskListItemProps {
  task: Task;
  onPress: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
  onReschedule?: () => void;
  rescheduleLabel?: string;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onPress,
  onToggleComplete,
  onDelete,
  onReschedule,
  rescheduleLabel,
}) => {
  const isCompleted = task.status === 'completed';
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handleToggle = () => {
    onToggleComplete();
  };

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
          <Trash2 color="#FFFFFF" size={24} />
        </Animated.View>
      </Pressable>
    );
  };

  const renderLeftActions = (
    progress: import('react-native').Animated.AnimatedInterpolation<string | number>, 
    dragX: import('react-native').Animated.AnimatedInterpolation<string | number>
  ) => {
    if (isCompleted || !onReschedule || !rescheduleLabel) return null;

    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Pressable 
        style={styles.rescheduleAction} 
        onPress={onReschedule}
        accessibilityRole="button"
        accessibilityLabel={`Reschedule to ${rescheduleLabel}`}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <BodyMD className="text-white font-medium">{rescheduleLabel}</BodyMD>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
      <ListCard 
        onPress={onPress} 
        style={[styles.container, isCompleted && styles.completedContainer]}
      >
        <View style={styles.contentRow}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable 
              style={styles.checkbox} 
              onPress={handleToggle}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isCompleted }}
              testID={`checkbox-${task.title}`}
            >
              {isCompleted ? (
                <CheckCircle2 color="#9CA3AF" size={24} />
              ) : (
                <Circle color="#D1D5DB" size={24} />
              )}
            </Pressable>
          </Animated.View>

          <View style={styles.textContainer}>
            <BodyMD 
              className={`font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}
              numberOfLines={1}
            >
              {task.title}
            </BodyMD>
            
            {(!isCompleted && (task.dueTime || task.category !== 'General')) && (
              <View style={styles.metaRow}>
                {task.dueTime && (
                  <Caption className="text-slate-400 mr-2">
                    {task.dueTime}
                  </Caption>
                )}
                {task.category && task.category !== 'General' && (
                  <Caption className="text-slate-400">
                    • {task.category}
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  completedContainer: {
    opacity: 0.6,
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
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
    width: 100,
  },
  rescheduleAction: {
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 24,
    width: 100,
  }
});
