import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { SpiritualJourneyStats } from '@/types/profile';

const COLORS = {
  card: '#191E2B',
  cardLight: '#202637',
  gold: '#D8B56D',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
  orange: '#F59E0B',
  green: '#8BB89B',
  blue: '#60A5FA',
  purple: '#C084FC',
};

interface SpiritualJourneyCardsProps {
  stats: SpiritualJourneyStats;
}

export function SpiritualJourneyCards({ stats }: SpiritualJourneyCardsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionEyebrow}>✦ SPIRITUAL DISCIPLINE</Text>
          <Text style={styles.sectionTitle}>Journey Overview</Text>
        </View>
        <View style={styles.streakPill}>
          <Ionicons name="flame" size={14} color={COLORS.orange} />
          <Text style={styles.streakPillText}>{stats.currentStreakDays}d streak</Text>
        </View>
      </View>

      {/* Featured Streak Banner */}
      <View style={styles.featuredCard}>
        <View style={styles.featuredIconContainer}>
          <Ionicons name="flame" size={28} color={COLORS.orange} />
        </View>
        <View style={styles.featuredContent}>
          <View style={styles.featuredRow}>
            <Text style={styles.featuredNumber}>{stats.currentStreakDays}</Text>
            <Text style={styles.featuredUnit}>Days In a Row</Text>
          </View>
          <Text style={styles.featuredSub}>
            “Thy word is a lamp unto my feet, and a light unto my path.”
          </Text>
        </View>
      </View>

      {/* 2x2 Stats Grid */}
      <View style={styles.grid}>
        {/* Chapters Read */}
        <View style={styles.gridCard}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(216, 181, 109, 0.12)' }]}>
            <Ionicons name="book" size={18} color={COLORS.gold} />
          </View>
          <Text style={styles.statValue}>{stats.chaptersRead}</Text>
          <Text style={styles.statLabel}>Chapters Read</Text>
        </View>

        {/* Plans Completed */}
        <View style={styles.gridCard}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(139, 184, 155, 0.12)' }]}>
            <Ionicons name="ribbon" size={18} color={COLORS.green} />
          </View>
          <Text style={styles.statValue}>{stats.readingPlansCompleted}</Text>
          <Text style={styles.statLabel}>Plans Completed</Text>
        </View>

        {/* Bookmarked Verses */}
        <View style={styles.gridCard}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(96, 165, 250, 0.12)' }]}>
            <Ionicons name="bookmark" size={18} color={COLORS.blue} />
          </View>
          <Text style={styles.statValue}>{stats.totalBookmarkedVerses}</Text>
          <Text style={styles.statLabel}>Bookmarks</Text>
        </View>

        {/* Journal Entries */}
        <View style={styles.gridCard}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(192, 132, 252, 0.12)' }]}>
            <Ionicons name="journal" size={18} color={COLORS.purple} />
          </View>
          <Text style={styles.statValue}>{stats.totalJournalEntries}</Text>
          <Text style={styles.statLabel}>Journal Notes</Text>
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
    color: COLORS.gold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.orange,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  featuredIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
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
    color: COLORS.textPrimary,
  },
  featuredUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.orange,
  },
  featuredSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
});
