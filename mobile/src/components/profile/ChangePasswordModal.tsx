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

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (currentPass: string, newPass: string) => Promise<void>;
}

export function ChangePasswordModal({
  visible,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const { colors } = useAppTheme();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!currentPass.trim()) {
      Alert.alert('Validation Error', 'Please enter your current password.');
      return;
    }
    if (!newPass.trim() || newPass.length < 8) {
      Alert.alert(
        'Validation Error',
        'New password must be at least 8 characters long.'
      );
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('Validation Error', 'New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(currentPass, newPass);
      Alert.alert(
        'Password Updated',
        'Your password has been changed successfully.'
      );
      handleClose();
    } catch (err: any) {
      Alert.alert('Update Failed', err?.message || 'Could not change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
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
              <Text style={[styles.sheetEyebrow, { color: colors.gold }]}>✦ SECURITY</Text>
              <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
                Change Password
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: colors.cardSecondary }]}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.gold }]}>CURRENT PASSWORD</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="key-outline" size={18} color={colors.gold} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={currentPass}
                  onChangeText={setCurrentPass}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showCurrent}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrent((p) => !p)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.gold }]}>NEW PASSWORD</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="lock-closed-outline" size={18} color={colors.gold} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={newPass}
                  onChangeText={setNewPass}
                  placeholder="Minimum 8 characters"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showNew}
                />
                <TouchableOpacity
                  onPress={() => setShowNew((p) => !p)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showNew ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.gold }]}>
                CONFIRM NEW PASSWORD
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.gold} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  placeholder="Re-enter new password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm((p) => !p)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footerRow}>
              <TouchableOpacity
                style={[
                  styles.cancelBtn,
                  { backgroundColor: colors.cardSecondary, borderColor: colors.border },
                ]}
                onPress={handleClose}
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
                    <Ionicons name="shield-checkmark" size={16} color="#10131D" />
                    <Text style={styles.saveBtnText}>Update Password</Text>
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
  inputGroup: {
    marginBottom: 16,
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
    marginTop: 10,
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
