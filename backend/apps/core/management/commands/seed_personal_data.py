import json
import time
import os
from pathlib import Path
from datetime import datetime

from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
from django.core.exceptions import ValidationError

from apps.planner.models import Task
from apps.goals.models import Goal
from apps.habits.models import Habit
from apps.journal.models import JournalEntry
from apps.journey.models import Memory
from apps.blog.models import BlogPost, BlogStatus

User = get_user_model()

class Command(BaseCommand):
    help = 'One-time Personal Knowledge Seeder for a specific user.'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.stats = {
            'planner': {'imported': 0, 'updated': 0, 'skipped': 0, 'duplicates': 0, 'warnings': 0, 'errors': 0, 'status': 'Pending'},
            'goals': {'imported': 0, 'updated': 0, 'skipped': 0, 'duplicates': 0, 'warnings': 0, 'errors': 0, 'status': 'Pending'},
            'habits': {'imported': 0, 'updated': 0, 'skipped': 0, 'duplicates': 0, 'warnings': 0, 'errors': 0, 'status': 'Pending'},
            'journal': {'imported': 0, 'updated': 0, 'skipped': 0, 'duplicates': 0, 'warnings': 0, 'errors': 0, 'status': 'Pending'},
            'journey': {'imported': 0, 'updated': 0, 'skipped': 0, 'duplicates': 0, 'warnings': 0, 'errors': 0, 'status': 'Pending'},
            'blog': {'imported': 0, 'updated': 0, 'skipped': 0, 'duplicates': 0, 'warnings': 0, 'errors': 0, 'status': 'Pending'},
        }

    def handle(self, *args, **options):
        start_time = time.time()
        self.stdout.write(self.style.NOTICE("Starting Personal Knowledge Seeder..."))
        
        data_dir = settings.BASE_DIR / 'data' / 'personal'
        manifest_path = data_dir / 'manifest.json'
        
        if not manifest_path.exists():
            self.stdout.write(self.style.ERROR(f"Manifest file missing: {manifest_path}"))
            return
            
        try:
            with open(manifest_path, 'r', encoding='utf-8') as f:
                manifest = json.load(f)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to read manifest.json: {e}"))
            return
            
        owner_email = manifest.get("owner_email", "")
        if owner_email.lower() != "pratikpala9999@gmail.com":
            self.stdout.write(self.style.ERROR(f"Abort: Invalid owner email in manifest: {owner_email}"))
            return
            
        try:
            user = User.objects.get(email__iexact=owner_email)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"Abort: User {owner_email} does not exist in the database."))
            return
            
        enabled_modules = manifest.get("enabled_modules", [])
        
        if "planner" in enabled_modules:
            self.import_planner(data_dir / 'planner.json', user)
        if "goals" in enabled_modules:
            self.import_goals(data_dir / 'goals.json', user)
        if "habits" in enabled_modules:
            self.import_habits(data_dir / 'habits.json', user)
        if "journal" in enabled_modules:
            self.import_journal(data_dir / 'journal.json', user)
        if "journey" in enabled_modules:
            self.import_journey(data_dir / 'journey.json', user)
        if "blog" in enabled_modules:
            self.import_blog(data_dir / 'blog.json', user)
            
        execution_time = time.time() - start_time
        
        # Print Summary
        self.stdout.write(self.style.SUCCESS("\n--- Import Summary ---"))
        for mod, stat in self.stats.items():
            self.stdout.write(self.style.SUCCESS(f"\nModule: {mod.upper()} [{stat['status']}]"))
            self.stdout.write(f"  Imported: {stat['imported']}")
            self.stdout.write(f"  Updated: {stat['updated']}")
            self.stdout.write(f"  Duplicates: {stat['duplicates']}")
            self.stdout.write(f"  Skipped: {stat['skipped']}")
            self.stdout.write(f"  Warnings: {stat['warnings']}")
            self.stdout.write(f"  Errors: {stat['errors']}")
            
        self.stdout.write(self.style.SUCCESS(f"\nExecution Time: {execution_time:.2f} seconds"))

    def _process_file(self, file_path, module_name, user, processor_func):
        if not file_path.exists():
            self.stdout.write(self.style.WARNING(f"File missing for {module_name}: {file_path}. Skipping."))
            self.stats[module_name]['status'] = 'Skipped (File Missing)'
            return
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f"Invalid JSON in {file_path}: {e}"))
            self.stats[module_name]['status'] = 'Failed (Invalid JSON)'
            self.stats[module_name]['errors'] += 1
            return
            
        if not isinstance(data, list):
            self.stdout.write(self.style.ERROR(f"Expected a list of objects in {file_path}"))
            self.stats[module_name]['status'] = 'Failed (Invalid Format)'
            self.stats[module_name]['errors'] += 1
            return
            
        try:
            with transaction.atomic():
                for item in data:
                    processor_func(item, user, module_name)
            self.stats[module_name]['status'] = 'Success'
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Transaction failed for {module_name}: {e}. Rolling back module."))
            self.stats[module_name]['status'] = 'Failed (Rolled Back)'
            self.stats[module_name]['errors'] += 1

    def import_planner(self, file_path, user):
        def process(item, user, mod):
            import_id = item.get('import_id')
            if not import_id:
                self.stats[mod]['skipped'] += 1
                self.stats[mod]['warnings'] += 1
                return
            obj, created = Task.objects.update_or_create(
                user=user, import_id=import_id,
                defaults={
                    'title': item.get('title', 'Untitled'),
                    'status': item.get('status', 'todo'),
                    'priority': item.get('priority', 'medium'),
                    'category': item.get('category', ''),
                }
            )
            if created:
                self.stats[mod]['imported'] += 1
            else:
                self.stats[mod]['updated'] += 1
                self.stats[mod]['duplicates'] += 1
                
        self._process_file(file_path, 'planner', user, process)

    def import_goals(self, file_path, user):
        def process(item, user, mod):
            import_id = item.get('import_id')
            if not import_id:
                self.stats[mod]['skipped'] += 1
                self.stats[mod]['warnings'] += 1
                return
            obj, created = Goal.objects.update_or_create(
                user=user, import_id=import_id,
                defaults={
                    'title': item.get('title', 'Untitled'),
                    'status': item.get('status', 'not_started'),
                    'priority': item.get('priority', 'medium'),
                    'category': item.get('category', ''),
                    'progress': float(item.get('progress', 0.0)),
                }
            )
            if created:
                self.stats[mod]['imported'] += 1
            else:
                self.stats[mod]['updated'] += 1
                self.stats[mod]['duplicates'] += 1
                
        self._process_file(file_path, 'goals', user, process)

    def import_habits(self, file_path, user):
        def process(item, user, mod):
            import_id = item.get('import_id')
            if not import_id:
                self.stats[mod]['skipped'] += 1
                self.stats[mod]['warnings'] += 1
                return
                
            start_date_str = item.get('start_date')
            start_date = timezone.now().date()
            if start_date_str:
                try:
                    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                except ValueError:
                    pass

            obj, created = Habit.objects.update_or_create(
                user=user, import_id=import_id,
                defaults={
                    'title': item.get('title', 'Untitled'),
                    'status': item.get('status', 'active'),
                    'frequency': item.get('frequency', 'daily'),
                    'start_date': start_date,
                }
            )
            if created:
                self.stats[mod]['imported'] += 1
            else:
                self.stats[mod]['updated'] += 1
                self.stats[mod]['duplicates'] += 1
                
        self._process_file(file_path, 'habits', user, process)

    def import_journal(self, file_path, user):
        def process(item, user, mod):
            import_id = item.get('import_id')
            if not import_id:
                self.stats[mod]['skipped'] += 1
                self.stats[mod]['warnings'] += 1
                return
            obj, created = JournalEntry.objects.update_or_create(
                user=user, import_id=import_id,
                defaults={
                    'title': item.get('title', 'Untitled'),
                    'content': item.get('content', ''),
                    'mood': item.get('mood', ''),
                    'todays_wins': item.get('todays_wins', ''),
                    'challenges': item.get('challenges', ''),
                    'lessons_learned': item.get('lessons_learned', ''),
                    'tomorrow_focus': item.get('tomorrow_focus', ''),
                }
            )
            if created:
                self.stats[mod]['imported'] += 1
            else:
                self.stats[mod]['updated'] += 1
                self.stats[mod]['duplicates'] += 1
                
        self._process_file(file_path, 'journal', user, process)

    def import_journey(self, file_path, user):
        def process(item, user, mod):
            import_id = item.get('import_id')
            if not import_id:
                self.stats[mod]['skipped'] += 1
                self.stats[mod]['warnings'] += 1
                return
                
            date_str = item.get('date')
            date_val = timezone.now()
            if date_str:
                try:
                    from django.utils.dateparse import parse_datetime
                    parsed = parse_datetime(date_str)
                    if parsed:
                        date_val = parsed
                except ValueError:
                    pass

            obj, created = Memory.objects.update_or_create(
                user=user, import_id=import_id,
                defaults={
                    'title': item.get('title', 'Untitled'),
                    'category': item.get('category', 'other'),
                    'date': date_val,
                }
            )
            if created:
                self.stats[mod]['imported'] += 1
            else:
                self.stats[mod]['updated'] += 1
                self.stats[mod]['duplicates'] += 1
                
        self._process_file(file_path, 'journey', user, process)

    def import_blog(self, file_path, user):
        def process(item, user, mod):
            import_id = item.get('import_id')
            if not import_id:
                self.stats[mod]['skipped'] += 1
                self.stats[mod]['warnings'] += 1
                return
            
            status_map = {
                'draft': BlogStatus.DRAFT,
                'published': BlogStatus.PUBLISHED,
                'review': BlogStatus.REVIEW,
                'scheduled': BlogStatus.SCHEDULED,
                'archived': BlogStatus.ARCHIVED,
            }
            status_val = status_map.get(item.get('status', 'draft'), BlogStatus.DRAFT)
            
            obj, created = BlogPost.objects.update_or_create(
                author=user, import_id=import_id,
                defaults={
                    'title': item.get('title', 'Untitled'),
                    'slug': item.get('slug', import_id),
                    'content': item.get('content', ''),
                    'status': status_val,
                }
            )
            if created:
                self.stats[mod]['imported'] += 1
            else:
                self.stats[mod]['updated'] += 1
                self.stats[mod]['duplicates'] += 1
                
        self._process_file(file_path, 'blog', user, process)
