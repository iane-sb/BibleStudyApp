import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { TRANSLATIONS } from '@/services/bible-service';
import { TranslationCode } from '@/types/bible';
import { BibleStudyPreferences, VerseDisplayMode } from '@/types/profile';

const COLORS = {
  card: '#191E2B',
  cardLight: '#202637',
  gold: '#D8B56D',
  goldDark: '#A88B50',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
  redLetter: '#E06D6D',
};

const FONT_SIZES = [14, 16, 18, 20, 22];

const COMMON_TIMES = ['06:00 AM', '07:00 AM', '08:00 AM', '12:00 PM', '09:00 PM'];

interface StudyPreferencesSectionProps {
  preferences: BibleStudyPreferences;
  onUpdate: (updates: Partial<BibleStudyPreferences>) => void;
}

export function StudyPreferencesSection({
  preferences,
  onUpdate,
}: StudyPreferencesSectionProps) {
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>✦ SCRIPTURE SETTINGS</Text>
        <Text style={styles.sectionTitle}>Bible Study Preferences</Text>
      </View>

      <View style={styles.card}>
        {/* Preferred Translation */}
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <View style={styles.iconTitleRow}>
              <Ionicons name="book-outline" size={18} color={COLORS.gold} />
              <Text style={styles.settingTitle}>Default Translation</Text>
            </View>
            <Text style={styles.settingHint}>Active in Reader</Text>
          </View>

          <View style={styles.translationsRow}>
            {TRANSLATIONS.map((t) => {
              const isSelected = preferences.preferredTranslation === t.code;
              return (
                <TouchableOpacity
                  key={t.code}
                  style={[
                    styles.translationChip,
                    isSelected && styles.translationChipSelected,
                  ]}
                  onPress={() =>
                    onUpdate({ preferredTranslation: t.code as TranslationCode })
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.translationChipText,
                      isSelected && styles.translationChipTextSelected,
                    ]}
                  >
                    {t.code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Font Size & Live Preview */}
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <View style={styles.iconTitleRow}>
              <Ionicons name="text-outline" size={18} color={COLORS.gold} />
              <Text style={styles.settingTitle}>Reader Font Size</Text>
            </View>
            <Text style={styles.settingValueBadge}>{preferences.fontSize} pt</Text>
          </View>

          <View style={styles.fontSizeSelectorRow}>
            {FONT_SIZES.map((size) => {
              const isSelected = preferences.fontSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizePill,
                    isSelected && styles.sizePillSelected,
                  ]}
                  onPress={() => onUpdate({ fontSize: size })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.sizePillText,
                      isSelected && styles.sizePillTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Live Scripture Preview */}
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>LIVE PREVIEW</Text>
            <Text
              style={[
                styles.previewText,
                {
                  fontSize: preferences.fontSize,
                  lineHeight: Math.round(preferences.fontSize * 1.55),
                },
              ]}
            >
              {preferences.showVerseNumbers ? (
                <Text style={styles.previewVerseNum}>16 </Text>
              ) : null}
              For God so loved the world, that he gave his only begotten Son, that
              whosoever believeth in him should not perish, but have everlasting life.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Verse Display Mode */}
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <View style={styles.iconTitleRow}>
              <Ionicons name="layers-outline" size={18} color={COLORS.gold} />
              <Text style={styles.settingTitle}>Reading Layout</Text>
            </View>
          </View>

          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                preferences.verseDisplayMode === 'verse-by-verse' &&
                  styles.segmentButtonActive,
              ]}
              onPress={() =>
                onUpdate({ verseDisplayMode: 'verse-by-verse' as VerseDisplayMode })
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="list"
                size={14}
                color={
                  preferences.verseDisplayMode === 'verse-by-verse'
                    ? COLORS.gold
                    : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  preferences.verseDisplayMode === 'verse-by-verse' &&
                    styles.segmentButtonTextActive,
                ]}
              >
                Verse-by-Verse
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentButton,
                preferences.verseDisplayMode === 'paragraph' &&
                  styles.segmentButtonActive,
              ]}
              onPress={() =>
                onUpdate({ verseDisplayMode: 'paragraph' as VerseDisplayMode })
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="reorder-four"
                size={14}
                color={
                  preferences.verseDisplayMode === 'paragraph'
                    ? COLORS.gold
                    : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  preferences.verseDisplayMode === 'paragraph' &&
                    styles.segmentButtonTextActive,
                ]}
              >
                Paragraph Flow
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Show Verse Numbers Switch */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabelCol}>
            <Text style={styles.switchLabel}>Show Verse Numbers</Text>
            <Text style={styles.switchSubLabel}>
              Display superscript indices before verses
            </Text>
          </View>
          <Switch
            value={preferences.showVerseNumbers}
            onValueChange={(val) => onUpdate({ showVerseNumbers: val })}
            trackColor={{ false: '#262D3D', true: COLORS.goldDark }}
            thumbColor={preferences.showVerseNumbers ? COLORS.gold : '#9296A3'}
          />
        </View>

        <View style={styles.divider} />

        {/* Words of Christ in Red */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabelCol}>
            <View style={styles.redLabelRow}>
              <Text style={styles.switchLabel}>Words of Christ</Text>
              <View style={styles.redPill}>
                <Text style={styles.redPillText}>Red Letter</Text>
              </View>
            </View>
            <Text style={styles.switchSubLabel}>
              Highlight Jesus' spoken words in Gospels
            </Text>
          </View>
          <Switch
            value={preferences.redLetterChrist}
            onValueChange={(val) => onUpdate({ redLetterChrist: val })}
            trackColor={{ false: '#262D3D', true: 'rgba(224, 109, 109, 0.6)' }}
            thumbColor={preferences.redLetterChrist ? COLORS.redLetter : '#9296A3'}
          />
        </View>

        <View style={styles.divider} />

        {/* Daily Reading Reminder */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabelCol}>
            <Text style={styles.switchLabel}>Daily Reading Reminder</Text>
            <Text style={styles.switchSubLabel}>
              Gentle notification for your daily quiet time
            </Text>
          </View>
          <Switch
            value={preferences.dailyReminderEnabled}
            onValueChange={(val) => onUpdate({ dailyReminderEnabled: val })}
            trackColor={{ false: '#262D3D', true: COLORS.goldDark }}
            thumbColor={preferences.dailyReminderEnabled ? COLORS.gold : '#9296A3'}
          />
        </View>

        {/* Preferred Reading Time Picker */}
        {preferences.dailyReminderEnabled && (
          <View style={styles.timeSettingRow}>
            <View style={styles.timeTopRow}>
              <View style={styles.iconTitleRow}>
                <Ionicons name="time-outline" size={16} color={COLORS.gold} />
                <Text style={styles.timeLabel}>Preferred Reading Time</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowTimePicker((prev) => !prev)}
                style={styles.timeBadge}
                activeOpacity={0.7}
              >
                <Text style={styles.timeBadgeText}>
                  {preferences.preferredReadingTime}
                </Text>
                <Ionicons
                  name={showTimePicker ? 'chevron-up' : 'chevron-down'}
                  size={12}
                  color={COLORS.gold}
                />
              </TouchableOpacity>
            </View>

            {showTimePicker && (
              <View style={styles.timeOptionsContainer}>
                {COMMON_TIMES.map((time) => {
                  const isCurrent = preferences.preferredReadingTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOptionPill,
                        isCurrent && styles.timeOptionPillSelected,
                      ]}
                      onPress={() => {
                        onUpdate({ preferredReadingTime: time });
                        setShowTimePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.timeOptionText,
                          isCurrent && styles.timeOptionTextSelected,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}
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
    padding: 16,
  },
  settingItem: {
    paddingVertical: 4,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  settingHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  settingValueBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gold,
    backgroundColor: COLORS.goldMuted,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  translationsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  translationChip: {
    flex: 1,
    minWidth: 65,
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  translationChipSelected: {
    backgroundColor: COLORS.goldMuted,
    borderColor: COLORS.gold,
  },
  translationChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  translationChipTextSelected: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  fontSizeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sizePill: {
    flex: 1,
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  sizePillSelected: {
    backgroundColor: COLORS.goldMuted,
    borderColor: COLORS.gold,
  },
  sizePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  sizePillTextSelected: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  previewBox: {
    backgroundColor: COLORS.cardLight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  previewLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  previewText: {
    color: COLORS.textPrimary,
    fontFamily: 'serif',
  },
  previewVerseNum: {
    color: COLORS.gold,
    fontWeight: '700',
    fontSize: 11,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardLight,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'rgba(216, 181, 109, 0.35)',
  },
  segmentButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  segmentButtonTextActive: {
    fontWeight: '700',
    color: COLORS.gold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  switchLabelCol: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  switchSubLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  redLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redPill: {
    backgroundColor: 'rgba(224, 109, 109, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  redPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.redLetter,
  },
  timeSettingRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  timeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldMuted,
    borderWidth: 1,
    borderColor: 'rgba(216, 181, 109, 0.35)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gold,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  timeOptionPill: {
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  timeOptionPillSelected: {
    backgroundColor: COLORS.goldMuted,
    borderColor: COLORS.gold,
  },
  timeOptionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  timeOptionTextSelected: {
    color: COLORS.gold,
    fontWeight: '700',
  },
});
