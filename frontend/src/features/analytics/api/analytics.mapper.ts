import type {
  ChartDatasetDTO,
  ChartDatasetModel,
  DashboardSummaryDTO,
  DashboardSummaryModel,
  PlannerAnalyticsDTO,
  PlannerAnalyticsModel,
  GoalAnalyticsDTO,
  GoalAnalyticsModel,
  HabitAnalyticsDTO,
  HabitAnalyticsModel,
  JournalAnalyticsDTO,
  JournalAnalyticsModel,
  JourneyAnalyticsDTO,
  JourneyAnalyticsModel,
  ProductivityAnalyticsDTO,
  ProductivityAnalyticsModel,
  TrendAnalyticsDTO,
  TrendAnalyticsModel,
  RechartsDataPoint
} from './analytics.types';

export const mapChartDatasetToDomain = (dto: ChartDatasetDTO): ChartDatasetModel => ({
  labels: dto.labels || [],
  datasets: dto.datasets || [],
  totals: dto.totals || {},
  metadata: dto.metadata || {}
});

export const mapChartDatasetToRecharts = (dto: ChartDatasetDTO): RechartsDataPoint[] => {
  if (!dto || !dto.labels) return [];
  return dto.labels.map((label, index) => {
    const dataPoint: RechartsDataPoint = { name: label };
    dto.datasets.forEach(dataset => {
      dataPoint[dataset.label || 'value'] = dataset.data[index] || 0;
    });
    return dataPoint;
  });
};

export const mapDashboardSummaryToDomain = (dto: DashboardSummaryDTO): DashboardSummaryModel => ({
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
  upcomingDeadlines: dto.upcoming_deadlines || [],
  mostImportantGoal: dto.most_important_goal,
  weeklyHighlights: dto.weekly_highlights || []
});

export const mapPlannerAnalyticsToDomain = (dto: PlannerAnalyticsDTO): PlannerAnalyticsModel => ({
  taskCompletionTrend: mapChartDatasetToDomain(dto.task_completion_trend),
  priorityDistribution: mapChartDatasetToDomain(dto.priority_distribution),
  categoryDistribution: mapChartDatasetToDomain(dto.category_distribution),
  weeklyCompletion: dto.weekly_completion,
  monthlyCompletion: dto.monthly_completion,
  estimatedVsActualTime: mapChartDatasetToDomain(dto.estimated_vs_actual_time),
  averageCompletionTimeHours: dto.average_completion_time_hours,
  upcomingDeadlines: dto.upcoming_deadlines || [],
  overdueTrends: mapChartDatasetToDomain(dto.overdue_trends),
  dailyProductivity: mapChartDatasetToDomain(dto.daily_productivity)
});

export const mapGoalAnalyticsToDomain = (dto: GoalAnalyticsDTO): GoalAnalyticsModel => ({
  goalProgress: dto.goal_progress,
  completedGoals: dto.completed_goals,
  averageGoalProgress: dto.average_goal_progress,
  goalCategories: mapChartDatasetToDomain(dto.goal_categories),
  milestoneCompletion: dto.milestone_completion,
  estimatedHours: dto.estimated_hours,
  actualHours: dto.actual_hours,
  goalVelocity: dto.goal_velocity,
  goalCompletionTrends: mapChartDatasetToDomain(dto.goal_completion_trends)
});

export const mapHabitAnalyticsToDomain = (dto: HabitAnalyticsDTO): HabitAnalyticsModel => ({
  completionRate: dto.completion_rate,
  currentStreak: dto.current_streak,
  longestStreak: dto.longest_streak,
  averageStreak: dto.average_streak,
  recoveryTimeDays: dto.recovery_time_days,
  breakFrequency: dto.break_frequency,
  weeklyActivity: mapChartDatasetToDomain(dto.weekly_activity),
  monthlyActivity: mapChartDatasetToDomain(dto.monthly_activity),
  habitHeatmap: mapChartDatasetToDomain(dto.habit_heatmap),
  categoryDistribution: mapChartDatasetToDomain(dto.category_distribution),
  consistencyScore: dto.consistency_score,
  bestHabit: dto.best_habit,
  weakestHabit: dto.weakest_habit
});

export const mapJournalAnalyticsToDomain = (dto: JournalAnalyticsDTO): JournalAnalyticsModel => ({
  writingStreak: dto.writing_streak,
  longestWritingStreak: dto.longest_writing_streak,
  wordCountTrends: mapChartDatasetToDomain(dto.word_count_trends),
  readingTimeTrends: mapChartDatasetToDomain(dto.reading_time_trends),
  moodDistribution: mapChartDatasetToDomain(dto.mood_distribution),
  energyTrends: mapChartDatasetToDomain(dto.energy_trends),
  stressTrends: mapChartDatasetToDomain(dto.stress_trends),
  favoriteEntries: dto.favorite_entries,
  monthlyWriting: mapChartDatasetToDomain(dto.monthly_writing),
  averageWords: dto.average_words,
  averageReadingTimeMins: dto.average_reading_time_mins
});

export const mapJourneyAnalyticsToDomain = (dto: JourneyAnalyticsDTO): JourneyAnalyticsModel => ({
  timelineGrowth: mapChartDatasetToDomain(dto.timeline_growth),
  activityTimeline: mapChartDatasetToDomain(dto.activity_timeline),
  favoriteMemories: dto.favorite_memories,
  pinnedMemories: dto.pinned_memories,
  memoryCategories: mapChartDatasetToDomain(dto.memory_categories),
  mostActiveMonth: dto.most_active_month,
  mostActiveYear: dto.most_active_year,
  monthlyActivity: mapChartDatasetToDomain(dto.monthly_activity),
  yearlyActivity: mapChartDatasetToDomain(dto.yearly_activity),
  milestoneCounts: dto.milestone_counts,
  journeyScore: dto.journey_score
});

export const mapProductivityAnalyticsToDomain = (dto: ProductivityAnalyticsDTO): ProductivityAnalyticsModel => ({
  overallScore: dto.overall_score,
  individualModuleScores: dto.individual_module_scores || {},
  scoreBreakdown: dto.score_breakdown || {},
  reasons: dto.reasons || []
});

export const mapTrendAnalyticsToDomain = (dto: TrendAnalyticsDTO): TrendAnalyticsModel => ({
  weekOverWeek: dto.week_over_week || {},
  monthOverMonth: dto.month_over_month || {},
  yearOverYear: dto.year_over_year || {},
  growth: dto.growth,
  decline: dto.decline,
  momentum: dto.momentum,
  stagnation: dto.stagnation,
  trendPercentages: dto.trend_percentages || {}
});
