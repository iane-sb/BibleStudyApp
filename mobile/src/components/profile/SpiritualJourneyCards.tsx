import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { SpiritualJourneyStats } from '@/types/profile';

interface SpiritualJourneyCardsProps {
  stats: SpiritualJourneyStats;
}

export function SpiritualJourneyCards({ stats }: SpiritualJourneyCardsProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <Text style={[styles.sectionEyebrow, { color: colors.gold }]}>✦ SPIRITUAL DISCIPLINE</Text>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Journey Overview</Text>
        </View>
        <View
          style={[
            styles.streakPill,
            { backgroundColor: `${colors.orange}1f`, borderColor: `${colors.orange}4d` },
          ]}
        >
          <Ionicons name="flame" size={14} color={colors.orange} />
          <Text style={[styles.streakPillText, { color: colors.orange }]}>
            {stats.currentStreakDays}d streak
          </Text>
        </View>
      </View>

      {/* Featured Streak Banner */}
      <View
        style={[
          styles.featuredCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.featuredIconContainer,
            { backgroundColor: `${colors.orange}24`, borderColor: `${colors.orange}59` },
          ]}
        >
          <Ionicons name="flame" size={28} color={colors.orange} />
        </View>
        <View style={styles.featuredContent}>
          <View style={styles.featuredRow}>
            <Text style={[styles.featuredNumber, { color: colors.textPrimary }]}>
              {stats.currentStreakDays}
            </Text>
            <Text style={[styles.featuredUnit, { color: colors.orange }]}>Days In a Row</Text>
          </View>
          <Text style={[styles.featuredSub, { color: colors.textSecondary }]}>
            “Thy word is a lamp unto my feet, and a light unto my path.”
          </Text>
        </View>
      </View>

      {/* 2x2 Stats Grid */}
      <View style={styles.grid}>
        {/* Chapters Read */}
        <View
          style={[
            styles.gridCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.iconBox, { backgroundColor: `${colors.gold}24` }]}>
            <Ionicons name="book" size={18} color={colors.gold} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {stats.chaptersRead}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Chapters Read</Text>
        </View>

        {/* Plans Completed */}
        <View
          style={[
            styles.gridCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.iconBox, { backgroundColor: `${colors.success}24` }]}>
            <Ionicons name="ribbon" size={18} color={colors.success} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {stats.readingPlansCompleted}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Plans Completed</Text>
        </View>

        {/* Bookmarked Verses */}
        <View
          style={[
            styles.gridCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.iconBox, { backgroundColor: `${colors.blue}24` }]}>
            <Ionicons name="bookmark" size={18} color={colors.blue} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {stats.totalBookmarkedVerses}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bookmarks</Text>
        </View>

        {/* Journal Entries */}
        <View
          style={[
            styles.gridCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.iconBox, { backgroundColor: `${colors.purple}24` }]}>
            <Ionicons name="journal" size={18} color={colors.purple} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {stats.totalJournalEntries}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Journal Notes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {},
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
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  featuredIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredContent: {
    flex: 1,
  },
  featuredRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  featuredNumber: {
    fontSize: 22,
    fontWeight: '800',
  },
  featuredUnit: {
    fontSize: 13,
    fontWeight: '600',
  },
  featuredSub: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
});
