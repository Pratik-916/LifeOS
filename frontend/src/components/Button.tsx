import React from 'react';
import { cn } from '../lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-[1px]";
  
  const variants = {
    primary: "bg-primary text-background hover:bg-primary/90 hover:shadow-md",
    secondary: "bg-surfaceHighlight text-primary border border-border/20 hover:shadow-sm",
    ghost: "hover:bg-surfaceHighlight text-secondary hover:text-primary hover:shadow-sm",
    danger: "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20 hover:shadow-sm",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
