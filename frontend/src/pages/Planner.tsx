import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  CheckCircle2, Plus, Calendar as CalendarIcon, 
  Clock, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, FileText, ClipboardList
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';
import { timeBlocks } from '../data/planner';
import { useAppStore } from '../store/useAppStore';
import type { Task } from '../types';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { useFilterSort } from '../hooks/useFilterSort';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Planner() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, settings } = useAppStore();
  
  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Derived filtered & sorted tasks using hook
  const filteredTasks = useFilterSort({
    data: tasks,
    searchQuery,
    searchFields: ['title', 'description'],
    filters: [
      { field: 'status', value: statusFilter },
      { field: 'priority', value: priorityFilter },
      { field: 'category', value: categoryFilter },
    ],
    sortBy,
    sortConfig: {
      dueDateAsc: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      dueDateDesc: (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
      priorityDesc: (a, b) => {
        const weight = { high: 3, medium: 2, low: 1 };
        return weight[b.priority] - weight[a.priority];
      },
      priorityAsc: (a, b) => {
        const weight = { high: 3, medium: 2, low: 1 };
        return weight[a.priority] - weight[b.priority];
      }
    }
  });

  // Overall Task Progress (Today)
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const completedCount = todayTasks.filter(t => t.status === 'done').length;
  const pendingCount = todayTasks.length - completedCount;
  const progressPercentage = todayTasks.length === 0 ? 0 : Math.round((completedCount / todayTasks.length) * 100);

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    // Determine start of week based on settings.weekStartsOn
    const weekStartsOn = settings?.weekStartsOn === 'Monday' ? 1 : 0;
    
    const startDate = startOfWeek(monthStart, { weekStartsOn });
    const endDate = endOfWeek(monthEnd, { weekStartsOn });
    
    const dateFormat = 'yyyy-MM-dd';
    const days = eachDayOfInterval({
      start: startDate,
      end: endDate
    });
    
    return days.map(day => {
      const dateStr = format(day, dateFormat);
      // Check if there are tasks for this day
      const hasEvents = tasks.some(t => t.dueDate === dateStr && t.status !== 'done');
      
      return {
        date: day,
        day: format(day, 'd'),
        currentMonth: isSameMonth(day, monthStart),
        isToday: isToday(day),
        hasEvents
      };
    });
  }, [currentDate, settings?.weekStartsOn, tasks]);

  const weekDays = useMemo(() => {
    if (settings?.weekStartsOn === 'Monday') {
      return ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    }
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  }, [settings?.weekStartsOn]);

  // Modal Handlers (Memoized)
  const handleOpenCreate = useCallback(() => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData as any);
    }
  };

  return (
    <motion.div 
      className="space-y-8 pb-10 max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <PageHeader 
        title="Daily Planner"
        description="Organize your tasks, schedule, and stay focused."
        actionLabel="New Task"
        onAction={handleOpenCreate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tasks List (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-border/20 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  All Tasks
                </h2>
                <div className="flex gap-4 text-sm font-medium">
                  <span className="text-primary">{tasks.length} Total</span>
                </div>
              </div>

              {/* Toolbar & Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surfaceHighlight p-4 rounded-2xl border border-border/20">
                <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search tasks..." />
                
                <FilterBar
                  filters={[
                    {
                      id: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter,
                      options: [
                        { label: 'All Status', value: 'all' },
                        { label: 'To Do', value: 'todo' },
                        { label: 'In Progress', value: 'in-progress' },
                        { label: 'Done', value: 'done' }
                      ]
                    },
                    {
                      id: 'priority', label: 'Priority', value: priorityFilter, onChange: setPriorityFilter,
                      options: [
                        { label: 'All Priority', value: 'all' },
                        { label: 'High', value: 'high' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Low', value: 'low' }
                      ]
                    }
                  ]}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOptions={[
                    { label: 'Due Date (Earliest)', value: 'dueDateAsc' },
                    { label: 'Due Date (Latest)', value: 'dueDateDesc' },
                    { label: 'Priority (High first)', value: 'priorityDesc' },
                    { label: 'Priority (Low first)', value: 'priorityAsc' }
                  ]}
                />
              </div>

              {/* Task List */}
              <div className="space-y-3 mt-6">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <EmptyState 
                        icon={ClipboardList}
                        title="No tasks found"
                        message="You don't have any tasks matching your current filters."
                      />
                    </motion.div>
                  ) : (
                    filteredTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onEdit={handleOpenEdit}
                        onDelete={deleteTask}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* Daily Notes */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-border/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Daily Scratchpad
              </h2>
              <textarea 
                className="w-full h-40 bg-surfaceHighlight border border-border/20 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all resize-none text-primary placeholder:text-secondary/50 no-scrollbar"
                placeholder="Brain dump, thoughts, or quick notes..."
              />
            </Card>
          </motion.div>
          
        </div>

        {/* Right Column: Calendar, Pomodoro, Time Blocking (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Progress & Pomodoro Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Progress Circle (Today's Tasks) */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 flex flex-col items-center justify-center text-center h-full border-border/20">
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-6 line-clamp-1">Today's Progress</h3>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="50" fill="none" className="stroke-border" strokeWidth="8" />
                    <motion.circle 
                      cx="56" cy="56" r="50" fill="none" 
                      className="stroke-success" strokeWidth="8" strokeLinecap="round"
                      initial={{ strokeDasharray: "314", strokeDashoffset: "314" }}
                      animate={{ strokeDashoffset: 314 - (314 * progressPercentage) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{progressPercentage}%</span>
                  </div>
                </div>
                <div className="flex gap-4 text-xs font-medium mt-6 w-full justify-center">
                  <span className="text-success">{completedCount} Done</span>
                  <span className="text-warning">{pendingCount} Left</span>
                </div>
              </Card>
            </motion.div>

            {/* Pomodoro Timer */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 flex flex-col items-center justify-center text-center h-full bg-gradient-to-b from-surfaceHighlight to-surfaceHighlight/10 border-border/20">
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Focus
                </h3>
                <div className="text-5xl font-bold tracking-tighter text-primary mb-4 font-mono">
                  {timerMinutes}:00
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => setIsTimerRunning(!isTimerRunning)} className="w-10 p-0">
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                  </Button>
                  <Button variant="secondary" size="sm" className="w-10 p-0">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Mini Calendar */}
          <motion.div variants={itemVariants}>
            <Card className="p-5 border-border/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-purple-500" />
                  {format(currentDate, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 hover:bg-surfaceHighlight rounded-md"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 hover:bg-surfaceHighlight rounded-md"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-xs font-medium text-secondary py-1">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((date, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm relative transition-all cursor-pointer",
                      !date.currentMonth ? "text-secondary/30" : "text-primary hover:bg-surfaceHighlight",
                      date.isToday && "bg-accent text-white font-bold hover:bg-accent/90"
                    )}
                  >
                    {date.day}
                    {date.hasEvents && !date.isToday && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-purple-500" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Time Blocking Schedule */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-border/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  Schedule
                </h2>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  <Plus className="w-4 h-4 mr-1" /> Add Block
                </Button>
              </div>

              <div className="relative border-l border-border/20 ml-12 space-y-4 py-2">
                {timeBlocks.map((block) => (
                  <div key={block.id} className="relative pl-6">
                    {/* Time marker */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-medium text-secondary w-10 text-right">
                      {block.time}
                    </div>
                    {/* Timeline dot */}
                    <div className="absolute w-2 h-2 bg-border rounded-full -left-[4px] top-1/2 -translate-y-1/2" />
                    
                    {/* Block card */}
                    <div className={cn("px-4 py-3 rounded-xl border", block.color)}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">{block.title}</span>
                        <span className="text-xs font-medium opacity-80">{block.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
      />
    </motion.div>
  );
}
