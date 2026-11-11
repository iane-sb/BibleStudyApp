import {
  AccountPrivacySettings,
  AppearanceTheme,
  AvatarPreset,
  BibleStudyPreferences,
  NotificationPreferences,
  SpiritualJourneyStats,
  UserProfile,
} from '@/types/profile';

// ============================================================================
// MOCK DATA (Clearly isolated for offline testing / Expo Go preview)
// In production, these calls will connect to the Laravel REST / Sanctum API.
// ============================================================================

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
    name: 'God’s Love',
    icon: 'heart-outline',
    bgColor: '#2B1C22',
    iconColor: '#E58A98',
  },
];

const INITIAL_PROFILE: UserProfile = {
  id: 'usr_78942',
  name: 'Benito Ramos',
  email: 'benito.ramos@example.com',
  membershipStatus: 'premium',
  memberSince: 'January 2025',
  favoriteVerse: 'Philippians 4:13',
  bio: 'Walking in faith, growing in grace through daily Scripture study.',
  avatarPreset: 'cross',
};

const INITIAL_STATS: SpiritualJourneyStats = {
  chaptersRead: 142,
  readingPlansCompleted: 4,
  currentStreakDays: 17,
  totalBookmarkedVerses: 58,
  totalJournalEntries: 23,
};

const INITIAL_PREFERENCES: BibleStudyPreferences = {
  preferredTranslation: 'KJV',
  fontSize: 18,
  verseDisplayMode: 'verse-by-verse',
  showVerseNumbers: true,
  redLetterChrist: true,
  dailyReminderEnabled: true,
  preferredReadingTime: '07:00 AM',
};

const INITIAL_NOTIFICATIONS: NotificationPreferences = {
  dailyVerse: true,
  readingReminders: true,
  readingPlanReminders: true,
  prayerAndJournalReminders: false,
};

const INITIAL_PRIVACY: AccountPrivacySettings = {
  isProfilePublic: false,
  shareReadingStats: true,
  showStreakPublicly: true,
};

// ============================================================================
// SERVICE STORE & OBSERVER SYSTEM
// ============================================================================

type Listener = () => void;

class ProfileServiceManager {
  private profile: UserProfile = { ...INITIAL_PROFILE };
  private stats: SpiritualJourneyStats = { ...INITIAL_STATS };
  private preferences: BibleStudyPreferences = { ...INITIAL_PREFERENCES };
  private appearance: AppearanceTheme = 'dark';
  private notifications: NotificationPreferences = { ...INITIAL_NOTIFICATIONS };
  private privacy: AccountPrivacySettings = { ...INITIAL_PRIVACY };
  private listeners: Set<Listener> = new Set();

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in profile service listener:', err);
      }
    });
  }

  // --- Profile Methods ---
  public async getProfile(): Promise<UserProfile> {
    // Laravel API counterpart: GET /api/v1/user/profile
    return { ...this.profile };
  }

  public async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    // Laravel API counterpart: PUT /api/v1/user/profile
    await new Promise((res) => setTimeout(res, 300));
    this.profile = { ...this.profile, ...updates };
    this.notify();
    return { ...this.profile };
  }

  // --- Stats Methods ---
  public async getStats(): Promise<SpiritualJourneyStats> {
    // Laravel API counterpart: GET /api/v1/user/spiritual-stats
    return { ...this.stats };
  }

  public async refreshStats(): Promise<SpiritualJourneyStats> {
    // Simulates syncing stats from the server
    await new Promise((res) => setTimeout(res, 400));
    this.notify();
    return { ...this.stats };
  }

  // --- Preferences Methods ---
  public async getPreferences(): Promise<BibleStudyPreferences> {
    // Laravel API counterpart: GET /api/v1/user/preferences
    return { ...this.preferences };
  }

  public async updatePreferences(
    updates: Partial<BibleStudyPreferences>
  ): Promise<BibleStudyPreferences> {
    // Laravel API counterpart: PATCH /api/v1/user/preferences
    this.preferences = { ...this.preferences, ...updates };
    this.notify();
    return { ...this.preferences };
  }

  // --- Appearance Methods ---
  public getAppearance(): AppearanceTheme {
    return this.appearance;
  }

  public async updateAppearance(theme: AppearanceTheme): Promise<AppearanceTheme> {
    this.appearance = theme;
    this.notify();
    return this.appearance;
  }

  // --- Notification Methods ---
  public async getNotifications(): Promise<NotificationPreferences> {
    // Laravel API counterpart: GET /api/v1/user/notifications/settings
    return { ...this.notifications };
  }

  public async updateNotifications(
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    // Laravel API counterpart: PUT /api/v1/user/notifications/settings
    this.notifications = { ...this.notifications, ...updates };
    this.notify();
    return { ...this.notifications };
  }

  // --- Privacy Methods ---
  public async getPrivacy(): Promise<AccountPrivacySettings> {
    return { ...this.privacy };
  }

  public async updatePrivacy(
    updates: Partial<AccountPrivacySettings>
  ): Promise<AccountPrivacySettings> {
    this.privacy = { ...this.privacy, ...updates };
    this.notify();
    return { ...this.privacy };
  }

  // --- Security & Account Management ---
  public async changePassword(currentPass: string, newPass: string): Promise<boolean> {
    // Laravel API counterpart: POST /api/v1/user/change-password
    await new Promise((res) => setTimeout(res, 500));
    if (!currentPass || !newPass) {
      throw new Error('Please enter both your current and new password.');
    }
    if (newPass.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }
    return true;
  }

  public async updateEmail(newEmail: string): Promise<boolean> {
    // Laravel API counterpart: POST /api/v1/user/update-email
    await new Promise((res) => setTimeout(res, 400));
    if (!newEmail || !newEmail.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    this.profile.email = newEmail.trim();
    this.notify();
    return true;
  }

  public async signOut(): Promise<boolean> {
    // Laravel API counterpart: POST /api/v1/auth/logout
    await new Promise((res) => setTimeout(res, 300));
    return true;
  }

  public async deleteAccount(): Promise<boolean> {
    // Laravel API counterpart: DELETE /api/v1/user/account
    await new Promise((res) => setTimeout(res, 600));
    this.profile = { ...INITIAL_PROFILE };
    this.stats = { ...INITIAL_STATS };
    this.notify();
    return true;
  }
}

export const ProfileService = new ProfileServiceManager();
