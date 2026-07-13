import React from 'react';
import { View, Text } from 'react-native';

export const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    not_started: { label: 'Not Started', bg: 'bg-slate-100', text: 'text-slate-600' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-700' },
    completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    archived: { label: 'Archived', bg: 'bg-slate-200', text: 'text-slate-500' },
  }[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-600' };

  return (
    <View className={`px-2 py-1 rounded-md ${config.bg}`}>
      <Text className={`text-[10px] font-medium uppercase ${config.text}`}>
        {config.label}
      </Text>
    </View>
  );
};

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const config = {
    low: { label: 'Low', bg: 'bg-slate-100', text: 'text-slate-600' },
    medium: { label: 'Medium', bg: 'bg-amber-100', text: 'text-amber-700' },
    high: { label: 'High', bg: 'bg-rose-100', text: 'text-rose-700' },
  }[priority] || { label: priority, bg: 'bg-slate-100', text: 'text-slate-600' };

  return (
    <View className={`px-2 py-1 rounded-md ${config.bg}`}>
      <Text className={`text-[10px] font-medium uppercase ${config.text}`}>
        {config.label}
      </Text>
    </View>
  );
};

export const CategoryChip = ({ category }: { category: string }) => {
  return (
    <View className="px-2 py-1 rounded-full border border-slate-200">
      <Text className="text-[10px] text-slate-500 font-medium">
        {category}
      </Text>
    </View>
  );
};
