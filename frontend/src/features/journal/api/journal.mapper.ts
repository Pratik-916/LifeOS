import type {
  JournalEntryDTO,
  JournalEntryModel,
  JournalImageDTO,
  JournalImageModel,
  PaginatedJournalDTO,
  PaginatedJournalModel,
  JournalStatsDTO,
  JournalStatsModel,
  TagDTO,
  TagModel
} from './journal.types';

export const mapTagToDomain = (dto: TagDTO): TagModel => ({
  id: dto.id,
  name: dto.name,
  color: dto.color,
});

export const mapJournalImageToDomain = (dto: JournalImageDTO): JournalImageModel => ({
  id: dto.id,
  image: dto.image,
  caption: dto.caption,
  altText: dto.alt_text,
  order: dto.order,
  createdAt: dto.created_at,
});

export const mapJournalEntryToDomain = (dto: JournalEntryDTO): JournalEntryModel => ({
  id: dto.id,
  title: dto.title,
  content: dto.content,
  summary: dto.summary,
  mood: dto.mood,
  energyLevel: dto.energy_level,
  stressLevel: dto.stress_level,
  gratitude: dto.gratitude,
  todaysWins: dto.todays_wins,
  challenges: dto.challenges,
  lessonsLearned: dto.lessons_learned,
  tomorrowFocus: dto.tomorrow_focus,
  isFavorite: dto.is_favorite,
  isPinned: dto.is_pinned,
  status: dto.status,
  visibility: dto.visibility,
  wordCount: dto.word_count,
  readingTime: dto.reading_time,
  aiProcessed: dto.ai_processed,
  aiSummary: dto.ai_summary,
  sentimentScore: dto.sentiment_score,
  writingScore: dto.writing_score,
  aiTags: dto.ai_tags || [],
  aiLastProcessed: dto.ai_last_processed,
  tags: dto.tags || [],
  tagsDetail: (dto.tags_detail || []).map(mapTagToDomain),
  images: (dto.images || []).map(mapJournalImageToDomain),
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
  lastUpdatedAt: dto.last_updated_at,
  date: dto.created_at,
});

export const mapPaginatedJournalToDomain = (dto: PaginatedJournalDTO): PaginatedJournalModel => ({
  count: dto.count,
  next: dto.next,
  previous: dto.previous,
  results: (dto.results || []).map(mapJournalEntryToDomain),
});

export const mapJournalStatsToDomain = (dto: JournalStatsDTO): JournalStatsModel => ({
  totalEntries: dto.total_entries,
  entriesThisWeek: dto.entries_this_week,
  totalWords: dto.total_words,
  averageMood: dto.average_mood,
  longestStreak: dto.longest_streak,
  currentStreak: dto.current_streak,
});
