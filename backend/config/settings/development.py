from .base import *
import dj_database_url

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default='postgres://postgres:postgres@localhost:5432/lifeos'),
        conn_max_age=600
    )
}

# In development, we can relax some security settings if needed, 
# but we stick to the provided defaults mostly.
