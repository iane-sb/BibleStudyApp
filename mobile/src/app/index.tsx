import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppPalette, useAppTheme } from "@/contexts/ThemeContext";
import { useDailyVerse } from "@/hooks/use-daily-verse";
import { useProfile } from "@/hooks/use-profile";
import { AVATAR_PRESETS } from "@/services/profile-service";

const today = new Date();

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
  colors,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
  colors: AppPalette;
}) {
  return (
    <View style={stylesStatic.sectionHeader}>
      <Text style={[stylesStatic.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      {action && (
        <Pressable onPress={onPress}>
          <Text style={[stylesStatic.sectionAction, { color: colors.gold }]}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const { colors, isDark } = useAppTheme();
  const { profile } = useProfile();
  const activePreset = AVATAR_PRESETS.find((p) => p.id === profile?.avatarPreset);

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  // ─── Daily Verse Hook ───────────────────────────────────────────────────────
  const {
    verse,
    isBookmarked,
    loading: verseLoading,
    fadeAnim,
    toggleBookmark,
    simulateNextVerse,
  } = useDailyVerse();

  const handleShareVerse = async () => {
    if (!verse) return;
    try {
      await Share.share({
        message: `"${verse.text}"\n\n— ${verse.reference} · ${verse.translation}\n\nShared from Word & Wisdom`,
      });
    } catch {
      // user dismissed share sheet
    }
  };

  const handleSimulateRotate = () => {
    Alert.alert(
      "🔧 Dev Tool",
      "Simulate the 6:00 AM verse rotation to test the daily verse transition?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Rotate Now", onPress: () => simulateNextVerse() },
      ]
    );
  };

  // Format date label fresh on each render (supports timezone changes)
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle={colors.statusBar} />

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
            accessibilityLabel="View profile"
          >
            {profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatarImg}
                contentFit="cover"
              />
            ) : activePreset ? (
              <Ionicons
                name={activePreset.icon as any}
                size={22}
                color={activePreset.iconColor}
              />
            ) : (
              <Text style={styles.avatarText}>
                {profile?.name ? profile.name[0].toUpperCase() : "U"}
              </Text>
            )}
          </Pressable>
        </View>

        {/* DAILY VERSE */}
        <Animated.View style={[styles.verseCard, { opacity: fadeAnim }]}>
          <View style={styles.verseTop}>
            <Text style={styles.verseEyebrow}>✦ VERSE OF THE DAY</Text>
            <View style={styles.verseTopRight}>
              <Text style={styles.verseDate}>{dateLabel}</Text>
              {__DEV__ && (
                <Pressable
                  onPress={handleSimulateRotate}
                  style={styles.devBtn}
                  accessibilityLabel="Simulate verse rotation"
                >
                  <Ionicons name="refresh-circle-outline" size={16} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>
          </View>

          <Text style={styles.quoteMark}>“</Text>

          {verseLoading || !verse ? (
            <Text style={styles.verseText}>Loading today’s verse…</Text>
          ) : (
            <>
              <Text style={styles.verseText}>{verse.text}</Text>
              <Text style={styles.verseReference}>
                {verse.reference.toUpperCase()} · {verse.translation}
              </Text>
              {verse.themeLabel ? (
                <Text style={styles.verseThemeTag}>✦ {verse.themeLabel.toUpperCase()}</Text>
              ) : null}
            </>
          )}

          <View style={styles.verseDivider} />

          <View style={styles.verseFooter}>
            <View style={styles.verseActions}>
              <Pressable
                style={styles.verseActionBtn}
                onPress={toggleBookmark}
                accessibilityLabel={isBookmarked ? "Remove bookmark" : "Bookmark verse"}
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color={isBookmarked ? colors.gold : colors.textSecondary}
                />
              </Pressable>
              <Pressable
                style={styles.verseActionBtn}
                onPress={handleShareVerse}
                accessibilityLabel="Share verse"
              >
                <Ionicons
                  name="share-social-outline"
                  size={18}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <Pressable
              style={styles.readButton}
              onPress={() =>
                verse
                  ? router.push({
                      pathname: "/bible",
                      params: {
                        book: verse.bookCode,
                        chapter: String(verse.chapter),
                        translation: verse.translation,
                      },
                    } as any)
                  : router.push({ pathname: "/bible" } as any)
              }
            >
              <Text style={styles.readButtonText}>Read in Bible →</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* CONTINUE READING */}
        <SectionHeader
          title="Continue Reading"
          action="Open Bible  →"
          colors={colors}
          onPress={() =>
            router.push({
              pathname: "/bible",
              params: { book: "JHN", chapter: "1" },
            } as any)
          }
        />

        <Pressable
          style={styles.readingCard}
          onPress={() =>
            router.push({
              pathname: "/bible",
              params: { book: "JHN", chapter: "1" },
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
        <SectionHeader title="Your Daily Journey" colors={colors} />

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
        <SectionHeader title="Explore Your Faith" colors={colors} />

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

const stylesStatic = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  sectionAction: {
    fontSize: 11,
    fontWeight: "600",
  },
});

function createStyles(C: AppPalette, isDark: boolean) {
  return StyleSheet.create({
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
      color: C.textPrimary,
      fontSize: 25,
      fontWeight: "700",
    },
    headerSubtitle: {
      color: C.textSecondary,
      fontSize: 13,
      marginTop: 6,
    },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: C.cardSecondary,
      borderWidth: 1,
      borderColor: C.goldDark,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    avatarImg: {
      width: 46,
      height: 46,
      borderRadius: 23,
    },
    avatarText: {
      color: C.gold,
      fontSize: 17,
      fontWeight: "700",
    },
    verseCard: {
      backgroundColor: C.verseCardBg,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: C.verseCardBorder,
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
      color: C.textSecondary,
      fontSize: 10,
    },
    verseTopRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    verseThemeTag: {
      color: C.textSecondary,
      fontSize: 9,
      fontWeight: "700",
      letterSpacing: 1.2,
      marginTop: 6,
    },
    verseActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    verseActionBtn: {
      padding: 7,
      borderRadius: 8,
    },
    devBtn: {
      padding: 2,
      opacity: 0.5,
    },
    quoteMark: {
      color: C.gold,
      fontSize: 55,
      lineHeight: 65,
      marginTop: 12,
      fontWeight: "700",
    },
    verseText: {
      color: C.textPrimary,
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
      backgroundColor: C.verseDivider,
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
      color: C.verseFooterText,
      fontSize: 11,
    },
    readButton: {
      backgroundColor: C.readBtnBg,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
    },
    readButtonText: {
      color: C.readBtnText,
      fontWeight: "800",
      fontSize: 11,
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
      backgroundColor: C.readingIconBg,
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
      color: C.textPrimary,
      fontSize: 15,
      fontWeight: "700",
      marginTop: 5,
    },
    readingSubtitle: {
      color: C.textSecondary,
      fontSize: 11,
      marginTop: 3,
    },
    progressTrack: {
      height: 4,
      backgroundColor: C.progressTrack,
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
      color: C.textSecondary,
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
      color: C.textPrimary,
      fontSize: 14,
      fontWeight: "700",
    },
    progressCardSubtitle: {
      color: C.textSecondary,
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
      backgroundColor: C.progressTrack,
      borderRadius: 6,
      marginTop: 17,
    },
    dailyFill: {
      height: 7,
      width: "33.33%",
      backgroundColor: C.success,
      borderRadius: 6,
    },
    dailyFootnote: {
      color: C.textSecondary,
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
      color: C.textPrimary,
      fontSize: 13,
      fontWeight: "700",
    },
    actionSubtitle: {
      color: C.textSecondary,
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
      color: C.textSecondary,
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
}
