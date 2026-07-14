export interface TagDTO {
  id: number;
  name: string;
  color: string;
}

export interface MemoryImageDTO {
  id: number;
  image: string;
  caption: string;
  alt_text: string;
  display_order: number;
  created_at: string;
}

export interface MemoryDTO {
  id: number;
  title: string;
  description: string;
  date: string | null;
  location: string;
  category: string;
  visibility: string;
  favorite: boolean;
  pinned: boolean;
  color: string;
  icon: string;
  tags: number[];
  tags_detail?: TagDTO[];
  images?: MemoryImageDTO[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  last_updated_at?: string;
}

export interface TimelineEventDTO {
  id: string;
  entity_type: string;
  entity_id: string;
  title: string;
  description: string;
  timestamp: string | null;
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

export interface TimelineMonthGroupDTO {
  month: string;
  events: TimelineEventDTO[];
}

export interface TimelineYearGroupDTO {
  year: string;
  months: TimelineMonthGroupDTO[];
}

export interface JourneyStatisticsDTO {
  total_memories: number;
  total_timeline_events: number;
  active_years: number;
  current_year_activity: number;
  completed_goals: number;
  completed_tasks: number;
  habit_milestones: number;
  writing_milestones: number;
  longest_habit_streak: number;
  longest_writing_streak: number;
  favorite_memories: number;
  pinned_memories: number;
  monthly_activity_counts: { month: string; count: number }[];
  yearly_activity_counts: { year: string; count: number }[];
  category_distribution: { category: string; count: number }[];
  most_active_month: string | null;
  most_active_year: number | null;
  most_used_category: string | null;
  most_active_module: string | null;
  average_events_per_month: number;
}

// Frontend Domain Models
export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface MemoryImage {
  id: string;
  image: string;
  caption: string;
  altText: string;
  displayOrder: number;
  createdAt: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string | null;
  location: string;
  category: string;
  visibility: string;
  favorite: boolean;
  pinned: boolean;
  color: string;
  icon: string;
  tags: string[];
  tagsDetail: Tag[];
  images: MemoryImage[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TimelineEvent {
  id: string;
  entityType: string;
  entityId: string;
  title: string;
  description: string;
  timestamp: string | null;
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
}

export interface TimelineMonthGroup {
  month: string;
  events: TimelineEvent[];
}

export interface TimelineYearGroup {
  year: string;
  months: TimelineMonthGroup[];
}

export interface JourneyStatistics {
  totalMemories: number;
  totalTimelineEvents: number;
  activeYears: number;
  currentYearActivity: number;
  completedGoals: number;
  completedTasks: number;
  habitMilestones: number;
  writingMilestones: number;
  longestHabitStreak: number;
  longestWritingStreak: number;
  favoriteMemories: number;
  pinnedMemories: number;
  monthlyActivityCounts: { month: string; count: number }[];
  yearlyActivityCounts: { year: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  mostActiveMonth: string | null;
  mostActiveYear: number | null;
  mostUsedCategory: string | null;
  mostActiveModule: string | null;
  averageEventsPerMonth: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateMemoryPayload {
  title: string;
  description?: string;
  date?: string | null;
  location?: string;
  category?: string;
  visibility?: string;
  favorite?: boolean;
  pinned?: boolean;
  color?: string;
  icon?: string;
  tags?: string[];
}

export interface UpdateMemoryPayload extends Partial<CreateMemoryPayload> {
  last_updated_at?: string;
}
