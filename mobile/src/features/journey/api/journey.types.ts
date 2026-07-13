export interface TagDTO {
  id: string;
  name: string;
  color: string;
}

export interface TagModel {
  id: string;
  name: string;
  color: string;
}

export interface MemoryImageDTO {
  id: string;
  image: string;
  caption: string;
  alt_text: string;
  display_order: number;
  created_at: string;
}

export interface MemoryImageModel {
  id: string;
  image: string;
  caption: string;
  altText: string;
  displayOrder: number;
  createdAt: string;
}

export interface MemoryDTO {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  visibility: string;
  favorite: boolean;
  pinned: boolean;
  color: string;
  icon: string;
  tags: string[];
  tags_detail: TagDTO[];
  images: MemoryImageDTO[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  last_updated_at?: string;
}

export interface MemoryModel {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  visibility: string;
  favorite: boolean;
  pinned: boolean;
  color: string;
  icon: string;
  tags: string[];
  tagsDetail: TagModel[];
  images: MemoryImageModel[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  lastUpdatedAt?: string;
}

export interface TimelineEventDTO {
  id: string;
  entity_type: string;
  entity_id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
  category: string;
  tags: string[];
  source_module: string;
  visibility: string;
  favorite: boolean;
  pinned: boolean;
  preview: string;
  image: string | null;
  action_url: string;
  entity_status: string;
}

export interface TimelineEventModel {
  id: string;
  entityType: string;
  entityId: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
  category: string;
  tags: string[];
  sourceModule: string;
  visibility: string;
  favorite: boolean;
  pinned: boolean;
  preview: string;
  image: string | null;
  actionUrl: string;
  entityStatus: string;
  type?: string; 
}

export interface TimelineMonthDTO {
  month: string;
  events: TimelineEventDTO[];
}

export interface TimelineMonthModel {
  month: string;
  events: TimelineEventModel[];
}

export interface TimelineYearDTO {
  year: string;
  months: TimelineMonthDTO[];
}

export interface TimelineYearModel {
  year: string;
  months: TimelineMonthModel[];
}

export interface PaginatedTimelineDTO {
  count: number;
  next: string | null;
  previous: string | null;
  results: TimelineYearDTO[];
}

export interface PaginatedTimelineModel {
  count: number;
  next: string | null;
  previous: string | null;
  results: TimelineYearModel[];
}

export interface PaginatedMemoryDTO {
  count: number;
  next: string | null;
  previous: string | null;
  results: MemoryDTO[];
}

export interface PaginatedMemoryModel {
  count: number;
  next: string | null;
  previous: string | null;
  results: MemoryModel[];
}

export interface JourneyStatsDTO {
  active_years: number;
  total_achievements: number;
  goals_completed: number;
  tasks_completed: number;
  journal_entries: number;
  longest_habit_streak: number;
  total_memories: number;
}

export interface JourneyStatsModel {
  activeYears: number;
  totalAchievements: number;
  goalsCompleted: number;
  tasksCompleted: number;
  journalEntries: number;
  longestHabitStreak: number;
  totalMemories: number;
}

export interface MemoryFilters {
  page?: number;
  search?: string;
  category?: string;
  visibility?: string;
  favorite?: boolean | string;
  pinned?: boolean | string;
  ordering?: string;
}

export interface TimelineFilters {
  offset?: number;
  limit?: number;
  year?: number;
  month?: number;
}

export interface CreateMemoryPayload {
  title: string;
  description?: string;
  date: string;
  location?: string;
  category?: string;
  visibility?: string;
  color?: string;
  icon?: string;
  favorite?: boolean;
  pinned?: boolean;
  tags?: string[];
}

export interface UpdateMemoryPayload {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  category?: string;
  visibility?: string;
  color?: string;
  icon?: string;
  favorite?: boolean;
  pinned?: boolean;
  tags?: string[];
  last_updated_at?: string;
}
