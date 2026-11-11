/**
 * Global Theme Context
 *
 * Provides application-wide Dark / Light / System theme selection
 * with SecureStore persistence. Any screen can call useAppTheme()
 * to get the current resolved colors and toggle the preference.
 *
 * Future Laravel integration: sync theme preference via
 *   PATCH /api/v1/user/preferences { appearance: 'dark'|'light'|'system' }
 */

import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform, useColorScheme } from 'react-native';

import { AppearanceTheme } from '@/types/profile';

// ─── Color Palettes ───────────────────────────────────────────────────────────

export interface AppPalette {
  background: string;
  card: string;
  cardSecondary: string;
  gold: string;
  goldDark: string;
  goldMuted: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderMuted: string;
  danger: string;
  dangerMuted: string;
  success: string;
  orange: string;
  blue: string;
  purple: string;
  statusBar: 'light-content' | 'dark-content';
}

export const DarkPalette: AppPalette = {
  background: '#10131D',
  card: '#191E2B',
  cardSecondary: '#202637',
  gold: '#D8B56D',
  goldDark: '#A88B50',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  textMuted: '#656A7A',
  border: '#2A3040',
  borderMuted: 'rgba(255, 255, 255, 0.04)',
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.12)',
  success: '#8BB89B',
  orange: '#F59E0B',
  blue: '#60A5FA',
  purple: '#C084FC',
  statusBar: 'light-content',
};

export const LightPalette: AppPalette = {
  background: '#F7F7FA',
  card: '#FFFFFF',
  cardSecondary: '#F0F1F7',
  gold: '#9A7130',
  goldDark: '#7A5920',
  goldMuted: 'rgba(154, 113, 48, 0.12)',
  textPrimary: '#202333',
  textSecondary: '#73798A',
  textMuted: '#A0A5B4',
  border: '#E7E8EE',
  borderMuted: 'rgba(0, 0, 0, 0.05)',
  danger: '#DC2626',
  dangerMuted: 'rgba(220, 38, 38, 0.1)',
  success: '#16A34A',
  orange: '#D97706',
  blue: '#2563EB',
  purple: '#9333EA',
  statusBar: 'dark-content',
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  /** The user-selected preference ('dark' | 'light' | 'system') */
  themePreference: AppearanceTheme;
  /** The resolved color palette (never 'system') */
  colors: AppPalette;
  /** Whether the resolved theme is dark */
  isDark: boolean;
  /** Change the app-wide theme and persist it */
  setTheme: (theme: AppearanceTheme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  themePreference: 'dark',
  colors: DarkPalette,
  isDark: true,
  setTheme: async () => {},
});

const STORAGE_KEY = 'ww_appearance_v1';

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme(); // 'dark' | 'light' | null
  const [preference, setPreference] = useState<AppearanceTheme>('dark');
  const [hydrated, setHydrated] = useState(false);

  // Load persisted preference on mount
  useEffect(() => {
    (async () => {
      try {
        let saved: string | null = null;
        if (Platform.OS === 'web') {
          saved = typeof window !== 'undefined'
            ? window.localStorage.getItem(STORAGE_KEY)
            : null;
        } else {
          saved = await SecureStore.getItemAsync(STORAGE_KEY);
        }
        if (saved === 'dark' || saved === 'light' || saved === 'system') {
          setPreference(saved);
        }
      } catch {
        // If SecureStore fails, fall back to default 'dark'
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const setTheme = useCallback(async (theme: AppearanceTheme) => {
    setPreference(theme);
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, theme);
        }
      } else {
        await SecureStore.setItemAsync(STORAGE_KEY, theme);
      }
    } catch {
      // Non-critical — the in-memory change already applied
    }
  }, []);

  const resolvedScheme = useMemo<'dark' | 'light'>(() => {
    if (preference === 'system') {
      return systemScheme === 'light' ? 'light' : 'dark';
    }
    return preference;
  }, [preference, systemScheme]);

  const colors = resolvedScheme === 'light' ? LightPalette : DarkPalette;
  const isDark = resolvedScheme === 'dark';

  const value = useMemo<ThemeContextValue>(
    () => ({ themePreference: preference, colors, isDark, setTheme }),
    [preference, colors, isDark, setTheme]
  );

  // Don't render until we've read storage, to avoid flash
  if (!hydrated) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAppTheme() {
  return useContext(ThemeContext);
}
