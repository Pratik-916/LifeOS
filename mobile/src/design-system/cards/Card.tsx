/* eslint-disable */
import React from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CardProps extends PressableProps {
  variant?: 'primary' | 'outlined' | 'glass' | 'elevated' | 'module' | 'stat' | 'list' | 'settings';
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const getCardVariantClasses = (variant: CardProps['variant']) => {
  switch (variant) {
    case 'primary':
      return 'bg-surface-light dark:bg-surface-dark rounded-2xl p-4';
    case 'outlined':
      return 'bg-transparent border border-secondary-100 dark:border-secondary-900 rounded-2xl p-4';
    case 'glass':
      return 'bg-background-light dark:bg-background-dark/70 dark:bg-black/70 rounded-2xl p-4'; // Needs blur in styling ideally
    case 'elevated':
      return 'bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-lg shadow-black/10';
    case 'module':
      return 'bg-surface-light dark:bg-surface-dark rounded-3xl p-5';
    case 'stat':
      return 'bg-surface-light dark:bg-surface-dark rounded-xl p-3 flex-1';
    case 'list':
      return 'bg-surface-light dark:bg-surface-dark rounded-xl p-3 flex-row items-center';
    case 'settings':
      return 'bg-surface-light dark:bg-surface-dark rounded-xl p-4 flex-row items-center justify-between';
    default:
      return 'bg-surface-light dark:bg-surface-dark rounded-2xl p-4';
  }
};

export const Card = React.forwardRef<View, CardProps>(
  (
    {
      variant = 'primary',
      disabled = false,
      onPress,
      onPressIn,
      onPressOut,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePressIn = (e: any) => {
      if (onPress) {
        scale.value = withSpring(0.98);
      }
      if (onPressIn) onPressIn(e);
    };

    const handlePressOut = (e: any) => {
      if (onPress) {
        scale.value = withSpring(1);
      }
      if (onPressOut) onPressOut(e);
    };

    const variantClasses = getCardVariantClasses(variant);
    const disabledClasses = disabled ? 'opacity-60' : 'opacity-100';

    // If there's no onPress, we might not want it to be a Pressable, but keeping the API simple:
    if (!onPress) {
      return (
        <View ref={ref} className={`${variantClasses} ${disabledClasses} ${className}`} {...(props as any)}>
          {children}
        </View>
      );
    }

    return (
      <AnimatedPressable
        ref={ref as any}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        className={`${variantClasses} ${disabledClasses} ${className}`}
        style={animatedStyle}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }
);

Card.displayName = 'Card';

export const PrimaryCard = (props: CardProps) => <Card variant="primary" {...props} />;
export const OutlinedCard = (props: CardProps) => <Card variant="outlined" {...props} />;
export const GlassCard = (props: CardProps) => <Card variant="glass" {...props} />;
export const ElevatedCard = (props: CardProps) => <Card variant="elevated" {...props} />;
export const ModuleCard = (props: CardProps) => <Card variant="module" {...props} />;
export const StatCard = (props: CardProps) => <Card variant="stat" {...props} />;
export const ListCard = (props: CardProps) => <Card variant="list" {...props} />;
export const SettingsCard = (props: CardProps) => <Card variant="settings" {...props} />;
