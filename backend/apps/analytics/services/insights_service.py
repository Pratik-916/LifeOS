from apps.analytics.services.planner_analytics_service import PlannerAnalyticsService
from apps.analytics.services.goal_analytics_service import GoalAnalyticsService
from apps.analytics.services.habit_analytics_service import HabitAnalyticsService
from apps.analytics.services.journal_analytics_service import JournalAnalyticsService
from apps.analytics.services.journey_analytics_service import JourneyAnalyticsService
from apps.analytics.services.productivity_service import ProductivityService
from apps.analytics.services.trend_service import TrendService

class InsightsService:
    """
    Unified facade over every analytics service.
    Dashboard and future AI should consume ONLY InsightsService.
    """
    @staticmethod
    def get_planner_insights(user, filters=None):
        return PlannerAnalyticsService.get_analytics(user, filters)

    @staticmethod
    def get_goal_insights(user, filters=None):
        return GoalAnalyticsService.get_analytics(user, filters)

    @staticmethod
    def get_habit_insights(user, filters=None):
        return HabitAnalyticsService.get_analytics(user, filters)

    @staticmethod
    def get_journal_insights(user, filters=None):
        return JournalAnalyticsService.get_analytics(user, filters)

    @staticmethod
    def get_journey_insights(user, filters=None):
        return JourneyAnalyticsService.get_analytics(user, filters)

    @staticmethod
    def get_productivity_insights(user, filters=None):
        return ProductivityService.calculate_productivity_score(user, filters)

    @staticmethod
    def get_burnout_indicator(user):
        return ProductivityService.calculate_burnout_indicator(user)

    @staticmethod
    def get_trends(user, current_metrics, previous_metrics):
        return TrendService.calculate_trends(user, current_metrics, previous_metrics)
