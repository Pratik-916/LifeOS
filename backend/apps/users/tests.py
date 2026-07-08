from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class UserMeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.me_url = '/api/v1/users/me/'
        
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='StrongPassword123!'
        )
        # Profile and Settings should be created via signals
        
        self.other_user = User.objects.create_user(
            email='otheruser@example.com',
            password='StrongPassword123!'
        )

    def test_anonymous_access(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.json()['success'])

    def test_get_me_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['success'])
        self.assertEqual(response.json()['data']['email'], self.user.email)
        self.assertIn('profile', response.json()['data'])
        self.assertIn('settings', response.json()['data'])

    def test_update_me_success(self):
        self.client.force_authenticate(user=self.user)
        update_data = {
            'first_name': 'Updated',
            'profile': {
                'bio': 'New Bio'
            },
            'settings': {
                'theme': 'dark'
            }
        }
        response = self.client.patch(self.me_url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['success'])
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.profile.bio, 'New Bio')
        self.assertEqual(self.user.settings.theme, 'dark')

    def test_cannot_update_read_only_fields(self):
        self.client.force_authenticate(user=self.user)
        update_data = {
            'email': 'hacked@example.com',
            'is_verified': True
        }
        response = self.client.patch(self.me_url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'testuser@example.com')
        self.assertFalse(self.user.is_verified)
