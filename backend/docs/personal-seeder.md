# Personal Knowledge Seeder

This document explains the one-time migration utility designed to safely and incrementally seed personal history data into the LifeOS database.

## Purpose
The Personal Knowledge Seeder allows importing verified historical records (goals, habits, tasks, journal entries, memories, and blog posts) into LifeOS without writing custom Python code for every new piece of information.

It operates entirely via structured JSON files stored in `backend/data/personal/`.

## Architecture & Duplicate Protection
To ensure production safety and idempotent executions:
1. **Immutable `import_id`**: Every model (`Task`, `Goal`, `Habit`, `JournalEntry`, `Memory`, `BlogPost`) has been updated to include a unique `import_id` field.
2. **Upsert Logic**: When the seeder runs, it checks if a record with the given `import_id` already exists.
    - If it does not exist, it is created.
    - If it does exist, it is safely updated.
3. **Transaction Safety**: Every module (e.g., Planner, Goals) is wrapped in its own atomic database transaction. If `goals.json` contains malformed data midway through, the Goals module will rollback completely, but the successfully imported Planner module will remain committed.
4. **Manifest Validation**: Before any data is imported, the seeder validates `manifest.json` to ensure the target owner is precisely the correct authorized user.

## Supported JSON Format
The source of truth resides in `backend/data/personal/`.

### `manifest.json`
```json
{
  "owner_email": "Pratikpala9999@gmail.com",
  "importer_version": "1.0",
  "enabled_modules": ["planner", "goals", "habits", "journal", "journey", "blog"]
}
```

### Module Files
Each module file (e.g., `planner.json`) must contain a JSON array of objects.
Every object **must** have a unique `import_id` string.

**Example: `planner.json`**
```json
[
  {
    "import_id": "task-sem-exams",
    "title": "Semester exams",
    "status": "completed",
    "priority": "high",
    "category": "education"
  }
]
```

## How to Run
Ensure you are in the `backend/` directory and your virtual environment is activated.

Run the management command:
```bash
python manage.py seed_personal_data
```

## Incremental Imports
Because of the `import_id` duplicate protection, you can run the command as many times as you like. To add new personal history records in the future:
1. Append the new JSON objects to the respective file in `backend/data/personal/`.
2. Give them unique `import_id`s.
3. Run `python manage.py seed_personal_data` again. Existing records will be updated, and new records will be imported.
