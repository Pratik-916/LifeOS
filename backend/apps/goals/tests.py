from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import Goal, Milestone
from apps.tags.models import Tag
from apps.activities.models import Activity

User = get_user_model()

class GoalTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.goals_url = '/api/v1/goals/goals/'
        
        self.user = User.objects.create_user(
            email='goals@example.com',
            password='StrongPassword123!'
        )
        
        self.tag = Tag.objects.create(name='Life')

    def test_create_goal_with_milestones(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'Learn Guitar',
            'status': 'not_started',
            'priority': 'medium',
            'tags': [self.tag.id],
            'milestones': [
                {'title': 'Buy Guitar', 'is_completed': True},
                {'title': 'Learn Chords', 'is_completed': False}
            ]
        }
        response = self.client.post(self.goals_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.json()['success'])
        
        goal_id = response.json()['data']['id']
        goal = Goal.objects.get(id=goal_id)
        
        # Test progress calculation: 1 out of 2 milestones = 50%
        self.assertEqual(goal.progress, 50.0)
        self.assertEqual(goal.status, 'in_progress')
        self.assertEqual(goal.milestones.count(), 2)
        
        # Test Activity Generation (Goal created + 2 milestones created + milestone completed)
        self.assertTrue(Activity.objects.filter(user=self.user, action="Goal Created").exists())

    def test_bulk_complete(self):
        self.client.force_authenticate(user=self.user)
        goal1 = Goal.objects.create(user=self.user, title='G1')
        goal2 = Goal.objects.create(user=self.user, title='G2')
        
        response = self.client.post('/api/v1/goals/goals/bulk-complete/', {'ids': [str(goal1.id), str(goal2.id)]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        goal1.refresh_from_db()
        self.assertEqual(goal1.progress, 100.0)
        self.assertEqual(goal1.status, 'completed')
        self.assertIsNotNone(goal1.completed_at)

    def test_soft_delete(self):
        self.client.force_authenticate(user=self.user)
        goal = Goal.objects.create(user=self.user, title='To Delete')
        
        response = self.client.delete(f'{self.goals_url}{goal.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        self.assertFalse(Goal.objects.filter(id=goal.id).exists())
        self.assertTrue(Goal.all_objects.filter(id=goal.id).exists())
