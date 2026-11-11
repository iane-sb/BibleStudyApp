import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AVATAR_PRESETS } from '@/services/profile-service';
import { UserProfile } from '@/types/profile';

const COLORS = {
  background: '#10131D',
  card: '#191E2B',
  cardLight: '#202637',
  gold: '#D8B56D',
  goldDark: '#A88B50',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
};

interface EditProfileModalProps {
  visible: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
}

export function EditProfileModal({
  visible,
  profile,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [favoriteVerse, setFavoriteVerse] = useState(profile.favoriteVerse ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [selectedPreset, setSelectedPreset] = useState(profile.avatarPreset ?? 'cross');
  const [customAvatarUrl, setCustomAvatarUrl] = useState(profile.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setFavoriteVerse(profile.favoriteVerse ?? '');
    setBio(profile.bio ?? '');
    setSelectedPreset(profile.avatarPreset ?? 'cross');
    setCustomAvatarUrl(profile.avatarUrl ?? '');
  }, [profile, visible]);

  const activePreset = AVATAR_PRESETS.find((p) => p.id === selectedPreset);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name: name.trim(),
        email: email.trim(),
        favoriteVerse: favoriteVerse.trim() || undefined,
        bio: bio.trim() || undefined,
        avatarPreset: selectedPreset,
        avatarUrl: customAvatarUrl.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      Alert.alert('Update Failed', err?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetEyebrow}>✦ EDIT ACCOUNT</Text>
              <Text style={styles.sheetTitle}>Personal Profile</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Avatar Preview & Selection */}
            <View style={styles.avatarSection}>
              <Text style={styles.fieldLabel}>CHOOSE PROFILE AVATAR</Text>
              <View style={styles.previewCenter}>
                {customAvatarUrl ? (
                  <Image
                    source={{ uri: customAvatarUrl }}
                    style={styles.currentPreviewImage}
                    contentFit="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.currentPreviewFallback,
                      { backgroundColor: activePreset?.bgColor ?? '#202637' },
                    ]}
                  >
                    <Ionicons
                      name={(activePreset?.icon ?? 'person-outline') as any}
                      size={36}
                      color={activePreset?.iconColor ?? COLORS.gold}
                    />
                  </View>
                )}
                <Text style={styles.avatarHint}>
                  {customAvatarUrl ? 'Custom Image URL' : activePreset?.name ?? 'Avatar'}
                </Text>
              </View>

              {/* Preset Icons Gallery */}
              <View style={styles.presetGrid}>
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected =
                    !customAvatarUrl && selectedPreset === preset.id;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[
                        styles.presetCard,
                        { backgroundColor: preset.bgColor },
                        isSelected && styles.presetCardSelected,
                      ]}
                      onPress={() => {
                        setSelectedPreset(preset.id);
                        setCustomAvatarUrl('');
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={preset.icon as any}
                        size={22}
                        color={preset.iconColor}
                      />
                      <Text
                        style={[
                          styles.presetName,
                          isSelected && styles.presetNameSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {preset.name.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Custom Image URL Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>OR CUSTOM IMAGE URL</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="image-outline" size={18} color={COLORS.gold} />
                <TextInput
                  style={styles.textInput}
                  value={customAvatarUrl}
                  onChangeText={setCustomAvatarUrl}
                  placeholder="https://example.com/avatar.jpg"
                  placeholderTextColor="#5C6272"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {customAvatarUrl.length > 0 && (
                  <TouchableOpacity onPress={() => setCustomAvatarUrl('')}>
                    <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>FULL NAME *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={COLORS.gold} />
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor="#5C6272"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={COLORS.gold} />
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  placeholderTextColor="#5C6272"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Favorite Verse */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>FAVORITE VERSE</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="bookmark-outline" size={18} color={COLORS.gold} />
                <TextInput
                  style={styles.textInput}
                  value={favoriteVerse}
                  onChangeText={setFavoriteVerse}
                  placeholder="e.g., Philippians 4:13 or Psalm 23:1"
                  placeholderTextColor="#5C6272"
                />
              </View>
            </View>

            {/* Bio / Devotional Goal */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>BIO / STUDY VISION</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="A short reflection on your walk with God..."
                  placeholderTextColor="#5C6272"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={saving}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#10131D" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color="#10131D" />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  avatarSection: {
    marginBottom: 16,
  },
  previewCenter: {
    alignItems: 'center',
    marginVertical: 12,
  },
  currentPreviewImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  currentPreviewFallback: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 4,
  },
  presetCardSelected: {
    borderColor: COLORS.gold,
    borderWidth: 2,
  },
  presetName: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  presetNameSelected: {
    color: COLORS.textPrimary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.cardLight,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10131D',
  },
});
