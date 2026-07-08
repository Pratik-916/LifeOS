from datetime import timedelta, date
from django.utils import timezone
import pytz

def get_user_timezone(habit):
    user_tz_str = getattr(habit.user.profile, 'timezone', 'UTC') if hasattr(habit.user, 'profile') else 'UTC'
    try:
        return pytz.timezone(user_tz_str)
    except pytz.UnknownTimeZoneError:
        return pytz.UTC

def get_local_today(user_tz):
    return timezone.now().astimezone(user_tz).date()

def calculate_stats(habit):
    user_tz = get_user_timezone(habit)
    today = get_local_today(user_tz)
    
    logs = habit.logs.all().order_by('-completion_date')
    
    if not logs.exists():
        habit.current_count = 0
        habit.current_streak = 0
        habit.completion_rate = 0.0
        # longest_streak stays as is
        habit.save()
        return habit

    # Calculate completion rate
    total_completions = logs.count()
    start = habit.start_date
    end = min(today, habit.end_date) if habit.end_date else today
    
    if habit.frequency == 'daily':
        total_periods = (end - start).days + 1
    elif habit.frequency == 'weekly':
        total_periods = ((end - start).days // 7) + 1
    elif habit.frequency == 'monthly':
        total_periods = (end.year - start.year) * 12 + (end.month - start.month) + 1
    else:
        total_periods = 1
        
    total_periods = max(1, total_periods)
    completion_rate = (total_completions / total_periods) * 100.0
    habit.completion_rate = round(min(100.0, max(0.0, completion_rate)), 2)
    
    # Calculate streaks
    current_streak = 0
    longest_streak = 0
    temp_streak = 0
    
    if habit.frequency == 'daily':
        # Daily streak calculation
        dates = [log.completion_date for log in logs if log.count >= habit.target_count]
        dates = sorted(list(set(dates)), reverse=True) # Ensure unique, sorted desc
        
        if not dates:
            habit.current_streak = 0
            habit.save()
            return habit
            
        # Determine if streak is currently active
        # Active if logged today, or logged yesterday (streak hasn't broken yet)
        expected_next = dates[0]
        if expected_next == today or expected_next == today - timedelta(days=1):
            is_active_streak = True
        else:
            is_active_streak = False
            
        if is_active_streak:
            current_streak = 1
            for i in range(1, len(dates)):
                if dates[i] == dates[i-1] - timedelta(days=1):
                    current_streak += 1
                else:
                    break
                    
        # Calculate longest streak across all logs
        temp_streak = 1
        longest_streak = 1
        for i in range(1, len(dates)):
            if dates[i] == dates[i-1] - timedelta(days=1):
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 1

    elif habit.frequency == 'weekly':
        # Weekly: compare (iso_year, iso_week)
        # target_count in a week means sum of logs in that week >= target_count
        # Or simple version: just consider any week with a log as a point if sum >= target
        # For performance, we group by iso_calendar
        week_counts = {}
        for log in logs:
            iso_year, iso_week, _ = log.completion_date.isocalendar()
            key = (iso_year, iso_week)
            week_counts[key] = week_counts.get(key, 0) + log.count
            
        completed_weeks = sorted([w for w, c in week_counts.items() if c >= habit.target_count], reverse=True)
        
        if not completed_weeks:
            habit.current_streak = 0
            habit.save()
            return habit
            
        today_iso = today.isocalendar()
        today_week = (today_iso[0], today_iso[1])
        last_week_date = today - timedelta(days=7)
        last_week_iso = last_week_date.isocalendar()
        last_week = (last_week_iso[0], last_week_iso[1])
        
        if completed_weeks[0] == today_week or completed_weeks[0] == last_week:
            current_streak = 1
            for i in range(1, len(completed_weeks)):
                prev_y, prev_w = completed_weeks[i-1]
                curr_y, curr_w = completed_weeks[i]
                
                # Check consecutive logic
                if prev_w == 1:
                    expected = (prev_y - 1, date(prev_y - 1, 12, 28).isocalendar()[1])
                else:
                    expected = (prev_y, prev_w - 1)
                    
                if (curr_y, curr_w) == expected:
                    current_streak += 1
                else:
                    break
        
        temp_streak = 1
        longest_streak = 1
        for i in range(1, len(completed_weeks)):
            prev_y, prev_w = completed_weeks[i-1]
            curr_y, curr_w = completed_weeks[i]
            if prev_w == 1:
                expected = (prev_y - 1, date(prev_y - 1, 12, 28).isocalendar()[1])
            else:
                expected = (prev_y, prev_w - 1)
                
            if (curr_y, curr_w) == expected:
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 1

    elif habit.frequency == 'monthly':
        # Monthly: compare (year, month)
        month_counts = {}
        for log in logs:
            key = (log.completion_date.year, log.completion_date.month)
            month_counts[key] = month_counts.get(key, 0) + log.count
            
        completed_months = sorted([m for m, c in month_counts.items() if c >= habit.target_count], reverse=True)
        
        if not completed_months:
            habit.current_streak = 0
            habit.save()
            return habit
            
        today_month = (today.year, today.month)
        if today.month == 1:
            last_month = (today.year - 1, 12)
        else:
            last_month = (today.year, today.month - 1)
            
        if completed_months[0] == today_month or completed_months[0] == last_month:
            current_streak = 1
            for i in range(1, len(completed_months)):
                prev_y, prev_m = completed_months[i-1]
                curr_y, curr_m = completed_months[i]
                
                expected_m = 12 if prev_m == 1 else prev_m - 1
                expected_y = prev_y - 1 if prev_m == 1 else prev_y
                
                if (curr_y, curr_m) == (expected_y, expected_m):
                    current_streak += 1
                else:
                    break
                    
        temp_streak = 1
        longest_streak = 1
        for i in range(1, len(completed_months)):
            prev_y, prev_m = completed_months[i-1]
            curr_y, curr_m = completed_months[i]
            expected_m = 12 if prev_m == 1 else prev_m - 1
            expected_y = prev_y - 1 if prev_m == 1 else prev_y
            
            if (curr_y, curr_m) == (expected_y, expected_m):
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 1

    habit.current_streak = current_streak
    habit.longest_streak = max(habit.longest_streak, longest_streak)
    
    # Calculate current_count for today/this week/this month
    if habit.frequency == 'daily':
        today_logs = [l for l in logs if l.completion_date == today]
        habit.current_count = sum(l.count for l in today_logs)
    elif habit.frequency == 'weekly':
        today_iso = today.isocalendar()
        week_logs = [l for l in logs if l.completion_date.isocalendar()[:2] == today_iso[:2]]
        habit.current_count = sum(l.count for l in week_logs)
    elif habit.frequency == 'monthly':
        month_logs = [l for l in logs if l.completion_date.year == today.year and l.completion_date.month == today.month]
        habit.current_count = sum(l.count for l in month_logs)

    habit.save()
    return habit
