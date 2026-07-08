import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ className, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        className={cn(
          "w-full bg-surfaceHighlight border rounded-xl py-2.5 px-4 pr-10 text-sm focus:outline-none focus:ring-1 transition-all text-primary placeholder:text-secondary/50",
          error ? "border-danger focus:ring-danger" : "border-border/20 focus:ring-accent focus:border-accent",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};
