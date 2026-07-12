from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import timedelta

from apps.journal.models import JournalEntry, JournalImage
from apps.tags.models import Tag
from apps.activities.models import Activity

User = get_user_model()

class JournalTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.journal_url = '/api/v1/journal/entries/'
        
        self.user = User.objects.create_user(
            email='journal@example.com',
            password='StrongPassword123!'
        )
        # Ensure profile timezone is UTC for tests
        if hasattr(self.user, 'profile'):
            self.user.profile.timezone = 'UTC'
            self.user.profile.save()
            
        self.other_user = User.objects.create_user(
            email='other@example.com',
            password='StrongPassword123!'
        )
        
        self.tag = Tag.objects.create(name='Gratitude')

    def test_create_journal_entry(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'My First Entry',
            'content': 'This is the content of my journal. It has some words.',
            'mood': 'happy',
            'energy_level': 8,
            'stress_level': 2,
            'tags': [self.tag.name]
        }
        response = self.client.post(self.journal_url, data, format='json')
        if response.status_code != status.HTTP_201_CREATED:
            print("ERROR response:", response.json())
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.json()['success'])
        
        entry_id = response.json()['data']['id']
        entry = JournalEntry.objects.get(id=entry_id)
        
        # Check signals for word count
        self.assertEqual(entry.word_count, 11)
        self.assertTrue(entry.reading_time >= 1)
        
        # Check tags
        self.assertTrue(entry.tags.filter(id=self.tag.id).exists())
        
        # Check Activity generated
        self.assertTrue(Activity.objects.filter(user=self.user, action="Journal Created").exists())

    def test_update_journal_entry_and_optimistic_locking(self):
        self.client.force_authenticate(user=self.user)
        entry = JournalEntry.objects.create(
            user=self.user, 
            title='Initial Title', 
            content='Initial Content'
        )
        
        old_time = entry.updated_at - timedelta(seconds=10)
        data = {
            'title': 'Updated Title',
            'last_updated_at': old_time.isoformat()
        }
        
        # Should fail optimistic lock
        response = self.client.patch(f'{self.journal_url}{entry.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Should succeed with correct time
        data['last_updated_at'] = entry.updated_at.isoformat()
        response = self.client.patch(f'{self.journal_url}{entry.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        entry.refresh_from_db()
        self.assertEqual(entry.title, 'Updated Title')
        
        # Check Activity updated
        self.assertTrue(Activity.objects.filter(user=self.user, action="Journal Updated").exists())

    def test_soft_delete_and_restore(self):
        self.client.force_authenticate(user=self.user)
        entry = JournalEntry.objects.create(user=self.user, title='To Delete', content='X')
        
        # Delete
        response = self.client.delete(f'{self.journal_url}{entry.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify Activity
        self.assertTrue(Activity.objects.filter(user=self.user, action="Journal Deleted").exists())
        
        # Restore
        response = self.client.post(f'{self.journal_url}{entry.id}/restore/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(JournalEntry.objects.filter(id=entry.id).exists())
        
        # Verify Activity
        self.assertTrue(Activity.objects.filter(user=self.user, action="Journal Restored").exists())

    def test_favorite_and_pin(self):
        self.client.force_authenticate(user=self.user)
        entry = JournalEntry.objects.create(user=self.user, title='Test', content='Test')
        
        response = self.client.post(f'{self.journal_url}{entry.id}/favorite/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['data']['is_favorite'])
        self.assertTrue(Activity.objects.filter(user=self.user, action="Favorite Added").exists())
        
        response = self.client.post(f'{self.journal_url}{entry.id}/pin/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['data']['is_pinned'])
        self.assertTrue(Activity.objects.filter(user=self.user, action="Pinned").exists())

    def test_journal_statistics(self):
        self.client.force_authenticate(user=self.user)
        
        JournalEntry.objects.create(
            user=self.user, 
            title='Day 1', 
            content='Lots of words in this entry for testing word count and streak',
            word_count=11, # Normally set via signal, but manual here is fine as signal triggers on save
            mood='good',
            is_favorite=True
        )
        
        response = self.client.get(f'{self.journal_url}stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()['data']
        self.assertEqual(data['total_entries'], 1)
        self.assertEqual(data['favorite_count'], 1)
        self.assertEqual(data['average_mood'], 'good')
        self.assertTrue(data['total_words'] >= 11)

    def test_permissions(self):
        entry = JournalEntry.objects.create(user=self.user, title='Private', content='X')
        
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(f'{self.journal_url}{entry.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
