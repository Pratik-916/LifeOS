import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from tests.factories.users import UserFactory
from tests.factories.planner import TaskFactory
from tests.factories.goals import GoalFactory
from tests.factories.habits import HabitFactory
from tests.factories.journal import JournalEntryFactory
from tests.factories.journey import MemoryFactory

pytestmark = pytest.mark.django_db

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def auth_client(api_client):
    user = UserFactory()
    api_client.force_authenticate(user=user)
    api_client.user = user
    return api_client

class TestPlannerAPI:
    def test_tasks_list_unauthorized(self, api_client):
        url = reverse('task-list')
        response = api_client.get(url)
        assert response.status_code == 401

    def test_tasks_list_authorized(self, auth_client):
        TaskFactory(user=auth_client.user)
        url = reverse('task-list')
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data.get('results', response.data)) > 0
        
    def test_task_create(self, auth_client):
        url = reverse('task-list')
        data = {'title': 'New Task', 'status': 'todo', 'priority': 'medium'}
        response = auth_client.post(url, data, format='json')
        assert response.status_code == 201


class TestGoalsAPI:
    def test_goals_list_unauthorized(self, api_client):
        url = reverse('goal-list')
        response = api_client.get(url)
        assert response.status_code == 401

    def test_goals_list_authorized(self, auth_client):
        GoalFactory(user=auth_client.user)
        url = reverse('goal-list')
        response = auth_client.get(url)
        assert response.status_code == 200

    def test_goal_create(self, auth_client):
        url = reverse('goal-list')
        data = {'title': 'New Goal', 'status': 'not_started'}
        response = auth_client.post(url, data, format='json')
        assert response.status_code == 201


class TestHabitsAPI:
    def test_habits_list_unauthorized(self, api_client):
        url = reverse('habit-list')
        response = api_client.get(url)
        assert response.status_code == 401

    def test_habits_list_authorized(self, auth_client):
        HabitFactory(user=auth_client.user)
        url = reverse('habit-list')
        response = auth_client.get(url)
        assert response.status_code == 200

    def test_habit_create(self, auth_client):
        url = reverse('habit-list')
        data = {'title': 'New Habit', 'start_date': '2023-01-01', 'frequency': 'daily'}
        response = auth_client.post(url, data, format='json')
        assert response.status_code == 201


class TestJournalAPI:
    def test_journal_list_unauthorized(self, api_client):
        url = reverse('journalentry-list')
        response = api_client.get(url)
        assert response.status_code == 401

    def test_journal_list_authorized(self, auth_client):
        JournalEntryFactory(user=auth_client.user)
        url = reverse('journalentry-list')
        response = auth_client.get(url)
        assert response.status_code == 200

    def test_journal_create(self, auth_client):
        url = reverse('journalentry-list')
        data = {'title': 'New Entry', 'content': 'Hello world'}
        response = auth_client.post(url, data, format='json')
        assert response.status_code == 201


class TestJourneyAPI:
    def test_memories_list_unauthorized(self, api_client):
        url = reverse('memory-list')
        response = api_client.get(url)
        assert response.status_code == 401

    def test_memories_list_authorized(self, auth_client):
        MemoryFactory(user=auth_client.user)
        url = reverse('memory-list')
        response = auth_client.get(url)
        assert response.status_code == 200

    def test_memory_create(self, auth_client):
        url = reverse('memory-list')
        data = {'title': 'New Memory', 'date': '2023-01-01T12:00:00Z'}
        response = auth_client.post(url, data, format='json')
        assert response.status_code == 201
