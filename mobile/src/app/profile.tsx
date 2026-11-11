import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountSecuritySection } from '@/components/profile/AccountSecuritySection';
import { AppearanceSection } from '@/components/profile/AppearanceSection';
import { ChangePasswordModal } from '@/components/profile/ChangePasswordModal';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { EmailModal } from '@/components/profile/EmailModal';
import { FeedbackModal } from '@/components/profile/FeedbackModal';
import { InfoContentModal, InfoModalType } from '@/components/profile/InfoContentModal';
import { NotificationSection } from '@/components/profile/NotificationSection';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SpiritualJourneyCards } from '@/components/profile/SpiritualJourneyCards';
import { StudyPreferencesSection } from '@/components/profile/StudyPreferencesSection';
import { SupportInfoSection } from '@/components/profile/SupportInfoSection';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useProfile } from '@/hooks/use-profile';
import {
  BibleStudyPreferences,
  NotificationPreferences,
  UserProfile,
} from '@/types/profile';

export default function ProfileScreen() {
  const { colors, isDark, themePreference, setTheme } = useAppTheme();

  const {
    profile,
    stats,
    preferences,
    notifications,
    privacy,
    loading,
    refreshStats,
    updateProfile,
    updateAvatarUri,
    updatePreferences,
    updateNotifications,
    updatePrivacy,
    changePassword,
    updateEmail,
    signOut,
    deleteAccount,
  } = useProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [manageEmailOpen, setManageEmailOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshStats();
    setRefreshing(false);
    showToast('Spiritual journey synced');
  };

  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    await updateProfile(updates);
    showToast('Profile updated ✓');
  };

  const handleAvatarChange = async (localUri: string) => {
    await updateAvatarUri(localUri);
    showToast('Profile photo updated ✓');
  };

  const handleUpdatePreferences = async (updates: Partial<BibleStudyPreferences>) => {
    await updatePreferences(updates);
    showToast('Preferences saved ✓');
  };

  const handleUpdateAppearance = async (theme: typeof themePreference) => {
    await setTheme(theme);
    showToast(
      `Theme: ${theme === 'dark' ? 'Dark Mode' : theme === 'light' ? 'Light Mode' : 'System Default'}`
    );
  };

  const handleUpdateNotifications = async (updates: Partial<NotificationPreferences>) => {
    await updateNotifications(updates);
    showToast('Notifications updated ✓');
  };

  const handleUpgradePress = () => {
    Alert.alert(
      'Word & Wisdom Premium',
      'Unlock unlimited reading plans, parallel translations, audio Bible, and cloud sync.\n\nActivate Premium now?',
      [
        { text: 'Maybe Later', style: 'cancel' },
        {
          text: 'Activate Premium ✦',
          onPress: async () => {
            await updateProfile({ membershipStatus: 'premium' });
            showToast('Welcome to Premium! ✦');
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    await signOut();
    Alert.alert('Signed Out', 'May the peace of God be with you.');
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    Alert.alert('Account Deleted', 'Your data has been erased.');
  };

  // Loading screen
  if (loading || !profile || !stats || !preferences || !notifications || !privacy) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.statusBar} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your study sanctuary...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={colors.statusBar} />

      {/* Header Bar */}
      <View
        style={[
          styles.headerBar,
          { borderBottomColor: colors.borderMuted },
        ]}
      >
        <View>
          <Text style={[styles.brandTitle, { color: colors.gold }]}>✦ WORD & WISDOM</Text>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>
            Profile & Settings
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.refreshBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={handleRefresh}
          activeOpacity={0.7}
          accessibilityLabel="Sync profile"
        >
          <Ionicons name="sync-outline" size={18} color={colors.gold} />
        </TouchableOpacity>
      </View>

      {/* Toast Banner */}
      {toastMsg && (
        <View
          style={[
            styles.toastBanner,
            {
              backgroundColor: `${colors.goldMuted}`,
              borderBottomColor: `${colors.gold}44`,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={15} color={colors.gold} />
          <Text style={[styles.toastText, { color: colors.gold }]}>{toastMsg}</Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.gold}
            colors={[colors.gold]}
          />
        }
      >
        {/* A: Profile Header */}
        <ProfileHeader
          profile={profile}
          onEditPress={() => setEditProfileOpen(true)}
          onUpgradePress={handleUpgradePress}
          onAvatarChange={handleAvatarChange}
        />

        {/* B: Spiritual Journey */}
        <SpiritualJourneyCards stats={stats} />

        {/* C: Bible Study Preferences */}
        <StudyPreferencesSection
          preferences={preferences}
          onUpdate={handleUpdatePreferences}
        />

        {/* D: Appearance */}
        <AppearanceSection
          currentTheme={themePreference}
          onThemeSelect={handleUpdateAppearance}
        />

        {/* E: Notifications */}
        <NotificationSection
          notifications={notifications}
          onUpdate={handleUpdateNotifications}
        />

        {/* F: Account & Security */}
        <AccountSecuritySection
          email={profile.email}
          privacy={privacy}
          onEditProfile={() => setEditProfileOpen(true)}
          onChangePassword={() => setChangePasswordOpen(true)}
          onManageEmail={() => setManageEmailOpen(true)}
          onUpdatePrivacy={updatePrivacy}
          onSignOut={handleSignOut}
          onDeleteAccount={handleDeleteAccount}
        />

        {/* G: Support & Info */}
        <SupportInfoSection
          onOpenHelp={() => setInfoModalType('help')}
          onOpenFeedback={() => setFeedbackOpen(true)}
          onOpenPrivacy={() => setInfoModalType('privacy')}
          onOpenTerms={() => setInfoModalType('terms')}
          onOpenAbout={() => setInfoModalType('about')}
        />
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={editProfileOpen}
        profile={profile}
        onClose={() => setEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      <ChangePasswordModal
        visible={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={async (cur, next) => {
          await changePassword(cur, next);
          showToast('Password updated ✓');
        }}
      />

      <EmailModal
        visible={manageEmailOpen}
        currentEmail={profile.email}
        onClose={() => setManageEmailOpen(false)}
        onSubmit={async (email) => {
          await updateEmail(email);
          showToast('Email updated ✓');
        }}
      />

      <FeedbackModal visible={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      <InfoContentModal type={infoModalType} onClose={() => setInfoModalType(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  brandTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  screenTitle: { fontSize: 22, fontWeight: '800', marginTop: 2, letterSpacing: 0.2 },
  refreshBtn: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 1,
  },
  toastText: { fontSize: 12, fontWeight: '600' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: { fontSize: 14, fontStyle: 'italic' },
});
