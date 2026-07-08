from apps.journey.services.journey_statistics_service import JourneyStatisticsService
from apps.analytics.dtos import JourneyAnalytics, ChartDataset

class JourneyAnalyticsService:
    @staticmethod
    def get_analytics(user, filters=None):
        stats = JourneyStatisticsService.get_statistics(user)
        
        cat_dist = ChartDataset(
            labels=[c['category'] or 'None' for c in stats['category_distribution']],
            datasets=[{'label': 'Memories', 'data': [c['count'] for c in stats['category_distribution']]}]
        )
        
        monthly = ChartDataset(
            labels=[m['month'] for m in stats['monthly_activity_counts']],
            datasets=[{'label': 'Activity', 'data': [m['count'] for m in stats['monthly_activity_counts']]}]
        )
        
        yearly = ChartDataset(
            labels=[y['year'] for y in stats['yearly_activity_counts']],
            datasets=[{'label': 'Activity', 'data': [y['count'] for y in stats['yearly_activity_counts']]}]
        )
        
        return JourneyAnalytics(
            timeline_growth=ChartDataset(labels=[], datasets=[]),
            activity_timeline=ChartDataset(labels=[], datasets=[]),
            favorite_memories=stats['favorite_memories'],
            pinned_memories=stats['pinned_memories'],
            memory_categories=cat_dist,
            most_active_month=stats['most_active_month'] or '',
            most_active_year=str(stats['most_active_year'] or ''),
            monthly_activity=monthly,
            yearly_activity=yearly,
            milestone_counts=stats['habit_milestones'] + stats['writing_milestones'],
            journey_score=stats['total_timeline_events']
        )
