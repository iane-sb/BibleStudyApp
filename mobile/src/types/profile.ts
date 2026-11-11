import { TranslationCode } from '@/types/bible';

export type MembershipTier = 'free' | 'premium';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarPreset?: string;
  membershipStatus: MembershipTier;
  memberSince: string;
  favoriteVerse?: string;
  bio?: string;
}

export interface SpiritualJourneyStats {
  chaptersRead: number;
  readingPlansCompleted: number;
  currentStreakDays: number;
  totalBookmarkedVerses: number;
  totalJournalEntries: number;
}

export type VerseDisplayMode = 'verse-by-verse' | 'paragraph';

export interface BibleStudyPreferences {
  preferredTranslation: TranslationCode;
  fontSize: number; // e.g., 16, 18, 20, 22, 24
  verseDisplayMode: VerseDisplayMode;
  showVerseNumbers: boolean;
  redLetterChrist: boolean;
  dailyReminderEnabled: boolean;
  preferredReadingTime: string; // e.g., "07:00 AM"
}

export type AppearanceTheme = 'dark' | 'light' | 'system';

export interface NotificationPreferences {
  dailyVerse: boolean;
  readingReminders: boolean;
  readingPlanReminders: boolean;
  prayerAndJournalReminders: boolean;
}

export interface AccountPrivacySettings {
  isProfilePublic: boolean;
  shareReadingStats: boolean;
  showStreakPublicly: boolean;
}

export interface AvatarPreset {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}
