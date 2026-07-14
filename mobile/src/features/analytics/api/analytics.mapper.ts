import type { 
  ChartDatasetDTO, ChartDataset,
  DashboardSummaryDTO, DashboardSummary,
  PlannerAnalyticsDTO, PlannerAnalytics,
  GoalAnalyticsDTO, GoalAnalytics,
  HabitAnalyticsDTO, HabitAnalytics,
  JournalAnalyticsDTO, JournalAnalytics,
  JourneyAnalyticsDTO, JourneyAnalytics,
  ProductivityAnalyticsDTO, ProductivityAnalytics,
  TrendAnalyticsDTO, TrendAnalytics
} from './analytics.types';

export const mapChartDataset = (dto: ChartDatasetDTO): ChartDataset => ({
  labels: dto.labels,
  datasets: dto.datasets,
  totals: dto.totals,
  metadata: dto.metadata,
});

export const mapDashboardSummary = (dto: DashboardSummaryDTO): DashboardSummary => ({
  todaysTasks: dto.todays_tasks,
  completedTasks: dto.completed_tasks,
  pendingTasks: dto.pending_tasks,
  overdueTasks: dto.overdue_tasks,
  todaysHabits: dto.todays_habits,
  completedHabits: dto.completed_habits,
  currentHabitStreak: dto.current_habit_streak,
  longestHabitStreak: dto.longest_habit_streak,
  currentGoals: dto.current_goals,
  completedGoals: dto.completed_goals,
  journalEntriesThisWeek: dto.journal_entries_this_week,
  journeyEventsThisMonth: dto.journey_events_this_month,
  productivityScore: dto.productivity_score,
  weeklyProductivity: dto.weekly_productivity,
  monthlyProductivity: dto.monthly_productivity,
  completionPercentage: dto.completion_percentage,
  upcomingDeadlines: dto.upcoming_deadlines,
  mostImportantGoal: dto.most_important_goal,
  weeklyHighlights: dto.weekly_highlights,
});

export const mapPlannerAnalytics = (dto: PlannerAnalyticsDTO): PlannerAnalytics => ({
  taskCompletionTrend: mapChartDataset(dto.task_completion_trend),
  priorityDistribution: mapChartDataset(dto.priority_distribution),
  categoryDistribution: mapChartDataset(dto.category_distribution),
  weeklyCompletion: dto.weekly_completion,
  monthlyCompletion: dto.monthly_completion,
  estimatedVsActualTime: mapChartDataset(dto.estimated_vs_actual_time),
  averageCompletionTimeHours: dto.average_completion_time_hours,
  upcomingDeadlines: dto.upcoming_deadlines,
  overdueTrends: mapChartDataset(dto.overdue_trends),
  dailyProductivity: mapChartDataset(dto.daily_productivity),
});

export const mapGoalAnalytics = (dto: GoalAnalyticsDTO): GoalAnalytics => ({
  goalProgress: dto.goal_progress,
  completedGoals: dto.completed_goals,
  averageGoalProgress: dto.average_goal_progress,
  goalCategories: mapChartDataset(dto.goal_categories),
  milestoneCompletion: dto.milestone_completion,
  estimatedHours: dto.estimated_hours,
  actualHours: dto.actual_hours,
  goalVelocity: dto.goal_velocity,
  goalCompletionTrends: mapChartDataset(dto.goal_completion_trends),
});

export const mapHabitAnalytics = (dto: HabitAnalyticsDTO): HabitAnalytics => ({
  completionRate: dto.completion_rate,
  currentStreak: dto.current_streak,
  longestStreak: dto.longest_streak,
  averageStreak: dto.average_streak,
  recoveryTimeDays: dto.recovery_time_days,
  breakFrequency: dto.break_frequency,
  weeklyActivity: mapChartDataset(dto.weekly_activity),
  monthlyActivity: mapChartDataset(dto.monthly_activity),
  habitHeatmap: mapChartDataset(dto.habit_heatmap),
  categoryDistribution: mapChartDataset(dto.category_distribution),
  consistencyScore: dto.consistency_score,
  bestHabit: dto.best_habit,
  weakestHabit: dto.weakest_habit,
});

export const mapJournalAnalytics = (dto: JournalAnalyticsDTO): JournalAnalytics => ({
  writingStreak: dto.writing_streak,
  longestWritingStreak: dto.longest_writing_streak,
  wordCountTrends: mapChartDataset(dto.word_count_trends),
  readingTimeTrends: mapChartDataset(dto.reading_time_trends),
  moodDistribution: mapChartDataset(dto.mood_distribution),
  energyTrends: mapChartDataset(dto.energy_trends),
  stressTrends: mapChartDataset(dto.stress_trends),
  favoriteEntries: dto.favorite_entries,
  monthlyWriting: mapChartDataset(dto.monthly_writing),
  averageWords: dto.average_words,
  averageReadingTimeMins: dto.average_reading_time_mins,
});

export const mapJourneyAnalytics = (dto: JourneyAnalyticsDTO): JourneyAnalytics => ({
  timelineGrowth: mapChartDataset(dto.timeline_growth),
  activityTimeline: mapChartDataset(dto.activity_timeline),
  favoriteMemories: dto.favorite_memories,
  pinnedMemories: dto.pinned_memories,
  memoryCategories: mapChartDataset(dto.memory_categories),
  mostActiveMonth: dto.most_active_month,
  mostActiveYear: dto.most_active_year,
  monthlyActivity: mapChartDataset(dto.monthly_activity),
  yearlyActivity: mapChartDataset(dto.yearly_activity),
  milestoneCounts: dto.milestone_counts,
  journeyScore: dto.journey_score,
});

export const mapProductivityAnalytics = (dto: ProductivityAnalyticsDTO): ProductivityAnalytics => ({
  overallScore: dto.overall_score,
  individualModuleScores: dto.individual_module_scores,
  scoreBreakdown: dto.score_breakdown,
  reasons: dto.reasons,
});

export const mapTrendAnalytics = (dto: TrendAnalyticsDTO): TrendAnalytics => ({
  weekOverWeek: dto.week_over_week,
  monthOverMonth: dto.month_over_month,
  yearOverYear: dto.year_over_year,
  growth: dto.growth,
  decline: dto.decline,
  momentum: dto.momentum,
  stagnation: dto.stagnation,
  trendPercentages: dto.trend_percentages,
});
