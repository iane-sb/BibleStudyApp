/**
 * useDailyVerse — React Hook for the 6:00 AM Daily Verse
 *
 * Provides:
 *  - verse: DailyVerse object with text, book, chapter, translation, theme
 *  - isBookmarked: boolean
 *  - loading: boolean
 *  - toggleBookmark: () => Promise<void>
 *  - refreshDailyVerse: () => Promise<void>
 *  - simulateNextVerse: () => Promise<void> (Dev only)
 *  - fadeAnim: Animated.Value for subtle fade transitions
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { DailyVerseService } from '@/services/daily-verse-service';
import { DailyVerse } from '@/types/daily-verse';

export function useDailyVerse() {
  const [verse, setVerse] = useState<DailyVerse | null>(
    DailyVerseService.getVerse()
  );
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    DailyVerseService.getIsBookmarked()
  );
  const [loading, setLoading] = useState<boolean>(!verse);

  // Animated value for subtle fade transition when the verse changes
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevVerseIdRef = useRef<string | null>(verse?.id ?? null);

  const triggerFadeTransition = useCallback(() => {
    // Subtle crossfade: fade down slightly then smoothly back up
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.15,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 340,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  const loadCurrentVerse = useCallback(async () => {
    try {
      const v = await DailyVerseService.checkAndRotateIfNeeded();
      const bookmarked = await DailyVerseService.isVerseBookmarked(v.id);

      // If verse ID changed while the component is mounted, animate transition
      if (prevVerseIdRef.current && prevVerseIdRef.current !== v.id) {
        triggerFadeTransition();
      }
      prevVerseIdRef.current = v.id;

      setVerse(v);
      setIsBookmarked(bookmarked);
    } catch (err) {
      console.warn('useDailyVerse load error:', err);
    } finally {
      setLoading(false);
    }
  }, [triggerFadeTransition]);

  useEffect(() => {
    // Initialize service on mount
    DailyVerseService.initialize().then(loadCurrentVerse).catch(console.warn);

    // Subscribe to rotation or bookmark changes
    const unsubscribe = DailyVerseService.subscribe(() => {
      const v = DailyVerseService.getVerse();
      const bookmarked = DailyVerseService.getIsBookmarked();

      if (v && prevVerseIdRef.current && prevVerseIdRef.current !== v.id) {
        triggerFadeTransition();
      }
      if (v) prevVerseIdRef.current = v.id;

      setVerse(v);
      setIsBookmarked(bookmarked);
      setLoading(false);
    });

    return unsubscribe;
  }, [loadCurrentVerse, triggerFadeTransition]);

  const toggleBookmark = useCallback(async () => {
    if (!verse) return;
    const nextState = await DailyVerseService.toggleBookmark(verse);
    setIsBookmarked(nextState);
  }, [verse]);

  const refreshDailyVerse = useCallback(async () => {
    setLoading(true);
    await DailyVerseService.checkAndRotateIfNeeded();
    setLoading(false);
  }, []);

  const simulateNextVerse = useCallback(async () => {
    triggerFadeTransition();
    await DailyVerseService.simulateRotateNext();
  }, [triggerFadeTransition]);

  return {
    verse,
    isBookmarked,
    loading,
    fadeAnim,
    toggleBookmark,
    refreshDailyVerse,
    simulateNextVerse,
  };
}
