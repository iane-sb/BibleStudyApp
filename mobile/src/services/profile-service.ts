/**
 * ProfileService — Persistent Profile & Settings State Manager
 *
 * All data is persisted to SecureStore / localStorage via StorageService.
 * Settings survive app restarts.
 *
 * API Integration Roadmap (future Laravel Sanctum):
 *   GET  /api/v1/user/profile           → getProfile()
 *   PUT  /api/v1/user/profile           → updateProfile()
 *   GET  /api/v1/user/preferences       → getPreferences()
 *   PATCH /api/v1/user/preferences      → updatePreferences()
 *   GET  /api/v1/user/notifications     → getNotifications()
 *   PUT  /api/v1/user/notifications     → updateNotifications()
 *   POST /api/v1/user/change-password   → changePassword()
 *   POST /api/v1/user/update-email      → updateEmail()
 *   POST /api/v1/auth/logout            → signOut()
 *   DELETE /api/v1/user/account         → deleteAccount()
 */

import {
  AccountPrivacySettings,
  AvatarPreset,
  BibleStudyPreferences,
  NotificationPreferences,
  SpiritualJourneyStats,
  UserProfile,
} from '@/types/profile';

import { STORAGE_KEYS, StorageService } from './storage-service';

// ─── Avatar Presets (static, no API needed) ───────────────────────────────────

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'cross',
    name: 'Cross of Grace',
    icon: 'add-outline',
    bgColor: '#2D2418',
    iconColor: '#D8B56D',
  },
  {
    id: 'book',
    name: 'Open Word',
    icon: 'book-outline',
    bgColor: '#182436',
    iconColor: '#8BB4E8',
  },
  {
    id: 'flame',
    name: 'Spiritual Fire',
    icon: 'flame-outline',
    bgColor: '#2E1E17',
    iconColor: '#EFA062',
  },
  {
    id: 'shield',
    name: 'Shield of Faith',
    icon: 'shield-checkmark-outline',
    bgColor: '#192C23',
    iconColor: '#8BB89B',
  },
  {
    id: 'star',
    name: 'Morning Star',
    icon: 'star-outline',
    bgColor: '#2D2819',
    iconColor: '#ECCF7C',
  },
  {
    id: 'heart',
    name: "God's Love",
    icon: 'heart-outline',
    bgColor: '#2B1C22',
    iconColor: '#E58A98',
  },
];

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_local',
  name: 'Your Name',
  email: 'your.email@example.com',
  membershipStatus: 'free',
  memberSince: 'November 2026',
  favoriteVerse: '',
  bio: '',
  avatarPreset: 'cross',
  avatarUrl: undefined,
};

const DEFAULT_STATS: SpiritualJourneyStats = {
  chaptersRead: 0,
  readingPlansCompleted: 0,
  currentStreakDays: 0,
  totalBookmarkedVerses: 0,
  totalJournalEntries: 0,
};

const DEFAULT_PREFERENCES: BibleStudyPreferences = {
  preferredTranslation: 'KJV',
  fontSize: 18,
  verseDisplayMode: 'verse-by-verse',
  showVerseNumbers: true,
  redLetterChrist: true,
  dailyReminderEnabled: false,
  preferredReadingTime: '07:00 AM',
};

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  dailyVerse: false,
  readingReminders: false,
  readingPlanReminders: false,
  prayerAndJournalReminders: false,
};

const DEFAULT_PRIVACY: AccountPrivacySettings = {
  isProfilePublic: false,
  shareReadingStats: false,
  showStreakPublicly: false,
};

// ─── Observable Store ─────────────────────────────────────────────────────────

type Listener = () => void;

class ProfileServiceManager {
  private profile: UserProfile = { ...DEFAULT_PROFILE };
  private stats: SpiritualJourneyStats = { ...DEFAULT_STATS };
  private preferences: BibleStudyPreferences = { ...DEFAULT_PREFERENCES };
  private notifications: NotificationPreferences = { ...DEFAULT_NOTIFICATIONS };
  private privacy: AccountPrivacySettings = { ...DEFAULT_PRIVACY };
  private listeners: Set<Listener> = new Set();
  private initialized = false;

  /** Subscribe to any state change. Returns unsubscribe function. */
  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try { l(); } catch (e) { console.warn('ProfileService listener error:', e); }
    });
  }

  // ─── Initialization ───────────────────────────────────────────────────────

  /** Load all persisted data. Called once on app start. */
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    try {
      const [savedProfile, savedPrefs, savedNotifs, savedPrivacy] = await Promise.all([
        StorageService.getJSON<UserProfile>(STORAGE_KEYS.PROFILE),
        StorageService.getJSON<BibleStudyPreferences>(STORAGE_KEYS.PREFERENCES),
        StorageService.getJSON<NotificationPreferences>(STORAGE_KEYS.NOTIFICATIONS),
        StorageService.getJSON<AccountPrivacySettings>(STORAGE_KEYS.PRIVACY),
      ]);

      if (savedProfile) this.profile = { ...DEFAULT_PROFILE, ...savedProfile };
      if (savedPrefs) this.preferences = { ...DEFAULT_PREFERENCES, ...savedPrefs };
      if (savedNotifs) this.notifications = { ...DEFAULT_NOTIFICATIONS, ...savedNotifs };
      if (savedPrivacy) this.privacy = { ...DEFAULT_PRIVACY, ...savedPrivacy };
    } catch (err) {
      console.warn('ProfileService: failed to load persisted data', err);
    } finally {
      this.initialized = true;
    }
  }

  // ─── Profile ──────────────────────────────────────────────────────────────

  public async getProfile(): Promise<UserProfile> {
    return { ...this.profile };
  }

  public async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    this.profile = { ...this.profile, ...updates };
    await StorageService.setJSON(STORAGE_KEYS.PROFILE, this.profile);
    this.notify();
    return { ...this.profile };
  }

  public async updateAvatarUri(localUri: string | undefined): Promise<void> {
    this.profile = { ...this.profile, avatarUrl: localUri, avatarPreset: undefined };
    await StorageService.setJSON(STORAGE_KEYS.PROFILE, this.profile);
    this.notify();
  }

  // ─── Stats (read-only until API; local mock only) ─────────────────────────

  public async getStats(): Promise<SpiritualJourneyStats> {
    return { ...this.stats };
  }

  public async refreshStats(): Promise<SpiritualJourneyStats> {
    // Future: GET /api/v1/user/spiritual-stats
    await new Promise((r) => setTimeout(r, 400));
    this.notify();
    return { ...this.stats };
  }

  // ─── Preferences ──────────────────────────────────────────────────────────

  public async getPreferences(): Promise<BibleStudyPreferences> {
    return { ...this.preferences };
  }

  public async updatePreferences(
    updates: Partial<BibleStudyPreferences>
  ): Promise<BibleStudyPreferences> {
    this.preferences = { ...this.preferences, ...updates };
    await StorageService.setJSON(STORAGE_KEYS.PREFERENCES, this.preferences);
    this.notify();
    return { ...this.preferences };
  }

  // ─── Notifications ────────────────────────────────────────────────────────

  public async getNotifications(): Promise<NotificationPreferences> {
    return { ...this.notifications };
  }

  public async updateNotifications(
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    this.notifications = { ...this.notifications, ...updates };
    await StorageService.setJSON(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
    return { ...this.notifications };
  }

  // ─── Privacy ──────────────────────────────────────────────────────────────

  public async getPrivacy(): Promise<AccountPrivacySettings> {
    return { ...this.privacy };
  }

  public async updatePrivacy(
    updates: Partial<AccountPrivacySettings>
  ): Promise<AccountPrivacySettings> {
    this.privacy = { ...this.privacy, ...updates };
    await StorageService.setJSON(STORAGE_KEYS.PRIVACY, this.privacy);
    this.notify();
    return { ...this.privacy };
  }

  // ─── Security ─────────────────────────────────────────────────────────────

  public async changePassword(currentPass: string, newPass: string): Promise<void> {
    // Future: POST /api/v1/user/change-password
    await new Promise((r) => setTimeout(r, 600));
    if (!currentPass) throw new Error('Current password is required.');
    if (newPass.length < 8) throw new Error('New password must be at least 8 characters.');
    // Password validation only — not stored locally (never store passwords)
  }

  public async updateEmail(newEmail: string): Promise<void> {
    // Future: POST /api/v1/user/update-email
    await new Promise((r) => setTimeout(r, 400));
    if (!newEmail || !newEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    this.profile = { ...this.profile, email: newEmail.trim() };
    await StorageService.setJSON(STORAGE_KEYS.PROFILE, this.profile);
    this.notify();
  }

  // ─── Session ──────────────────────────────────────────────────────────────

  public async signOut(): Promise<void> {
    // Future: POST /api/v1/auth/logout + clear auth tokens
    await new Promise((r) => setTimeout(r, 300));
    // Currently no auth tokens to clear — navigate to login when auth is added
  }

  public async deleteAccount(): Promise<void> {
    // Future: DELETE /api/v1/user/account + clear all local data
    await new Promise((r) => setTimeout(r, 600));
    // Clear all stored data
    await Promise.all([
      StorageService.remove(STORAGE_KEYS.PROFILE),
      StorageService.remove(STORAGE_KEYS.PREFERENCES),
      StorageService.remove(STORAGE_KEYS.NOTIFICATIONS),
      StorageService.remove(STORAGE_KEYS.PRIVACY),
      StorageService.remove(STORAGE_KEYS.AVATAR_URI),
    ]);
    this.profile = { ...DEFAULT_PROFILE };
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.notifications = { ...DEFAULT_NOTIFICATIONS };
    this.privacy = { ...DEFAULT_PRIVACY };
    this.notify();
  }
}

export const ProfileService = new ProfileServiceManager();
