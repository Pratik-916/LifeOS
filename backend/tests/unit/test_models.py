import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from apps.planner.models import Task
from apps.goals.models import Goal, Milestone
from apps.habits.models import Habit
from apps.journal.models import JournalEntry
from apps.journey.models import Memory
from tests.factories.users import UserFactory
from tests.factories.planner import TaskFactory
from tests.factories.goals import GoalFactory, MilestoneFactory
from tests.factories.habits import HabitFactory
from tests.factories.journal import JournalEntryFactory
from tests.factories.journey import MemoryFactory

pytestmark = pytest.mark.django_db

class TestTaskModel:
    def test_task_save_sets_completed_at(self):
        task = TaskFactory(status='todo')
        assert task.completed_at is None
        
        task.status = 'completed'
        task.save()
        assert task.completed_at is not None
        
    def test_task_save_removes_completed_at(self):
        task = TaskFactory(status='completed')
        assert task.completed_at is not None
        
        task.status = 'in_progress'
        task.save()
        assert task.completed_at is None


class TestGoalModel:
    def test_goal_save_status_from_progress(self):
        goal = GoalFactory(progress=0.0)
        assert goal.status == 'not_started'
        
        goal.progress = 50.0
        goal.save()
        assert goal.status == 'in_progress'
        
        goal.progress = 100.0
        goal.save()
        assert goal.status == 'completed'
        assert goal.completed_at is not None

    def test_goal_save_NaN_progress(self):
        goal = GoalFactory()
        goal.progress = float('nan')
        goal.save()
        assert goal.progress == 0.0

    def test_milestone_calculates_goal_progress(self):
        goal = GoalFactory()
        m1 = MilestoneFactory(goal=goal, is_completed=False)
        m2 = MilestoneFactory(goal=goal, is_completed=False)
        
        goal.refresh_from_db()
        assert goal.progress == 0.0
        
        m1.is_completed = True
        m1.save()
        
        goal.refresh_from_db()
        assert goal.progress == 50.0
        
        m2.is_completed = True
        m2.save()
        
        goal.refresh_from_db()
        assert goal.progress == 100.0
        
        m2.delete()
        goal.refresh_from_db()
        assert goal.progress == 100.0


class TestHabitModel:
    def test_habit_validation_target_count(self):
        habit = HabitFactory(target_count=0)
        with pytest.raises(ValidationError) as excinfo:
            habit.clean()
        assert 'Target count must be at least 1' in str(excinfo.value)
        
    def test_habit_validation_end_date(self):
        start = timezone.now().date()
        end = start - timezone.timedelta(days=1)
        habit = HabitFactory(start_date=start, end_date=end)
        with pytest.raises(ValidationError) as excinfo:
            habit.clean()
        assert 'End date cannot be before start date' in str(excinfo.value)


class TestJournalEntryModel:
    def test_journal_validation_levels(self):
        entry = JournalEntryFactory(energy_level=11)
        with pytest.raises(ValidationError) as excinfo:
            entry.clean()
        assert 'Energy level must be between 1 and 10' in str(excinfo.value)
        
        entry = JournalEntryFactory(stress_level=0)
        with pytest.raises(ValidationError) as excinfo:
            entry.clean()
        assert 'Stress level must be between 1 and 10' in str(excinfo.value)
