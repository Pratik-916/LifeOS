from rest_framework import serializers
from apps.blog.models import BlogPost, BlogCategory, BlogImage
from apps.tags.serializers import TagSerializer

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = '__all__'

class BlogImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogImage
        fields = '__all__'

class BlogPostSerializer(serializers.ModelSerializer):
    category_detail = BlogCategorySerializer(source='category', read_only=True)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    images = BlogImageSerializer(many=True, read_only=True)
    slug = serializers.SlugField(required=False)
    
    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'author', 'reading_time', 'word_count']
        
class BlogPostPublicSerializer(serializers.ModelSerializer):
    """
    Serializer used for public facing APIs. 
    Excludes internal state and administrative fields.
    """
    category = BlogCategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ['id', 'author_name', 'category', 'tags', 'title', 'slug', 'excerpt', 
                  'content', 'featured_image', 'published_at', 'reading_time', 'word_count', 
                  'seo_title', 'seo_description', 'canonical_url', 'ai_generated', 'ai_summary', 
                  'featured', 'pinned']
                  
    def get_author_name(self, obj):
        if not obj.author:
            return 'Unknown'
            
        first = getattr(obj.author, 'first_name', '')
        last = getattr(obj.author, 'last_name', '')
        full_name = f"{first} {last}".strip()
        
        if full_name:
            return full_name
        if getattr(obj.author, 'email', None):
            return obj.author.email.split('@')[0]
        return getattr(obj.author, 'username', 'Unknown')
        
class BlogStatisticsSerializer(serializers.Serializer):
    total_posts = serializers.IntegerField()
    published_posts = serializers.IntegerField()
    draft_posts = serializers.IntegerField()
    archived_posts = serializers.IntegerField()
    scheduled_posts = serializers.IntegerField()
    featured_posts = serializers.IntegerField()
    average_reading_time_mins = serializers.FloatField()
    average_word_count = serializers.IntegerField()
    publishing_frequency_days = serializers.FloatField()
    publishing_streak = serializers.IntegerField()
    most_used_tags = serializers.ListField(child=serializers.DictField())
    most_popular_category = serializers.CharField(allow_null=True)
    monthly_publishing = serializers.DictField()
    yearly_publishing = serializers.DictField()
    top_categories = serializers.DictField()
    top_tags = serializers.DictField()
