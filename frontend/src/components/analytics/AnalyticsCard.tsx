import React from 'react';
import { Card } from '../Card';
import {  } from 'framer-motion';

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: string;
  className?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, subtitle, children, height = "h-[350px]", className = "" 
}) => {
  return (
    <Card className={`p-6 flex flex-col bg-surfaceHighlight border-border/20 hover:bg-surfaceHighlight transition-colors ${height} ${className}`}>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">{title}</h3>
        {subtitle && <p className="text-xs text-secondary/70 mt-1">{subtitle}</p>}
      </div>
      <div className="flex-1 min-h-0 w-full relative">
        {children}
      </div>
    </Card>
  );
};
