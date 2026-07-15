/* eslint-disable */
import React from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BodySM } from '../text/Typography';
import { Icon } from '../icons/IconProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ChipProps extends PressableProps {
  label: string;
  variant?: 'filter' | 'tag' | 'category' | 'selectable';
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  icon?: string;
  className?: string;
}

export const Chip = React.forwardRef<View, ChipProps>(
  (
    {
      label,
      variant = 'tag',
      selected = false,
      onPress,
      onRemove,
      icon,
      className = '',
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

    const handlePressIn = () => {
      if (onPress) scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
      if (onPress) scale.value = withSpring(1);
    };

    const isInteractive = !!onPress;
    
    let bgClass = 'bg-secondary-100 dark:bg-secondary-900';
    let textClass = 'text-text-muted';
    let borderClass = 'border border-transparent';

    if (variant === 'selectable' || variant === 'filter') {
      if (selected) {
        bgClass = 'bg-primary-500';
        textClass = 'text-white';
      } else {
        bgClass = 'bg-surface-light dark:bg-surface-dark';
        borderClass = 'border border-secondary-500';
      }
    } else if (variant === 'category') {
      bgClass = 'bg-modules-planner/20'; // Example default category color
      textClass = 'text-modules-planner';
    }

    const content = (
      <>
        {icon && (
          <Icon
            name={icon}
            size={14}
            className="mr-1.5"
            // Color logic could be enhanced here
          />
        )}
        <BodySM className={`font-medium ${textClass}`}>
          {label}
        </BodySM>
        {onRemove && (
          <Pressable onPress={onRemove} className="ml-1.5 p-0.5" hitSlop={8}>
            <Icon name="X" size={14} />
          </Pressable>
        )}
      </>
    );

    const containerClasses = `flex-row items-center self-start px-3 py-1.5 rounded-full ${bgClass} ${borderClass} ${className}`;

    if (isInteractive) {
      return (
        <AnimatedPressable
          ref={ref as any}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className={containerClasses}
          style={animatedStyle}
          {...props}
        >
          {content}
        </AnimatedPressable>
      );
    }

    return (
      <View ref={ref} className={containerClasses} {...(props as any)}>
        {content}
      </View>
    );
  }
);

Chip.displayName = 'Chip';

export const FilterChip = (props: Omit<ChipProps, 'variant'>) => <Chip variant="filter" {...props} />;
export const TagChip = (props: Omit<ChipProps, 'variant'>) => <Chip variant="tag" {...props} />;
export const CategoryChip = (props: Omit<ChipProps, 'variant'>) => <Chip variant="category" {...props} />;
export const SelectableChip = (props: Omit<ChipProps, 'variant'>) => <Chip variant="selectable" {...props} />;
