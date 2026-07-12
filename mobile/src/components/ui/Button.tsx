import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  isLoading, 
  className, 
  ...props 
}) => {
  const baseClasses = "py-3 px-4 rounded-xl flex-row items-center justify-center";
  
  const variantClasses = {
    primary: "bg-blue-600",
    secondary: "bg-gray-200",
    outline: "bg-transparent border border-gray-300",
    ghost: "bg-transparent"
  };

  const textClasses = {
    primary: "text-white font-bold text-base",
    secondary: "text-gray-900 font-bold text-base",
    outline: "text-gray-900 font-bold text-base",
    ghost: "text-blue-600 font-bold text-base"
  };

  return (
    <TouchableOpacity 
      className={`${baseClasses} ${variantClasses[variant]} ${props.disabled ? 'opacity-50' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : 'gray'} />
      ) : (
        <Text className={textClasses[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
