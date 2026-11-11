import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
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

const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'feature', label: 'Feature Request' },
  { id: 'scripture', label: 'Scripture Bug' },
  { id: 'ui', label: 'Design & UX' },
];

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const { colors } = useAppTheme();
  const [category, setCategory] = useState('general');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Empty Message', 'Please write your thoughts or feedback.');
      return;
    }

    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 600));
    setSubmitting(false);
    setComment('');
    Alert.alert(
      'Feedback Received',
      'Thank you for your valuable feedback! We pray Word & Wisdom blesses your daily walk.'
    );
    onClose();
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
              <Text style={[styles.sheetEyebrow, { color: colors.gold }]}>✦ WE HEAR YOU</Text>
              <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>Send Feedback</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.cardSecondary }]}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Your feedback shapes the future of Word & Wisdom. Share any thoughts,
              feature requests, or translation corrections.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.gold }]}>FEEDBACK TOPIC</Text>
              <View style={styles.categoriesRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryPill,
                        {
                          backgroundColor: isSelected ? colors.goldMuted : colors.cardSecondary,
                          borderColor: isSelected ? colors.gold : colors.border,
                        },
                      ]}
                      onPress={() => setCategory(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          { color: isSelected ? colors.gold : colors.textSecondary },
                          isSelected && { fontWeight: '700' },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.gold }]}>YOUR MESSAGE</Text>
              <View
                style={[
                  styles.textAreaWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <TextInput
                  style={[styles.textArea, { color: colors.textPrimary }]}
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Tell us what you love or what we could improve..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={5}
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
                disabled={submitting}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.gold }]}
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.8}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#10131D" />
                ) : (
                  <>
                    <Ionicons name="paper-plane" size={16} color="#10131D" />
                    <Text style={styles.saveBtnText}>Send Feedback</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    paddingBottom: 24,
    maxHeight: '85%',
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
  infoText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
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
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  textAreaWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  textArea: {
    minHeight: 110,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
