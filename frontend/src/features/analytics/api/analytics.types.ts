// DTOs (Data Transfer Objects) - Match backend snake_case

export interface ChartDatasetDTO {
  labels: string[];
  datasets: Record<string, any>[];
  totals?: Record<string, any>;
  metadata?: Record<string, any>;
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
  upcoming_deadlines: Record<string, any>[];
  most_important_goal: Record<string, any> | null;
  weekly_highlights: string[];
}

export interface PlannerAnalyticsDTO {
  task_completion_trend: ChartDatasetDTO;
  priority_distribution: ChartDatasetDTO;
  category_distribution: ChartDatasetDTO;
  weekly_completion: number;
  monthly_completion: number;
  estimated_vs_actual_time: ChartDatasetDTO;
  average_completion_time_hours: number;
  upcoming_deadlines: Record<string, any>[];
  overdue_trends: ChartDatasetDTO;
  daily_productivity: ChartDatasetDTO;
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
  best_habit: Record<string, any> | null;
  weakest_habit: Record<string, any> | null;
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

export interface ProductivityAnalyticsDTO {
  overall_score: number;
  individual_module_scores: Record<string, number>;
  score_breakdown: Record<string, number>;
  reasons: string[];
}

export interface TrendAnalyticsDTO {
  week_over_week: Record<string, any>;
  month_over_month: Record<string, any>;
  year_over_year: Record<string, any>;
  growth: number;
  decline: number;
  momentum: string;
  stagnation: boolean;
  trend_percentages: Record<string, number>;
}


// Domain Models - Frontend camelCase

export interface ChartDatasetModel {
  labels: string[];
  datasets: Record<string, any>[];
  totals: Record<string, any>;
  metadata: Record<string, any>;
}

export interface DashboardSummaryModel {
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
  upcomingDeadlines: Record<string, any>[];
  mostImportantGoal: Record<string, any> | null;
  weeklyHighlights: string[];
}

export interface PlannerAnalyticsModel {
  taskCompletionTrend: ChartDatasetModel;
  priorityDistribution: ChartDatasetModel;
  categoryDistribution: ChartDatasetModel;
  weeklyCompletion: number;
  monthlyCompletion: number;
  estimatedVsActualTime: ChartDatasetModel;
  averageCompletionTimeHours: number;
  upcomingDeadlines: Record<string, any>[];
  overdueTrends: ChartDatasetModel;
  dailyProductivity: ChartDatasetModel;
}

export interface GoalAnalyticsModel {
  goalProgress: number;
  completedGoals: number;
  averageGoalProgress: number;
  goalCategories: ChartDatasetModel;
  milestoneCompletion: number;
  estimatedHours: number;
  actualHours: number;
  goalVelocity: number;
  goalCompletionTrends: ChartDatasetModel;
}

export interface HabitAnalyticsModel {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  averageStreak: number;
  recoveryTimeDays: number;
  breakFrequency: number;
  weeklyActivity: ChartDatasetModel;
  monthlyActivity: ChartDatasetModel;
  habitHeatmap: ChartDatasetModel;
  categoryDistribution: ChartDatasetModel;
  consistencyScore: number;
  bestHabit: Record<string, any> | null;
  weakestHabit: Record<string, any> | null;
}

export interface JournalAnalyticsModel {
  writingStreak: number;
  longestWritingStreak: number;
  wordCountTrends: ChartDatasetModel;
  readingTimeTrends: ChartDatasetModel;
  moodDistribution: ChartDatasetModel;
  energyTrends: ChartDatasetModel;
  stressTrends: ChartDatasetModel;
  favoriteEntries: number;
  monthlyWriting: ChartDatasetModel;
  averageWords: number;
  averageReadingTimeMins: number;
}

export interface JourneyAnalyticsModel {
  timelineGrowth: ChartDatasetModel;
  activityTimeline: ChartDatasetModel;
  favoriteMemories: number;
  pinnedMemories: number;
  memoryCategories: ChartDatasetModel;
  mostActiveMonth: string;
  mostActiveYear: string;
  monthlyActivity: ChartDatasetModel;
  yearlyActivity: ChartDatasetModel;
  milestoneCounts: number;
  journeyScore: number;
}

export interface ProductivityAnalyticsModel {
  overallScore: number;
  individualModuleScores: Record<string, number>;
  scoreBreakdown: Record<string, number>;
  reasons: string[];
}

export interface TrendAnalyticsModel {
  weekOverWeek: Record<string, any>;
  monthOverMonth: Record<string, any>;
  yearOverYear: Record<string, any>;
  growth: number;
  decline: number;
  momentum: string;
  stagnation: boolean;
  trendPercentages: Record<string, number>;
}

// Chart Abstraction mapping
export interface RechartsDataPoint {
  name: string;
  [key: string]: any;
}
