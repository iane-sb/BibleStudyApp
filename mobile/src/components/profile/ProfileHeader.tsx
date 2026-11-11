import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AVATAR_PRESETS } from '@/services/profile-service';
import { UserProfile } from '@/types/profile';

const COLORS = {
  background: '#10131D',
  card: '#191E2B',
  gold: '#D8B56D',
  goldDark: '#A88B50',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
  cardLight: '#202637',
  badgeGreen: '#8BB89B',
};

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditPress: () => void;
  onUpgradePress: () => void;
}

export function ProfileHeader({
  profile,
  onEditPress,
  onUpgradePress,
}: ProfileHeaderProps) {
  const activePreset = AVATAR_PRESETS.find((p) => p.id === profile.avatarPreset);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      {/* Top Banner / Avatar area */}
      <View style={styles.avatarRow}>
        <View style={styles.avatarWrapper}>
          {profile.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                { backgroundColor: activePreset?.bgColor ?? '#202637' },
              ]}
            >
              {activePreset ? (
                <Ionicons
                  name={activePreset.icon as any}
                  size={36}
                  color={activePreset.iconColor}
                />
              ) : (
                <Text style={styles.initialsText}>{getInitials(profile.name)}</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.editBadge}
            onPress={onEditPress}
            activeOpacity={0.8}
            accessibilityLabel="Edit profile picture"
          >
            <Ionicons name="camera" size={14} color="#10131D" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {profile.name}
            </Text>
          </View>

          <Text style={styles.userEmail} numberOfLines={1}>
            {profile.email}
          </Text>

          {/* Membership Badge */}
          <View style={styles.badgeRow}>
            {profile.membershipStatus === 'premium' ? (
              <View style={styles.premiumBadge}>
                <Ionicons name="sparkles" size={12} color={COLORS.gold} />
                <Text style={styles.premiumBadgeText}>PREMIUM MEMBER</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.freeBadge}
                onPress={onUpgradePress}
                activeOpacity={0.7}
              >
                <Text style={styles.freeBadgeText}>FREE TIER</Text>
                <Text style={styles.upgradeLink}>Upgrade ✦</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.memberSince}>Since {profile.memberSince}</Text>
          </View>
        </View>
      </View>

      {/* Bio / Favorite Verse */}
      {profile.favoriteVerse ? (
        <View style={styles.favoriteVerseCard}>
          <View style={styles.verseHeader}>
            <Ionicons name="bookmark-outline" size={13} color={COLORS.gold} />
            <Text style={styles.favoriteVerseLabel}>FAVORITE VERSE</Text>
          </View>
          <Text style={styles.favoriteVerseText}>“{profile.favoriteVerse}”</Text>
          {profile.bio ? <Text style={styles.bioText}>{profile.bio}</Text> : null}
        </View>
      ) : null}

      {/* Edit Profile Action Button */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={16} color={COLORS.gold} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImage: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  avatarFallback: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gold,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.gold,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldMuted,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(216, 181, 109, 0.35)',
    gap: 5,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 0.8,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202637',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  upgradeLink: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
  },
  memberSince: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  favoriteVerseCard: {
    backgroundColor: COLORS.cardLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  favoriteVerseLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 0.8,
  },
  favoriteVerseText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  bioText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  actionRow: {
    marginTop: 14,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216, 181, 109, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(216, 181, 109, 0.4)',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 7,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gold,
  },
});
