from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/v1/auth/register/'
        self.login_url = '/api/v1/auth/login/'
        self.logout_url = '/api/v1/auth/logout/'
        self.refresh_url = '/api/v1/auth/refresh/'
        
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'StrongPassword123!',
            'password_confirm': 'StrongPassword123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
    def test_registration_success(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.json()['success'])
        self.assertIn('tokens', response.json()['data'])
        self.assertTrue(User.objects.filter(email='testuser@example.com').exists())

    def test_duplicate_email_registration(self):
        self.client.post(self.register_url, self.user_data)
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.json()['success'])
        self.assertIn('email', response.json()['errors'])

    def test_login_success(self):
        self.client.post(self.register_url, self.user_data)
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['success'])
        self.assertIn('access', response.json()['data'])
        self.assertIn('refresh', response.json()['data'])

    def test_invalid_login(self):
        self.client.post(self.register_url, self.user_data)
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': 'WrongPassword1!'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.json()['success'])

    def test_logout_success(self):
        self.client.post(self.register_url, self.user_data)
        login_res = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        refresh_token = login_res.json()['data']['refresh']
        access_token = login_res.json()['data']['access']
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = self.client.post(self.logout_url, {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['success'])

    def test_logout_without_auth(self):
        response = self.client.post(self.logout_url, {'refresh': 'dummy'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_jwt_refresh(self):
        self.client.post(self.register_url, self.user_data)
        login_res = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        refresh_token = login_res.json()['data']['refresh']
        
        response = self.client.post(self.refresh_url, {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['success'])
        self.assertIn('access', response.json()['data'])
