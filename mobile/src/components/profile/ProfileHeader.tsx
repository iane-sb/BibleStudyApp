/**
 * ProfileHeader — Profile avatar, name, email, membership badge, and
 * "Edit Profile" button.
 *
 * Photo upload flow:
 *  1. Tap avatar or camera icon → request gallery permission
 *  2. Open expo-image-picker gallery
 *  3. Pass selected image to PhotoCropModal
 *  4. Receive cropped local URI, call onAvatarChange
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { PhotoCropModal } from '@/components/profile/PhotoCropModal';
import { useAppTheme } from '@/contexts/ThemeContext';
import { AVATAR_PRESETS } from '@/services/profile-service';
import { UserProfile } from '@/types/profile';

const COLORS = {
  background: '#10131D',
  card: '#191E2B',
  gold: '#D8B56D',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
  cardLight: '#202637',
};

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditPress: () => void;
  onUpgradePress: () => void;
  onAvatarChange: (localUri: string) => Promise<void>;
}

export function ProfileHeader({
  profile,
  onEditPress,
  onUpgradePress,
  onAvatarChange,
}: ProfileHeaderProps) {
  const { colors } = useAppTheme();
  const activePreset = AVATAR_PRESETS.find((p) => p.id === profile.avatarPreset);

  const [cropSource, setCropSource] = useState<{
    uri: string;
    width: number;
    height: number;
  } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handlePickPhoto = useCallback(async () => {
    // Request permission
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library in device Settings to change your profile photo.'
        );
        return;
      }
    }

    // Launch gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // We handle our own crop UI
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setCropSource({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      });
    }
  }, []);

  const handleCropSave = useCallback(
    async (localUri: string) => {
      setUploadingAvatar(true);
      try {
        await onAvatarChange(localUri);
        setCropSource(null);
      } finally {
        setUploadingAvatar(false);
      }
    },
    [onAvatarChange]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Avatar row */}
      <View style={styles.avatarRow}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={handlePickPhoto}
          activeOpacity={0.85}
          accessibilityLabel="Change profile photo"
        >
          {profile.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={[styles.avatarImage, { borderColor: colors.gold }]}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                {
                  backgroundColor: activePreset?.bgColor ?? colors.cardSecondary,
                  borderColor: colors.gold,
                },
              ]}
            >
              {activePreset ? (
                <Ionicons
                  name={activePreset.icon as any}
                  size={36}
                  color={activePreset.iconColor}
                />
              ) : (
                <Text style={[styles.initialsText, { color: colors.gold }]}>
                  {getInitials(profile.name)}
                </Text>
              )}
            </View>
          )}

          {/* Camera badge */}
          <View style={[styles.cameraBadge, { backgroundColor: colors.gold, borderColor: colors.card }]}>
            {uploadingAvatar ? (
              <View style={styles.uploadingDot} />
            ) : (
              <Ionicons name="camera" size={14} color="#10131D" />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]} numberOfLines={1}>
            {profile.email}
          </Text>

          <View style={styles.badgeRow}>
            {profile.membershipStatus === 'premium' ? (
              <View style={[styles.premiumBadge, { backgroundColor: colors.goldMuted, borderColor: `${colors.gold}55` }]}>
                <Ionicons name="sparkles" size={12} color={colors.gold} />
                <Text style={[styles.premiumBadgeText, { color: colors.gold }]}>PREMIUM MEMBER</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.freeBadge, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}
                onPress={onUpgradePress}
                activeOpacity={0.7}
              >
                <Text style={[styles.freeBadgeText, { color: colors.textSecondary }]}>FREE TIER</Text>
                <Text style={[styles.upgradeLink, { color: colors.gold }]}>Upgrade ✦</Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.memberSince, { color: colors.textSecondary }]}>Since {profile.memberSince}</Text>
          </View>
        </View>
      </View>

      {/* Favorite verse & bio */}
      {(profile.favoriteVerse || profile.bio) ? (
        <View style={[styles.verseCard, { backgroundColor: colors.cardSecondary, borderLeftColor: colors.gold }]}>
          {profile.favoriteVerse ? (
            <>
              <View style={styles.verseHeader}>
                <Ionicons name="bookmark-outline" size={13} color={colors.gold} />
                <Text style={[styles.verseLabel, { color: colors.gold }]}>FAVORITE VERSE</Text>
              </View>
              <Text style={[styles.verseText, { color: colors.textPrimary }]}>"{profile.favoriteVerse}"</Text>
            </>
          ) : null}
          {profile.bio ? (
            <Text style={[styles.bioText, { color: colors.textSecondary }]}>{profile.bio}</Text>
          ) : null}
        </View>
      ) : null}

      {/* Buttons row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn, { backgroundColor: colors.goldMuted, borderColor: `${colors.gold}66` }]}
          onPress={onEditPress}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={15} color={colors.gold} />
          <Text style={[styles.editBtnText, { color: colors.gold }]}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.photoBtn, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}
          onPress={handlePickPhoto}
          activeOpacity={0.8}
        >
          <Ionicons name="image-outline" size={15} color={colors.textSecondary} />
          <Text style={[styles.photoBtnText, { color: colors.textSecondary }]}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Crop Modal */}
      {cropSource && (
        <PhotoCropModal
          visible={true}
          sourceUri={cropSource.uri}
          imageWidth={cropSource.width}
          imageHeight={cropSource.height}
          onCancel={() => setCropSource(null)}
          onSave={handleCropSave}
        />
      )}
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
  cameraBadge: {
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
  uploadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10131D',
  },
  headerInfo: {
    flex: 1,
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
  verseCard: {
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
  verseLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 0.8,
  },
  verseText: {
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
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  editBtn: {
    backgroundColor: 'rgba(216, 181, 109, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(216, 181, 109, 0.4)',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gold,
  },
  photoBtn: {
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
