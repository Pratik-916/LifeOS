import React from 'react';
import { View } from 'react-native';
import { Clock, CheckCircle } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';
import { DashboardSectionTitle } from './DashboardSectionTitle';
import { DashboardEmptyState } from './DashboardEmptyState';
import { format } from 'date-fns';

interface AgendaItemProps {
  title: string;
  type: string;
  time?: string;
}

const AgendaItem = ({ title, type, time }: AgendaItemProps) => {
  let color = '#2563EB'; // default task
  if (type === 'habit') color = '#10B981';
  if (type === 'goal') color = '#F59E0B';
  if (type === 'journal') color = '#8B5CF6';
  if (type === 'journey') color = '#14B8A6';

  return (
    <View className="flex-row items-center mb-4 px-2" accessible={true} accessibilityLabel={`${title}, due ${time || 'today'}`}>
      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${color}15` }}>
        <CheckCircle size={20} color={color} />
      </View>
      <View className="flex-1">
        <Typography variant="body" className="font-semibold text-slate-800">{title}</Typography>
        <Typography variant="caption" className="text-slate-500 capitalize">{type}</Typography>
      </View>
      {time && (
        <View className="flex-row items-center">
          <Clock size={14} color="#94A3B8" className="mr-1" />
          <Typography variant="caption" className="text-slate-500">{time}</Typography>
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
}

export const AgendaCard = React.memo(({ deadlines = [] }: AgendaCardProps) => {
  if (!deadlines || deadlines.length === 0) {
    return (
      <View className="mb-8">
        <DashboardSectionTitle title="Today's Agenda" />
        <DashboardEmptyState 
          title="All caught up!"
          description="Enjoy your free time. There are no immediate deadlines."
        />
      </View>
    );
  }

  // Slice to max 5 items
  const items = deadlines.slice(0, 5);

  return (
    <View className="mb-8">
      <DashboardSectionTitle title="Today's Agenda" />
      <View className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
        {items.map((item, idx) => (
          <AgendaItem 
            key={item.id || `item-${idx}`}
            title={(item.title || item.name) ?? 'Untitled'}
            type={item.type || 'task'}
            time={item.due_date ? format(new Date(item.due_date), 'h:mm a') : undefined}
          />
        ))}
      </View>
    </View>
  );
});
AgendaCard.displayName = 'AgendaCard';
