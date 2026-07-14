export interface ChartDatasetDTO {
  labels: string[];
  datasets: Record<string, unknown>[];
  totals?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ChartDataset {
  labels: string[];
  datasets: Record<string, unknown>[];
  totals?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface DashboardSummaryDTO {
  todays_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  todays_habits: number;
  completed_habits: number;
  current_habit_streak: number;
  longest_habit_streak: number;
  current_goals: number;
  completed_goals: number;
  journal_entries_this_week: number;
  journey_events_this_month: number;
  productivity_score: number;
  weekly_productivity: number;
  monthly_productivity: number;
  completion_percentage: number;
  upcoming_deadlines: Record<string, unknown>[];
  most_important_goal: Record<string, unknown> | null;
  weekly_highlights: string[];
}

export interface DashboardSummary {
  todaysTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  todaysHabits: number;
  completedHabits: number;
  currentHabitStreak: number;
  longestHabitStreak: number;
  currentGoals: number;
  completedGoals: number;
  journalEntriesThisWeek: number;
  journeyEventsThisMonth: number;
  productivityScore: number;
  weeklyProductivity: number;
  monthlyProductivity: number;
  completionPercentage: number;
  upcomingDeadlines: Record<string, unknown>[];
  mostImportantGoal: Record<string, unknown> | null;
  weeklyHighlights: string[];
}

export interface PlannerAnalyticsDTO {
  task_completion_trend: ChartDatasetDTO;
  priority_distribution: ChartDatasetDTO;
  category_distribution: ChartDatasetDTO;
  weekly_completion: number;
  monthly_completion: number;
  estimated_vs_actual_time: ChartDatasetDTO;
  average_completion_time_hours: number;
  upcoming_deadlines: Record<string, unknown>[];
  overdue_trends: ChartDatasetDTO;
  daily_productivity: ChartDatasetDTO;
}

export interface PlannerAnalytics {
  taskCompletionTrend: ChartDataset;
  priorityDistribution: ChartDataset;
  categoryDistribution: ChartDataset;
  weeklyCompletion: number;
  monthlyCompletion: number;
  estimatedVsActualTime: ChartDataset;
  averageCompletionTimeHours: number;
  upcomingDeadlines: Record<string, unknown>[];
  overdueTrends: ChartDataset;
  dailyProductivity: ChartDataset;
}

export interface GoalAnalyticsDTO {
  goal_progress: number;
  completed_goals: number;
  average_goal_progress: number;
  goal_categories: ChartDatasetDTO;
  milestone_completion: number;
  estimated_hours: number;
  actual_hours: number;
  goal_velocity: number;
  goal_completion_trends: ChartDatasetDTO;
}

export interface GoalAnalytics {
  goalProgress: number;
  completedGoals: number;
  averageGoalProgress: number;
  goalCategories: ChartDataset;
  milestoneCompletion: number;
  estimatedHours: number;
  actualHours: number;
  goalVelocity: number;
  goalCompletionTrends: ChartDataset;
}

export interface HabitAnalyticsDTO {
  completion_rate: number;
  current_streak: number;
  longest_streak: number;
  average_streak: number;
  recovery_time_days: number;
  break_frequency: number;
  weekly_activity: ChartDatasetDTO;
  monthly_activity: ChartDatasetDTO;
  habit_heatmap: ChartDatasetDTO;
  category_distribution: ChartDatasetDTO;
  consistency_score: number;
  best_habit: Record<string, unknown> | null;
  weakest_habit: Record<string, unknown> | null;
}

export interface HabitAnalytics {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  averageStreak: number;
  recoveryTimeDays: number;
  breakFrequency: number;
  weeklyActivity: ChartDataset;
  monthlyActivity: ChartDataset;
  habitHeatmap: ChartDataset;
  categoryDistribution: ChartDataset;
  consistencyScore: number;
  bestHabit: Record<string, unknown> | null;
  weakestHabit: Record<string, unknown> | null;
}

export interface JournalAnalyticsDTO {
  writing_streak: number;
  longest_writing_streak: number;
  word_count_trends: ChartDatasetDTO;
  reading_time_trends: ChartDatasetDTO;
  mood_distribution: ChartDatasetDTO;
  energy_trends: ChartDatasetDTO;
  stress_trends: ChartDatasetDTO;
  favorite_entries: number;
  monthly_writing: ChartDatasetDTO;
  average_words: number;
  average_reading_time_mins: number;
}

export interface JournalAnalytics {
  writingStreak: number;
  longestWritingStreak: number;
  wordCountTrends: ChartDataset;
  readingTimeTrends: ChartDataset;
  moodDistribution: ChartDataset;
  energyTrends: ChartDataset;
  stressTrends: ChartDataset;
  favoriteEntries: number;
  monthlyWriting: ChartDataset;
  averageWords: number;
  averageReadingTimeMins: number;
}

export interface JourneyAnalyticsDTO {
  timeline_growth: ChartDatasetDTO;
  activity_timeline: ChartDatasetDTO;
  favorite_memories: number;
  pinned_memories: number;
  memory_categories: ChartDatasetDTO;
  most_active_month: string;
  most_active_year: string;
  monthly_activity: ChartDatasetDTO;
  yearly_activity: ChartDatasetDTO;
  milestone_counts: number;
  journey_score: number;
}

export interface JourneyAnalytics {
  timelineGrowth: ChartDataset;
  activityTimeline: ChartDataset;
  favoriteMemories: number;
  pinnedMemories: number;
  memoryCategories: ChartDataset;
  mostActiveMonth: string;
  mostActiveYear: string;
  monthlyActivity: ChartDataset;
  yearlyActivity: ChartDataset;
  milestoneCounts: number;
  journeyScore: number;
}

export interface ProductivityAnalyticsDTO {
  overall_score: number;
  individual_module_scores: Record<string, unknown>;
  score_breakdown: Record<string, unknown>;
  reasons: string[];
}

export interface ProductivityAnalytics {
  overallScore: number;
  individualModuleScores: Record<string, unknown>;
  scoreBreakdown: Record<string, unknown>;
  reasons: string[];
}

export interface TrendAnalyticsDTO {
  week_over_week: Record<string, unknown>;
  month_over_month: Record<string, unknown>;
  year_over_year: Record<string, unknown>;
  growth: number;
  decline: number;
  momentum: string;
  stagnation: boolean;
  trend_percentages: Record<string, number>;
}

export interface TrendAnalytics {
  weekOverWeek: Record<string, unknown>;
  monthOverMonth: Record<string, unknown>;
  yearOverYear: Record<string, unknown>;
  growth: number;
  decline: number;
  momentum: string;
  stagnation: boolean;
  trendPercentages: Record<string, number>;
}

export interface AnalyticsFilters {
  year?: string;
  month?: string;
  category?: string;
  dateRange?: string; // 'today', '7_days', '30_days', '90_days', 'custom'
}
