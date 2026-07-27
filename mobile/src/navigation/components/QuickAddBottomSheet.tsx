import React from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Icon } from '../../design-system/icons/IconProvider';
import { HeadingLG, HeadingMD } from '../../design-system/text/Typography';
import { colors } from '../../design-system/tokens/colors';
import { useNavigation } from '@react-navigation/native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface QuickAddBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface QuickAddOptionProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const QuickAddOption = ({ title, icon, color, onPress }: QuickAddOptionProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => { scale.value = withSpring(0.92); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.optionCard, animatedStyle]}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Icon name={icon} size={28} color="#FFFFFF" />
      </View>
      <HeadingMD className="mt-3 text-text-light dark:text-text-dark">{title}</HeadingMD>
    </AnimatedPressable>
  );
};

export const QuickAddBottomSheet = ({ visible, onClose }: QuickAddBottomSheetProps) => {
  const navigation = useNavigation<any>();

  const handleNavigate = (route: string, screen?: string) => {
    onClose();
    // Use setTimeout to allow the modal to close smoothly before navigating
    setTimeout(() => {
      if (screen) {
        navigation.navigate(route, { screen });
      } else {
        navigation.navigate(route);
      }
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.sheetContent} className="bg-surface-light dark:bg-surface-dark">
          <View style={styles.handleBar} className="bg-secondary-500" />
          
          <HeadingLG className="mb-6 mt-2 text-center text-text-light dark:text-text-dark">Quick Add</HeadingLG>

          <View style={styles.grid}>
            <QuickAddOption 
              title="Task" 
              icon="CheckSquare" 
              color={colors.modules.planner} 
              onPress={() => handleNavigate('Planner')} 
            />
            <QuickAddOption 
              title="Habit" 
              icon="Target" 
              color={colors.modules.habits} 
              onPress={() => handleNavigate('Today')} 
            />
            <QuickAddOption 
              title="Goal" 
              icon="Trophy" 
              color={colors.modules.goals} 
              onPress={() => handleNavigate('Today')} 
            />
            <QuickAddOption 
              title="Entry" 
              icon="BookOpen" 
              color={colors.modules.journal} 
              onPress={() => handleNavigate('Journal')} 
            />
            <QuickAddOption 
              title="Memory" 
              icon="Camera" 
              color={colors.modules.memory} 
              onPress={() => handleNavigate('Journal')} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  sheetContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
    opacity: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  optionCard: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    padding: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
