import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { NotificationPreferences } from '@/types/profile';

const COLORS = {
  card: '#191E2B',
  cardLight: '#202637',
  gold: '#D8B56D',
  goldDark: '#A88B50',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
};

interface NotificationSectionProps {
  notifications: NotificationPreferences;
  onUpdate: (updates: Partial<NotificationPreferences>) => void;
}

export function NotificationSection({
  notifications,
  onUpdate,
}: NotificationSectionProps) {
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
        <Text style={styles.sectionEyebrow}>✦ NOTIFICATIONS</Text>
        <Text style={styles.sectionTitle}>Reminders & Alerts</Text>
      </View>

      <View style={styles.card}>
        {items.map((item, index) => {
          const isEnabled = notifications[item.key];
          return (
            <View key={item.key}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.row}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={isEnabled ? COLORS.gold : COLORS.textSecondary}
                  />
                </View>

                <View style={styles.labelCol}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>

                <Switch
                  value={isEnabled}
                  onValueChange={(val) => onUpdate({ [item.key]: val })}
                  trackColor={{ false: '#262D3D', true: COLORS.goldDark }}
                  thumbColor={isEnabled ? COLORS.gold : '#9296A3'}
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
    backgroundColor: COLORS.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  itemSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: 4,
  },
});
