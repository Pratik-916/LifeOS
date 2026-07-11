import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardWidget } from './DashboardWidget';
import { useTasks } from '../../planner/hooks/useTasks';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const UpcomingTasksCard = () => {
  // Fetch tasks. We'll sort and filter client-side for the dashboard view to avoid excessive distinct API calls
  const { data: tasksResponse, isLoading, isError, error, refetch } = useTasks({});
  
  const navigate = useNavigate();
  
  const tasks = tasksResponse?.results || [];
  
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  
  const sortedTasks = [...activeTasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  }).slice(0, 5); // Take top 5

  return (
    <DashboardWidget
      id="upcoming_tasks"
      title="Upcoming Tasks"
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      isEmpty={tasks.length === 0}
      onRefresh={refetch}
      headerAction={
        <button 
          onClick={() => navigate('/planner')}
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Planner <ArrowRight className="w-3 h-3" />
        </button>
      }
      emptyState={
        <div className="text-center text-secondary py-4">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">You're all caught up!</p>
        </div>
      }
    >
      <div className="space-y-3">
        {sortedTasks.map(task => {
          const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
          return (
            <div key={task.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => navigate('/planner')}>
              <button className="mt-0.5 text-secondary group-hover:text-accent transition-colors">
                <Circle className="w-4 h-4" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate group-hover:text-accent transition-colors">
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className={cn("text-xs flex items-center gap-1", isOverdue ? "text-danger" : "text-secondary")}>
                    <Clock className="w-3 h-3" />
                    {isToday(parseISO(task.dueDate)) ? 'Today' : format(parseISO(task.dueDate), 'MMM d, yyyy')}
                    {isOverdue && ' (Overdue)'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardWidget>
  );
};
