import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  variant = 'ghost', 
  size = 'md',
  className,
  style,
  ...props 
}) => {
  const baseClasses = "items-center justify-center rounded-full";
  
  const variantClasses = {
    primary: "bg-indigo-600",
    secondary: "bg-slate-200",
    ghost: "bg-transparent"
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14"
  };

  return (
    <TouchableOpacity 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.disabled ? 'opacity-50' : ''} ${className}`}
      style={style}
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
};
