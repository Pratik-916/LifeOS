import factory
from django.utils import timezone
from apps.habits.models import Habit
from .users import UserFactory

class HabitFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Habit
        
    user = factory.SubFactory(UserFactory)
    title = factory.Faker('sentence')
    start_date = factory.LazyFunction(timezone.now)
    frequency = 'daily'
