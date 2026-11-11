/**
 * StorageService — Persistent key-value store
 *
 * Uses expo-secure-store on native and localStorage on web.
 * All profile settings, preferences, and avatar data are saved here.
 *
 * Keys are namespaced with 'ww_' prefix to avoid collisions.
 * Sensitive data (password, tokens) MUST NOT be stored here.
 *
 * Future Laravel integration: values loaded from API will be written
 * here as a client-side cache / offline fallback.
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const PREFIX = 'ww_';

function key(name: string): string {
  return `${PREFIX}${name}`;
}

async function set(name: string, value: string): Promise<void> {
  const k = key(name);
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(k, value);
    }
  } else {
    await SecureStore.setItemAsync(k, value);
  }
}

async function get(name: string): Promise<string | null> {
  const k = key(name);
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(k);
    }
    return null;
  }
  return await SecureStore.getItemAsync(k);
}

async function remove(name: string): Promise<void> {
  const k = key(name);
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(k);
    }
  } else {
    await SecureStore.deleteItemAsync(k);
  }
}

async function setJSON<T>(name: string, value: T): Promise<void> {
  await set(name, JSON.stringify(value));
}

async function getJSON<T>(name: string): Promise<T | null> {
  const raw = await get(name);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export const StorageService = {
  set,
  get,
  remove,
  setJSON,
  getJSON,
};

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  PROFILE: 'profile_v1',
  PREFERENCES: 'preferences_v1',
  NOTIFICATIONS: 'notifications_v1',
  PRIVACY: 'privacy_v1',
  APPEARANCE: 'appearance_v1',
  AVATAR_URI: 'avatar_uri_v1',
} as const;
