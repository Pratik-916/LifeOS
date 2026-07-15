import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { BodyMD } from '../text/Typography';
import { Icon } from '../icons/IconProvider';

export type BannerType = 'offline' | 'error' | 'success' | 'warning' | 'info';

export interface BannerProps {
  type: BannerType;
  message: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const getBannerStyles = (type: BannerType) => {
  switch (type) {
    case 'offline':
      return { bg: 'bg-secondary-500', icon: 'WifiOff', color: '#FFFFFF' };
    case 'error':
      return { bg: 'bg-danger', icon: 'AlertCircle', color: '#FFFFFF' };
    case 'success':
      return { bg: 'bg-success', icon: 'CheckCircle', color: '#FFFFFF' };
    case 'warning':
      return { bg: 'bg-warning', icon: 'AlertTriangle', color: '#FFFFFF' };
    case 'info':
    default:
      return { bg: 'bg-info', icon: 'Info', color: '#FFFFFF' };
  }
};

export const Banner = ({ type, message, onDismiss, actionLabel, onAction, className = '' }: BannerProps) => {
  const [visible, setVisible] = useState(true);
  const { bg, icon, color } = getBannerStyles(type);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <View className={`flex-row items-center p-3 w-full ${bg} ${className}`}>
      <Icon name={icon} size={20} color={color} className="mr-3" />
      <BodyMD className="flex-1 text-white font-medium">{message}</BodyMD>
      
      {actionLabel && onAction && (
        <Pressable onPress={onAction} className="mr-4">
          <BodyMD className="text-white font-bold">{actionLabel}</BodyMD>
        </Pressable>
      )}
      
      {onDismiss && (
        <Pressable onPress={handleDismiss} className="p-1">
          <Icon name="X" size={20} color={color} />
        </Pressable>
      )}
    </View>
  );
};
