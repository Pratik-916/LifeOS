import React from 'react';
import { View } from 'react-native';
import { Icon, BodyMD, Caption, PrimaryCard, HeadingMD } from '../../../design-system';
import { format, isPast, isToday } from 'date-fns';

interface AgendaItemProps {
  title: string;
  type: string;
  time?: string;
  isOverdue?: boolean;
}

const AgendaItem = ({ title, type, time, isOverdue }: AgendaItemProps) => {
  let color = '#2563EB'; // default task
  if (type === 'habit') color = '#10B981';
  if (type === 'goal') color = '#F59E0B';
  if (type === 'journal') color = '#8B5CF6';
  if (type === 'journey') color = '#14B8A6';

  if (isOverdue) color = '#EF4444'; // Red for overdue

  return (
    <View className="flex-row items-center mb-4 px-2" accessible={true} accessibilityLabel={`${title}, due ${time || 'today'}${isOverdue ? ', overdue' : ''}`}>
      <View className="w-12 h-12 rounded-[20px] items-center justify-center mr-4" style={{ backgroundColor: `${color}15` }}>
        <Icon name={isOverdue ? "AlertCircle" : "CheckCircle"} size={22} color={color} />
      </View>
      <View className="flex-1">
        <BodyMD className={`font-semibold ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>{title}</BodyMD>
        <Caption className="text-slate-500 capitalize">{type}</Caption>
      </View>
      {time && (
        <View className="flex-row items-center">
          <Icon name="Clock" size={14} color={isOverdue ? "#EF4444" : "#94A3B8"} className="mr-1" />
          <Caption className={isOverdue ? "text-red-500" : "text-slate-500"}>{time}</Caption>
        </View>
      )}
    </View>
  );
};

interface DeadlineItem {
  id?: string;
  title?: string;
  name?: string;
  type?: string;
  due_date?: string;
}

interface AgendaCardProps {
  deadlines?: DeadlineItem[];
  completedTasks?: number;
  pendingTasks?: number;
}

export const AgendaCard = React.memo(({ deadlines = [], completedTasks = 0, pendingTasks = 0 }: AgendaCardProps) => {
  // Determine states
  const isCompletedDay = completedTasks > 0 && pendingTasks === 0 && deadlines.length === 0;
  
  if (isCompletedDay) {
    return (
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <HeadingMD className="text-slate-800 dark:text-slate-200">Today's Agenda</HeadingMD>
        </View>
        <PrimaryCard className="p-8 shadow-sm items-center justify-center border border-green-100 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <View className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-800/50 items-center justify-center mb-4">
            <Icon name="Check" size={32} color="#10B981" />
          </View>
          <HeadingMD className="text-green-800 dark:text-green-400 mb-1">All Done!</HeadingMD>
          <BodyMD className="text-green-600 dark:text-green-500 text-center">You've completed everything for today. Time to relax.</BodyMD>
        </PrimaryCard>
      </View>
    );
  }

  if (!deadlines || deadlines.length === 0) {
    return (
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <HeadingMD className="text-slate-800 dark:text-slate-200">Today's Agenda</HeadingMD>
        </View>
        <PrimaryCard className="p-8 shadow-sm items-center justify-center border border-slate-100 dark:border-slate-800">
          <View className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center mb-4">
            <Icon name="Coffee" size={32} color="#94A3B8" />
          </View>
          <HeadingMD className="text-slate-700 dark:text-slate-300 mb-1">Your day is clear.</HeadingMD>
          <BodyMD className="text-slate-500 text-center">Take a breath or plan ahead.</BodyMD>
        </PrimaryCard>
      </View>
    );
  }

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <HeadingMD className="text-slate-800 dark:text-slate-200">Today's Agenda</HeadingMD>
      </View>
      <PrimaryCard className="p-4 shadow-sm border border-slate-100 dark:border-slate-800">
        {deadlines.map((item, idx) => {
          let isOverdue = false;
          if (item.due_date) {
            const dueDate = new Date(item.due_date);
            isOverdue = isPast(dueDate) && !isToday(dueDate); // Overdue if past and not today
          }
          
          return (
            <AgendaItem 
              key={item.id || `item-${idx}`}
              title={(item.title || item.name) ?? 'Untitled'}
              type={item.type || 'task'}
              time={item.due_date ? format(new Date(item.due_date), 'h:mm a') : undefined}
              isOverdue={isOverdue}
            />
          );
        })}
      </PrimaryCard>
    </View>
  );
});
AgendaCard.displayName = 'AgendaCard';
