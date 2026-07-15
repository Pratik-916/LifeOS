import factory
from apps.planner.models import Task
from .users import UserFactory

class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Task
        
    user = factory.SubFactory(UserFactory)
    title = factory.Faker('sentence')
    description = factory.Faker('text')
    status = 'todo'
    priority = 'medium'
