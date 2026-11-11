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
import {
  InfoContentModal,
  InfoModalType,
} from '@/components/profile/InfoContentModal';
import { SupportInfoSection } from '@/components/profile/SupportInfoSection';
import { NotificationSection } from '@/components/profile/NotificationSection';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SpiritualJourneyCards } from '@/components/profile/SpiritualJourneyCards';
import { StudyPreferencesSection } from '@/components/profile/StudyPreferencesSection';
import { useProfile } from '@/hooks/use-profile';
import {
  AppearanceTheme,
  BibleStudyPreferences,
  NotificationPreferences,
  UserProfile,
} from '@/types/profile';

const COLORS = {
  background: '#10131D',
  card: '#191E2B',
  gold: '#D8B56D',
  goldDark: '#A88B50',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
};

export default function ProfileScreen() {
  const {
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
  } = useProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Visibility States
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [manageEmailOpen, setManageEmailOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshStats();
    setRefreshing(false);
    showToast('Spiritual journey synced');
  };

  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    await updateProfile(updates);
    showToast('Profile updated successfully');
  };

  const handleUpdatePreferences = async (
    updates: Partial<BibleStudyPreferences>
  ) => {
    await updatePreferences(updates);
    showToast('Preferences updated');
  };

  const handleUpdateAppearance = async (theme: AppearanceTheme) => {
    await updateAppearance(theme);
    showToast(`Theme switched to ${theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System Default'}`);
  };

  const handleUpdateNotifications = async (
    updates: Partial<NotificationPreferences>
  ) => {
    await updateNotifications(updates);
    showToast('Notification settings saved');
  };

  const handleUpgradePress = () => {
    Alert.alert(
      'Word & Wisdom Premium',
      'Unlock unlimited reading plans, multi-translation parallel study, audio Bible narration, and cloud sync across all your devices.\n\nWould you like to activate Premium now?',
      [
        { text: 'Maybe Later', style: 'cancel' },
        {
          text: 'Activate Premium ✦',
          onPress: async () => {
            await updateProfile({ membershipStatus: 'premium' });
            showToast('Welcome to Word & Wisdom Premium! ✦');
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    await signOut();
    Alert.alert(
      'Signed Out',
      'You have been safely signed out. May the peace of God be with you.'
    );
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    Alert.alert(
      'Account Deleted',
      'Your account and personal study records have been deleted.'
    );
  };

  if (loading || !profile || !stats || !preferences || !notifications || !privacy) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.gold} />
          <Text style={styles.loadingText}>Loading your study sanctuary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Screen Header Bar */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.brandTitle}>✦ WORD & WISDOM</Text>
          <Text style={styles.screenTitle}>Profile & Settings</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          activeOpacity={0.7}
          accessibilityLabel="Sync profile"
        >
          <Ionicons name="sync-outline" size={18} color={COLORS.gold} />
        </TouchableOpacity>
      </View>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <View style={styles.toastBanner}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.gold} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.gold}
            colors={[COLORS.gold]}
          />
        }
      >
        {/* SECTION A: Profile Header */}
        <ProfileHeader
          profile={profile}
          onEditPress={() => setEditProfileOpen(true)}
          onUpgradePress={handleUpgradePress}
        />

        {/* SECTION B: Spiritual Journey Overview */}
        <SpiritualJourneyCards stats={stats} />

        {/* SECTION C: Bible Study Preferences */}
        <StudyPreferencesSection
          preferences={preferences}
          onUpdate={handleUpdatePreferences}
        />

        {/* SECTION D: Appearance Settings */}
        <AppearanceSection
          currentTheme={appearance}
          onThemeSelect={handleUpdateAppearance}
        />

        {/* SECTION E: Notifications */}
        <NotificationSection
          notifications={notifications}
          onUpdate={handleUpdateNotifications}
        />

        {/* SECTION F: Account & Security */}
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

        {/* SECTION G: Support & Information */}
        <SupportInfoSection
          onOpenHelp={() => setInfoModalType('help')}
          onOpenFeedback={() => setFeedbackOpen(true)}
          onOpenPrivacy={() => setInfoModalType('privacy')}
          onOpenTerms={() => setInfoModalType('terms')}
          onOpenAbout={() => setInfoModalType('about')}
        />
      </ScrollView>

      {/* MODALS */}
      <EditProfileModal
        visible={editProfileOpen}
        profile={profile}
        onClose={() => setEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      <ChangePasswordModal
        visible={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={async (currentPass, newPass) => {
          await changePassword(currentPass, newPass);
        }}
      />

      <EmailModal
        visible={manageEmailOpen}
        currentEmail={profile.email}
        onClose={() => setManageEmailOpen(false)}
        onSubmit={async (newEmail) => {
          await updateEmail(newEmail);
          showToast('Email address updated');
        }}
      />

      <FeedbackModal
        visible={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

      <InfoContentModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 1.2,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216, 181, 109, 0.16)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(216, 181, 109, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gold,
  },
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
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
