import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { TRANSLATIONS } from '@/services/bible-service';
import { TranslationCode } from '@/types/bible';
import { BibleStudyPreferences, VerseDisplayMode } from '@/types/profile';

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
  const { colors } = useAppTheme();
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionEyebrow, { color: colors.gold }]}>✦ SCRIPTURE SETTINGS</Text>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Bible Study Preferences
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Preferred Translation */}
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <View style={styles.iconTitleRow}>
              <Ionicons name="book-outline" size={18} color={colors.gold} />
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Default Translation
              </Text>
            </View>
            <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
              Active in Reader
            </Text>
          </View>

          <View style={styles.translationsRow}>
            {TRANSLATIONS.map((t) => {
              const isSelected = preferences.preferredTranslation === t.code;
              return (
                <TouchableOpacity
                  key={t.code}
                  style={[
                    styles.translationChip,
                    {
                      backgroundColor: isSelected ? colors.goldMuted : colors.cardSecondary,
                      borderColor: isSelected ? colors.gold : colors.border,
                    },
                  ]}
                  onPress={() =>
                    onUpdate({ preferredTranslation: t.code as TranslationCode })
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.translationChipText,
                      { color: isSelected ? colors.gold : colors.textSecondary },
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

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        {/* Font Size & Live Preview */}
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <View style={styles.iconTitleRow}>
              <Ionicons name="text-outline" size={18} color={colors.gold} />
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Reader Font Size
              </Text>
            </View>
            <Text
              style={[
                styles.settingValueBadge,
                { backgroundColor: colors.goldMuted, color: colors.gold },
              ]}
            >
              {preferences.fontSize} pt
            </Text>
          </View>

          <View style={styles.fontSizeSelectorRow}>
            {FONT_SIZES.map((size) => {
              const isSelected = preferences.fontSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizePill,
                    {
                      backgroundColor: isSelected ? colors.goldMuted : colors.cardSecondary,
                      borderColor: isSelected ? colors.gold : colors.border,
                    },
                  ]}
                  onPress={() => onUpdate({ fontSize: size })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.sizePillText,
                      { color: isSelected ? colors.gold : colors.textSecondary },
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
          <View
            style={[
              styles.previewBox,
              { backgroundColor: colors.cardSecondary, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
              LIVE PREVIEW
            </Text>
            <Text
              style={[
                styles.previewText,
                {
                  color: colors.textPrimary,
                  fontSize: preferences.fontSize,
                  lineHeight: Math.round(preferences.fontSize * 1.55),
                },
              ]}
            >
              {preferences.showVerseNumbers ? (
                <Text style={{ color: colors.gold, fontWeight: '700', fontSize: 11 }}>
                  16{' '}
                </Text>
              ) : null}
              For God so loved the world, that he gave his only begotten Son, that
              whosoever believeth in him should not perish, but have everlasting life.
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        {/* Verse Display Mode */}
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <View style={styles.iconTitleRow}>
              <Ionicons name="layers-outline" size={18} color={colors.gold} />
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Reading Layout
              </Text>
            </View>
          </View>

          <View style={[styles.segmentedControl, { backgroundColor: colors.cardSecondary }]}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                preferences.verseDisplayMode === 'verse-by-verse' && [
                  styles.segmentButtonActive,
                  { backgroundColor: colors.card, borderColor: `${colors.gold}66` },
                ],
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
                    ? colors.gold
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  {
                    color:
                      preferences.verseDisplayMode === 'verse-by-verse'
                        ? colors.gold
                        : colors.textSecondary,
                  },
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
                preferences.verseDisplayMode === 'paragraph' && [
                  styles.segmentButtonActive,
                  { backgroundColor: colors.card, borderColor: `${colors.gold}66` },
                ],
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
                    ? colors.gold
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  {
                    color:
                      preferences.verseDisplayMode === 'paragraph'
                        ? colors.gold
                        : colors.textSecondary,
                  },
                  preferences.verseDisplayMode === 'paragraph' &&
                    styles.segmentButtonTextActive,
                ]}
              >
                Paragraph Flow
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        {/* Show Verse Numbers Switch */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabelCol}>
            <Text style={[styles.switchLabel, { color: colors.textPrimary }]}>
              Show Verse Numbers
            </Text>
            <Text style={[styles.switchSubLabel, { color: colors.textSecondary }]}>
              Display superscript indices before verses
            </Text>
          </View>
          <Switch
            value={preferences.showVerseNumbers}
            onValueChange={(val) => onUpdate({ showVerseNumbers: val })}
            trackColor={{ false: colors.cardSecondary, true: colors.goldDark }}
            thumbColor={preferences.showVerseNumbers ? colors.gold : colors.textSecondary}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        {/* Words of Christ in Red */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabelCol}>
            <View style={styles.redLabelRow}>
              <Text style={[styles.switchLabel, { color: colors.textPrimary }]}>
                Words of Christ
              </Text>
              <View style={[styles.redPill, { backgroundColor: `${colors.danger}22` }]}>
                <Text style={[styles.redPillText, { color: colors.danger }]}>Red Letter</Text>
              </View>
            </View>
            <Text style={[styles.switchSubLabel, { color: colors.textSecondary }]}>
              Highlight Jesus' spoken words in Gospels
            </Text>
          </View>
          <Switch
            value={preferences.redLetterChrist}
            onValueChange={(val) => onUpdate({ redLetterChrist: val })}
            trackColor={{ false: colors.cardSecondary, true: `${colors.danger}88` }}
            thumbColor={preferences.redLetterChrist ? colors.danger : colors.textSecondary}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        {/* Daily Reading Reminder */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabelCol}>
            <Text style={[styles.switchLabel, { color: colors.textPrimary }]}>
              Daily Reading Reminder
            </Text>
            <Text style={[styles.switchSubLabel, { color: colors.textSecondary }]}>
              Gentle notification for your daily quiet time
            </Text>
          </View>
          <Switch
            value={preferences.dailyReminderEnabled}
            onValueChange={(val) => onUpdate({ dailyReminderEnabled: val })}
            trackColor={{ false: colors.cardSecondary, true: colors.goldDark }}
            thumbColor={preferences.dailyReminderEnabled ? colors.gold : colors.textSecondary}
          />
        </View>

        {/* Preferred Reading Time Picker */}
        {preferences.dailyReminderEnabled && (
          <View style={[styles.timeSettingRow, { borderTopColor: colors.borderMuted }]}>
            <View style={styles.timeTopRow}>
              <View style={styles.iconTitleRow}>
                <Ionicons name="time-outline" size={16} color={colors.gold} />
                <Text style={[styles.timeLabel, { color: colors.textPrimary }]}>
                  Preferred Reading Time
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowTimePicker((prev) => !prev)}
                style={[
                  styles.timeBadge,
                  { backgroundColor: colors.goldMuted, borderColor: `${colors.gold}55` },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeBadgeText, { color: colors.gold }]}>
                  {preferences.preferredReadingTime}
                </Text>
                <Ionicons
                  name={showTimePicker ? 'chevron-up' : 'chevron-down'}
                  size={12}
                  color={colors.gold}
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
                        {
                          backgroundColor: isCurrent ? colors.goldMuted : colors.cardSecondary,
                          borderColor: isCurrent ? colors.gold : colors.border,
                        },
                      ]}
                      onPress={() => {
                        onUpdate({ preferredReadingTime: time });
                        setShowTimePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.timeOptionText,
                          { color: isCurrent ? colors.gold : colors.textSecondary },
                          isCurrent && { fontWeight: '700' },
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
  },
  settingHint: {
    fontSize: 11,
  },
  settingValueBadge: {
    fontSize: 11,
    fontWeight: '700',
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
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  translationChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  translationChipTextSelected: {
    fontWeight: '700',
  },
  fontSizeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sizePill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  sizePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sizePillTextSelected: {
    fontWeight: '700',
  },
  previewBox: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  previewLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  previewText: {
    fontFamily: 'serif',
  },
  segmentedControl: {
    flexDirection: 'row',
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
    borderWidth: 1,
  },
  segmentButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  segmentButtonTextActive: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
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
  },
  switchSubLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  redLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  redPillText: {
    fontSize: 9,
    fontWeight: '700',
  },
  timeSettingRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  timeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  timeOptionPill: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  timeOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
