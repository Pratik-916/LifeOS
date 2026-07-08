from django.utils import timezone
from datetime import timedelta
from apps.habits.models import Habit, HabitLog
import pytz

def get_dashboard_stats(user):
    user_tz_str = getattr(user.profile, 'timezone', 'UTC') if hasattr(user, 'profile') else 'UTC'
    try:
        user_tz = pytz.timezone(user_tz_str)
    except pytz.UnknownTimeZoneError:
        user_tz = pytz.UTC

    now = timezone.now()
    local_now = now.astimezone(user_tz)
    today = local_now.date()
    
    active_habits = Habit.objects.filter(user=user, status='active', is_archived=False)
    
    today_habits = []
    completed_today = 0
    
    for habit in active_habits:
        if habit.frequency == 'daily':
            if habit.start_date <= today and (not habit.end_date or habit.end_date >= today):
                today_habits.append(habit)
                if habit.current_count >= habit.target_count:
                    completed_today += 1

    total_today = len(today_habits)
    pending_today = total_today - completed_today
    completion_percentage = (completed_today / total_today * 100) if total_today > 0 else 0
    
    # Calculate global streak metrics across all habits
    longest_streak_ever = max([h.longest_streak for h in active_habits], default=0)
    current_streak_sum = sum([h.current_streak for h in active_habits])
    
    return {
        "total_today": total_today,
        "completed_today": completed_today,
        "pending_today": pending_today,
        "completion_percentage": round(completion_percentage, 2),
        "longest_streak_ever": longest_streak_ever,
        "current_streak_sum": current_streak_sum,
    }
