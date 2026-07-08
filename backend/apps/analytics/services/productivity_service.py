from apps.analytics.constants import PRODUCTIVITY_WEIGHTS, BURNOUT_THRESHOLDS
from apps.analytics.dtos import ProductivityAnalytics
from apps.planner.models import Task
from apps.goals.models import Goal
from apps.habits.models import Habit
from apps.journal.models import JournalEntry

class ProductivityService:
    @staticmethod
    def calculate_productivity_score(user, filters=None):
        # A simple robust rule-based calculation mapping to PRODUCTIVITY_WEIGHTS
        reasons = []
        breakdown = {}
        
        # 1. Tasks (Max 30)
        tasks_done = Task.objects.filter(user=user, status='completed').count()
        task_score = min(PRODUCTIVITY_WEIGHTS['tasks'], tasks_done) 
        if task_score > 0:
            reasons.append(f"Task Completion +{task_score}")
        breakdown['tasks'] = task_score

        # 2. Goals (Max 25)
        goals_done = Goal.objects.filter(user=user, status='completed').count()
        goal_score = min(PRODUCTIVITY_WEIGHTS['goals'], goals_done * 5)
        if goal_score > 0:
            reasons.append(f"Goals +{goal_score}")
        breakdown['goals'] = goal_score
        
        # 3. Habits (Max 25)
        habits = Habit.objects.filter(user=user)
        habit_score = 0
        if habits.exists():
            avg_comp = sum(h.completion_rate for h in habits) / habits.count()
            habit_score = int(PRODUCTIVITY_WEIGHTS['habits'] * (avg_comp / 100.0))
            if habit_score > 0:
                reasons.append(f"Habits +{habit_score}")
        breakdown['habits'] = habit_score
        
        # 4. Journal (Max 10)
        journals_done = JournalEntry.objects.filter(user=user).count()
        journal_score = min(PRODUCTIVITY_WEIGHTS['journal'], journals_done * 2)
        if journal_score > 0:
            reasons.append(f"Journal +{journal_score}")
        breakdown['journal'] = journal_score
        
        # 5. Journey (Max 10)
        journey_score = min(PRODUCTIVITY_WEIGHTS['journey'], 5) # Default 5 if active
        if journey_score > 0:
            reasons.append(f"Journey +{journey_score}")
        breakdown['journey'] = journey_score

        overall = sum(breakdown.values())
        
        return ProductivityAnalytics(
            overall_score=overall,
            individual_module_scores=breakdown,
            score_breakdown=breakdown,
            reasons=reasons
        )

    @staticmethod
    def calculate_burnout_indicator(user):
        """
        Returns LOW, MEDIUM, or HIGH based on simple rule based calculation.
        """
        # simplified rule based burnout check
        # High pending tasks
        pending = Task.objects.filter(user=user, status__in=['todo', 'in_progress']).count()
        
        if pending > BURNOUT_THRESHOLDS['high']:
            return "HIGH"
        elif pending > BURNOUT_THRESHOLDS['medium']:
            return "MEDIUM"
        return "LOW"
