import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  User, Palette, Calendar, Book, Bell, LayoutDashboard, 
  Database, Shield, Info, 
  Check, Download, Upload, ShieldAlert, Globe, MessageSquare, AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppStore } from '../store/useAppStore';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useAuth } from '../contexts/AuthContext';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Toggle = ({ checked, onChange, disabled }: { checked: boolean, onChange: () => void, disabled?: boolean }) => (
  <button 
    onClick={disabled ? undefined : onChange}
    className={cn(
      "w-11 h-6 rounded-full flex items-center transition-colors px-1",
      checked ? "bg-accent" : "bg-surfaceHighlight",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    )}
    disabled={disabled}
  >
    <motion.div 
      animate={{ x: checked ? 20 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-4 h-4 rounded-full bg-white shadow-sm"
    />
  </button>
);

const ComingSoonBadge = () => (
  <span className="px-2 py-0.5 rounded-full bg-accent/20 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider ml-3">
    Coming Soon
  </span>
);

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Zustand Store mappings
  const { user } = useAuth();
  const store = useAppStore();
  const { 
    settings, 
    backupMetadata, 
    updateSettings, 
    updateWidgetVisibility,
    updateBackupMetadata,
    importData,
    factoryReset,
    clearLocalData,
    resetPreferences,
    goals,
    habits,
    journalEntries,
    activities
  } = store;

  const tasks: any[] = useMemo(() => [], []);

  const stats = useDashboardStats();

  // Calculate App Statistics
  const appStats = useMemo(() => {
    // Try to find the earliest created item to determine "Started Using"
    const allDates = [
      ...tasks.map((t: any) => new Date(t.createdAt).getTime()),
      ...goals.map((g: any) => new Date(g.createdAt).getTime()),
      ...habits.map((h: any) => new Date(h.createdAt).getTime()),
      ...journalEntries.map((j: any) => new Date(j.createdAt).getTime()),
    ].filter(d => !isNaN(d));
    
    const startedUsingDate = allDates.length > 0 ? new Date(Math.min(...allDates)) : new Date();
    const daysUsing = Math.max(1, Math.floor((Date.now() - startedUsingDate.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      startedUsing: startedUsingDate.toLocaleDateString(),
      daysUsing,
      tasksCompleted: tasks.filter(t => t.status === 'done').length,
      goalsCompleted: goals.filter((g: any) => g.status === 'Completed').length,
      habitsCreated: habits.length,
      journalEntries: journalEntries.length,
      longestStreak: stats.longestStreak,
      productivityScore: stats.productivityScore,
      totalActivities: activities.length
    };
  }, [tasks, goals, habits, journalEntries, activities, stats]);

  // Toggles Wrapper
  const toggleSetting = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };
  
  const toggleWidget = (key: keyof typeof settings.widgetVisibility) => {
    updateWidgetVisibility({ [key]: !settings.widgetVisibility[key] });
  };

  const navItems = [
    { name: 'Profile', icon: User },
    { name: 'Appearance', icon: Palette },
    { name: 'Planner', icon: Calendar },
    { name: 'Journal', icon: Book },
    { name: 'Notifications', icon: Bell },
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Data & Backup', icon: Database },
    { name: 'Security', icon: Shield },
    { name: 'About', icon: Info },
  ];

  // --- Handlers ---
  const handleExport = () => {
    // Generate a backup blob from the entire store
    const storeState = useAppStore.getState();
    const dataToExport = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      data: {
        tasks: [],
        habits: storeState.habits,
        goals: storeState.goals,
        activities: storeState.activities,
        journalEntries: storeState.journalEntries,
        memories: storeState.memories,
        profile: storeState.profile,
        settings: storeState.settings
      }
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    updateBackupMetadata({
      lastBackupTime: new Date().toISOString(),
      backupSize: blob.size,
      applicationVersion: '1.0.0'
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Basic validation
        if (!json.data || !json.data.settings || !json.data.tasks) {
          alert("Invalid backup file format.");
          return;
        }

        if (window.confirm("This will overwrite your current data. Do you want to proceed?")) {
          // Automatic backup before restore
          handleExport();
          
          importData(json.data);
          alert("Data successfully imported!");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFactoryReset = () => {
    if (window.confirm("WARNING: This will delete ALL your data permanently (tasks, habits, journals, goals, memories, settings). This cannot be undone. Type 'RESET' to confirm.")) {
      const confirmation = window.prompt("Type 'RESET' to confirm factory reset:");
      if (confirmation === 'RESET') {
        factoryReset();
      }
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0 md:sticky md:top-8 h-max">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                activeTab === item.name 
                  ? "bg-surfaceHighlight text-primary" 
                  : "text-secondary hover:bg-surfaceHighlight hover:text-primary"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <motion.div 
        key={activeTab}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 space-y-8"
      >
        {activeTab === 'Profile' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Profile</h2>
              <p className="text-secondary text-sm">Manage your personal information.</p>
            </div>
            <Card className="p-8 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr bg-accent p-1">
                  <div className="w-full h-full rounded-full bg-surfaceHighlight flex items-center justify-center overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.firstName || 'User')}
                  </h3>
                  <p className="text-secondary">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">First Name</label>
                  <input 
                    type="text" 
                    value={user?.firstName || ''} 
                    disabled
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors opacity-70 cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Last Name</label>
                  <input 
                    type="text" 
                    value={user?.lastName || ''}
                    disabled
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors opacity-70 cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-secondary">Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors opacity-70 cursor-not-allowed" 
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-border/20 flex justify-end">
                <Button variant="primary" disabled className="gap-2">
                  Save Changes <ComingSoonBadge />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Appearance' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Appearance</h2>
              <p className="text-secondary text-sm">Customize how LifeOS looks on your device.</p>
            </div>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-secondary">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={cn("flex flex-col items-center gap-3 p-4 rounded-xl border transition-colors", settings.theme === 'dark' ? 'border-accent bg-accent/10' : 'border-border/20 bg-surfaceHighlight hover:bg-surfaceHighlight')}
                >
                  <div className="w-full h-16 rounded-md bg-surfaceHighlight border border-border/20" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
                <button 
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={cn("flex flex-col items-center gap-3 p-4 rounded-xl border transition-colors", settings.theme === 'light' ? 'border-accent bg-accent/10' : 'border-border/20 bg-transparent hover:bg-surfaceHighlight')}
                >
                  <div className="w-full h-16 rounded-md bg-white border border-border/20" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button 
                  onClick={() => updateSettings({ theme: 'system' })}
                  className={cn("flex flex-col items-center gap-3 p-4 rounded-xl border transition-colors", settings.theme === 'system' ? 'border-accent bg-accent/10' : 'border-border/20 bg-transparent hover:bg-surfaceHighlight')}
                >
                  <div className="w-full h-16 rounded-md bg-gradient-to-r from-white to-[#121212] border border-border/20" />
                  <span className="text-sm font-medium">System</span>
                </button>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-secondary">Accent Color</h3>
                <div className="flex gap-4">
                  {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map(color => (
                    <button
                      key={color}
                      onClick={() => updateSettings({ accentColor: color })}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    >
                      {settings.accentColor === color && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-secondary">Font Size</h3>
                <div className="flex gap-4">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => updateSettings({ fontSize: size })}
                      className={cn(
                        "px-4 py-2 rounded-lg border transition-colors capitalize",
                        settings.fontSize === size ? "bg-accent/20 border-accent text-accent font-medium" : "bg-surfaceHighlight border-border/20 text-secondary hover:bg-surfaceHighlight"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden divide-y divide-border">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Compact Mode</h3>
                  <p className="text-sm text-secondary">Reduce padding and font sizes across the app.</p>
                </div>
                <Toggle checked={settings.compactMode} onChange={() => toggleSetting('compactMode')} />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">UI Animations</h3>
                  <p className="text-sm text-secondary">Enable smooth transitions and micro-interactions.</p>
                </div>
                <Toggle checked={settings.animations} onChange={() => toggleSetting('animations')} />
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Planner' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Planner Settings</h2>
              <p className="text-secondary text-sm">Configure your scheduling preferences.</p>
            </div>
            
            <Card className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Default View <ComingSoonBadge /></label>
                  <select 
                    disabled
                    value={settings.defaultView}
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors appearance-none opacity-50 cursor-not-allowed"
                  >
                    <option value="Day">Day</option>
                    <option value="Week">Week</option>
                    <option value="Month">Month</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Week Starts On</label>
                  <select 
                    value={settings.weekStartsOn}
                    onChange={(e) => updateSettings({ weekStartsOn: e.target.value as any })}
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Default Reminder Time</label>
                  <input 
                    type="time" 
                    value={settings.defaultReminderTime}
                    onChange={(e) => updateSettings({ defaultReminderTime: e.target.value })}
                    className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors dark:[color-scheme:dark] [color-scheme:light]"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Journal' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Journal Settings</h2>
              <p className="text-secondary text-sm">Configure your writing environment.</p>
            </div>
            
            <Card className="p-6 mb-6">
              <div className="space-y-2 max-w-sm">
                <label className="text-sm font-medium text-secondary">Default Mood</label>
                <select 
                  value={settings.defaultMood}
                  onChange={(e) => updateSettings({ defaultMood: e.target.value })}
                  className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  <option value="Happy">Happy</option>
                  <option value="Productive">Productive</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Stressed">Stressed</option>
                  <option value="Tired">Tired</option>
                  <option value="Sad">Sad</option>
                  <option value="Excited">Excited</option>
                </select>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden divide-y divide-border">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Auto-Save</h3>
                  <p className="text-sm text-secondary">Save drafts automatically as you type.</p>
                </div>
                <Toggle checked={settings.autosave} onChange={() => toggleSetting('autosave')} />
              </div>
              <div className="p-6 flex items-center justify-between opacity-50">
                <div>
                  <h3 className="font-semibold flex items-center">Markdown Support <ComingSoonBadge /></h3>
                  <p className="text-sm text-secondary">Enable markdown shortcuts in the editor.</p>
                </div>
                <Toggle checked={false} onChange={() => {}} disabled />
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Notifications' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Notifications</h2>
              <p className="text-secondary text-sm">Choose what we notify you about.</p>
            </div>
            <Card className="p-0 overflow-hidden divide-y divide-border">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Daily Summary Reminder</h3>
                  <p className="text-sm text-secondary">Morning push notification with your agenda.</p>
                </div>
                <Toggle checked={settings.dailyReminder} onChange={() => toggleSetting('dailyReminder')} />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Goal Deadlines</h3>
                  <p className="text-sm text-secondary">Alerts when a goal deadline is approaching.</p>
                </div>
                <Toggle checked={settings.goalReminder} onChange={() => toggleSetting('goalReminder')} />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Habit Check-ins</h3>
                  <p className="text-sm text-secondary">Evening reminder to log your habits.</p>
                </div>
                <Toggle checked={settings.habitReminder} onChange={() => toggleSetting('habitReminder')} />
              </div>
              
              <div className="p-6 flex items-center justify-between opacity-50 bg-surfaceHighlight">
                <div>
                  <h3 className="font-semibold flex items-center">Email Notifications <ComingSoonBadge /></h3>
                  <p className="text-sm text-secondary">Receive daily digests via email.</p>
                </div>
                <Toggle checked={false} onChange={() => {}} disabled />
              </div>
              <div className="p-6 flex items-center justify-between opacity-50 bg-surfaceHighlight">
                <div>
                  <h3 className="font-semibold flex items-center">Push Notifications <ComingSoonBadge /></h3>
                  <p className="text-sm text-secondary">Receive alerts directly to your desktop or phone.</p>
                </div>
                <Toggle checked={false} onChange={() => {}} disabled />
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Dashboard' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Dashboard Preferences</h2>
              <p className="text-secondary text-sm">Toggle widgets on your home screen.</p>
            </div>
            <Card className="p-0 overflow-hidden divide-y divide-border">
              <div className="p-6 flex items-center justify-between">
                <h3 className="font-semibold">Productivity Score</h3>
                <Toggle checked={settings.widgetVisibility.productivityScore} onChange={() => toggleWidget('productivityScore')} />
              </div>
              <div className="p-6 flex items-center justify-between opacity-50 bg-surfaceHighlight">
                <h3 className="font-semibold flex items-center">Weather <ComingSoonBadge /></h3>
                <Toggle checked={false} onChange={() => {}} disabled />
              </div>
              <div className="p-6 flex items-center justify-between">
                <h3 className="font-semibold">Motivational Quotes</h3>
                <Toggle checked={settings.widgetVisibility.quotes} onChange={() => toggleWidget('quotes')} />
              </div>
              <div className="p-6 flex items-center justify-between">
                <h3 className="font-semibold">Recent Activity</h3>
                <Toggle checked={settings.widgetVisibility.recentActivity} onChange={() => toggleWidget('recentActivity')} />
              </div>
              <div className="p-6 flex items-center justify-between">
                <h3 className="font-semibold">Habit Tracker</h3>
                <Toggle checked={settings.widgetVisibility.habitTracker} onChange={() => toggleWidget('habitTracker')} />
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Data & Backup' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Data & Backup</h2>
              <p className="text-secondary text-sm">Manage your personal data exports.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className="p-6 flex flex-col items-center justify-center text-center space-y-4 hover:bg-surfaceHighlight transition-colors cursor-pointer border-dashed border-border/50"
                onClick={handleExport}
              >
                <div className="w-12 h-12 rounded-full bg-surfaceHighlight flex items-center justify-center text-accent">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Export Data</h3>
                  <p className="text-xs text-secondary">Download as JSON</p>
                </div>
              </Card>
              <Card 
                className="p-6 flex flex-col items-center justify-center text-center space-y-4 hover:bg-surfaceHighlight transition-colors cursor-pointer border-dashed border-border/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-surfaceHighlight flex items-center justify-center text-success">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Import Data</h3>
                  <p className="text-xs text-secondary">Restore from a backup</p>
                </div>
                <input 
                  type="file" 
                  accept=".json" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImport}
                />
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Storage Status</h3>
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold">{formatSize(backupMetadata.backupSize)}</span>
                <span className="text-sm text-secondary">Size of Last Backup</span>
              </div>
              <p className="text-xs text-secondary flex items-center gap-2 mt-4">
                {backupMetadata.lastBackupTime ? (
                  <><Check className="w-3.5 h-3.5 text-success" /> Last synced {new Date(backupMetadata.lastBackupTime).toLocaleString()}</>
                ) : (
                  "Never backed up."
                )}
              </p>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Security' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Privacy & Security</h2>
              <p className="text-secondary text-sm">Keep your account secure.</p>
            </div>
            
            <Card className="p-0 overflow-hidden divide-y divide-border">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">Privacy Mode</h3>
                  <p className="text-sm text-secondary">Blur sensitive data across the application automatically.</p>
                </div>
                <Toggle checked={settings.privacyMode} onChange={() => toggleSetting('privacyMode')} />
              </div>
              <div className="p-6 flex items-center justify-between opacity-50 bg-surfaceHighlight">
                <div>
                  <h3 className="font-semibold flex items-center">Change Password <ComingSoonBadge /></h3>
                  <p className="text-sm text-secondary">Requires backend integration.</p>
                </div>
                <Button variant="secondary" size="sm" disabled>Update</Button>
              </div>
              <div className="p-6 flex items-center justify-between opacity-50 bg-surfaceHighlight">
                <div>
                  <h3 className="font-semibold flex items-center">Two-Factor Authentication <ComingSoonBadge /></h3>
                  <p className="text-sm text-secondary">Requires backend integration.</p>
                </div>
                <Toggle checked={false} onChange={() => {}} disabled />
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'About' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">About</h2>
              <p className="text-secondary text-sm">Information about LifeOS.</p>
            </div>
            
            <Card className="p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-lg shadow-accent/20 mb-4">
                <LayoutDashboard className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-1">LifeOS</h3>
              <p className="text-accent font-medium mb-8">Version {backupMetadata.applicationVersion || '1.0.0'}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10">
                <div className="p-4 rounded-xl bg-surfaceHighlight border border-border/20 text-center space-y-1">
                  <p className="text-xl font-bold text-primary">{appStats.daysUsing}</p>
                  <p className="text-[10px] uppercase tracking-wider text-secondary font-medium">Days Active</p>
                </div>
                <div className="p-4 rounded-xl bg-surfaceHighlight border border-border/20 text-center space-y-1">
                  <p className="text-xl font-bold text-success">{appStats.tasksCompleted}</p>
                  <p className="text-[10px] uppercase tracking-wider text-secondary font-medium">Tasks Done</p>
                </div>
                <div className="p-4 rounded-xl bg-surfaceHighlight border border-border/20 text-center space-y-1">
                  <p className="text-xl font-bold text-purple-400">{appStats.goalsCompleted}</p>
                  <p className="text-[10px] uppercase tracking-wider text-secondary font-medium">Goals Met</p>
                </div>
                <div className="p-4 rounded-xl bg-surfaceHighlight border border-border/20 text-center space-y-1">
                  <p className="text-xl font-bold text-pink-400">{appStats.journalEntries}</p>
                  <p className="text-[10px] uppercase tracking-wider text-secondary font-medium">Journal Entries</p>
                </div>
                <div className="p-4 rounded-xl bg-surfaceHighlight border border-border/20 text-center space-y-1">
                  <p className="text-xl font-bold text-orange-400">{appStats.habitsCreated}</p>
                  <p className="text-[10px] uppercase tracking-wider text-secondary font-medium">Habits</p>
                </div>
                <div className="p-4 rounded-xl bg-surfaceHighlight border border-border/20 text-center space-y-1">
                  <p className="text-xl font-bold text-yellow-400">{appStats.longestStreak}</p>
                  <p className="text-[10px] uppercase tracking-wider text-secondary font-medium">Best Streak</p>
                </div>
                <div className="p-4 rounded-xl bg-surfaceHighlight border border-border/20 text-center space-y-1">
                  <p className="text-xl font-bold text-accent">{appStats.productivityScore}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-secondary font-medium">Productivity</p>
                </div>
                <div className="p-4 rounded-xl bg-surfaceHighlight border border-border/20 text-center space-y-1">
                  <p className="text-xl font-bold text-blue-400">{appStats.totalActivities}</p>
                  <p className="text-[10px] uppercase tracking-wider text-secondary font-medium">Activities</p>
                </div>
              </div>

              <div className="text-sm text-secondary/70 mb-8 border-t border-border/20 w-full pt-8">
                <p>Started using LifeOS on <span className="text-primary font-medium">{appStats.startedUsing}</span></p>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-secondary">
                <span>Built with</span>
                <span className="text-accent font-semibold">React</span>
                <span>+</span>
                <span className="text-[#38bdf8] font-semibold">Tailwind</span>
                <span>+</span>
                <span className="text-yellow-500 font-semibold">Zustand</span>
              </div>
              <p className="text-sm text-secondary mb-8">Designed and developed by <span className="text-primary font-medium">Pratik</span></p>
              
              <div className="flex flex-wrap gap-4 w-full justify-center">
                <Button variant="secondary" className="flex items-center gap-2 bg-surfaceHighlight">
                  <Globe className="w-4 h-4" /> Website
                </Button>
                <Button variant="secondary" className="flex items-center gap-2 bg-surfaceHighlight">
                  <MessageSquare className="w-4 h-4" /> Feedback
                </Button>
                <Button variant="secondary" className="flex items-center gap-2 bg-surfaceHighlight opacity-50 cursor-not-allowed">
                  <AlertCircle className="w-4 h-4" /> Report Bug
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Danger Zone */}
        <motion.div variants={itemVariants} className="pt-10">
          <h2 className="text-sm font-semibold text-danger uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Danger Zone
          </h2>
          <Card className="p-0 overflow-hidden border-danger/20 divide-y divide-danger/10">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary">Reset Preferences</h3>
                <p className="text-sm text-secondary">Reset all settings to default.</p>
              </div>
              <Button onClick={resetPreferences} variant="secondary" size="sm" className="text-primary hover:text-white hover:bg-surfaceHighlight border-border/20">Reset Settings</Button>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary">Clear Local Data</h3>
                <p className="text-sm text-secondary">Wipe tasks, goals, habits, etc. (Keeps Settings)</p>
              </div>
              <Button onClick={() => { if(window.confirm('Clear all user data?')) clearLocalData() }} variant="secondary" size="sm" className="text-primary hover:text-white hover:bg-surfaceHighlight border-border/20">Clear Data</Button>
            </div>
            <div className="p-6 flex items-center justify-between bg-danger/5">
              <div>
                <h3 className="font-semibold text-danger">Factory Reset</h3>
                <p className="text-sm text-danger/70">Permanently delete everything and refresh app.</p>
              </div>
              <Button onClick={handleFactoryReset} variant="secondary" size="sm" className="text-danger border-danger/20 hover:bg-danger hover:text-white transition-colors">Factory Reset</Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
