from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class ChartDataset:
    labels: List[str]
    datasets: List[Dict[str, Any]]
    totals: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self):
        return {
            'labels': self.labels,
            'datasets': self.datasets,
            'totals': self.totals,
            'metadata': self.metadata
        }

@dataclass
class DashboardSummary:
    todays_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
    todays_habits: int
    completed_habits: int
    current_habit_streak: int
    longest_habit_streak: int
    current_goals: int
    completed_goals: int
    journal_entries_this_week: int
    journey_events_this_month: int
    productivity_score: int
    weekly_productivity: int
    monthly_productivity: int
    completion_percentage: float
    upcoming_deadlines: List[Dict[str, Any]]
    most_important_goal: Optional[Dict[str, Any]]
    weekly_highlights: List[str]
    
@dataclass
class PlannerAnalytics:
    task_completion_trend: ChartDataset
    priority_distribution: ChartDataset
    category_distribution: ChartDataset
    weekly_completion: int
    monthly_completion: int
    estimated_vs_actual_time: ChartDataset
    average_completion_time_hours: float
    upcoming_deadlines: List[Dict[str, Any]]
    overdue_trends: ChartDataset
    daily_productivity: ChartDataset

@dataclass
class GoalAnalytics:
    goal_progress: float
    completed_goals: int
    average_goal_progress: float
    goal_categories: ChartDataset
    milestone_completion: int
    estimated_hours: float
    actual_hours: float
    goal_velocity: float
    goal_completion_trends: ChartDataset

@dataclass
class HabitAnalytics:
    completion_rate: float
    current_streak: int
    longest_streak: int
    average_streak: float
    recovery_time_days: float
    break_frequency: int
    weekly_activity: ChartDataset
    monthly_activity: ChartDataset
    habit_heatmap: ChartDataset
    category_distribution: ChartDataset
    consistency_score: int
    best_habit: Optional[Dict[str, Any]]
    weakest_habit: Optional[Dict[str, Any]]

@dataclass
class JournalAnalytics:
    writing_streak: int
    longest_writing_streak: int
    word_count_trends: ChartDataset
    reading_time_trends: ChartDataset
    mood_distribution: ChartDataset
    energy_trends: ChartDataset
    stress_trends: ChartDataset
    favorite_entries: int
    monthly_writing: ChartDataset
    average_words: int
    average_reading_time_mins: float

@dataclass
class JourneyAnalytics:
    timeline_growth: ChartDataset
    activity_timeline: ChartDataset
    favorite_memories: int
    pinned_memories: int
    memory_categories: ChartDataset
    most_active_month: str
    most_active_year: str
    monthly_activity: ChartDataset
    yearly_activity: ChartDataset
    milestone_counts: int
    journey_score: int

@dataclass
class ProductivityAnalytics:
    overall_score: int
    individual_module_scores: Dict[str, int]
    score_breakdown: Dict[str, int]
    reasons: List[str]

@dataclass
class TrendAnalytics:
    week_over_week: Dict[str, Any]
    month_over_month: Dict[str, Any]
    year_over_year: Dict[str, Any]
    growth: float
    decline: float
    momentum: str
    stagnation: bool
    trend_percentages: Dict[str, float]
