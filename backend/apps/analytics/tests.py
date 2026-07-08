from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status

from apps.planner.models import Task
from apps.goals.models import Goal
from apps.habits.models import Habit
from apps.journal.models import JournalEntry
from apps.journey.models import Memory

User = get_user_model()

class AnalyticsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.base_url = '/api/v1/analytics/'
        
        self.user = User.objects.create_user(
            email='analytics@example.com',
            password='StrongPassword123!'
        )
        if hasattr(self.user, 'profile'):
            self.user.profile.timezone = 'UTC'
            self.user.profile.save()
            
        self.client.force_authenticate(user=self.user)
        
        # Create dummy data
        Task.objects.create(user=self.user, title='Task 1', status='completed', priority='high', estimated_minutes=30, actual_minutes=30, due_date=timezone.now().date())
        Goal.objects.create(user=self.user, title='Goal 1', status='completed', progress=100)
        Habit.objects.create(user=self.user, title='Habit 1', completion_rate=100.0, start_date=timezone.now().date())
        JournalEntry.objects.create(user=self.user, title='Journal 1', word_count=500, reading_time=2)
        Memory.objects.create(user=self.user, title='Memory 1', date=timezone.now())

    def test_dashboard_endpoint(self):
        response = self.client.get(f'{self.base_url}dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()['data']
        self.assertEqual(data['completed_tasks'], 1)
        self.assertEqual(data['completed_goals'], 1)
        self.assertEqual(data['todays_habits'], 1)
        self.assertTrue('productivity_score' in data)

    def test_planner_analytics_endpoint(self):
        response = self.client.get(f'{self.base_url}planner/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()['data']
        self.assertTrue('task_completion_trend' in data)
        self.assertEqual(data['average_completion_time_hours'], 0.5)

    def test_goals_analytics_endpoint(self):
        response = self.client.get(f'{self.base_url}goals/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()['data']
        self.assertEqual(data['completed_goals'], 1)

    def test_habits_analytics_endpoint(self):
        response = self.client.get(f'{self.base_url}habits/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()['data']
        self.assertEqual(data['completion_rate'], 100.0)

    def test_journal_analytics_endpoint(self):
        response = self.client.get(f'{self.base_url}journal/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()['data']
        self.assertEqual(data['average_words'], 500)
        self.assertEqual(data['average_reading_time_mins'], 2.0)

    def test_journey_analytics_endpoint(self):
        response = self.client.get(f'{self.base_url}journey/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()['data']
        self.assertTrue('timeline_growth' in data)

    def test_productivity_analytics_endpoint(self):
        response = self.client.get(f'{self.base_url}productivity/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()['data']
        self.assertTrue(data['overall_score'] > 0)
        self.assertTrue(len(data['reasons']) > 0)

    def test_trends_endpoint(self):
        response = self.client.get(f'{self.base_url}trends/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()['data']
        self.assertTrue('growth' in data)
