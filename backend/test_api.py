from django.test import Client

from django.test import Client
from apps.users.models import User
from django.urls import reverse
import json

def test():
    # Get any user or create one
    user = User.objects.first()
    if not user:
        print("No users found.")
        return
        
    client = Client()
    client.force_login(user)

    # Test Goals API
    try:
        response = client.get('/api/v1/goals/', HTTP_HOST='127.0.0.1')
        print(f"Goals API Status: {response.status_code}")
        print(f"Goals Response: {response.content.decode()[:200]}")
    except Exception as e:
        print(f"Goals API Error: {e}")

    # Test Habits API
    try:
        response = client.get('/api/v1/habits/', HTTP_HOST='127.0.0.1')
        print(f"Habits API Status: {response.status_code}")
        print(f"Habits Response: {response.content.decode()[:200]}")
    except Exception as e:
        print(f"Habits API Error: {e}")

    # Test Timeline API
    try:
        response = client.get('/api/v1/memories/timeline/')
        print(f"Timeline API Status: {response.status_code}")
    except Exception as e:
        print(f"Timeline API Error: {e}")

    # Test Blog API
    try:
        response = client.get('/api/v1/blog/admin/posts/')
        print(f"Blog API Status: {response.status_code}")
    except Exception as e:
        print(f"Blog API Error: {e}")

    # Test Journal API
    try:
        response = client.get('/api/v1/journal/')
        print(f"Journal API Status: {response.status_code}")
    except Exception as e:
        print(f"Journal API Error: {e}")

test()
