import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { NotificationPreferences } from '@/types/profile';

interface NotificationSectionProps {
  notifications: NotificationPreferences;
  onUpdate: (updates: Partial<NotificationPreferences>) => void;
}

export function NotificationSection({
  notifications,
  onUpdate,
}: NotificationSectionProps) {
  const { colors } = useAppTheme();

  const items: {
    key: keyof NotificationPreferences;
    title: string;
    subtitle: string;
    icon: string;
  }[] = [
    {
      key: 'dailyVerse',
      title: 'Verse of the Day',
      subtitle: 'Inspirational morning scripture push alert',
      icon: 'sparkles-outline',
    },
    {
      key: 'readingReminders',
      title: 'Daily Reading Reminders',
      subtitle: 'Gentle nudges to maintain your devotional habit',
      icon: 'alarm-outline',
    },
    {
      key: 'readingPlanReminders',
      title: 'Reading Plan Milestones',
      subtitle: 'Updates on your scheduled reading plan progression',
      icon: 'calendar-outline',
    },
    {
      key: 'prayerAndJournalReminders',
      title: 'Prayer & Journal Prompts',
      subtitle: 'Evening reflection reminders to write and pray',
      icon: 'heart-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionEyebrow, { color: colors.gold }]}>✦ NOTIFICATIONS</Text>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Reminders & Alerts</Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {items.map((item, index) => {
          const isEnabled = notifications[item.key];
          return (
            <View key={item.key}>
              {index > 0 && (
                <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />
              )}
              <View style={styles.row}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: isEnabled ? colors.goldMuted : colors.cardSecondary,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={isEnabled ? colors.gold : colors.textSecondary}
                  />
                </View>

                <View style={styles.labelCol}>
                  <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
                    {item.subtitle}
                  </Text>
                </View>

                <Switch
                  value={isEnabled}
                  onValueChange={(val) => onUpdate({ [item.key]: val })}
                  trackColor={{ false: colors.cardSecondary, true: colors.goldDark }}
                  thumbColor={isEnabled ? colors.gold : colors.textSecondary}
                />
              </View>
            </View>
          );
        })}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
