import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  background: "#10131D",
  card: "#191E2B",
  cardLight: "#202637",
  gold: "#D8B56D",
  goldDark: "#A88B50",
  white: "#F5F0E6",
  muted: "#9296A3",
  border: "#2A3040",
  green: "#8BB89B",
};

const today = new Date();

const dateLabel = today.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function getGreeting() {
  const hour = today.getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <Pressable onPress={onPress}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>✦ WORD & WISDOM</Text>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.headerSubtitle}>
              Make room for God's Word today.
            </Text>
          </View>

          <Pressable
            style={styles.avatar}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.avatarText}>U</Text>
          </Pressable>
        </View>

        {/* DAILY VERSE */}
        <View style={styles.verseCard}>
          <View style={styles.verseTop}>
            <Text style={styles.verseEyebrow}>✦ VERSE OF THE DAY</Text>
            <Text style={styles.verseDate}>{dateLabel}</Text>
          </View>

          <Text style={styles.quoteMark}>“</Text>

          <Text style={styles.verseText}>
            I am the vine, ye are the branches: He that
            abideth in me, and I in him, the same bringeth
            forth much fruit.
          </Text>

          <Text style={styles.verseReference}>JOHN 15:5 · KJV</Text>

          <View style={styles.verseDivider} />

          <View style={styles.verseFooter}>
            <Text style={styles.verseFooterText}>A moment in His Word</Text>

            <Pressable
              style={styles.readButton}
              onPress={() =>
                router.push({
                  pathname: '/bible',
                  params: { book: 'JHN', chapter: '15', translation: 'KJV' },
                } as any)
              }
            >
              <Text style={styles.readButtonText}>Read Bible →</Text>
            </Pressable>
          </View>
        </View>

        {/* CONTINUE READING */}
        <SectionHeader
          title="Continue Reading"
          action="Open Bible  →"
          onPress={() =>
            router.push({
              pathname: '/bible',
              params: { book: 'JHN', chapter: '1' },
            } as any)
          }
        />

        <Pressable
          style={styles.readingCard}
          onPress={() =>
            router.push({
              pathname: '/bible',
              params: { book: 'JHN', chapter: '1' },
            } as any)
          }
        >
          <View style={styles.readingIcon}>
            <Text style={styles.readingIconText}>▤</Text>
          </View>

          <View style={styles.readingInfo}>
            <Text style={styles.readingLabel}>YOUR LAST PASSAGE</Text>
            <Text style={styles.readingTitle}>John Chapter 1</Text>
            <Text style={styles.readingSubtitle}>The Word Became Flesh</Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>35% completed</Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {/* DAILY PROGRESS */}
        <SectionHeader title="Your Daily Journey" />

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressCardTitle}>
                Stay rooted in the Word
              </Text>
              <Text style={styles.progressCardSubtitle}>
                Every chapter brings you closer.
              </Text>
            </View>

            <Text style={styles.progressPercent}>1/3</Text>
          </View>

          <View style={styles.dailyTrack}>
            <View style={styles.dailyFill} />
          </View>

          <Text style={styles.dailyFootnote}>
            One of three daily reading goals completed
          </Text>
        </View>

        {/* QUICK ACCESS */}
        <SectionHeader title="Explore Your Faith" />

        <View style={styles.actionGrid}>
          <Pressable
            style={styles.actionCard}
            onPress={() => router.push("/bible")}
          >
            <Text style={styles.actionIcon}>▤</Text>
            <Text style={styles.actionTitle}>Holy Bible</Text>
            <Text style={styles.actionSubtitle}>Read Scripture</Text>
          </Pressable>

          <Pressable
            style={styles.actionCard}
            onPress={() => router.push("/plans")}
          >
            <Text style={styles.actionIcon}>◷</Text>
            <Text style={styles.actionTitle}>Reading Plans</Text>
            <Text style={styles.actionSubtitle}>Grow daily</Text>
          </Pressable>

          <Pressable
            style={styles.actionCard}
            onPress={() => router.push("/journal")}
          >
            <Text style={styles.actionIcon}>✎</Text>
            <Text style={styles.actionTitle}>Study Notes</Text>
            <Text style={styles.actionSubtitle}>Write reflections</Text>
          </Pressable>

          <Pressable
            style={styles.actionCard}
            onPress={() => router.push("/journal")}
          >
            <Text style={styles.actionIcon}>♡</Text>
            <Text style={styles.actionTitle}>Prayer Journal</Text>
            <Text style={styles.actionSubtitle}>Talk with God</Text>
          </Pressable>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerSymbol}>✦</Text>
          <Text style={styles.footerText}>
            Be still, and know that I am God.
          </Text>
          <Text style={styles.footerReference}>PSALM 46:10</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  brand: {
    color: C.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 13,
  },
  greeting: {
    color: C.white,
    fontSize: 25,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: C.muted,
    fontSize: 13,
    marginTop: 6,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.cardLight,
    borderWidth: 1,
    borderColor: C.goldDark,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: C.gold,
    fontSize: 17,
    fontWeight: "700",
  },
  verseCard: {
    backgroundColor: "#20283A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#41404A",
    padding: 21,
    marginBottom: 30,
    overflow: "hidden",
  },
  verseTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  verseEyebrow: {
    color: C.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  verseDate: {
    color: C.muted,
    fontSize: 10,
  },
  quoteMark: {
    color: C.gold,
    fontSize: 55,
    lineHeight: 65,
    marginTop: 12,
    fontWeight: "700",
  },
  verseText: {
    color: C.white,
    fontSize: 21,
    lineHeight: 33,
    fontWeight: "500",
    marginBottom: 19,
  },
  verseReference: {
    color: C.gold,
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: "800",
  },
  verseDivider: {
    height: 1,
    backgroundColor: "#454B58",
    marginVertical: 19,
  },
  verseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  verseFooterText: {
    color: "#B9BDCA",
    fontSize: 11,
  },
  readButton: {
    backgroundColor: C.gold,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  readButtonText: {
    color: "#171923",
    fontWeight: "800",
    fontSize: 11,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 3,
  },
  sectionTitle: {
    color: C.white,
    fontSize: 17,
    fontWeight: "700",
  },
  sectionAction: {
    color: C.gold,
    fontSize: 11,
    fontWeight: "600",
  },
  readingCard: {
    backgroundColor: C.card,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 27,
    gap: 13,
  },
  readingIcon: {
    width: 47,
    height: 55,
    borderRadius: 12,
    backgroundColor: "#303344",
    justifyContent: "center",
    alignItems: "center",
  },
  readingIconText: {
    color: C.gold,
    fontSize: 24,
  },
  readingInfo: {
    flex: 1,
  },
  readingLabel: {
    color: C.gold,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  readingTitle: {
    color: C.white,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 5,
  },
  readingSubtitle: {
    color: C.muted,
    fontSize: 11,
    marginTop: 3,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#343A49",
    borderRadius: 5,
    marginTop: 11,
  },
  progressFill: {
    height: 4,
    width: "35%",
    backgroundColor: C.gold,
    borderRadius: 5,
  },
  progressText: {
    color: C.muted,
    fontSize: 9,
    marginTop: 5,
  },
  chevron: {
    color: C.gold,
    fontSize: 27,
  },
  progressCard: {
    backgroundColor: C.card,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    padding: 17,
    marginBottom: 28,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressCardTitle: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
  },
  progressCardSubtitle: {
    color: C.muted,
    fontSize: 11,
    marginTop: 5,
  },
  progressPercent: {
    color: C.gold,
    fontSize: 22,
    fontWeight: "800",
  },
  dailyTrack: {
    height: 7,
    backgroundColor: "#343A49",
    borderRadius: 6,
    marginTop: 17,
  },
  dailyFill: {
    height: 7,
    width: "33.33%",
    backgroundColor: C.green,
    borderRadius: 6,
  },
  dailyFootnote: {
    color: C.muted,
    fontSize: 10,
    marginTop: 9,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    minHeight: 116,
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 15,
    justifyContent: "center",
  },
  actionIcon: {
    color: C.gold,
    fontSize: 24,
    marginBottom: 9,
  },
  actionTitle: {
    color: C.white,
    fontSize: 13,
    fontWeight: "700",
  },
  actionSubtitle: {
    color: C.muted,
    fontSize: 10,
    marginTop: 5,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    paddingVertical: 15,
  },
  footerSymbol: {
    color: C.gold,
    fontSize: 19,
    marginBottom: 9,
  },
  footerText: {
    color: C.muted,
    fontSize: 12,
    fontStyle: "italic",
  },
  footerReference: {
    color: C.goldDark,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 8,
    fontWeight: "700",
  },
});
