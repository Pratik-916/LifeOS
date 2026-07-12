from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import Task, SubTask
from apps.tags.models import Tag

User = get_user_model()

class PlannerTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tasks_url = '/api/v1/planner/tasks/'
        
        self.user = User.objects.create_user(
            email='planner@example.com',
            password='StrongPassword123!'
        )
        
        self.other_user = User.objects.create_user(
            email='other@example.com',
            password='StrongPassword123!'
        )
        
        self.tag1 = Tag.objects.create(name='Work')
        self.tag2 = Tag.objects.create(name='Urgent')

    def test_create_task(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'New Task',
            'status': 'todo',
            'priority': 'high',
            'tags': [self.tag1.id, self.tag2.id],
            'subtasks': [
                {'title': 'Sub 1'},
                {'title': 'Sub 2'}
            ]
        }
        response = self.client.post(self.tasks_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.json()['success'])
        
        task_id = response.json()['data']['id']
        task = Task.objects.get(id=task_id)
        self.assertEqual(task.title, 'New Task')
        self.assertEqual(task.subtasks.count(), 2)
        from apps.activities.models import Activity
        self.assertEqual(Activity.objects.filter(object_id=task.id).count(), 1) # Created activity

    def test_update_task_optimistic_locking(self):
        self.client.force_authenticate(user=self.user)
        task = Task.objects.create(user=self.user, title='Test Task')
        
        # Simulate an update with an old updated_at
        old_time = task.updated_at - timezone.timedelta(seconds=10)
        data = {
            'title': 'Updated Title',
            'last_updated_at': old_time.isoformat()
        }
        response = self.client.patch(f'{self.tasks_url}{task.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.json()['success'])
        self.assertIn('non_field_errors', response.json()['errors'])

    def test_soft_delete_and_restore(self):
        self.client.force_authenticate(user=self.user)
        task = Task.objects.create(user=self.user, title='To Delete')
        
        # Delete
        response = self.client.delete(f'{self.tasks_url}{task.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify not in normal queryset
        self.assertFalse(Task.objects.filter(id=task.id).exists())
        self.assertTrue(Task.all_objects.filter(id=task.id).exists())
        
        # Restore
        response = self.client.post(f'{self.tasks_url}{task.id}/restore/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify restored
        self.assertTrue(Task.objects.filter(id=task.id).exists())

    def test_permissions(self):
        task = Task.objects.create(user=self.user, title='Private Task')
        
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(f'{self.tasks_url}{task.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_stats_endpoint(self):
        self.client.force_authenticate(user=self.user)
        
        # Create some tasks
        Task.objects.create(user=self.user, title='T1', status='todo', priority='high')
        Task.objects.create(user=self.user, title='T2', status='completed')
        Task.objects.create(user=self.user, title='T3', status='in_progress', due_date=timezone.now().date() - timezone.timedelta(days=1)) # Overdue
        
        response = self.client.get('/api/v1/planner/tasks/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()['data']
        self.assertEqual(data['total_tasks'], 3)
        self.assertEqual(data['completed'], 1)
        self.assertEqual(data['pending'], 2)
        self.assertEqual(data['overdue'], 1)
        self.assertEqual(data['high_priority'], 1)
        self.assertEqual(data['completion_rate'], 33.33)
