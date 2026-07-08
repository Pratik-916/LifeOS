from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import timedelta

from apps.journey.models import Memory
from apps.activities.models import Activity
from apps.planner.models import Task
from apps.goals.models import Goal
from apps.tags.models import Tag

User = get_user_model()

class JourneyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.memory_url = '/api/v1/journey/memories/'
        
        self.user = User.objects.create_user(
            email='journey@example.com',
            password='StrongPassword123!'
        )
        if hasattr(self.user, 'profile'):
            self.user.profile.timezone = 'UTC'
            self.user.profile.save()
            
        self.other_user = User.objects.create_user(
            email='other@example.com',
            password='StrongPassword123!'
        )
        
        self.tag = Tag.objects.create(name='Life')

    def test_create_memory(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'Graduation',
            'description': 'Graduated from university!',
            'date': timezone.now().isoformat(),
            'location': 'University',
            'category': 'education',
            'visibility': 'private',
            'tags': [self.tag.id]
        }
        response = self.client.post(self.memory_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.json()['success'])
        
        memory_id = response.json()['data']['id']
        memory = Memory.objects.get(id=memory_id)
        
        self.assertEqual(memory.title, 'Graduation')
        self.assertTrue(memory.tags.filter(id=self.tag.id).exists())
        self.assertTrue(Activity.objects.filter(user=self.user, action="Memory Created").exists())

    def test_update_and_optimistic_locking(self):
        self.client.force_authenticate(user=self.user)
        memory = Memory.objects.create(
            user=self.user, 
            title='Initial Title', 
            date=timezone.now()
        )
        
        old_time = memory.updated_at - timedelta(seconds=10)
        data = {
            'title': 'Updated Title',
            'last_updated_at': old_time.isoformat()
        }
        
        response = self.client.patch(f'{self.memory_url}{memory.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        data['last_updated_at'] = memory.updated_at.isoformat()
        response = self.client.patch(f'{self.memory_url}{memory.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        memory.refresh_from_db()
        self.assertEqual(memory.title, 'Updated Title')
        self.assertTrue(Activity.objects.filter(user=self.user, action="Memory Updated").exists())

    def test_soft_delete_and_restore(self):
        self.client.force_authenticate(user=self.user)
        memory = Memory.objects.create(user=self.user, title='To Delete', date=timezone.now())
        
        response = self.client.delete(f'{self.memory_url}{memory.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(Activity.objects.filter(user=self.user, action="Memory Deleted").exists())
        
        response = self.client.post(f'{self.memory_url}{memory.id}/restore/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Memory.objects.filter(id=memory.id).exists())
        self.assertTrue(Activity.objects.filter(user=self.user, action="Memory Restored").exists())

    def test_favorite_and_pin(self):
        self.client.force_authenticate(user=self.user)
        memory = Memory.objects.create(user=self.user, title='Test', date=timezone.now())
        
        response = self.client.post(f'{self.memory_url}{memory.id}/favorite/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['data']['favorite'])
        self.assertTrue(Activity.objects.filter(user=self.user, action="Memory Favorited").exists())
        
        response = self.client.post(f'{self.memory_url}{memory.id}/pin/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['data']['pinned'])
        self.assertTrue(Activity.objects.filter(user=self.user, action="Memory Pinned").exists())

    def test_timeline_aggregation(self):
        self.client.force_authenticate(user=self.user)
        
        Memory.objects.create(user=self.user, title='My Memory', date=timezone.now())
        Task.objects.create(user=self.user, title='My Task', status='todo')
        Goal.objects.create(user=self.user, title='My Goal', status='not_started')
        
        response = self.client.get(f'{self.memory_url}timeline/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()['data']['results']
        self.assertTrue(len(data) >= 1) # At least the memory should be in there
        # Since we just created Task and Goal, depending on if they trigger Activities directly, they might also be in the timeline
        types_in_timeline = [item['entity_type'] for item in data]
        self.assertIn('memory', types_in_timeline)

    def test_journey_statistics(self):
        self.client.force_authenticate(user=self.user)
        
        Memory.objects.create(user=self.user, title='My Memory', date=timezone.now(), favorite=True)
        Task.objects.create(user=self.user, title='My Task', status='completed')
        
        response = self.client.get(f'{self.memory_url}stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()['data']
        self.assertEqual(data['total_memories'], 1)
        self.assertEqual(data['favorite_memories'], 1)
        self.assertEqual(data['completed_tasks'], 1)

    def test_permissions(self):
        memory = Memory.objects.create(user=self.user, title='Private', date=timezone.now())
        
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(f'{self.memory_url}{memory.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
