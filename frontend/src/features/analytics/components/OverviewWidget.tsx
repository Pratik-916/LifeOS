import React from 'react';
import { useOverview } from '../hooks';
import { StatisticsGrid } from '../../../components/analytics/StatisticsGrid';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export default function OverviewWidget({ filters }: { filters?: Record<string, any> }) {
  const { data, isLoading, error } = useOverview(filters);

  if (isLoading) {
    return <div className="h-[200px] flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error || !data) {
    return <div className="h-[200px] flex items-center justify-center text-red-500">Failed to load overview data.</div>;
  }

  return <StatisticsGrid overview={data} />;
}
