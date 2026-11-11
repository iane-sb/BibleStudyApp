import Ionicons from '@expo/vector-icons/Ionicons';
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

import { useAppTheme } from '@/contexts/ThemeContext';
import { AVATAR_PRESETS } from '@/services/profile-service';
import { UserProfile } from '@/types/profile';

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
  const { colors } = useAppTheme();
  const [name, setName] = useState(profile.name);
  const [favoriteVerse, setFavoriteVerse] = useState(profile.favoriteVerse ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [selectedPreset, setSelectedPreset] = useState(profile.avatarPreset ?? 'cross');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(profile.name);
      setFavoriteVerse(profile.favoriteVerse ?? '');
      setBio(profile.bio ?? '');
      setSelectedPreset(profile.avatarPreset ?? 'cross');
    }
  }, [profile, visible]);

  const activePreset = AVATAR_PRESETS.find((p) => p.id === selectedPreset);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full name is required.');
      return;
    }
    try {
      setSaving(true);
      await onSave({
        name: name.trim(),
        favoriteVerse: favoriteVerse.trim() || undefined,
        bio: bio.trim() || undefined,
        avatarPreset: profile.avatarUrl ? undefined : selectedPreset,
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
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.sheetHeader,
              { borderBottomColor: colors.border },
            ]}
          >
            <View>
              <Text style={[styles.eyebrow, { color: colors.gold }]}>✦ EDIT ACCOUNT</Text>
              <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>Personal Profile</Text>
            </View>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: colors.cardSecondary }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar preset selection (only shown when no real photo) */}
            {!profile.avatarUrl && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.gold }]}>CHOOSE AVATAR ICON</Text>
                <View style={styles.previewCenter}>
                  <View
                    style={[
                      styles.previewCircle,
                      {
                        backgroundColor: activePreset?.bgColor ?? colors.cardSecondary,
                        borderColor: colors.gold,
                      },
                    ]}
                  >
                    <Ionicons
                      name={(activePreset?.icon ?? 'person-outline') as any}
                      size={34}
                      color={activePreset?.iconColor ?? colors.gold}
                    />
                  </View>
                </View>
                <View style={styles.presetGrid}>
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <TouchableOpacity
                        key={preset.id}
                        style={[
                          styles.presetCard,
                          { backgroundColor: preset.bgColor },
                          isSelected && [styles.presetSelected, { borderColor: colors.gold }],
                        ]}
                        onPress={() => setSelectedPreset(preset.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name={preset.icon as any} size={22} color={preset.iconColor} />
                        <Text
                          style={[
                            styles.presetName,
                            { color: isSelected ? colors.textPrimary : colors.textSecondary },
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
            )}

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.gold }]}>FULL NAME *</Text>
              <View
                style={[
                  styles.inputWrap,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="person-outline" size={18} color={colors.gold} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Favorite Verse */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.gold }]}>FAVORITE VERSE</Text>
              <View
                style={[
                  styles.inputWrap,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="bookmark-outline" size={18} color={colors.gold} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  value={favoriteVerse}
                  onChangeText={setFavoriteVerse}
                  placeholder="e.g., Philippians 4:13"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Bio */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.gold }]}>BIO / STUDY VISION</Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    alignItems: 'flex-start',
                    paddingTop: 10,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.textPrimary, minHeight: 70, textAlignVertical: 'top' },
                  ]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="A short reflection on your walk with God..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.cancelBtn,
                { backgroundColor: colors.cardSecondary, borderColor: colors.border },
              ]}
              onPress={onClose}
              disabled={saving}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.gold }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#10131D" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color="#10131D" />
                  <Text style={styles.saveText}>Save Changes</Text>
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
    backgroundColor: 'rgba(5,7,12,0.78)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
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
  },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  sheetTitle: { fontSize: 18, fontWeight: '700' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 20, paddingVertical: 16 },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  input: { flex: 1, fontSize: 14 },
  previewCenter: { alignItems: 'center', marginVertical: 12 },
  previewCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
  presetSelected: { borderWidth: 2 },
  presetName: { fontSize: 10, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelText: { fontSize: 13, fontWeight: '600' },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveText: { fontSize: 13, fontWeight: '700', color: '#10131D' },
});
