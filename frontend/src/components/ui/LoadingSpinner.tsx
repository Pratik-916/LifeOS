import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
      {message && <p className="text-sm font-medium text-secondary">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[100]">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-[200px]">
      {content}
    </div>
  );
};
