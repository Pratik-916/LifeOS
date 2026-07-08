from rest_framework import serializers

# Since our services return simple Python dataclasses or dicts, 
# we can use simple serializers to serialize the response properly 
# and generate standard Swagger schemas.

class ChartDatasetSerializer(serializers.Serializer):
    labels = serializers.ListField(child=serializers.CharField())
    datasets = serializers.ListField(child=serializers.DictField())
    totals = serializers.DictField(required=False)
    metadata = serializers.DictField(required=False)

class DashboardSummarySerializer(serializers.Serializer):
    todays_tasks = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    overdue_tasks = serializers.IntegerField()
    todays_habits = serializers.IntegerField()
    completed_habits = serializers.IntegerField()
    current_habit_streak = serializers.IntegerField()
    longest_habit_streak = serializers.IntegerField()
    current_goals = serializers.IntegerField()
    completed_goals = serializers.IntegerField()
    journal_entries_this_week = serializers.IntegerField()
    journey_events_this_month = serializers.IntegerField()
    productivity_score = serializers.IntegerField()
    weekly_productivity = serializers.IntegerField()
    monthly_productivity = serializers.IntegerField()
    completion_percentage = serializers.FloatField()
    upcoming_deadlines = serializers.ListField(child=serializers.DictField())
    most_important_goal = serializers.DictField(allow_null=True)
    weekly_highlights = serializers.ListField(child=serializers.CharField())

class PlannerAnalyticsSerializer(serializers.Serializer):
    task_completion_trend = ChartDatasetSerializer()
    priority_distribution = ChartDatasetSerializer()
    category_distribution = ChartDatasetSerializer()
    weekly_completion = serializers.IntegerField()
    monthly_completion = serializers.IntegerField()
    estimated_vs_actual_time = ChartDatasetSerializer()
    average_completion_time_hours = serializers.FloatField()
    upcoming_deadlines = serializers.ListField(child=serializers.DictField())
    overdue_trends = ChartDatasetSerializer()
    daily_productivity = ChartDatasetSerializer()

class GoalAnalyticsSerializer(serializers.Serializer):
    goal_progress = serializers.FloatField()
    completed_goals = serializers.IntegerField()
    average_goal_progress = serializers.FloatField()
    goal_categories = ChartDatasetSerializer()
    milestone_completion = serializers.IntegerField()
    estimated_hours = serializers.FloatField()
    actual_hours = serializers.FloatField()
    goal_velocity = serializers.FloatField()
    goal_completion_trends = ChartDatasetSerializer()

class HabitAnalyticsSerializer(serializers.Serializer):
    completion_rate = serializers.FloatField()
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()
    average_streak = serializers.FloatField()
    recovery_time_days = serializers.FloatField()
    break_frequency = serializers.IntegerField()
    weekly_activity = ChartDatasetSerializer()
    monthly_activity = ChartDatasetSerializer()
    habit_heatmap = ChartDatasetSerializer()
    category_distribution = ChartDatasetSerializer()
    consistency_score = serializers.IntegerField()
    best_habit = serializers.DictField(allow_null=True)
    weakest_habit = serializers.DictField(allow_null=True)

class JournalAnalyticsSerializer(serializers.Serializer):
    writing_streak = serializers.IntegerField()
    longest_writing_streak = serializers.IntegerField()
    word_count_trends = ChartDatasetSerializer()
    reading_time_trends = ChartDatasetSerializer()
    mood_distribution = ChartDatasetSerializer()
    energy_trends = ChartDatasetSerializer()
    stress_trends = ChartDatasetSerializer()
    favorite_entries = serializers.IntegerField()
    monthly_writing = ChartDatasetSerializer()
    average_words = serializers.IntegerField()
    average_reading_time_mins = serializers.FloatField()

class JourneyAnalyticsSerializer(serializers.Serializer):
    timeline_growth = ChartDatasetSerializer()
    activity_timeline = ChartDatasetSerializer()
    favorite_memories = serializers.IntegerField()
    pinned_memories = serializers.IntegerField()
    memory_categories = ChartDatasetSerializer()
    most_active_month = serializers.CharField()
    most_active_year = serializers.CharField()
    monthly_activity = ChartDatasetSerializer()
    yearly_activity = ChartDatasetSerializer()
    milestone_counts = serializers.IntegerField()
    journey_score = serializers.IntegerField()

class ProductivityAnalyticsSerializer(serializers.Serializer):
    overall_score = serializers.IntegerField()
    individual_module_scores = serializers.DictField()
    score_breakdown = serializers.DictField()
    reasons = serializers.ListField(child=serializers.CharField())
    
class TrendAnalyticsSerializer(serializers.Serializer):
    week_over_week = serializers.DictField()
    month_over_month = serializers.DictField()
    year_over_year = serializers.DictField()
    growth = serializers.FloatField()
    decline = serializers.FloatField()
    momentum = serializers.CharField()
    stagnation = serializers.BooleanField()
    trend_percentages = serializers.DictField(child=serializers.FloatField())
