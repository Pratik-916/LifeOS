import React from 'react';
import { View, ViewProps } from 'react-native';
import { HeadingMD, BodyMD } from '../text/Typography';
import { Icon } from '../icons/IconProvider';
import { PrimaryButton, SecondaryButton } from '../buttons/Button';

export interface EmptyStateProps extends ViewProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  icon = 'Inbox',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
  ...props
}: EmptyStateProps) => {
  return (
    <View className={`flex-1 items-center justify-center p-8 ${className}`} {...props}>
      <View className="h-24 w-24 rounded-full bg-secondary-100 dark:bg-secondary-900 items-center justify-center mb-6">
        <Icon name={icon} size={48} color="#94A3B8" />
      </View>
      
      <HeadingMD className="text-center mb-2">{title}</HeadingMD>
      
      {description && (
        <BodyMD className="text-center text-text-muted mb-8">
          {description}
        </BodyMD>
      )}
      
      <View className="w-full space-y-3">
        {actionLabel && onAction && (
          <PrimaryButton title={actionLabel} onPress={onAction} className="w-full" />
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <SecondaryButton title={secondaryActionLabel} onPress={onSecondaryAction} className="w-full" />
        )}
      </View>
    </View>
  );
};
