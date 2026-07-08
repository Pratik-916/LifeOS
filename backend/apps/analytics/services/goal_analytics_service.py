from django.db.models import Count, Avg, Sum
from apps.goals.models import Goal
from apps.analytics.dtos import GoalAnalytics, ChartDataset

class GoalAnalyticsService:
    @staticmethod
    def get_analytics(user, filters=None):
        goals = Goal.objects.filter(user=user)
        completed_goals = goals.filter(status='completed')
        
        avg_prog = goals.aggregate(Avg('progress'))['progress__avg'] or 0
        
        category_data = list(goals.values('category').annotate(count=Count('id')))
        goal_categories = ChartDataset(
            labels=[item['category'] or 'None' for item in category_data],
            datasets=[{'label': 'Goals', 'data': [item['count'] for item in category_data]}]
        )
        
        est_hrs = goals.aggregate(Sum('estimated_hours'))['estimated_hours__sum'] or 0
        act_hrs = goals.aggregate(Sum('actual_hours'))['actual_hours__sum'] or 0
        
        return GoalAnalytics(
            goal_progress=round(avg_prog, 2),
            completed_goals=completed_goals.count(),
            average_goal_progress=round(avg_prog, 2),
            goal_categories=goal_categories,
            milestone_completion=0,
            estimated_hours=float(est_hrs),
            actual_hours=float(act_hrs),
            goal_velocity=0.0,
            goal_completion_trends=ChartDataset(labels=[], datasets=[])
        )
