export const NOTIFICATION_CHANNELS = {
  PLANNER: 'planner_channel',
  HABITS: 'habits_channel',
  GOALS: 'goals_channel',
  JOURNAL: 'journal_channel',
  JOURNEY: 'journey_channel',
  DEFAULT: 'default_channel',
};

export const STORAGE_KEYS = {
  MAPPINGS: '@notifications:mappings',
};

export const QUEUE_CONFIG = {
  BATCH_SIZE: 10,
  BATCH_DELAY_MS: 50, // Yields to JS event loop to avoid UI thread blocking
};
