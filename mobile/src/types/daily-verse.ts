/**
 * Daily Verse Types
 *
 * Defines the structure for the curated daily verses and the local
 * persistence record that manages the 6:00 AM rotation cycle.
 */

export type VerseTheme =
  | 'faith'
  | 'love'
  | 'hope'
  | 'strength'
  | 'wisdom'
  | 'peace'
  | 'prayer'
  | 'promises'
  | 'gratitude'
  | 'perseverance';

export interface DailyVerse {
  id: string;
  bookCode: string;
  bookName: string;
  chapter: number;
  verse: number | string;
  reference: string;
  text: string;
  translation: string;
  theme: VerseTheme;
  themeLabel: string;
}

export interface DailyVerseRecord {
  verseId: string;
  cycleDate: string; // "YYYY-MM-DD" representing the 6:00 AM cycle
  selectedAt: string; // ISO 8601 string
  previousVerseId?: string;
  isBookmarked?: boolean;
}

export interface BookmarkedVerseItem {
  id: string;
  verse: DailyVerse;
  bookmarkedAt: string; // ISO 8601 string
}
