import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

interface SupportInfoSectionProps {
  onOpenHelp: () => void;
  onOpenFeedback: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAbout: () => void;
}

export function SupportInfoSection({
  onOpenHelp,
  onOpenFeedback,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAbout,
}: SupportInfoSectionProps) {
  const { colors } = useAppTheme();

  const items = [
    {
      title: 'Help Center & FAQs',
      subtitle: 'Answers to common questions and reader guides',
      icon: 'help-circle-outline',
      onPress: onOpenHelp,
    },
    {
      title: 'Send Feedback',
      subtitle: 'Suggest features or report an issue',
      icon: 'chatbubble-ellipses-outline',
      onPress: onOpenFeedback,
    },
    {
      title: 'Privacy Policy',
      subtitle: 'How your devotional data is kept safe',
      icon: 'lock-closed-outline',
      onPress: onOpenPrivacy,
    },
    {
      title: 'Terms of Service',
      subtitle: 'End user license & content usage policies',
      icon: 'document-text-outline',
      onPress: onOpenTerms,
    },
    {
      title: 'About Word & Wisdom',
      subtitle: 'Our story, ministry, and statement of faith',
      icon: 'information-circle-outline',
      onPress: onOpenAbout,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionEyebrow, { color: colors.gold }]}>✦ MINISTRY & LEGAL</Text>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Support & Information
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {items.map((item, index) => (
          <View key={item.title}>
            {index > 0 && (
              <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />
            )}
            <TouchableOpacity
              style={styles.row}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: colors.cardSecondary }]}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={colors.gold}
                />
              </View>

              <View style={styles.labelCol}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* App Version & Spiritual Colophon Footer */}
      <View style={styles.footerContainer}>
        <Text style={[styles.appVersionText, { color: colors.textSecondary }]}>
          Word & Wisdom v1.0.0 (Build 42)
        </Text>
        <Text style={[styles.ministryText, { color: colors.textMuted }]}>
          “For the word of God is quick, and powerful.” · Hebrews 4:12
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
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
    paddingVertical: 10,
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
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  appVersionText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  ministryText: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
});
