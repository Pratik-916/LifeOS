import factory
from apps.goals.models import Goal, Milestone
from .users import UserFactory

class GoalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Goal
        
    user = factory.SubFactory(UserFactory)
    title = factory.Faker('sentence')
    description = factory.Faker('text')
    status = 'not_started'
    progress = 0.0

class MilestoneFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Milestone
        
    goal = factory.SubFactory(GoalFactory)
    title = factory.Faker('sentence')
