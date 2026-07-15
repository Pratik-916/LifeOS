import factory
from django.utils import timezone
from apps.journey.models import Memory
from .users import UserFactory

class MemoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Memory
        
    user = factory.SubFactory(UserFactory)
    title = factory.Faker('sentence')
    date = factory.LazyFunction(timezone.now)
    category = 'other'
