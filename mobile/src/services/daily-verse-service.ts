/**
 * DailyVerseService — Automatic 6:00 AM Daily Verse Rotation Engine
 *
 * Responsibilities:
 *  1. Determines the 6:00 AM cycle boundary for local device time.
 *  2. Randomly selects an encouraging verse from the curated catalog.
 *  3. Prevents consecutive repeats using local history tracking.
 *  4. Persists the selected verse and cycle date locally via StorageService.
 *  5. Automatically rotates when:
 *     - The app is open as the clock strikes 6:00 AM (via timer).
 *     - The app returns to the foreground after 6:00 AM (via AppState).
 *     - The app launches after 6:00 AM (via initialize).
 *  6. Manages persistent verse bookmarking.
 *  7. Provides a simulation helper for development testing.
 */

import { AppState, AppStateStatus } from 'react-native';

import {
  CURATED_DAILY_VERSES,
  CuratedVerseRef,
} from '@/data/daily-verse-catalog';
import { BibleService } from '@/services/bible-service';
import { ProfileService } from '@/services/profile-service';
import { STORAGE_KEYS, StorageService } from '@/services/storage-service';
import {
  BookmarkedVerseItem,
  DailyVerse,
  DailyVerseRecord,
} from '@/types/daily-verse';

// Maximum number of recently used verses to exclude to avoid repetition
const MAX_RECENT_HISTORY = 14;

type Listener = () => void;

/**
 * Returns the 6:00 AM cycle key for a given date.
 * If time is before 06:00:00 AM local time, it belongs to yesterday's 6:00 AM cycle.
 * Otherwise, it belongs to today's 6:00 AM cycle.
 * Format: "YYYY-MM-DD"
 */
export function getDailyVerseCycleKey(date: Date = new Date()): string {
  const d = new Date(date);
  if (d.getHours() < 6) {
    d.setDate(d.getDate() - 1);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates milliseconds from current time until the next 6:00:00 AM local time.
 */
export function getMsUntilNext6AM(date: Date = new Date()): number {
  const next6AM = new Date(date);
  if (next6AM.getHours() >= 6) {
    next6AM.setDate(next6AM.getDate() + 1);
  }
  next6AM.setHours(6, 0, 0, 0);
  return Math.max(1000, next6AM.getTime() - date.getTime());
}

class DailyVerseManager {
  private currentVerse: DailyVerse | null = null;
  private currentRecord: DailyVerseRecord | null = null;
  private isBookmarkedState: boolean = false;
  private listeners: Set<Listener> = new Set();
  private initialized: boolean = false;
  private timerId: any = null;
  private appStateSubscription: any = null;

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.warn('DailyVerseService listener error:', err);
      }
    });
  }

  // ─── Verse Resolution ───────────────────────────────────────────────────────

  /**
   * Resolves the full Scripture text for a curated verse from the local Bible database.
   */
  public resolveVerse(ref: CuratedVerseRef, translation = 'KJV'): DailyVerse {
    let verseText = '';

    try {
      const chapterData = BibleService.getChapterVerses(
        translation as any,
        ref.bookCode,
        ref.chapter
      );

      if (chapterData && chapterData.verses && chapterData.verses.length > 0) {
        if (ref.endVerse && ref.endVerse > ref.startVerse) {
          const parts = chapterData.verses
            .filter((v) => v.v >= ref.startVerse && v.v <= ref.endVerse)
            .map((v) => v.t);
          if (parts.length > 0) {
            verseText = parts.join(' ');
          }
        } else {
          const match = chapterData.verses.find((v) => v.v === ref.startVerse);
          if (match) {
            verseText = match.t;
          }
        }
      }
    } catch (err) {
      console.warn(`Failed to resolve verse text for ${ref.reference}:`, err);
    }

    if (!verseText) {
      // Safe fallback if offline data is still loading
      verseText = 'I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit.';
    }

    const verseNum = ref.endVerse
      ? `${ref.startVerse}-${ref.endVerse}`
      : ref.startVerse;

    return {
      id: ref.id,
      bookCode: ref.bookCode,
      bookName: ref.bookName,
      chapter: ref.chapter,
      verse: verseNum,
      reference: ref.reference,
      text: verseText,
      translation,
      theme: ref.theme,
      themeLabel: ref.themeLabel,
    };
  }

  // ─── Random Selection Algorithm ─────────────────────────────────────────────

  /**
   * Selects an eligible verse from the curated catalog, excluding recent verses
   * to ensure zero repeats on consecutive days.
   */
  private pickRandomVerse(
    excludeId?: string,
    recentHistory: string[] = []
  ): CuratedVerseRef {
    const total = CURATED_DAILY_VERSES.length;
    if (total === 0) {
      throw new Error('Curated daily verse catalog is empty.');
    }

    // Try excluding all recent history
    const exclusionSet = new Set<string>(recentHistory);
    if (excludeId) exclusionSet.add(excludeId);

    let candidates = CURATED_DAILY_VERSES.filter((v) => !exclusionSet.has(v.id));

    // Fallback: If history exhausted almost all candidates, at least exclude yesterday's verse
    if (candidates.length === 0) {
      candidates = CURATED_DAILY_VERSES.filter((v) => v.id !== excludeId);
    }

    if (candidates.length === 0) {
      candidates = CURATED_DAILY_VERSES;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  // ─── 6:00 AM Cycle Verification & Rotation ──────────────────────────────────

  /**
   * Checks whether the current active cycle has changed since the last saved record.
   * If changed or absent, selects a new verse, saves locally, and notifies subscribers.
   */
  public async checkAndRotateIfNeeded(): Promise<DailyVerse> {
    const currentCycleKey = getDailyVerseCycleKey();

    // 1. If we already have the verse loaded in memory for this cycle, return it
    if (
      this.currentRecord &&
      this.currentRecord.cycleDate === currentCycleKey &&
      this.currentVerse
    ) {
      return this.currentVerse;
    }

    // 2. Check local persistence
    const savedRecord = await StorageService.getJSON<DailyVerseRecord>(
      STORAGE_KEYS.DAILY_VERSE
    );

    if (savedRecord && savedRecord.cycleDate === currentCycleKey) {
      const ref = CURATED_DAILY_VERSES.find((v) => v.id === savedRecord.verseId);
      if (ref) {
        this.currentRecord = savedRecord;
        this.currentVerse = this.resolveVerse(ref);
        this.isBookmarkedState = await this.isVerseBookmarked(ref.id);
        this.scheduleNext6AMCheck();
        this.notify();
        return this.currentVerse;
      }
    }

    // 3. Time for a new daily verse!
    const recentHistory =
      (await StorageService.getJSON<string[]>(
        STORAGE_KEYS.DAILY_VERSE_HISTORY
      )) || [];

    const previousId = savedRecord ? savedRecord.verseId : undefined;
    const nextRef = this.pickRandomVerse(previousId, recentHistory);

    const newRecord: DailyVerseRecord = {
      verseId: nextRef.id,
      cycleDate: currentCycleKey,
      selectedAt: new Date().toISOString(),
      previousVerseId: previousId,
    };

    // Update recent history
    const updatedHistory = [
      nextRef.id,
      ...recentHistory.filter((id) => id !== nextRef.id),
    ].slice(0, MAX_RECENT_HISTORY);

    await Promise.all([
      StorageService.setJSON(STORAGE_KEYS.DAILY_VERSE, newRecord),
      StorageService.setJSON(STORAGE_KEYS.DAILY_VERSE_HISTORY, updatedHistory),
    ]);

    this.currentRecord = newRecord;
    this.currentVerse = this.resolveVerse(nextRef);
    this.isBookmarkedState = await this.isVerseBookmarked(nextRef.id);
    this.scheduleNext6AMCheck();
    this.notify();

    return this.currentVerse;
  }

  // ─── Lifecycle & Timer Scheduling ──────────────────────────────────────────

  private scheduleNext6AMCheck() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    const msUntil6AM = getMsUntilNext6AM();

    // Max 32-bit signed int for setTimeout (~24.8 days)
    const delay = Math.min(msUntil6AM, 2147483647);

    this.timerId = setTimeout(async () => {
      try {
        await this.checkAndRotateIfNeeded();
      } catch (err) {
        console.warn('DailyVerseService timer rotation error:', err);
      }
    }, delay);
  }

  /**
   * Initializes the DailyVerseService. Should be called on app start.
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    // Listen to AppState (foreground / background)
    if (!this.appStateSubscription) {
      this.appStateSubscription = AppState.addEventListener(
        'change',
        async (nextAppState: AppStateStatus) => {
          if (nextAppState === 'active') {
            try {
              await this.checkAndRotateIfNeeded();
            } catch (err) {
              console.warn('DailyVerseService appState check error:', err);
            }
          }
        }
      );
    }

    await this.checkAndRotateIfNeeded();
  }

  // ─── Getters ───────────────────────────────────────────────────────────────

  public getVerse(): DailyVerse | null {
    return this.currentVerse;
  }

  public getRecord(): DailyVerseRecord | null {
    return this.currentRecord;
  }

  public getIsBookmarked(): boolean {
    return this.isBookmarkedState;
  }

  // ─── Bookmarks ─────────────────────────────────────────────────────────────

  public async getBookmarkedVerses(): Promise<BookmarkedVerseItem[]> {
    const list = await StorageService.getJSON<BookmarkedVerseItem[]>(
      STORAGE_KEYS.BOOKMARKED_VERSES
    );
    return list || [];
  }

  public async isVerseBookmarked(verseId: string): Promise<boolean> {
    const list = await this.getBookmarkedVerses();
    return list.some((item) => item.id === verseId || item.verse.id === verseId);
  }

  public async toggleBookmark(verse: DailyVerse): Promise<boolean> {
    const list = await this.getBookmarkedVerses();
    const existingIndex = list.findIndex(
      (item) => item.id === verse.id || item.verse.id === verse.id
    );

    let nextBookmarked = false;
    let updatedList: BookmarkedVerseItem[];

    if (existingIndex >= 0) {
      // Remove bookmark
      updatedList = list.filter((_, idx) => idx !== existingIndex);
      nextBookmarked = false;
    } else {
      // Add bookmark
      updatedList = [
        {
          id: verse.id,
          verse,
          bookmarkedAt: new Date().toISOString(),
        },
        ...list,
      ];
      nextBookmarked = true;
    }

    await StorageService.setJSON(STORAGE_KEYS.BOOKMARKED_VERSES, updatedList);

    // Sync total bookmarks with Profile stats
    try {
      const stats = await ProfileService.getStats();
      stats.totalBookmarkedVerses = updatedList.length;
      await StorageService.setJSON(STORAGE_KEYS.PROFILE, {
        ...(await ProfileService.getProfile()),
      });
    } catch {
      // ignore
    }

    if (this.currentVerse && this.currentVerse.id === verse.id) {
      this.isBookmarkedState = nextBookmarked;
    }

    this.notify();
    return nextBookmarked;
  }

  // ─── Development Simulator ──────────────────────────────────────────────────

  /**
   * Simulates the 6:00 AM rotation for development and testing.
   * Rotates to the next verse, updates cycle date, and triggers animated transition.
   */
  public async simulateRotateNext(): Promise<DailyVerse> {
    const currentId = this.currentVerse?.id;
    const recentHistory =
      (await StorageService.getJSON<string[]>(
        STORAGE_KEYS.DAILY_VERSE_HISTORY
      )) || [];

    const nextRef = this.pickRandomVerse(currentId, recentHistory);
    const simulatedCycleKey = `sim_${Date.now()}`;

    const newRecord: DailyVerseRecord = {
      verseId: nextRef.id,
      cycleDate: simulatedCycleKey,
      selectedAt: new Date().toISOString(),
      previousVerseId: currentId,
    };

    const updatedHistory = [
      nextRef.id,
      ...recentHistory.filter((id) => id !== nextRef.id),
    ].slice(0, MAX_RECENT_HISTORY);

    await Promise.all([
      StorageService.setJSON(STORAGE_KEYS.DAILY_VERSE, newRecord),
      StorageService.setJSON(STORAGE_KEYS.DAILY_VERSE_HISTORY, updatedHistory),
    ]);

    this.currentRecord = newRecord;
    this.currentVerse = this.resolveVerse(nextRef);
    this.isBookmarkedState = await this.isVerseBookmarked(nextRef.id);
    this.notify();

    return this.currentVerse;
  }
}

export const DailyVerseService = new DailyVerseManager();
