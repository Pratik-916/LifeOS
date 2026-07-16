/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ListCard, HeadingSM, Caption, Icon } from '../../../design-system';
import { CategoryChip, FrequencyBadge, ReminderIndicator } from './HabitBadges';
import { HabitProgressRing } from './HabitProgressRing';
import type { HabitModel } from '../api/habits.types';

interface HabitCardProps {
  habit: HabitModel;
  onPress: () => void;
  onLogCompletion: () => void;
  onArchive: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onLogCompletion,
  onArchive,
}) => {
  const isCompleted = habit.currentCount >= habit.targetCount;
  const isArchived = habit.status === 'archived';

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
      <TouchableOpacity 
        style={styles.archiveAction} 
        onPress={onArchive}
        accessibilityRole="button"
        accessibilityLabel={isArchived ? "Restore habit" : "Archive habit"}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {isArchived ? <Icon name="Undo2" color="#FFFFFF" size={24} /> : <Icon name="Archive" color="#FFFFFF" size={24} />}
        </Animated.View>
      </TouchableOpacity>
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

    return (
      <TouchableOpacity 
        style={styles.completeAction} 
        onPress={onLogCompletion}
        accessibilityRole="button"
        accessibilityLabel="Complete habit"
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Icon name="CheckCircle2" color="#FFFFFF" size={24} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
      <ListCard 
        onPress={onPress} 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={[styles.container, isCompleted && styles.completedContainer] as any}
      >
        <View style={styles.contentRow}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={onLogCompletion}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Log habit"
            testID="log_habit_button"
          >
            {habit.targetCount > 1 ? (
              <HabitProgressRing 
                progress={habit.currentCount} 
                total={habit.targetCount} 
                color={habit.color || '#10B981'}
              />
            ) : isCompleted ? (
              <Icon name="CheckCircle2" color={habit.color || '#10B981'} size={32} />
            ) : (
              <Icon name="Circle" color="#D1D5DB" size={32} />
            )}
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <HeadingSM 
                className={`font-medium ${isArchived ? 'text-gray-400' : 'text-text-light dark:text-text-dark'}`}
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {habit.title}
              </HeadingSM>
              {habit.isFavorite && (
                <Icon name="Star" size={16} color="#F59E0B" className="ml-1" />
              )}
            </View>
            
            <View style={styles.metaRow}>
              <CategoryChip category={habit.category} />
              <FrequencyBadge frequency={habit.frequency} />
              <ReminderIndicator enabled={habit.reminderEnabled} />
              
              {habit.currentStreak > 0 && (
                <View style={styles.streakBadge}>
                  <Icon name="Flame" size={12} color="#F97316" />
                  <Caption className="text-orange-600 font-bold ml-1">
                    {habit.currentStreak}
                  </Caption>
                </View>
              )}
            </View>
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
  completedContainer: {
    backgroundColor: '#F8FAFC',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEDD5', // Orange 50
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  archiveAction: {
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
    width: 100,
  },
  completeAction: {
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 24,
    width: 100,
  }
});
