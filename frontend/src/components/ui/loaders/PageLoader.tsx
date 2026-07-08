import React from 'react';
import { Spinner } from './Spinner';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          Loading LifeOS...
        </p>
      </div>
    </div>
  );
};
