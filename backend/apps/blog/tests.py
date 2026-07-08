from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import timedelta

from apps.blog.models import BlogPost, BlogCategory, BlogStatus, BlogVisibility

User = get_user_model()

class BlogTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_url = '/api/v1/blog/posts/'
        self.public_url = '/api/v1/blog/blog/'
        
        self.user = User.objects.create_user(
            email='blog@example.com',
            password='StrongPassword123!'
        )
        self.client.force_authenticate(user=self.user)
        
        self.category = BlogCategory.objects.create(name='Tech', slug='tech')
        self.post = BlogPost.objects.create(
            author=self.user,
            title='Initial Post',
            slug='initial-post',
            content='Some long enough content to pass tests.',
            category=self.category,
            status=BlogStatus.PUBLISHED,
            visibility=BlogVisibility.PUBLIC,
            published_at=timezone.now()
        )

    def test_create_draft(self):
        data = {
            'title': 'New Draft',
            'content': 'This is a draft'
        }
        response = self.client.post(self.admin_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())
        self.assertEqual(response.json()['data']['status'], 'draft')
        self.assertTrue(response.json()['data']['slug'])

    def test_publish_validation(self):
        # Publishing without a title or content should fail in a strict setup, 
        # but our serializer forces title. Let's create a draft and try to publish it
        draft = BlogPost.objects.create(author=self.user, title='Draft 1', slug='draft-1')
        response = self.client.post(f'{self.admin_url}{draft.id}/publish/')
        # Should fail because content is empty
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        draft.content = 'Valid content to publish'
        draft.save()
        response = self.client.post(f'{self.admin_url}{draft.id}/publish/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_schedule_validation(self):
        draft = BlogPost.objects.create(author=self.user, title='Draft 2', slug='draft-2', content='content')
        past_date = (timezone.now() - timedelta(days=1)).isoformat()
        
        # Schedule in the past should fail
        response = self.client.post(f'{self.admin_url}{draft.id}/schedule/', {'published_at': past_date})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Schedule in the future should succeed
        future_date = (timezone.now() + timedelta(days=1)).isoformat()
        response = self.client.post(f'{self.admin_url}{draft.id}/schedule/', {'published_at': future_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_public_slug_lookup(self):
        response = self.client.get(f'{self.public_url}{self.post.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['data']['title'], 'Initial Post')

    def test_search_and_filter(self):
        response = self.client.get(f'{self.public_url}search/?q=initial')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify pagination structure returns 'results'
        results = response.json()['data'].get('results', response.json()['data'])
        self.assertEqual(len(results), 1, response.json())

    def test_statistics(self):
        response = self.client.get(f'{self.public_url}stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()['data']
        self.assertEqual(data['total_posts'], 1)
        self.assertEqual(data['published_posts'], 1)
        self.assertEqual(data['most_popular_category'], 'Tech')
