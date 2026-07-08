from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import timedelta
import pytz

from .models import Habit, HabitLog, HabitReminder
from apps.tags.models import Tag
from apps.activities.models import Activity
from apps.users.models import UserProfile

User = get_user_model()

class HabitTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.habits_url = '/api/v1/habits/habits/'
        
        self.user = User.objects.create_user(
            email='habits@example.com',
            password='StrongPassword123!'
        )
        # Ensure profile has timezone
        self.user.profile.timezone = 'UTC'
        self.user.profile.save()
        
        self.tag = Tag.objects.create(name='Health')

    def test_create_habit_and_log_daily(self):
        self.client.force_authenticate(user=self.user)
        
        # 1. Create Habit
        data = {
            'title': 'Drink Water',
            'frequency': 'daily',
            'target_count': 1,
            'start_date': str(timezone.now().date()),
            'tags': [self.tag.id]
        }
        
        response = self.client.post(self.habits_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.json()['success'])
        
        habit_id = response.json()['data']['id']
        habit = Habit.objects.get(id=habit_id)
        
        # Verify Activity generated
        self.assertTrue(Activity.objects.filter(user=self.user, action="Habit Created").exists())
        
        # 2. Log Progress using specialized endpoint
        log_url = f'{self.habits_url}{habit_id}/log/'
        today_str = str(timezone.now().date())
        
        log_data = {
            'completion_date': today_str,
            'count': 1,
            'notes': 'Felt good'
        }
        log_res = self.client.post(log_url, log_data, format='json')
        self.assertEqual(log_res.status_code, status.HTTP_201_CREATED)
        
        habit.refresh_from_db()
        self.assertEqual(habit.current_streak, 1)
        self.assertEqual(habit.longest_streak, 1)
        self.assertEqual(habit.completion_rate, 100.0)
        self.assertEqual(habit.current_count, 1)
        
        # 3. Add older logs to test streak calculation logic
        HabitLog.objects.create(habit=habit, completion_date=timezone.now().date() - timedelta(days=1), count=1)
        HabitLog.objects.create(habit=habit, completion_date=timezone.now().date() - timedelta(days=2), count=1)
        
        habit.refresh_from_db()
        self.assertEqual(habit.current_streak, 3)
        self.assertEqual(habit.longest_streak, 3)

    def test_weekly_streak_calculation(self):
        # Weekly streaks use ISO calendar
        self.client.force_authenticate(user=self.user)
        habit = Habit.objects.create(
            user=self.user,
            title='Run 3 times a week',
            frequency='weekly',
            target_count=3,
            start_date=timezone.now().date() - timedelta(days=30)
        )
        
        today = timezone.now().date()
        # Create 3 logs this week on different days
        HabitLog.objects.create(habit=habit, completion_date=today, count=1)
        HabitLog.objects.create(habit=habit, completion_date=today - timedelta(days=1), count=1)
        HabitLog.objects.create(habit=habit, completion_date=today - timedelta(days=2), count=1)
        
        habit.refresh_from_db()
        self.assertEqual(habit.current_streak, 1)
        self.assertEqual(habit.current_count, 3)
        
        # Create 3 logs last week
        last_week = today - timedelta(days=7)
        HabitLog.objects.create(habit=habit, completion_date=last_week, count=3)
        
        habit.refresh_from_db()
        self.assertEqual(habit.current_streak, 2)

    def test_bulk_pause(self):
        self.client.force_authenticate(user=self.user)
        habit1 = Habit.objects.create(user=self.user, title='H1', start_date=timezone.now().date())
        habit2 = Habit.objects.create(user=self.user, title='H2', start_date=timezone.now().date())
        
        res = self.client.post('/api/v1/habits/habits/bulk-pause/', {'ids': [str(habit1.id), str(habit2.id)]}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        
        habit1.refresh_from_db()
        self.assertEqual(habit1.status, 'paused')

    def test_dashboard_stats(self):
        self.client.force_authenticate(user=self.user)
        Habit.objects.create(user=self.user, title='H1', start_date=timezone.now().date(), frequency='daily', target_count=1)
        
        res = self.client.get('/api/v1/habits/habits/stats/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json()['data']['total_today'], 1)
        self.assertEqual(res.json()['data']['completed_today'], 0)
