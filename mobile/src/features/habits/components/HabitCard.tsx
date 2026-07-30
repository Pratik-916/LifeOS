import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { HeadingSM, Caption, Icon, BodySM } from '../../../design-system';
import { HabitProgressRing } from './HabitProgressRing';
import type { HabitModel } from '../api/habits.types';

interface HabitCardProps {
  habit: HabitModel;
  onPress: () => void;
  onLogCompletion: () => void;
  onSkip: () => void;
  linkedGoalTitle?: string;
  onGoalPress?: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onLogCompletion,
  onSkip,
  linkedGoalTitle,
  onGoalPress,
}) => {
  const isCompleted = habit.currentCount >= habit.targetCount;
  
  // Opacity animation for completion
  // Opacity animation for completion
  const [opacityAnim] = React.useState(() => new Animated.Value(isCompleted ? 0.5 : 1));

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isCompleted ? 0.5 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isCompleted, opacityAnim]);

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
        style={styles.skipAction} 
        onPress={onSkip}
        accessibilityRole="button"
        accessibilityLabel="Skip habit today"
      >
        <Animated.View style={{ transform: [{ scale }] }}>
           <BodySM className="text-slate-600 font-medium">Skip Today</BodySM>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const formattedTime = habit.reminderTime ? habit.reminderTime.substring(0, 5) : ''; // Simplify time format if needed, assuming "HH:MM" or similar
  const scheduleText = `${habit.frequency === 'daily' ? 'Daily' : 'Weekly'}${formattedTime ? ` • ${formattedTime}` : ''}`;

  return (
    <Swipeable renderRightActions={renderRightActions} friction={2}>
      <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
        <TouchableOpacity 
          style={styles.contentRow}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={onLogCompletion}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={isCompleted ? "Habit completed" : "Complete habit"}
          >
            {habit.targetCount > 1 ? (
              <HabitProgressRing 
                progress={habit.currentCount} 
                total={habit.targetCount} 
                color={habit.color || '#10B981'}
              />
            ) : isCompleted ? (
              <Icon name="CheckCircle2" color={habit.color || '#10B981'} size={28} />
            ) : (
              <Icon name="Circle" color="#CBD5E1" size={28} />
            )}
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <HeadingSM 
              className={`font-medium mb-1 ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}
              numberOfLines={1}
            >
              {habit.title}
            </HeadingSM>
            
            <View style={styles.metaRow}>
              <Caption className="text-slate-500">
                {scheduleText}
              </Caption>
              
              {!isCompleted && habit.currentStreak >= 3 && (
                <Caption className="text-indigo-500 ml-3">
                  You've shown up for {habit.currentStreak} days.
                </Caption>
              )}
            </View>
            
            {linkedGoalTitle && (
              <TouchableOpacity 
                onPress={onGoalPress}
                hitSlop={{ top: 8, bottom: 8, left: 0, right: 8 }}
                className="mt-1"
                accessibilityRole="button"
                accessibilityLabel={`Goal: ${linkedGoalTitle}`}
              >
                <Caption className="text-slate-400 font-medium">
                  Supports {linkedGoalTitle}
                </Caption>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9', // Very subtle separator
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  skipAction: {
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
    width: 120,
    marginVertical: 4,
    borderRadius: 8,
  }
});
