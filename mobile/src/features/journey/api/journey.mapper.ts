import type {
  Tag, TagDTO,
  MemoryImage, MemoryImageDTO,
  Memory, MemoryDTO,
  TimelineEvent, TimelineEventDTO,
  TimelineMonthGroup, TimelineMonthGroupDTO,
  TimelineYearGroup, TimelineYearGroupDTO,
  JourneyStatistics, JourneyStatisticsDTO,
  CreateMemoryPayload, UpdateMemoryPayload
} from './journey.types';

export const mapTagDTO = (dto: TagDTO): Tag => ({
  id: String(dto.id),
  name: dto.name,
  color: dto.color,
});

export const mapMemoryImageDTO = (dto: MemoryImageDTO): MemoryImage => ({
  id: String(dto.id),
  image: dto.image,
  caption: dto.caption,
  altText: dto.alt_text,
  displayOrder: dto.display_order,
  createdAt: dto.created_at,
});

export const mapMemoryDTO = (dto: MemoryDTO): Memory => ({
  id: String(dto.id),
  title: dto.title,
  description: dto.description || '',
  date: dto.date,
  location: dto.location || '',
  category: dto.category || 'General',
  visibility: dto.visibility || 'private',
  favorite: dto.favorite || false,
  pinned: dto.pinned || false,
  color: dto.color || '#4f46e5',
  icon: dto.icon || 'book',
  tags: dto.tags ? dto.tags.map(String) : [],
  tagsDetail: dto.tags_detail ? dto.tags_detail.map(mapTagDTO) : [],
  images: dto.images ? dto.images.map(mapMemoryImageDTO) : [],
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapTimelineEventDTO = (dto: TimelineEventDTO): TimelineEvent => ({
  id: dto.id,
  entityType: dto.entity_type,
  entityId: dto.entity_id,
  title: dto.title,
  description: dto.description || '',
  timestamp: dto.timestamp,
  icon: dto.icon || 'activity',
  color: dto.color || '#888888',
  category: dto.category || '',
  tags: dto.tags || [],
  sourceModule: dto.source_module,
  visibility: dto.visibility || 'private',
  favorite: dto.favorite || false,
  pinned: dto.pinned || false,
  preview: dto.preview || '',
  image: dto.image,
  actionUrl: dto.action_url,
  entityStatus: dto.entity_status,
});

export const mapTimelineMonthGroupDTO = (dto: TimelineMonthGroupDTO): TimelineMonthGroup => ({
  month: dto.month,
  events: dto.events.map(mapTimelineEventDTO),
});

export const mapTimelineYearGroupDTO = (dto: TimelineYearGroupDTO): TimelineYearGroup => ({
  year: dto.year,
  months: dto.months.map(mapTimelineMonthGroupDTO),
});

export const mapJourneyStatisticsDTO = (dto: JourneyStatisticsDTO): JourneyStatistics => ({
  totalMemories: dto.total_memories,
  totalTimelineEvents: dto.total_timeline_events,
  activeYears: dto.active_years,
  currentYearActivity: dto.current_year_activity,
  completedGoals: dto.completed_goals,
  completedTasks: dto.completed_tasks,
  habitMilestones: dto.habit_milestones,
  writingMilestones: dto.writing_milestones,
  longestHabitStreak: dto.longest_habit_streak,
  longestWritingStreak: dto.longest_writing_streak,
  favoriteMemories: dto.favorite_memories,
  pinnedMemories: dto.pinned_memories,
  monthlyActivityCounts: dto.monthly_activity_counts,
  yearlyActivityCounts: dto.yearly_activity_counts,
  categoryDistribution: dto.category_distribution,
  mostActiveMonth: dto.most_active_month,
  mostActiveYear: dto.most_active_year,
  mostUsedCategory: dto.most_used_category,
  mostActiveModule: dto.most_active_module,
  averageEventsPerMonth: dto.average_events_per_month,
});

export const mapCreateMemoryPayload = (payload: CreateMemoryPayload): Partial<MemoryDTO> => {
  const dto: Record<string, unknown> = { ...payload };
  if (payload.tags) {
    dto.tags = payload.tags.map(Number).filter(n => !isNaN(n));
  }
  return dto as Partial<MemoryDTO>;
};

export const mapUpdateMemoryPayload = (payload: UpdateMemoryPayload): Partial<MemoryDTO> => {
  const dto: Record<string, unknown> = { ...payload };
  if (payload.tags) {
    dto.tags = payload.tags.map(Number).filter(n => !isNaN(n));
  }
  return dto as Partial<MemoryDTO>;
};
