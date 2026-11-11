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

import { useAppTheme } from '@/contexts/ThemeContext';
import { AccountPrivacySettings } from '@/types/profile';

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
  const { colors } = useAppTheme();
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
        <Text style={[styles.sectionEyebrow, { color: colors.gold }]}>
          ✦ SECURITY & CREDENTIALS
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Account & Security
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Edit Personal Info */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={onEditProfile}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.cardSecondary }]}>
            <Ionicons name="person-outline" size={18} color={colors.gold} />
          </View>
          <View style={styles.labelCol}>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
              Personal Information
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Name, bio, and favorite verse
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        {/* Email Management */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={onManageEmail}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.cardSecondary }]}>
            <Ionicons name="mail-outline" size={18} color={colors.gold} />
          </View>
          <View style={styles.labelCol}>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
              Email Address
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {email}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        {/* Change Password */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={onChangePassword}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.cardSecondary }]}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.gold} />
          </View>
          <View style={styles.labelCol}>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
              Change Password
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Update your sign-in password
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        {/* Account Privacy Toggle / Expandable */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => setPrivacyExpanded((prev) => !prev)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.cardSecondary }]}>
            <Ionicons name="shield-outline" size={18} color={colors.gold} />
          </View>
          <View style={styles.labelCol}>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
              Account Privacy
            </Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Manage public streak and study visibility
            </Text>
          </View>
          <Ionicons
            name={privacyExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {privacyExpanded && (
          <View style={[styles.privacyDropdown, { backgroundColor: colors.cardSecondary }]}>
            <View style={styles.subSwitchRow}>
              <View style={styles.subSwitchCol}>
                <Text style={[styles.subSwitchTitle, { color: colors.textPrimary }]}>
                  Public Profile
                </Text>
                <Text style={[styles.subSwitchDesc, { color: colors.textSecondary }]}>
                  Allow other community members to view your name
                </Text>
              </View>
              <Switch
                value={privacy.isProfilePublic}
                onValueChange={(val) => onUpdatePrivacy({ isProfilePublic: val })}
                trackColor={{ false: colors.card, true: colors.goldDark }}
                thumbColor={privacy.isProfilePublic ? colors.gold : colors.textSecondary}
              />
            </View>

            <View style={styles.subSwitchRow}>
              <View style={styles.subSwitchCol}>
                <Text style={[styles.subSwitchTitle, { color: colors.textPrimary }]}>
                  Share Reading Streak
                </Text>
                <Text style={[styles.subSwitchDesc, { color: colors.textSecondary }]}>
                  Show your consecutive reading days to encourage peers
                </Text>
              </View>
              <Switch
                value={privacy.showStreakPublicly}
                onValueChange={(val) => onUpdatePrivacy({ showStreakPublicly: val })}
                trackColor={{ false: colors.card, true: colors.goldDark }}
                thumbColor={privacy.showStreakPublicly ? colors.gold : colors.textSecondary}
              />
            </View>
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[
            styles.signOutButton,
            { backgroundColor: colors.goldMuted, borderColor: `${colors.gold}44` },
          ]}
          onPress={confirmSignOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.gold} />
          <Text style={[styles.signOutText, { color: colors.gold }]}>Sign Out</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          style={[
            styles.deleteButton,
            { backgroundColor: colors.dangerMuted, borderColor: `${colors.danger}44` },
          ]}
          onPress={confirmDeleteAccount}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
          <Text style={[styles.deleteText, { color: colors.danger }]}>Delete Account</Text>
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
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelCol: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  privacyDropdown: {
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
  },
  subSwitchDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    marginTop: 10,
    gap: 8,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
    gap: 8,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
