from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from apps.analytics.services.insights_service import InsightsService
from apps.analytics.services.dashboard_service import DashboardService
from apps.analytics.serializers import (
    DashboardSummarySerializer,
    PlannerAnalyticsSerializer,
    GoalAnalyticsSerializer,
    HabitAnalyticsSerializer,
    JournalAnalyticsSerializer,
    JourneyAnalyticsSerializer,
    ProductivityAnalyticsSerializer,
    TrendAnalyticsSerializer
)

class AnalyticsViewSet(viewsets.ViewSet):
    """
    Central intelligence engine of LifeOS. Read-only Analytics.
    """
    permission_classes = [IsAuthenticated]

    def _get_filters(self, request):
        return {
            'year': request.query_params.get('year'),
            'month': request.query_params.get('month'),
            'category': request.query_params.get('category'),
            'date_range': request.query_params.get('date_range')
        }

    @extend_schema(responses=DashboardSummarySerializer)
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        # We assume DashboardSummary is a DTO and can be serialized via standard dictionary mapping
        # or passing the dataclass directly to the serializer
        summary = DashboardService.get_summary(request.user)
        serializer = DashboardSummarySerializer(summary)
        return Response(serializer.data)

    @extend_schema(responses=DashboardSummarySerializer)
    @action(detail=False, methods=['get'])
    def overview(self, request):
        return self.dashboard(request) # Alias for dashboard for now

    @extend_schema(responses=PlannerAnalyticsSerializer)
    @action(detail=False, methods=['get'])
    def planner(self, request):
        insights = InsightsService.get_planner_insights(request.user, self._get_filters(request))
        serializer = PlannerAnalyticsSerializer(insights)
        return Response(serializer.data)

    @extend_schema(responses=GoalAnalyticsSerializer)
    @action(detail=False, methods=['get'])
    def goals(self, request):
        insights = InsightsService.get_goal_insights(request.user, self._get_filters(request))
        serializer = GoalAnalyticsSerializer(insights)
        return Response(serializer.data)

    @extend_schema(responses=HabitAnalyticsSerializer)
    @action(detail=False, methods=['get'])
    def habits(self, request):
        insights = InsightsService.get_habit_insights(request.user, self._get_filters(request))
        serializer = HabitAnalyticsSerializer(insights)
        return Response(serializer.data)

    @extend_schema(responses=JournalAnalyticsSerializer)
    @action(detail=False, methods=['get'])
    def journal(self, request):
        insights = InsightsService.get_journal_insights(request.user, self._get_filters(request))
        serializer = JournalAnalyticsSerializer(insights)
        return Response(serializer.data)

    @extend_schema(responses=JourneyAnalyticsSerializer)
    @action(detail=False, methods=['get'])
    def journey(self, request):
        insights = InsightsService.get_journey_insights(request.user, self._get_filters(request))
        serializer = JourneyAnalyticsSerializer(insights)
        return Response(serializer.data)

    @extend_schema(responses=ProductivityAnalyticsSerializer)
    @action(detail=False, methods=['get'])
    def productivity(self, request):
        insights = InsightsService.get_productivity_insights(request.user, self._get_filters(request))
        serializer = ProductivityAnalyticsSerializer(insights)
        return Response(serializer.data)

    @extend_schema(responses=dict)
    @action(detail=False, methods=['get'])
    def heatmap(self, request):
        # Specific endpoint if frontend needs just heatmap
        insights = InsightsService.get_habit_insights(request.user, self._get_filters(request))
        return Response(insights.habit_heatmap.to_dict())

    @extend_schema(responses=TrendAnalyticsSerializer)
    @action(detail=False, methods=['get'])
    def trends(self, request):
        # Stub: normally you fetch current metrics and previous metrics and pass to trend service
        insights = InsightsService.get_trends(request.user, {}, {})
        serializer = TrendAnalyticsSerializer(insights)
        return Response(serializer.data)

    @extend_schema(responses=dict)
    @action(detail=False, methods=['get'])
    def weekly(self, request):
        # Stub for generic weekly report
        return Response({"status": "weekly analytics generated"})
        
    @extend_schema(responses=dict)
    @action(detail=False, methods=['get'])
    def monthly(self, request):
        return Response({"status": "monthly analytics generated"})

    @extend_schema(responses=dict)
    @action(detail=False, methods=['get'])
    def yearly(self, request):
        return Response({"status": "yearly analytics generated"})
