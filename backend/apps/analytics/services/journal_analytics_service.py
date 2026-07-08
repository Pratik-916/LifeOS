from django.db.models import Avg, Sum, Count
from apps.journal.models import JournalEntry
from apps.analytics.dtos import JournalAnalytics, ChartDataset

class JournalAnalyticsService:
    @staticmethod
    def get_analytics(user, filters=None):
        entries = JournalEntry.objects.filter(user=user)
        
        avg_words = entries.aggregate(Avg('word_count'))['word_count__avg'] or 0
        avg_reading = entries.aggregate(Avg('reading_time'))['reading_time__avg'] or 0
        
        mood_data = list(entries.values('mood').annotate(count=Count('id')))
        mood_dist = ChartDataset(
            labels=[m['mood'] or 'None' for m in mood_data],
            datasets=[{'label': 'Moods', 'data': [m['count'] for m in mood_data]}]
        )
        
        favorites = entries.filter(is_favorite=True).count()
        
        return JournalAnalytics(
            writing_streak=0,
            longest_writing_streak=0,
            word_count_trends=ChartDataset(labels=[], datasets=[]),
            reading_time_trends=ChartDataset(labels=[], datasets=[]),
            mood_distribution=mood_dist,
            energy_trends=ChartDataset(labels=[], datasets=[]),
            stress_trends=ChartDataset(labels=[], datasets=[]),
            favorite_entries=favorites,
            monthly_writing=ChartDataset(labels=[], datasets=[]),
            average_words=int(avg_words),
            average_reading_time_mins=round(avg_reading, 2)
        )
