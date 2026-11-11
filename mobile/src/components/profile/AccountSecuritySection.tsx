import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AccountPrivacySettings } from '@/types/profile';

const COLORS = {
  card: '#191E2B',
  cardLight: '#202637',
  gold: '#D8B56D',
  goldDark: '#A88B50',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.12)',
};

interface AccountSecuritySectionProps {
  email: string;
  privacy: AccountPrivacySettings;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onManageEmail: () => void;
  onUpdatePrivacy: (updates: Partial<AccountPrivacySettings>) => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export function AccountSecuritySection({
  email,
  privacy,
  onEditProfile,
  onChangePassword,
  onManageEmail,
  onUpdatePrivacy,
  onSignOut,
  onDeleteAccount,
}: AccountSecuritySectionProps) {
  const [privacyExpanded, setPrivacyExpanded] = useState<boolean>(false);

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your Word & Wisdom account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: onSignOut,
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your profile, reading history, journal entries, and study bookmarks. This action cannot be undone.\n\nAre you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: () => {
            // Second confirmation step for safety
            Alert.alert(
              'Final Confirmation',
              'Please confirm once more: All your Bible study history will be permanently erased.',
              [
                { text: 'Keep My Account', style: 'cancel' },
                {
                  text: 'Erase Everything',
                  style: 'destructive',
                  onPress: onDeleteAccount,
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>✦ SECURITY & CREDENTIALS</Text>
        <Text style={styles.sectionTitle}>Account & Security</Text>
      </View>

      <View style={styles.card}>
        {/* Edit Personal Info */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={onEditProfile}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="person-outline" size={18} color={COLORS.gold} />
          </View>
          <View style={styles.labelCol}>
            <Text style={styles.rowTitle}>Personal Information</Text>
            <Text style={styles.rowSubtitle}>Name, bio, and favorite verse</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Email Management */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={onManageEmail}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={18} color={COLORS.gold} />
          </View>
          <View style={styles.labelCol}>
            <Text style={styles.rowTitle}>Email Address</Text>
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {email}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Change Password */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={onChangePassword}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.gold} />
          </View>
          <View style={styles.labelCol}>
            <Text style={styles.rowTitle}>Change Password</Text>
            <Text style={styles.rowSubtitle}>Update your sign-in password</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Account Privacy Toggle / Expandable */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => setPrivacyExpanded((prev) => !prev)}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="shield-outline" size={18} color={COLORS.gold} />
          </View>
          <View style={styles.labelCol}>
            <Text style={styles.rowTitle}>Account Privacy</Text>
            <Text style={styles.rowSubtitle}>
              Manage public streak and study visibility
            </Text>
          </View>
          <Ionicons
            name={privacyExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {privacyExpanded && (
          <View style={styles.privacyDropdown}>
            <View style={styles.subSwitchRow}>
              <View style={styles.subSwitchCol}>
                <Text style={styles.subSwitchTitle}>Public Profile</Text>
                <Text style={styles.subSwitchDesc}>
                  Allow other community members to view your name
                </Text>
              </View>
              <Switch
                value={privacy.isProfilePublic}
                onValueChange={(val) => onUpdatePrivacy({ isProfilePublic: val })}
                trackColor={{ false: '#262D3D', true: COLORS.goldDark }}
                thumbColor={privacy.isProfilePublic ? COLORS.gold : '#9296A3'}
              />
            </View>

            <View style={styles.subSwitchRow}>
              <View style={styles.subSwitchCol}>
                <Text style={styles.subSwitchTitle}>Share Reading Streak</Text>
                <Text style={styles.subSwitchDesc}>
                  Show your consecutive reading days to encourage peers
                </Text>
              </View>
              <Switch
                value={privacy.showStreakPublicly}
                onValueChange={(val) => onUpdatePrivacy({ showStreakPublicly: val })}
                trackColor={{ false: '#262D3D', true: COLORS.goldDark }}
                thumbColor={privacy.showStreakPublicly ? COLORS.gold : '#9296A3'}
              />
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={confirmSignOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color={COLORS.gold} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={confirmDeleteAccount}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelCol: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  rowSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: 4,
  },
  privacyDropdown: {
    backgroundColor: COLORS.cardLight,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    gap: 12,
  },
  subSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  subSwitchCol: {
    flex: 1,
  },
  subSwitchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  subSwitchDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216, 181, 109, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(216, 181, 109, 0.3)',
    borderRadius: 12,
    paddingVertical: 11,
    marginTop: 10,
    gap: 8,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gold,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerMuted,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
    gap: 8,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
  },
});
