from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from datetime import datetime
from django.utils import timezone
from apps.activities.models import Activity
from apps.journey.models import Memory

@dataclass
class TimelineEvent:
    id: str
    entity_type: str
    entity_id: str
    title: str
    description: str
    timestamp: datetime
    icon: str
    color: str
    category: str
    tags: List[str]
    source_module: str
    visibility: str
    favorite: bool
    pinned: bool
    preview: str
    image: Optional[str]
    action_url: str
    entity_status: str

    def to_dict(self):
        return {
            'id': self.id,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'title': self.title,
            'description': self.description,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'icon': self.icon,
            'color': self.color,
            'category': self.category,
            'tags': self.tags,
            'source_module': self.source_module,
            'visibility': self.visibility,
            'favorite': self.favorite,
            'pinned': self.pinned,
            'preview': self.preview,
            'image': self.image,
            'action_url': self.action_url,
            'entity_status': self.entity_status
        }

class TimelineService:
    @staticmethod
    def get_timeline(user, filters=None, limit=50, offset=0):
        if filters is None:
            filters = {}

        # Fetch Activities
        from django.contrib.contenttypes.models import ContentType
        memory_ct = ContentType.objects.get_for_model(Memory)
        activities_qs = Activity.objects.filter(user=user).exclude(content_type=memory_ct).select_related('content_type').order_by('-created_at')
        
        # Apply standard filters for activities
        # We will map standard filters as best as possible.
        # However, to be performant, we fetch a chunk of Activities and Memories, merge them, and slice.
        # But for robust pagination, fetching enough records from both, sorting them, and slicing is needed.
        # A simple approach for pagination: fetch offset+limit from BOTH, merge, sort, then slice [offset:offset+limit].
        fetch_limit = offset + limit
        
        activities = activities_qs[:fetch_limit]
        
        # Fetch Memories
        memories_qs = Memory.objects.filter(user=user).prefetch_related('tags', 'images').order_by('-date')
        
        if 'year' in filters:
            memories_qs = memories_qs.filter(date__year=filters['year'])
            activities_qs = activities_qs.filter(created_at__year=filters['year'])
        if 'month' in filters:
            memories_qs = memories_qs.filter(date__month=filters['month'])
            activities_qs = activities_qs.filter(created_at__month=filters['month'])
            
        memories = memories_qs[:fetch_limit]

        events = []
        
        for activity in activities:
            # Map activity to TimelineEvent
            metadata = activity.metadata or {}
            title = metadata.get('title', activity.action)
            desc = metadata.get('milestone', '') or metadata.get('notes', '')
            model_name = activity.content_type.model
            
            events.append(TimelineEvent(
                id=f"act_{activity.id}",
                entity_type=model_name,
                entity_id=str(activity.object_id),
                title=f"{activity.action}: {title}",
                description=desc,
                timestamp=activity.created_at,
                icon="activity",
                color="#888888",
                category="Activity",
                tags=[],
                source_module=model_name,
                visibility="private",
                favorite=False,
                pinned=False,
                preview="",
                image=None,
                action_url=f"/app/{model_name}/{activity.object_id}",
                entity_status="active"
            ))
            
        for memory in memories:
            image_url = None
            if memory.images.exists():
                image_url = memory.images.first().image.url if memory.images.first().image else None
                
            events.append(TimelineEvent(
                id=f"mem_{memory.id}",
                entity_type="memory",
                entity_id=str(memory.id),
                title=memory.title,
                description=memory.description,
                timestamp=memory.date,
                icon=memory.icon or "memory",
                color=memory.color or "#4f46e5",
                category=memory.category,
                tags=[tag.name for tag in memory.tags.all()],
                source_module="journey",
                visibility=memory.visibility,
                favorite=memory.favorite,
                pinned=memory.pinned,
                preview=memory.description[:100] + "..." if len(memory.description) > 100 else memory.description,
                image=image_url,
                action_url=f"/app/journey/{memory.id}",
                entity_status="active" if not memory.deleted_at else "deleted"
            ))
            
        # Sort combined events by timestamp descending
        events.sort(key=lambda x: x.timestamp, reverse=True)
        
        # Apply offset and limit
        paginated_events = events[offset:offset+limit]
        
        # Group by Year -> Month
        grouped_by_year = {}
        for event in paginated_events:
            if not event.timestamp:
                continue
                
            # Handle localized/naive datetime safely
            dt = event.timestamp
            year = str(dt.year)
            month = dt.strftime('%B')
            
            if year not in grouped_by_year:
                grouped_by_year[year] = {}
                
            if month not in grouped_by_year[year]:
                grouped_by_year[year][month] = []
                
            grouped_by_year[year][month].append(event.to_dict())
            
        timeline = []
        # Sort months conceptually (reverse chronological)
        month_order = ['December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January']
        
        for year, months_map in grouped_by_year.items():
            months = []
            for month, month_events in months_map.items():
                months.append({
                    'month': month,
                    'events': month_events
                })
            months.sort(key=lambda m: month_order.index(m['month']))
            timeline.append({
                'year': year,
                'months': months
            })
            
        # Sort years descending
        timeline.sort(key=lambda y: int(y['year']), reverse=True)
        
        return timeline
