import React, { useEffect } from 'react';
import { View, Modal, Pressable, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number; // default to 50% of screen if not provided
}

export const BottomSheet = ({ visible, onClose, children, height = SCREEN_HEIGHT * 0.5 }: BottomSheetProps) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 90 });
    }
  }, [visible, opacity, translateY]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null; // In a real app we might want to delay unmount until animation finishes

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, animatedBackdropStyle]}>
          <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: height,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            },
            animatedContentStyle,
          ]}
          className="bg-surface-light dark:bg-surface-dark p-6"
        >
          <View className="w-12 h-1.5 bg-secondary-500 rounded-full self-center mb-6" />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};
