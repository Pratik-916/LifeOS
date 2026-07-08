import type { StateCreator } from 'zustand';
import type { AppState } from '../useAppStore';
import type { UserProfile, AppSettings, BackupMetadata } from '../../types';

export interface SettingsSlice {
  profile: UserProfile;
  settings: AppSettings;
  backupMetadata: BackupMetadata;
  
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateWidgetVisibility: (updates: Partial<AppSettings['widgetVisibility']>) => void;
  updateBackupMetadata: (metadata: Partial<BackupMetadata>) => void;
  resetPreferences: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Pratik',
  username: 'pratik_dev',
  email: 'hello@example.com',
  bio: 'Building things for the web.',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#8b5cf6', // Default accent
  fontSize: 'medium',
  compactMode: false,
  animations: true,
  
  defaultView: 'Week',
  weekStartsOn: 'Monday',
  defaultReminderTime: '09:00',
  
  autosave: true,
  markdownSupport: true,
  defaultMood: 'neutral',
  
  dailyReminder: true,
  goalReminder: true,
  habitReminder: false,
  
  widgetVisibility: {
    productivityScore: true,
    weather: false,
    quotes: true,
    recentActivity: true,
    habitTracker: true
  },
  
  privacyMode: false
};

const DEFAULT_BACKUP_METADATA: BackupMetadata = {
  lastBackupTime: null,
  backupSize: null,
  applicationVersion: '1.0.0'
};

export const createSettingsSlice: StateCreator<AppState, [], [], SettingsSlice> = (set) => ({
  profile: DEFAULT_PROFILE,
  settings: DEFAULT_SETTINGS,
  backupMetadata: DEFAULT_BACKUP_METADATA,
  
  updateProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates }
  })),
  
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),
  
  updateWidgetVisibility: (updates) => set((state) => ({
    settings: {
      ...state.settings,
      widgetVisibility: {
        ...state.settings.widgetVisibility,
        ...updates
      }
    }
  })),
  
  updateBackupMetadata: (metadata) => set((state) => ({
    backupMetadata: { ...state.backupMetadata, ...metadata }
  })),
  
  resetPreferences: () => set({
    profile: DEFAULT_PROFILE,
    settings: DEFAULT_SETTINGS
  })
});
