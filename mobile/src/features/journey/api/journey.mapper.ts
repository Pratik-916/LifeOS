import type { 
  MemoryDTO, MemoryModel, 
  MemoryImageDTO, MemoryImageModel,
  TagDTO, TagModel,
  PaginatedMemoryDTO, PaginatedMemoryModel,
  TimelineEventDTO, TimelineEventModel,
  TimelineMonthDTO, TimelineMonthModel,
  TimelineYearDTO, TimelineYearModel,
  PaginatedTimelineDTO, PaginatedTimelineModel,
  JourneyStatsDTO, JourneyStatsModel 
} from './journey.types';

export const mapTagToDomain = (dto: TagDTO): TagModel => ({
  id: dto.id,
  name: dto.name,
  color: dto.color,
});

export const mapMemoryImageToDomain = (dto: MemoryImageDTO): MemoryImageModel => ({
  id: dto.id,
  image: dto.image,
  caption: dto.caption,
  altText: dto.alt_text,
  displayOrder: dto.display_order,
  createdAt: dto.created_at,
});

export const mapMemoryToDomain = (dto: MemoryDTO): MemoryModel => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  date: dto.date,
  location: dto.location,
  category: dto.category,
  visibility: dto.visibility,
  favorite: dto.favorite,
  pinned: dto.pinned,
  color: dto.color,
  icon: dto.icon,
  tags: dto.tags,
  tagsDetail: dto.tags_detail?.map(mapTagToDomain) || [],
  images: dto.images?.map(mapMemoryImageToDomain) || [],
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
  lastUpdatedAt: dto.last_updated_at,
});

export const mapPaginatedMemoryToDomain = (dto: PaginatedMemoryDTO): PaginatedMemoryModel => ({
  count: dto.count,
  next: dto.next,
  previous: dto.previous,
  results: dto.results.map(mapMemoryToDomain),
});

export const mapTimelineEventToDomain = (dto: TimelineEventDTO): TimelineEventModel => ({
  id: dto.id,
  entityType: dto.entity_type,
  entityId: dto.entity_id,
  title: dto.title,
  description: dto.description,
  timestamp: dto.timestamp,
  icon: dto.icon,
  color: dto.color,
  category: dto.category,
  tags: dto.tags,
  sourceModule: dto.source_module,
  visibility: dto.visibility,
  favorite: dto.favorite,
  pinned: dto.pinned,
  preview: dto.preview,
  image: dto.image,
  actionUrl: dto.action_url,
  entityStatus: dto.entity_status,
  type: dto.entity_type,
});

export const mapTimelineMonthToDomain = (dto: TimelineMonthDTO): TimelineMonthModel => ({
  month: dto.month,
  events: dto.events.map(mapTimelineEventToDomain),
});

export const mapTimelineYearToDomain = (dto: TimelineYearDTO): TimelineYearModel => ({
  year: dto.year,
  months: dto.months.map(mapTimelineMonthToDomain),
});

export const mapPaginatedTimelineToDomain = (dto: PaginatedTimelineDTO): PaginatedTimelineModel => ({
  count: dto.count,
  next: dto.next,
  previous: dto.previous,
  results: dto.results.map(mapTimelineYearToDomain),
});

export const mapJourneyStatsToDomain = (dto: JourneyStatsDTO): JourneyStatsModel => ({
  activeYears: dto.active_years,
  totalAchievements: dto.total_achievements,
  goalsCompleted: dto.goals_completed,
  tasksCompleted: dto.tasks_completed,
  journalEntries: dto.journal_entries,
  longestHabitStreak: dto.longest_habit_streak,
  totalMemories: dto.total_memories,
});
