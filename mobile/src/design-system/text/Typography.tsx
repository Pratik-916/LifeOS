import React from 'react';
import { Text, TextProps } from 'react-native';

export interface TypographyProps extends TextProps {
  className?: string;
  children?: React.ReactNode;
}

const createTextComponent = (baseClassName: string) => {
  const Component = React.forwardRef<Text, TypographyProps>(
    ({ className = '', ...props }, ref) => {
      return (
        <Text
          ref={ref}
          className={`${baseClassName} ${className}`}
          {...props}
        />
      );
    }
  );
  Component.displayName = 'TypographyComponent';
  return React.memo(Component);
};

export const HeadingXL = createTextComponent('text-3xl font-bold text-text-light dark:text-text-dark');
export const HeadingLG = createTextComponent('text-2xl font-bold text-text-light dark:text-text-dark');
export const HeadingMD = createTextComponent('text-xl font-semibold text-text-light dark:text-text-dark');
export const HeadingSM = createTextComponent('text-lg font-semibold text-text-light dark:text-text-dark');
export const BodyLG = createTextComponent('text-base text-text-light dark:text-text-dark');
export const BodyMD = createTextComponent('text-sm text-text-light dark:text-text-dark');
export const BodySM = createTextComponent('text-xs text-text-light dark:text-text-dark');
export const Caption = createTextComponent('text-[10px] text-text-muted');
export const Label = createTextComponent('text-sm font-medium text-text-light dark:text-text-dark uppercase tracking-wider');
export const ErrorText = createTextComponent('text-sm text-danger mt-1');
export const SuccessText = createTextComponent('text-sm text-success mt-1');
