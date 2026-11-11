import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

interface EmailModalProps {
  visible: boolean;
  currentEmail: string;
  onClose: () => void;
  onSubmit: (newEmail: string) => Promise<void>;
}

export function EmailModal({
  visible,
  currentEmail,
  onClose,
  onSubmit,
}: EmailModalProps) {
  const { colors } = useAppTheme();
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (newEmail.trim().toLowerCase() === currentEmail.trim().toLowerCase()) {
      Alert.alert('Notice', 'The new email is the same as your current email.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(newEmail.trim());
      Alert.alert(
        'Email Updated',
        'Your account email address has been updated successfully.'
      );
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not update email.');
    } finally {
      setLoading(false);
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
        <View
          style={[
            styles.sheetContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.sheetHeader,
              { borderBottomColor: colors.border },
            ]}
          >
            <View>
              <Text style={[styles.sheetEyebrow, { color: colors.gold }]}>
                ✦ ACCOUNT CREDENTIALS
              </Text>
              <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
                Manage Email
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.cardSecondary }]}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={[styles.hintText, { color: colors.textSecondary }]}>
              Your email is used for account recovery and study notifications.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.gold }]}>
                NEW EMAIL ADDRESS
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="mail-outline" size={18} color={colors.gold} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="Enter new email address"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.footerRow}>
              <TouchableOpacity
                style={[
                  styles.cancelBtn,
                  { backgroundColor: colors.cardSecondary, borderColor: colors.border },
                ]}
                onPress={onClose}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.gold }]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#10131D" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={16} color="#10131D" />
                    <Text style={styles.saveBtnText}>Update Email</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingBottom: 28,
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
  sheetEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  hintText: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
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
