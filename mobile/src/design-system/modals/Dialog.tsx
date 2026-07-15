import { useTheme } from '../../../theme/ThemeProvider';
import React, { useEffect } from 'react';
import { View, Modal, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { HeadingMD, BodyMD } from '../text/Typography';
import { PrimaryButton, SecondaryButton } from '../buttons/Button';
import { Icon } from '../icons/IconProvider';

// Very simple ActionSheet implementation on top of BottomSheet.
import { BottomSheet } from './BottomSheet';

export interface DialogProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
}

export const Dialog = ({ visible, onClose, title, description, children, dismissible = true }: DialogProps) => {
  const { theme } = useTheme();

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 150 });
      scale.value = withSpring(1, { damping: 20, stiffness: 100 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withSpring(0.9, { damping: 20, stiffness: 100 });
    }
  }, [visible, opacity, scale]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={() => dismissible && onClose?.()}>
      <View style={StyleSheet.absoluteFill} className="items-center justify-center p-6">
        <Animated.View style={[StyleSheet.absoluteFill, animatedBackdropStyle]}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(15, 23, 42, 0.5)' }]}
            onPress={() => dismissible && onClose?.()}
          />
        </Animated.View>
        <Animated.View
          style={animatedContentStyle}
          className="bg-surface-light dark:bg-surface-dark w-full max-w-sm rounded-3xl p-6"
        >
          {title && <HeadingMD className="mb-2">{title}</HeadingMD>}
          {description && <BodyMD className="text-text-muted mb-4">{description}</BodyMD>}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export interface ConfirmationDialogProps extends DialogProps {
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmationDialog = ({ onConfirm, onClose, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive, ...props }: ConfirmationDialogProps) => (
  <Dialog onClose={onClose} {...props}>
    <View className="flex-row items-center justify-end mt-4 space-x-3">
      <SecondaryButton title={cancelText} onPress={onClose} />
      <PrimaryButton accessibilityRole="button" accessibilityLabel="Button" title={confirmText} onPress={onConfirm} variant={isDestructive ? 'danger' : 'primary'} />
    </View>
  </Dialog>
);

export const LoadingDialog = ({ message = 'Loading...', ...props }: Omit<DialogProps, 'title' | 'description' | 'children' | 'dismissible' | 'onClose'> & { message?: string }) => (
  <Dialog dismissible={false} {...props}>
    <View className="items-center justify-center py-4">
      <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      <BodyMD className="mt-4">{message}</BodyMD>
    </View>
  </Dialog>
);

export const SuccessDialog = ({ message, onClose, ...props }: DialogProps & { message: string }) => (
  <Dialog onClose={onClose} {...props}>
    <View className="items-center justify-center py-4">
      <View className="h-16 w-16 bg-success/20 rounded-full items-center justify-center mb-4">
        <Icon name="CheckCircle" size={32} color={theme.colors.success} />
      </View>
      <BodyMD className="text-center mb-6">{message}</BodyMD>
      <PrimaryButton accessibilityRole="button" accessibilityLabel="Button" title="OK" onPress={onClose} className="w-full" />
    </View>
  </Dialog>
);

export const ErrorDialog = ({ message, onClose, ...props }: DialogProps & { message: string }) => (
  <Dialog onClose={onClose} {...props}>
    <View className="items-center justify-center py-4">
      <View className="h-16 w-16 bg-danger/20 rounded-full items-center justify-center mb-4">
        <Icon name="XCircle" size={32} color={theme.colors.danger} />
      </View>
      <BodyMD className="text-center mb-6">{message}</BodyMD>
      <PrimaryButton accessibilityRole="button" accessibilityLabel="Button" title="Close" onPress={onClose} variant="danger" className="w-full" />
    </View>
  </Dialog>
);

export interface ActionSheetItem {
  label: string;
  icon?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  items: ActionSheetItem[];
}

export const ActionSheet = ({ visible, onClose, items }: ActionSheetProps) => (
  <BottomSheet visible={visible} onClose={onClose} height={items.length * 60 + 100}>
    <View className="pb-8">
      {items.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => {
            item.onPress();
            onClose();
          }}
          className={`flex-row items-center py-4 border-b border-secondary-100 dark:border-secondary-900 ${index === items.length - 1 ? 'border-b-0' : ''}`}
        >
          {item.icon && <Icon name={item.icon} size={24} color={item.isDestructive ? '#EF4444' : '#94A3B8'} className="mr-3" />}
          <BodyMD className={item.isDestructive ? 'text-danger' : ''}>{item.label}</BodyMD>
        </Pressable>
      ))}
    </View>
  </BottomSheet>
);
