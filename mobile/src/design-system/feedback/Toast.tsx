import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import { BodyMD } from '../text/Typography';
import { Icon } from '../icons/IconProvider';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: (id: string) => void;
}

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return { icon: 'CheckCircle', iconColor: '#10B981' };
    case 'error':
      return { icon: 'XCircle', iconColor: '#EF4444' };
    case 'warning':
      return { icon: 'AlertTriangle', iconColor: '#F59E0B' };
    case 'info':
    default:
      return { icon: 'Info', iconColor: '#3B82F6' };
  }
};

export const Toast = ({ id, message, type = 'info', duration = 3000, onHide }: ToastProps) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 200 });

    const hideTimeout = setTimeout(() => {
      translateY.value = withSpring(-100, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(onHide)(id);
        }
      });
    }, duration);

    return () => clearTimeout(hideTimeout);
  }, [id, duration, onHide, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const { icon, iconColor } = getToastStyles(type);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 50,
          left: 20,
          right: 20,
          zIndex: 9999,
          elevation: 10,
        },
        animatedStyle,
      ]}
    >
      <View className="bg-surface-light dark:bg-surface-dark border border-secondary-100 dark:border-secondary-900 rounded-xl p-4 flex-row items-center shadow-lg shadow-black/10">
        <Icon name={icon} size={24} color={iconColor} className="mr-3" />
        <BodyMD className="flex-1 font-medium">{message}</BodyMD>
      </View>
    </Animated.View>
  );
};
