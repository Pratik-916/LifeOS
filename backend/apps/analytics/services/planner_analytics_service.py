from django.db.models import Count, Avg, Sum, Case, When, F, ExpressionWrapper, FloatField
from django.db.models.functions import TruncWeek, TruncMonth, ExtractDay
from apps.planner.models import Task
from apps.analytics.dtos import PlannerAnalytics, ChartDataset

class PlannerAnalyticsService:
    @staticmethod
    def get_analytics(user, filters=None):
        tasks = Task.objects.filter(user=user)
        
        # Priority distribution
        priority_data = list(tasks.values('priority').annotate(count=Count('id')))
        priority_dist = ChartDataset(
            labels=[item['priority'] for item in priority_data],
            datasets=[{'label': 'Tasks', 'data': [item['count'] for item in priority_data]}]
        )
        
        # Category distribution
        category_data = list(tasks.values('category').annotate(count=Count('id')))
        category_dist = ChartDataset(
            labels=[item['category'] or 'None' for item in category_data],
            datasets=[{'label': 'Tasks', 'data': [item['count'] for item in category_data]}]
        )
        
        # Estimated vs Actual
        completed = tasks.filter(status='completed')
        avg_est = completed.aggregate(Avg('estimated_minutes'))['estimated_minutes__avg'] or 0
        avg_act = completed.aggregate(Avg('actual_minutes'))['actual_minutes__avg'] or 0
        
        est_vs_act = ChartDataset(
            labels=['Estimated', 'Actual'],
            datasets=[{'label': 'Minutes', 'data': [avg_est, avg_act]}]
        )
        
        # Averages
        avg_completion = (avg_act / 60.0) if avg_act else 0
        
        # Basic counts
        weekly_comp = completed.annotate(week=TruncWeek('completed_at')).values('week').annotate(count=Count('id'))
        monthly_comp = completed.annotate(month=TruncMonth('completed_at')).values('month').annotate(count=Count('id'))
        
        return PlannerAnalytics(
            task_completion_trend=ChartDataset(labels=[], datasets=[]),
            priority_distribution=priority_dist,
            category_distribution=category_dist,
            weekly_completion=sum(w['count'] for w in weekly_comp),
            monthly_completion=sum(m['count'] for m in monthly_comp),
            estimated_vs_actual_time=est_vs_act,
            average_completion_time_hours=round(avg_completion, 2),
            upcoming_deadlines=[],
            overdue_trends=ChartDataset(labels=[], datasets=[]),
            daily_productivity=ChartDataset(labels=[], datasets=[])
        )
