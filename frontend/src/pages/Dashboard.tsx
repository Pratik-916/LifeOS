import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { format } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  CheckCircle2, Circle, Target, Quote, Flame, Clock, 
  TrendingUp, Award, Terminal, BookOpen, PenTool
} from 'lucide-react';
import { Card } from '../components/Card';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';
import { useDashboardStats } from '../hooks/useDashboardStats';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const quotes = [
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
  "Don't wait. The time will never be just right.",
  "It does not matter how slowly you go as long as you do not stop."
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  
  const { goals, habits, settings, profile } = useAppStore();
  const stats = useDashboardStats();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const statCards = [
    { id: 1, title: 'Tasks Completed', value: stats.completedTasks.toString(), icon: CheckCircle2, color: 'text-success' },
    { id: 2, title: 'Tasks Pending', value: stats.pendingTasks.toString(), icon: Clock, color: 'text-warning' },
    { id: 3, title: 'Current Streak', value: `${stats.currentStreak} Days`, icon: Flame, color: 'text-orange-500' },
    { id: 4, title: 'Longest Streak', value: `${stats.longestStreak} Days`, icon: Award, color: 'text-yellow-400' },
    { id: 5, title: 'Productivity Score', value: `${stats.productivityScore}%`, icon: TrendingUp, color: 'text-accent' },
    { id: 6, title: 'Coding Hours', value: `${stats.codingHours}h`, icon: Terminal, color: 'text-purple-500' },
    { id: 7, title: 'Study Hours', value: `${stats.studyHours}h`, icon: BookOpen, color: 'text-blue-400' },
    { id: 8, title: 'Journal Entries', value: stats.journalEntriesCount.toString(), icon: PenTool, color: 'text-pink-500' },
  ];

  return (
    <motion.div 
      className="space-y-8 pb-10 max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-accent text-sm font-medium tracking-wider mb-2 uppercase"
          >
            {format(currentTime, 'EEEE, MMMM do, yyyy')} • {format(currentTime, 'h:mm a')}
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-secondary">
            {getGreeting()}, <br className="md:hidden" />
            Welcome back, {profile.name}
          </h1>
          {settings.widgetVisibility.quotes && (
            <div className="flex items-center gap-3 mt-4 text-secondary">
              <Quote className="w-5 h-5 text-accent opacity-70 flex-shrink-0" />
              <p className="italic font-medium">"{dailyQuote}"</p>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <Card className="flex items-center gap-4 bg-accent/10 border-accent/20 p-4 md:px-6 flex-1 hover:bg-accent/15 transition-colors">
            <div className="p-3 rounded-full bg-accent/20 text-accent">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-secondary font-medium uppercase tracking-wider mb-1">Today's Focus</p>
              <p className="text-lg font-semibold text-primary line-clamp-1 sensitive-data">
                {stats.calculatedGoalsProgress.length > 0 ? stats.calculatedGoalsProgress[0].title : "No active goals"}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 bg-orange-500/10 border-orange-500/20 p-4 md:px-6 flex-1 hover:bg-orange-500/15 transition-colors">
            <div className="p-3 rounded-full bg-orange-500/20 text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-secondary font-medium uppercase tracking-wider mb-1">Current Streak</p>
              <p className="text-lg font-semibold text-primary sensitive-data">
                {stats.currentStreak} Days
              </p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.id} className="p-5 flex flex-col justify-between group hover:bg-surfaceHighlight transition-colors border-border/20">
            <div className="flex justify-between items-start mb-4">
              <span className="text-secondary font-medium text-sm">{stat.title}</span>
              <stat.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", stat.color)} />
            </div>
            <h3 className="text-3xl font-bold text-primary sensitive-data">{stat.value}</h3>
          </Card>
        ))}
      </motion.div>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Main Feed Column (Adapts dynamically) */}
        <div className={cn("space-y-8", (settings.widgetVisibility.recentActivity || stats.calculatedGoalsProgress.length > 0) ? "xl:col-span-2" : "xl:col-span-3")}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Today's Tasks (Always Visible) */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Today's Tasks
              </h2>
              <Card className="p-0 overflow-hidden flex flex-col divide-y divide-border">
                {stats.todayTasks.length === 0 ? (
                  <div className="p-8 text-center text-secondary font-medium">No tasks scheduled for today.</div>
                ) : (
                  stats.todayTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-4 hover:bg-surfaceHighlight transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <button className="focus:outline-none flex-shrink-0 mt-1">
                          {task.status === 'done' ? (
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-secondary group-hover:text-accent transition-colors flex-shrink-0" />
                          )}
                        </button>
                        <span className={cn("font-medium line-clamp-1", task.status === 'done' ? "text-secondary line-through" : "text-primary")}>
                          {task.title}
                        </span>
                      </div>
                      {task.dueTime && (
                        <span className="text-xs text-secondary font-medium px-2 py-1 bg-surfaceHighlight rounded-md flex-shrink-0 whitespace-nowrap">
                          {task.dueTime}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </Card>
            </motion.div>

            {/* Habit Tracker */}
            {settings.widgetVisibility.habitTracker && (
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Habits
                </h2>
                <Card className="p-5 space-y-6 border-border/20 hover:border-border/20 transition-colors">
                  {stats.habitsProgress.length === 0 ? (
                    <div className="text-center text-secondary py-4 font-medium">No habits tracked yet.</div>
                  ) : (
                    stats.habitsProgress.map(habit => (
                      <div key={habit.id} className="space-y-2 group">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm group-hover:text-accent transition-colors">{habit.name}</span>
                          <span className="text-xs text-secondary font-semibold sensitive-data">{habit.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-surfaceHighlight rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${habit.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={cn("h-full rounded-full transition-all duration-500", habit.color)}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </Card>
              </motion.div>
            )}
          </div>

          {/* Productivity Charts */}
          {settings.widgetVisibility.productivityScore && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <Card className="p-5 border-border/20 hover:border-border/20 transition-colors">
                <h3 className="text-sm font-semibold text-secondary mb-6 uppercase tracking-wider">Weekly Productivity</h3>
                <div className="h-48 sensitive-data">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.weeklyData}>
                      <XAxis dataKey="name" stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        cursor={{fill: 'var(--chart-cursor)'}} 
                        contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }}
                      />
                      <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-5 border-border/20 hover:border-border/20 transition-colors">
                <h3 className="text-sm font-semibold text-secondary mb-6 uppercase tracking-wider">Monthly Progress</h3>
                <div className="h-48 sensitive-data">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyData}>
                      <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" stroke="var(--chart-text)" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--chart-bg)', color: 'var(--color-primary)', borderColor: 'var(--chart-border)', borderRadius: '12px' }}
                      />
                      <Area type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Github Heatmap (Always visible as it's core to Dashboard) */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-border/20 hover:border-border/20 transition-colors overflow-x-auto no-scrollbar">
              <div className="flex justify-between items-center mb-6 min-w-[700px]">
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Consistency Heatmap</h3>
                <span className="text-xs text-secondary bg-surfaceHighlight px-3 py-1 rounded-full">Last 90 Days</span>
              </div>
              <div className="flex flex-col flex-wrap h-[100px] gap-1 min-w-[700px] content-start sensitive-data">
                {stats.heatmapData.map((day, i) => {
                  let colorClass = 'bg-border/50';
                  if (day.intensity === 1) colorClass = 'bg-accent/30';
                  if (day.intensity === 2) colorClass = 'bg-accent/60';
                  if (day.intensity === 3) colorClass = 'bg-accent/80';
                  if (day.intensity === 4) colorClass = 'bg-accent';
                  
                  return (
                    <div 
                      key={i} 
                      className={cn("w-3 h-3 rounded-[2px] transition-all hover:scale-125 hover:z-10 cursor-pointer", colorClass)}
                      title={`${format(new Date(day.date), 'MMM do')} : Level ${day.intensity}`}
                    />
                  );
                })}
              </div>
            </Card>
          </motion.div>

        </div>

        {/* Secondary Column (Adapts dynamically) */}
        {(settings.widgetVisibility.recentActivity || stats.calculatedGoalsProgress.length > 0) && (
          <div className="space-y-8 xl:col-span-1">
            
            {/* Goals Progress */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Goals Progress
              </h2>
              <Card className="p-5 space-y-6 border-border/20 hover:border-border/20 transition-colors">
                {stats.calculatedGoalsProgress.length === 0 ? (
                  <div className="text-center text-secondary font-medium">No active goals.</div>
                ) : (
                  stats.calculatedGoalsProgress.map(goal => (
                    <div key={goal.id} className="space-y-2 group">
                      <div className="flex justify-between items-center">
                        <span className="font-medium group-hover:text-purple-400 transition-colors line-clamp-1 pr-2">{goal.title}</span>
                        <span className="text-sm font-bold text-purple-500 flex-shrink-0 sensitive-data">{goal.percent}%</span>
                      </div>
                      <div className="h-3 w-full bg-surfaceHighlight rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.percent}%` }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        />
                      </div>
                      <p className="text-xs text-secondary text-right">{goal.milestones?.filter(m => m.completed).length || 0} / {goal.milestones?.length || 0} Milestones</p>
                    </div>
                  ))
                )}
              </Card>
            </motion.div>

            {/* Recent Activity */}
            {settings.widgetVisibility.recentActivity && (
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Recent Activity
                </h2>
                <Card className="p-5 border-border/20 hover:border-border/20 transition-colors">
                  {stats.recentActivity.length === 0 ? (
                    <div className="text-center text-secondary py-4 font-medium">No recent activity.</div>
                  ) : (
                    <div className="relative border-l-2 border-border/20 ml-3 space-y-8 py-2">
                      {stats.recentActivity.map((activity) => (
                        <div key={activity.id} className="relative pl-6 group">
                          {/* Timeline dot */}
                          <div className="absolute w-3 h-3 bg-accent rounded-full -left-[7px] top-1.5 ring-4 ring-surface group-hover:scale-125 transition-transform" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors sensitive-data">{activity.message}</p>
                            <p className="text-xs text-secondary font-medium">{activity.timeLabel}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

          </div>
        )}
      </div>
    </motion.div>
  );
}
