import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Icon } from '../../design-system/icons/IconProvider';
import { colors } from '../../design-system/tokens/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CustomTabBarButtonProps {
  onPress: () => void;
}

export const CustomTabBarButton = ({ onPress }: CustomTabBarButtonProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => { scale.value = withSpring(0.9); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, animatedStyle]}
      >
        <Icon name="Plus" size={32} color="#FFFFFF" />
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: -24, // Elevate above the tab bar
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  }
});
