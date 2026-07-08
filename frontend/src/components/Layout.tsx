import React from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-background to-background pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
      
      {/* Mobile Nav would go here */}
    </div>
  );
}
