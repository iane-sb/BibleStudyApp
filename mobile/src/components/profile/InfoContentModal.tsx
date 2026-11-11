import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

export type InfoModalType = 'help' | 'privacy' | 'terms' | 'about' | null;

interface InfoContentModalProps {
  type: InfoModalType;
  onClose: () => void;
}

export function InfoContentModal({ type, onClose }: InfoContentModalProps) {
  const { colors } = useAppTheme();

  if (!type) return null;

  const getContent = () => {
    switch (type) {
      case 'help':
        return {
          eyebrow: 'HELP CENTER & FAQ',
          title: 'Frequently Asked Questions',
          sections: [
            {
              heading: 'How do I change Bible translations?',
              body: 'You can tap on the translation pill at the top of the Bible reader or select your default preferred translation in your Profile preferences.',
            },
            {
              heading: 'How is my daily streak calculated?',
              body: 'Every day you read at least one Bible chapter or complete a reading plan task, your streak increments by one. The streak updates automatically at midnight local time.',
            },
            {
              heading: 'Can I read offline without an internet connection?',
              body: 'Yes. The King James Version (KJV) and bundled translations are stored locally on your device for uninterrupted offline quiet time.',
            },
            {
              heading: 'How do I bookmark verses or take notes?',
              body: 'In the Bible tab, tap any verse number to reveal the quick action bar where you can highlight, bookmark, or create a journal reflection.',
            },
          ],
        };
      case 'privacy':
        return {
          eyebrow: 'DATA PRIVACY',
          title: 'Privacy Policy',
          sections: [
            {
              heading: 'Your Devotional Sanctuary',
              body: 'Word & Wisdom treats your spiritual journey with the highest confidentiality. We never sell, rent, or monetize your personal reading habits, prayers, or journal entries.',
            },
            {
              heading: 'Data Storage & Encryption',
              body: 'All study statistics, bookmarks, and private journal entries are encrypted in transit and at rest using modern standard protocols.',
            },
            {
              heading: 'Analytics & Diagnostic Logs',
              body: 'We collect minimal, anonymized crash reports to ensure high reliability across Android and iOS devices. You can opt out at any time.',
            },
            {
              heading: 'Account Deletion & Data Portability',
              body: 'You have full sovereignty over your data. Deleting your account completely erases all personal records and journal thoughts from our databases.',
            },
          ],
        };
      case 'terms':
        return {
          eyebrow: 'LEGAL AGREEMENT',
          title: 'Terms of Service',
          sections: [
            {
              heading: 'Permitted Use',
              body: 'Word & Wisdom is provided for personal Bible study, church devotionals, small group discipleship, and Christian education.',
            },
            {
              heading: 'Scripture Copyrights & Attributions',
              body: 'The King James Version is public domain. NIV is copyright © Biblica, Inc. NLT is copyright © Tyndale House Publishers. RCPV is copyright © Philippine Bible Society. Used in accordance with standard educational licensing guidelines.',
            },
            {
              heading: 'Account Responsibility',
              body: 'Users are responsible for maintaining the confidentiality of their credentials and any activity conducted within their personal study account.',
            },
          ],
        };
      case 'about':
        return {
          eyebrow: 'OUR MISSION',
          title: 'About Word & Wisdom',
          sections: [
            {
              heading: 'Rooted in God’s Living Word',
              body: 'Word & Wisdom was crafted with a singular purpose: to remove friction from daily Scripture study and cultivate an intimate, lifelong devotional walk with Jesus Christ.',
            },
            {
              heading: 'Craftsmanship & Theology',
              body: 'Every screen is intentionally designed in dark navy and warm gold—reminiscent of illuminated manuscripts and sacred study halls—to inspire peace and reverence.',
            },
            {
              heading: 'App Details',
              body: 'Application Version: 1.0.0 (Release Build 42)\nArchitecture: Expo Router + React Native + Laravel Sanctum\nPlatform: Android & iOS Universal Support',
            },
          ],
        };
      default:
        return { eyebrow: '', title: '', sections: [] };
    }
  };

  const content = getContent();

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
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
              <Text style={[styles.sheetEyebrow, { color: colors.gold }]}>
                ✦ {content.eyebrow}
              </Text>
              <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
                {content.title}
              </Text>
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
            contentContainerStyle={styles.scrollBody}
          >
            {content.sections.map((section, idx) => (
              <View
                key={idx}
                style={[
                  styles.sectionBlock,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.sectionHeading, { color: colors.gold }]}>
                  {section.heading}
                </Text>
                <Text style={[styles.sectionBody, { color: colors.textPrimary }]}>
                  {section.body}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.doneBtn,
                { backgroundColor: colors.cardSecondary, borderColor: colors.border },
              ]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.doneBtnText, { color: colors.textPrimary }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    maxHeight: '85%',
    paddingBottom: 24,
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
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
  },
  sectionBlock: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  doneBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
