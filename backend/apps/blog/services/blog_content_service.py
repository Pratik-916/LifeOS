import re
from django.utils.text import slugify

class BlogContentService:
    @staticmethod
    def calculate_word_count(content: str) -> int:
        if not content:
            return 0
        words = re.findall(r'\w+', content)
        return len(words)

    @staticmethod
    def calculate_reading_time(word_count: int) -> int:
        # Standard reading speed: 200 words per minute
        if word_count == 0:
            return 0
        return max(1, round(word_count / 200))

    @staticmethod
    def generate_slug(title: str, existing_slugs=None) -> str:
        base_slug = slugify(title)
        slug = base_slug
        counter = 1
        
        if existing_slugs:
            while slug in existing_slugs:
                slug = f"{base_slug}-{counter}"
                counter += 1
                
        return slug

    @staticmethod
    def validate_seo_lengths(title: str, description: str) -> dict:
        errors = {}
        if title and len(title) > 60:
            errors['seo_title'] = 'SEO Title should not exceed 60 characters.'
        if description and len(description) > 160:
            errors['seo_description'] = 'SEO Description should not exceed 160 characters.'
        return errors

    @staticmethod
    def generate_excerpt(content: str, length: int = 150) -> str:
        if not content:
            return ""
        # Strip simple HTML/Markdown if necessary (for now just slice)
        plain = re.sub(r'<[^>]+>', '', content)
        if len(plain) <= length:
            return plain
        return plain[:length].rsplit(' ', 1)[0] + '...'
