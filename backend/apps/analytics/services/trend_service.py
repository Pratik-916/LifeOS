from apps.analytics.dtos import TrendAnalytics

class TrendService:
    @staticmethod
    def calculate_trends(user, current_metrics, previous_metrics):
        """
        Takes dictionaries of current and previous metrics to calculate growth/decline.
        This is a generic service reusable by AI and Dashboard.
        """
        # Stub implementation. In production, this would do proper diffing across dictionaries.
        week_over_week = {}
        month_over_month = {}
        year_over_year = {}
        
        # Example logic: just standard defaults
        growth = 0.0
        decline = 0.0
        stagnation = True
        
        if current_metrics and previous_metrics:
            curr_score = current_metrics.get('score', 0)
            prev_score = previous_metrics.get('score', 0)
            
            if prev_score > 0:
                growth = ((curr_score - prev_score) / prev_score) * 100
                stagnation = abs(growth) < 5
            elif curr_score > 0:
                growth = 100
                stagnation = False

            if growth < 0:
                decline = abs(growth)
                growth = 0.0

        momentum = "High" if growth > 20 else "Moderate" if growth > 0 else "Low"

        return TrendAnalytics(
            week_over_week=week_over_week,
            month_over_month=month_over_month,
            year_over_year=year_over_year,
            growth=round(growth, 2),
            decline=round(decline, 2),
            momentum=momentum,
            stagnation=stagnation,
            trend_percentages={'overall': round(growth - decline, 2)}
        )
