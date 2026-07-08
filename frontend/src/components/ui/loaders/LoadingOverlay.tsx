import React from 'react';
import { Spinner } from './Spinner';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm dark:bg-slate-900/80 rounded-inherit">
      <Spinner size="lg" className="text-primary-600 dark:text-primary-500" />
      {message && (
        <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
