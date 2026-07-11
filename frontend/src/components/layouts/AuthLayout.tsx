import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-primary hidden sm:block">LifeOS</span>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <Outlet />
      </div>
      
      <div className="w-full text-center text-xs text-secondary/50 pb-8">
        &copy; {new Date().getFullYear()} LifeOS. All rights reserved.
      </div>
    </div>
  );
};
