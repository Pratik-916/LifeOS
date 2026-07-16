/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { View } from 'react-native';

export type IconName = keyof typeof LucideIcons;

export interface IconProps {
  name: string; // Since we are extracting dynamically
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  color?: string;
  fill?: string;
  className?: string;
}

const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon = React.memo(
  React.forwardRef<View, IconProps>(
    ({ name, size = 'md', color = '#94A3B8', className = '', ...props }, ref) => {
      // Find the component safely
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const LucideIcon = (LucideIcons as any)[name];
      
      if (!LucideIcon) {
        return null;
      }

      const iconSize = typeof size === 'number' ? size : ICON_SIZES[size];

      return (
        <LucideIcon
          ref={ref}
          size={iconSize}
          color={color}
          className={className}
          {...props}
        />
      );
    }
  )
);

Icon.displayName = 'Icon';
