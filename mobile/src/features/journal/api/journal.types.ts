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

export interface JournalImageDTO {
  id: string;
  image: string;
  caption: string;
  alt_text: string;
  order: number;
  created_at: string;
}

export interface JournalImageModel {
  id: string;
  image: string;
  caption: string;
  altText: string;
  order: number;
  createdAt: string;
}

export interface JournalEntryDTO {
  id: string;
  title: string;
  content: string;
  summary: string;
  mood: string;
  energy_level: number;
  stress_level: number;
  gratitude: string;
  todays_wins: string;
  challenges: string;
  lessons_learned: string;
  tomorrow_focus: string;
  is_favorite: boolean;
  is_pinned: boolean;
  status: string;
  visibility: string;
  word_count: number;
  reading_time: number;
  ai_processed: boolean;
  ai_summary: string;
  sentiment_score: number;
  writing_score: number;
  ai_tags: string[];
  ai_last_processed: string;
  tags: string[];
  tags_detail: TagDTO[];
  images: JournalImageDTO[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  last_updated_at?: string;
}

export interface JournalEntryModel {
  id: string;
  title: string;
  content: string;
  summary: string;
  mood: string;
  energyLevel: number;
  stressLevel: number;
  gratitude: string;
  todaysWins: string;
  challenges: string;
  lessonsLearned: string;
  tomorrowFocus: string;
  isFavorite: boolean;
  isPinned: boolean;
  status: string;
  visibility: string;
  wordCount: number;
  readingTime: number;
  aiProcessed: boolean;
  aiSummary: string;
  sentimentScore: number;
  writingScore: number;
  aiTags: string[];
  aiLastProcessed: string;
  tags: string[];
  tagsDetail: TagModel[];
  images: JournalImageModel[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  lastUpdatedAt?: string;
  date?: string;
}

export interface JournalStatsDTO {
  total_entries: number;
  total_words: number;
  average_mood: number | null;
  current_streak: number;
  longest_streak: number;
  average_writing_score: number | null;
  average_sentiment: number | null;
  total_reading_time: number;
}

export interface JournalStatsModel {
  totalEntries: number;
  totalWords: number;
  averageMood: number | null;
  currentStreak: number;
  longestStreak: number;
  averageWritingScore: number | null;
  averageSentiment: number | null;
  totalReadingTime: number;
}

export interface PaginatedJournalDTO {
  count: number;
  next: string | null;
  previous: string | null;
  results: JournalEntryDTO[];
}

export interface PaginatedJournalModel {
  count: number;
  next: string | null;
  previous: string | null;
  results: JournalEntryModel[];
}

export interface JournalFilters {
  search?: string;
  mood?: string;
  is_favorite?: boolean;
  is_pinned?: boolean;
  status?: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface CreateJournalEntryPayload {
  title?: string;
  content: string;
  mood?: string;
  energy_level?: number;
  stress_level?: number;
  gratitude?: string;
  todays_wins?: string;
  challenges?: string;
  lessons_learned?: string;
  tomorrow_focus?: string;
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'private' | 'public';
  tags?: string[];
}

export interface UpdateJournalEntryPayload extends Partial<CreateJournalEntryPayload> {
  is_favorite?: boolean;
  is_pinned?: boolean;
  deleted_at?: string | null;
}
