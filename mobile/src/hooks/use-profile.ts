import { useCallback, useEffect, useState } from 'react';

import { ProfileService } from '@/services/profile-service';
import {
  AccountPrivacySettings,
  AppearanceTheme,
  BibleStudyPreferences,
  NotificationPreferences,
  SpiritualJourneyStats,
  UserProfile,
} from '@/types/profile';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<SpiritualJourneyStats | null>(null);
  const [preferences, setPreferences] = useState<BibleStudyPreferences | null>(null);
  const [appearance, setAppearance] = useState<AppearanceTheme>('dark');
  const [notifications, setNotifications] = useState<NotificationPreferences | null>(null);
  const [privacy, setPrivacy] = useState<AccountPrivacySettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      const [p, s, pref, n, priv] = await Promise.all([
        ProfileService.getProfile(),
        ProfileService.getStats(),
        ProfileService.getPreferences(),
        ProfileService.getNotifications(),
        ProfileService.getPrivacy(),
      ]);
      setProfile(p);
      setStats(s);
      setPreferences(pref);
      setAppearance(ProfileService.getAppearance());
      setNotifications(n);
      setPrivacy(priv);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = ProfileService.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, [loadData]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    return await ProfileService.updateProfile(updates);
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<BibleStudyPreferences>) => {
    return await ProfileService.updatePreferences(updates);
  }, []);

  const updateAppearance = useCallback(async (theme: AppearanceTheme) => {
    return await ProfileService.updateAppearance(theme);
  }, []);

  const updateNotifications = useCallback(
    async (updates: Partial<NotificationPreferences>) => {
      return await ProfileService.updateNotifications(updates);
    },
    []
  );

  const updatePrivacy = useCallback(async (updates: Partial<AccountPrivacySettings>) => {
    return await ProfileService.updatePrivacy(updates);
  }, []);

  const refreshStats = useCallback(async () => {
    return await ProfileService.refreshStats();
  }, []);

  const changePassword = useCallback(async (currentPass: string, newPass: string) => {
    return await ProfileService.changePassword(currentPass, newPass);
  }, []);

  const updateEmail = useCallback(async (newEmail: string) => {
    return await ProfileService.updateEmail(newEmail);
  }, []);

  const signOut = useCallback(async () => {
    return await ProfileService.signOut();
  }, []);

  const deleteAccount = useCallback(async () => {
    return await ProfileService.deleteAccount();
  }, []);

  return {
    profile,
    stats,
    preferences,
    appearance,
    notifications,
    privacy,
    loading,
    refreshStats,
    updateProfile,
    updatePreferences,
    updateAppearance,
    updateNotifications,
    updatePrivacy,
    changePassword,
    updateEmail,
    signOut,
    deleteAccount,
  };
}
