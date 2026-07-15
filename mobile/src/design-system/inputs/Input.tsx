/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from '../../../theme/ThemeProvider';
import React, { useState } from 'react';
import { TextInput, TextInputProps, View, Switch as RNSwitch, Pressable, Platform } from 'react-native';
import { BodyMD, Label, ErrorText } from '../text/Typography';
import { Icon } from '../icons/IconProvider';

export interface BaseInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerClassName?: string;
}

export const TextField = React.forwardRef<TextInput, BaseInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerClassName = '',
      className = '',
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
  const { theme } = useTheme();

      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    const borderClass = error
      ? 'border-danger'
      : isFocused
      ? 'border-primary-500'
      : 'border-secondary-100 dark:border-secondary-900';

    const bgClass = 'bg-surface-light dark:bg-surface-dark';

    return (
      <View className={`mb-4 ${containerClassName}`}>
        {label && <Label className="mb-2">{label}</Label>}
        
        <View
          className={`flex-row items-center border rounded-xl px-3 h-12 ${bgClass} ${borderClass}`}
        >
          {leftIcon && (
            <Icon name={leftIcon} size={20} className="mr-2" color={isFocused ? '#6366F1' : '#94A3B8'} />
          )}
          
          <TextInput
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={theme.colors.text.disabled}
            className={`flex-1 text-text-light dark:text-text-dark text-base ${Platform.OS === 'web' ? 'outline-none' : ''} ${className}`}
            {...props}
          />

          {rightIcon && (
            <Pressable onPress={onRightIconPress} disabled={!onRightIconPress}>
              <Icon name={rightIcon} size={20} className="ml-2" color={theme.colors.text.disabled} />
            </Pressable>
          )}
        </View>

        {error && <ErrorText>{error}</ErrorText>}
        {!error && helperText && <BodyMD className="text-text-muted mt-1 text-xs">{helperText}</BodyMD>}
      </View>
    );
  }
);

TextField.displayName = 'TextField';

export const SearchField = (props: BaseInputProps) => (
  <TextField leftIcon="Search" placeholder="Search..." returnKeyType="search" {...props} />
);

export const PasswordField = (props: BaseInputProps) => {
  const [show, setShow] = useState(false);
  return (
    <TextField
      secureTextEntry={!show}
      rightIcon={show ? 'EyeOff' : 'Eye'}
      onRightIconPress={() => setShow(!show)}
      {...props}
    />
  );
};

export const NumberField = (props: BaseInputProps) => (
  <TextField keyboardType="numeric" {...props} />
);

export const OTPField = (props: BaseInputProps) => (
  <TextField keyboardType="number-pad" maxLength={6} textAlign="center" {...props} /> // Basic implementation
);

export const DateField = (props: BaseInputProps) => (
  <TextField rightIcon="Calendar" editable={false} {...props} /> // Requires modal picker integration
);

export const Dropdown = (props: BaseInputProps) => (
  <TextField rightIcon="ChevronDown" editable={false} {...props} /> // Requires modal picker integration
);

export const TextArea = (props: BaseInputProps) => (
  <TextField
    multiline
    numberOfLines={4}
    className="h-32 pt-3" // Override height
    {...props}
  />
);

// Switch Component
export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  containerClassName?: string;
}

export const Switch = ({ value, onValueChange, disabled, label, containerClassName = '' }: SwitchProps) => (
  <View className={`flex-row items-center justify-between py-2 ${containerClassName}`}>
    {label && <BodyMD>{label}</BodyMD>}
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: '#94A3B8', true: '#6366F1' }}
      thumbColor={theme.colors.background.paper}
    />
  </View>
);

// Simplified Checkbox (Needs Icon for checked state)
export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  containerClassName?: string;
}

export const Checkbox = ({ checked, onChange, label, disabled, containerClassName = '' }: CheckboxProps) => (
  <Pressable 
    className={`flex-row items-center py-2 ${disabled ? 'opacity-50' : ''} ${containerClassName}`}
    onPress={() => !disabled && onChange(!checked)}
  >
    <View className={`h-6 w-6 rounded border items-center justify-center mr-3 ${checked ? 'bg-primary-500 border-primary-500' : 'bg-transparent border-secondary-500'}`}>
      {checked && <Icon name="Check" size={16} color={theme.colors.background.paper} />}
    </View>
    {label && <BodyMD>{label}</BodyMD>}
  </Pressable>
);

export const Radio = ({ checked, onChange, label, disabled, containerClassName = '' }: CheckboxProps) => (
  <Pressable 
    className={`flex-row items-center py-2 ${disabled ? 'opacity-50' : ''} ${containerClassName}`}
    onPress={() => !disabled && onChange(!checked)}
  >
    <View className={`h-6 w-6 rounded-full border items-center justify-center mr-3 ${checked ? 'border-primary-500' : 'border-secondary-500'}`}>
      {checked && <View className="h-3 w-3 rounded-full bg-primary-500" />}
    </View>
    {label && <BodyMD>{label}</BodyMD>}
  </Pressable>
);
