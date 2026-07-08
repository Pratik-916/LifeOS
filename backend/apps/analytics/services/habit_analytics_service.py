from django.db.models import Avg, Max, Count
from apps.habits.models import Habit
from apps.analytics.dtos import HabitAnalytics, ChartDataset

class HabitAnalyticsService:
    @staticmethod
    def get_analytics(user, filters=None):
        habits = Habit.objects.filter(user=user)
        
        avg_completion = habits.aggregate(Avg('completion_rate'))['completion_rate__avg'] or 0
        longest_streak = habits.aggregate(Max('longest_streak'))['longest_streak__max'] or 0
        current_streak = sum(h.current_streak for h in habits)
        
        category_data = list(habits.values('category').annotate(count=Count('id')))
        cat_dist = ChartDataset(
            labels=[c['category'] or 'None' for c in category_data],
            datasets=[{'label': 'Habits', 'data': [c['count'] for c in category_data]}]
        )
        
        best_habit = habits.order_by('-completion_rate').first()
        weakest_habit = habits.order_by('completion_rate').first()
        
        return HabitAnalytics(
            completion_rate=round(avg_completion, 2),
            current_streak=current_streak,
            longest_streak=longest_streak,
            average_streak=0.0,
            recovery_time_days=0.0,
            break_frequency=0,
            weekly_activity=ChartDataset(labels=[], datasets=[]),
            monthly_activity=ChartDataset(labels=[], datasets=[]),
            habit_heatmap=ChartDataset(labels=[], datasets=[]),
            category_distribution=cat_dist,
            consistency_score=int(avg_completion),
            best_habit={'title': best_habit.title} if best_habit else None,
            weakest_habit={'title': weakest_habit.title} if weakest_habit else None
        )
