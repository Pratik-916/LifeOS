import re
import math
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Avg, F
from django.db.models.functions import TruncDate
import pytz
from apps.journal.models import JournalEntry

def calculate_word_and_reading_time(text):
    if not text:
        return 0, 0
    words = len(re.findall(r'\b\w+\b', text))
    # Average reading speed ~ 200 words per minute
    reading_time = math.ceil(words / 200.0)
    return words, reading_time

def get_journal_stats(user):
    user_tz_str = getattr(user.profile, 'timezone', 'UTC') if hasattr(user, 'profile') else 'UTC'
    try:
        user_tz = pytz.timezone(user_tz_str)
    except pytz.UnknownTimeZoneError:
        user_tz = pytz.UTC

    now = timezone.now()
    local_now = now.astimezone(user_tz)
    today = local_now.date()
    this_week_start = today - timedelta(days=today.weekday())
    this_month_start = today.replace(day=1)
    
    qs = JournalEntry.objects.filter(user=user, status='published')
    
    total_entries = qs.count()
    if total_entries == 0:
        return {
            "total_entries": 0,
            "entries_this_week": 0,
            "entries_this_month": 0,
            "favorite_count": 0,
            "total_words": 0,
            "average_words": 0,
            "average_reading_time": 0,
            "average_mood": None,
            "average_sentiment": None,
            "current_streak": 0,
            "longest_streak": 0,
            "writing_heatmap": []
        }

    # Aggregate simple stats
    stats = qs.aggregate(
        total_words=Count('word_count'),
        avg_words=Avg('word_count'),
        avg_reading_time=Avg('reading_time'),
        avg_sentiment=Avg('sentiment_score')
    )
    # Using python to sum words properly if needed, but DB is fine
    total_words = sum(qs.values_list('word_count', flat=True))

    entries_this_week = qs.filter(created_at__gte=local_now.replace(hour=0, minute=0, second=0) - timedelta(days=today.weekday())).count()
    entries_this_month = qs.filter(created_at__gte=local_now.replace(day=1, hour=0, minute=0, second=0)).count()
    favorite_count = qs.filter(is_favorite=True).count()
    
    # Calculate most frequent mood
    mood_counts = qs.exclude(mood='').values('mood').annotate(count=Count('mood')).order_by('-count')
    avg_mood = mood_counts[0]['mood'] if mood_counts else None

    # Heatmap and Streaks
    # We will aggregate entries by date in user's timezone. Since dates are stored as DateTime in UTC, we use TruncDate but 
    # to be fully accurate we need TZ aware TruncDate. For simplicity, we fetch all dates and process in python.
    dates = qs.order_by('-created_at').values_list('created_at', flat=True)
    local_dates = sorted(list(set([d.astimezone(user_tz).date() for d in dates])), reverse=True)
    
    current_streak = 0
    longest_streak = 0
    temp_streak = 0
    
    if local_dates:
        expected_next = local_dates[0]
        if expected_next == today or expected_next == today - timedelta(days=1):
            is_active_streak = True
        else:
            is_active_streak = False
            
        if is_active_streak:
            current_streak = 1
            for i in range(1, len(local_dates)):
                if local_dates[i] == local_dates[i-1] - timedelta(days=1):
                    current_streak += 1
                else:
                    break
                    
        temp_streak = 1
        longest_streak = 1
        for i in range(1, len(local_dates)):
            if local_dates[i] == local_dates[i-1] - timedelta(days=1):
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 1
                
    heatmap = [{"date": str(d), "count": 1} for d in local_dates[:30]] # Just latest 30 days for brevity

    return {
        "total_entries": total_entries,
        "entries_this_week": entries_this_week,
        "entries_this_month": entries_this_month,
        "favorite_count": favorite_count,
        "total_words": total_words,
        "average_words": round(stats['avg_words'] or 0, 1),
        "average_reading_time": round(stats['avg_reading_time'] or 0, 1),
        "average_mood": avg_mood,
        "average_sentiment": round(stats['avg_sentiment'] or 0, 2) if stats['avg_sentiment'] else None,
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "writing_heatmap": heatmap
    }
