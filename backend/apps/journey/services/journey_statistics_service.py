from django.db.models import Count
from django.db.models.functions import TruncMonth, TruncYear
from apps.activities.models import Activity
from apps.journey.models import Memory
from apps.planner.models import Task
from apps.goals.models import Goal
from apps.habits.models import Habit
from apps.journal.models import JournalEntry

class JourneyStatisticsService:
    @staticmethod
    def get_statistics(user):
        memories = Memory.objects.filter(user=user)
        activities = Activity.objects.filter(user=user)
        
        total_memories = memories.count()
        total_activities = activities.count()
        total_timeline_events = total_memories + total_activities
        
        # Simple stats
        completed_tasks = Task.objects.filter(user=user, status='completed').count()
        completed_goals = Goal.objects.filter(user=user, status='completed').count()
        
        # Milestones from activities
        habit_milestones = activities.filter(action="Habit Milestone").count()
        writing_milestones = activities.filter(action="Writing Milestone").count()
        
        # Longest streaks
        longest_habit_streak = max([h.longest_streak for h in Habit.objects.filter(user=user)] or [0])
        longest_writing_streak = 0 # Normally calculated in Journal, simplified here to 0 or fetch from activities/service if persisted
        
        favorite_memories = memories.filter(favorite=True).count()
        pinned_memories = memories.filter(pinned=True).count()
        
        # Distribution
        category_distribution = list(memories.values('category').annotate(count=Count('category')).order_by('-count'))
        most_used_category = category_distribution[0]['category'] if category_distribution else None
        
        # Activity grouped by time
        yearly_activity = list(activities.annotate(year=TruncYear('created_at')).values('year').annotate(count=Count('id')).order_by('year'))
        monthly_activity = list(activities.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month'))
        
        active_years = len(yearly_activity)
        current_year_activity = yearly_activity[-1]['count'] if yearly_activity else 0
        
        most_active_year_data = max(yearly_activity, key=lambda x: x['count'], default=None)
        most_active_year = most_active_year_data['year'].year if most_active_year_data and most_active_year_data['year'] else None
        
        most_active_month_data = max(monthly_activity, key=lambda x: x['count'], default=None)
        most_active_month = most_active_month_data['month'].strftime('%Y-%m') if most_active_month_data and most_active_month_data['month'] else None
        
        # Module distribution
        module_distribution = list(activities.values('content_type__model').annotate(count=Count('id')).order_by('-count'))
        most_active_module = module_distribution[0]['content_type__model'] if module_distribution else None
        
        return {
            "total_memories": total_memories,
            "total_timeline_events": total_timeline_events,
            "active_years": active_years,
            "current_year_activity": current_year_activity,
            "completed_goals": completed_goals,
            "completed_tasks": completed_tasks,
            "habit_milestones": habit_milestones,
            "writing_milestones": writing_milestones,
            "longest_habit_streak": longest_habit_streak,
            "longest_writing_streak": longest_writing_streak,
            "favorite_memories": favorite_memories,
            "pinned_memories": pinned_memories,
            "monthly_activity_counts": [{"month": str(m['month']), "count": m['count']} for m in monthly_activity],
            "yearly_activity_counts": [{"year": str(y['year'].year), "count": y['count']} for y in yearly_activity],
            "category_distribution": category_distribution,
            "most_active_month": most_active_month,
            "most_active_year": most_active_year,
            "most_used_category": most_used_category,
            "most_active_module": most_active_module,
            "average_events_per_month": round(total_timeline_events / len(monthly_activity) if monthly_activity else 0, 2),
        }
