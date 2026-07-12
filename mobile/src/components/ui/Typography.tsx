import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
}

export const Typography: React.FC<TypographyProps> = ({ variant = 'body', className, children, ...props }) => {
  const variantClasses = {
    h1: "text-3xl font-extrabold text-gray-900",
    h2: "text-2xl font-bold text-gray-900",
    h3: "text-xl font-bold text-gray-900",
    body: "text-base text-gray-700",
    caption: "text-sm text-gray-500",
    label: "text-xs font-medium text-gray-400 uppercase tracking-wider"
  };

  return (
    <Text className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </Text>
  );
};
