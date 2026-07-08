# Database Architecture

LifeOS uses **PostgreSQL** as its primary database for both development and production environments. SQLite is explicitly not supported to ensure development mirrors production as closely as possible.

## Core Models

### User (`users.User`)
The central identity model in LifeOS. It inherits from `AbstractBaseUser` and `PermissionsMixin`.

- **Primary Key**: UUID (v4)
- **Identifier**: `email` (unique, indexed)
- **Fields**:
  - `email` (EmailField)
  - `first_name` (CharField)
  - `last_name` (CharField)
  - `avatar` (ImageField)
  - `is_active`, `is_staff`, `is_verified` (BooleanField)
  - `verification_token`, `reset_password_token` (CharField)
- **Indexes**: `email`, `created_at`

### User Profile (`users.UserProfile`)
Contains extended personal and demographic information. Automatically created via `post_save` signal when a User is created.

- **Relationship**: `OneToOneField` to `User` (related_name='profile')
- **Fields**:
  - `bio` (TextField)
  - `timezone` (CharField)
  - `country` (CharField)
  - `language` (CharField)
  - `birth_date` (DateField)
  - `website` (URLField)

### User Settings (`users.UserSettings`)
Stores long-term user preferences that sync across devices. Note: UI-only ephemeral state is stored in the frontend using Zustand, not here. Automatically created via `post_save` signal.

- **Relationship**: `OneToOneField` to `User` (related_name='settings')
- **Fields**:
  - `theme` (CharField: light, dark, system)
  - `accent_color` (CharField)
  - `default_reminder_time` (IntegerField: minutes)
  - `week_start` (IntegerField: 0=Sun, 1=Mon)
  - `font_size` (CharField)
  - `privacy_mode` (BooleanField)
  - `dashboard_widget_preferences` (JSONField)
  - `notification_preferences` (JSONField)

## Migrations Strategy

1. All models extend `TimeStampedModel` (from `apps.core.models`), ensuring every record has `created_at` and `updated_at` fields automatically maintained by Django.
2. The `User` model is fully configured as `AUTH_USER_MODEL` before any initial migrations are applied to prevent `InconsistentMigrationHistory` errors.
