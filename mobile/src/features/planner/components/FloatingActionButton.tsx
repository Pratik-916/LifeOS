import React from 'react';
import { FloatingActionButton as FAB } from '../../../design-system';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  testID?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
}) => {
  return (
    <FAB onPress={onPress} leftIcon="Plus" />
  );
};
