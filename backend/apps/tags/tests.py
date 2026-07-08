from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Tag

User = get_user_model()

class TagTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tags_url = '/api/v1/tags/'
        
        self.user = User.objects.create_user(
            email='taguser@example.com',
            password='StrongPassword123!'
        )
        
        self.tag1 = Tag.objects.create(name='Work', color='blue')
        self.tag2 = Tag.objects.create(name='Personal', color='green')

    def test_anonymous_access_denied(self):
        response = self.client.get(self.tags_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_tags(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.tags_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['success'])
        self.assertEqual(len(response.json()['data']['results']), 2)

    def test_create_tag(self):
        self.client.force_authenticate(user=self.user)
        data = {'name': 'Urgent', 'color': 'red'}
        response = self.client.post(self.tags_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.json()['success'])
        self.assertEqual(response.json()['data']['slug'], 'urgent')
