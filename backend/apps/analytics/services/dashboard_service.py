from apps.planner.models import Task
from apps.goals.models import Goal
from apps.habits.models import Habit
from apps.journal.models import JournalEntry
from apps.journey.models import Memory
from apps.activities.models import Activity
from django.utils import timezone
from apps.analytics.dtos import DashboardSummary
from apps.analytics.services.insights_service import InsightsService

class DashboardService:
    @staticmethod
    def get_summary(user):
        today = timezone.now().date()
        
        todays_tasks = Task.objects.filter(user=user, due_date=today)
        pending_tasks = Task.objects.filter(user=user, status__in=['todo', 'in_progress'])
        overdue_tasks = pending_tasks.filter(due_date__lt=today)
        completed_tasks = Task.objects.filter(user=user, status='completed').count()
        
        habits = Habit.objects.filter(user=user)
        completed_habits = 0 # Normally we check HabitLog for today
        current_streak = sum(h.current_streak for h in habits)
        longest_streak = max([h.longest_streak for h in habits] or [0])
        
        goals = Goal.objects.filter(user=user)
        current_goals = goals.filter(status='in_progress').count()
        completed_goals = goals.filter(status='completed').count()
        most_important = goals.filter(status='in_progress').order_by('-priority').first()
        
        journal_entries_week = JournalEntry.objects.filter(user=user, created_at__gte=timezone.now() - timezone.timedelta(days=7)).count()
        journey_events_month = Activity.objects.filter(user=user, created_at__gte=timezone.now() - timezone.timedelta(days=30)).count() + \
                               Memory.objects.filter(user=user, created_at__gte=timezone.now() - timezone.timedelta(days=30)).count()
        
        prod = InsightsService.get_productivity_insights(user)
        
        return DashboardSummary(
            todays_tasks=todays_tasks.count(),
            completed_tasks=completed_tasks,
            pending_tasks=pending_tasks.count(),
            overdue_tasks=overdue_tasks.count(),
            todays_habits=habits.count(),
            completed_habits=completed_habits,
            current_habit_streak=current_streak,
            longest_habit_streak=longest_streak,
            current_goals=current_goals,
            completed_goals=completed_goals,
            journal_entries_this_week=journal_entries_week,
            journey_events_this_month=journey_events_month,
            productivity_score=prod.overall_score,
            weekly_productivity=prod.overall_score,
            monthly_productivity=prod.overall_score,
            completion_percentage=round((completed_tasks / max((completed_tasks + pending_tasks.count()), 1)) * 100, 2),
            upcoming_deadlines=[{'title': t.title, 'date': t.due_date} for t in pending_tasks.filter(due_date__gte=today).order_by('due_date')[:5]],
            most_important_goal={'title': most_important.title} if most_important else None,
            weekly_highlights=prod.reasons
        )
