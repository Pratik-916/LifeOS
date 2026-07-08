import React from 'react';
import { Spinner } from './Spinner';

export const ButtonLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Spinner size="sm" />
      <span>Loading...</span>
    </div>
  );
};
