/* eslint-disable */
import React from 'react';
import { Pressable, PressableProps, ActivityIndicator, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BodyMD } from '../text/Typography';
import { Icon } from '../icons/IconProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps extends PressableProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  className?: string;
  textClassName?: string;
  isIconButton?: boolean;
  isFloating?: boolean;
}

const getVariantClasses = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary-500 border border-primary-500';
    case 'secondary':
      return 'bg-secondary-100 dark:bg-secondary-900 border border-secondary-100 dark:border-secondary-900';
    case 'ghost':
      return 'bg-transparent border-transparent';
    case 'outline':
      return 'bg-transparent border border-secondary-500';
    case 'danger':
      return 'bg-danger border border-danger';
    default:
      return 'bg-primary-500 border border-primary-500';
  }
};

const getTextClasses = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
    case 'danger':
      return 'text-white';
    case 'secondary':
    case 'outline':
    case 'ghost':
      return 'text-text-light dark:text-text-dark';
    default:
      return 'text-white';
  }
};

const getSizeClasses = (size: ButtonProps['size'], isIconButton?: boolean) => {
  if (isIconButton) {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-14 w-14';
      default: return 'h-12 w-12';
    }
  }
  
  switch (size) {
    case 'sm': return 'px-3 py-1.5 h-8';
    case 'lg': return 'px-6 py-4 h-14';
    default: return 'px-4 py-3 h-12';
  }
};

export const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      title,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className = '',
      textClassName = '',
      isIconButton = false,
      isFloating = false,
      onPressIn,
      onPressOut,
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
      scale.value = withSpring(0.95);
      if (onPressIn) onPressIn(e);
    };

    const handlePressOut = (e: any) => {
      scale.value = withSpring(1);
      if (onPressOut) onPressOut(e);
    };

    const isDisabled = disabled || loading;

    const baseClasses = 'flex-row items-center justify-center rounded-full';
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size, isIconButton || isFloating);
    const disabledClasses = isDisabled ? 'opacity-50' : 'opacity-100';
    const floatingClasses = isFloating ? 'absolute bottom-6 right-6 shadow-lg shadow-black/20' : '';

    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
    const textColor = getTextClasses(variant).includes('text-white') ? '#FFFFFF' : '#0F172A'; // Ideally from token but fixed for now.

    return (
      <AnimatedPressable
        ref={ref}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${floatingClasses} ${className}`}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <>
            {leftIcon && <Icon name={leftIcon} size={iconSize} color={textColor} className={title ? 'mr-2' : ''} />}
            {title && (
              <BodyMD className={`font-semibold ${getTextClasses(variant)} ${textClassName}`}>
                {title}
              </BodyMD>
            )}
            {rightIcon && <Icon name={rightIcon} size={iconSize} color={textColor} className={title ? 'ml-2' : ''} />}
          </>
        )}
      </AnimatedPressable>
    );
  }
);

Button.displayName = 'Button';

export const PrimaryButton = (props: ButtonProps) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props: ButtonProps) => <Button variant="secondary" {...props} />;
export const GhostButton = (props: ButtonProps) => <Button variant="ghost" {...props} />;
export const OutlineButton = (props: ButtonProps) => <Button variant="outline" {...props} />;
export const DangerButton = (props: ButtonProps) => <Button variant="danger" {...props} />;
export const FloatingActionButton = (props: ButtonProps) => <Button isFloating isIconButton variant="primary" size="lg" {...props} />;
export const IconButton = (props: ButtonProps) => <Button isIconButton variant="ghost" {...props} />;
export const LoadingButton = (props: ButtonProps) => <Button loading {...props} />;
