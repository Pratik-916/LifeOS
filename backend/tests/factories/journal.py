import factory
from apps.journal.models import JournalEntry
from .users import UserFactory

class JournalEntryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = JournalEntry
        
    user = factory.SubFactory(UserFactory)
    title = factory.Faker('sentence')
    content = factory.Faker('text')
