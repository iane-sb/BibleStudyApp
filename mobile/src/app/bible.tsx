import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BibleService, TRANSLATIONS } from '@/services/bible-service';
import { BibleBook, Testament, TranslationCode } from '@/types/bible';

const COLORS = {
  background: '#10131D',
  card: '#191E2B',
  cardSecondary: '#202637',
  gold: '#D8B56D',
  goldDark: '#A88B50',
  goldMuted: 'rgba(216, 181, 109, 0.15)',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
  activeTab: '#262D3D',
};

export default function BibleScreen() {
  // Navigation & Reader State
  const [currentBookCode, setCurrentBookCode] = useState<string>('JHN');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [translation, setTranslation] = useState<TranslationCode>('KJV');
  const [fontSize, setFontSize] = useState<number>(18);

  // Selector Modal State
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedTestament, setSelectedTestament] = useState<Testament>('NT');
  const [tempBook, setTempBook] = useState<BibleBook | null>(null);

  // Get active book metadata
  const currentBook = useMemo(() => {
    return BibleService.getBookByCode(currentBookCode) ?? {
      id: 43,
      number: 43,
      code: 'JHN',
      name: 'John',
      nameCeb: 'Juan',
      testament: 'NT' as Testament,
      chapters: 21,
    };
  }, [currentBookCode]);

  // Current translation info
  const translationInfo = useMemo(() => {
    return TRANSLATIONS.find((t) => t.code === translation) ?? TRANSLATIONS[0];
  }, [translation]);

  // Current chapter verses
  const chapterData = useMemo(() => {
    return BibleService.getChapterVerses(translation, currentBookCode, currentChapter);
  }, [translation, currentBookCode, currentChapter]);

  // Books list filtered by testament for the modal
  const booksInModal = useMemo(() => {
    return BibleService.getBooks(selectedTestament);
  }, [selectedTestament]);

  // Displayed book name depending on language
  const displayedBookName =
    translation === 'RCPV' && currentBook.nameCeb
      ? currentBook.nameCeb
      : currentBook.name;

  // Chapter navigation helpers
  const canGoPrevious = currentChapter > 1;
  const canGoNext = currentChapter < currentBook.chapters;

  const handlePrevChapter = () => {
    if (canGoPrevious) {
      setCurrentChapter((c) => c - 1);
    }
  };

  const handleNextChapter = () => {
    if (canGoNext) {
      setCurrentChapter((c) => c + 1);
    }
  };

  const openBookPicker = () => {
    setSelectedTestament(currentBook.testament);
    setTempBook(currentBook);
    setModalVisible(true);
  };

  const handleSelectBook = (book: BibleBook) => {
    setTempBook(book);
  };

  const handleSelectChapter = (ch: number) => {
    if (tempBook) {
      setCurrentBookCode(tempBook.code);
      setCurrentChapter(ch);
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* TOP HEADER CONTROLS */}
      <View style={styles.header}>
        {/* Book & Chapter Trigger */}
        <Pressable style={styles.bookSelectorButton} onPress={openBookPicker}>
          <Text style={styles.bookSelectorText}>
            {displayedBookName} {currentChapter}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.gold} />
        </Pressable>

        {/* Translation Switcher & Font Zoom Controls */}
        <View style={styles.headerRightControls}>
          {/* Translation Toggle Pill */}
          <View style={styles.translationPill}>
            <Pressable
              style={[
                styles.translationOption,
                translation === 'KJV' && styles.translationOptionActive,
              ]}
              onPress={() => setTranslation('KJV')}
            >
              <Text
                style={[
                  styles.translationText,
                  translation === 'KJV' && styles.translationTextActive,
                ]}
              >
                KJV
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.translationOption,
                translation === 'RCPV' && styles.translationOptionActive,
              ]}
              onPress={() => setTranslation('RCPV')}
            >
              <Text
                style={[
                  styles.translationText,
                  translation === 'RCPV' && styles.translationTextActive,
                ]}
              >
                RCPV
              </Text>
            </Pressable>
          </View>

          {/* Font Size Adjusters */}
          <View style={styles.fontControls}>
            <Pressable
              style={styles.fontBtn}
              onPress={() => setFontSize((s) => Math.max(15, s - 1))}
            >
              <Text style={styles.fontBtnText}>A-</Text>
            </Pressable>
            <Pressable
              style={styles.fontBtn}
              onPress={() => setFontSize((s) => Math.min(26, s + 1))}
            >
              <Text style={styles.fontBtnText}>A+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* SCRIPTURE READING VIEW */}
      <ScrollView
        style={styles.readingScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CHAPTER HEADING */}
        <View style={styles.chapterHeader}>
          <Text style={styles.testamentLabel}>
            {currentBook.testament === 'OT' ? 'OLD TESTAMENT' : 'NEW TESTAMENT'} ·{' '}
            {translationInfo.name.toUpperCase()}
          </Text>
          <Text style={styles.chapterTitle}>
            {displayedBookName} {currentChapter}
          </Text>
          <View style={styles.goldDivider} />
        </View>

        {/* VERSES LIST */}
        {chapterData.isBundled ? (
          <View style={styles.versesContainer}>
            {chapterData.verses.map((item) => (
              <View key={item.v} style={styles.verseRow}>
                <Text style={styles.verseNumber}>{item.v}</Text>
                <Text
                  style={[
                    styles.verseText,
                    { fontSize, lineHeight: Math.round(fontSize * 1.65) },
                  ]}
                >
                  {item.t}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.placeholderCard}>
            <Ionicons name="cloud-download-outline" size={36} color={COLORS.gold} />
            <Text style={styles.placeholderTitle}>Chapter Available via Sync</Text>
            <Text style={styles.placeholderBody}>
              {currentBook.name} Chapter {currentChapter} in {translationInfo.name} will be
              synced from your Laravel API or loaded in full offline bundles.
            </Text>
            <Pressable
              style={styles.backToJohnBtn}
              onPress={() => {
                setCurrentBookCode('JHN');
                setCurrentChapter(1);
              }}
            >
              <Text style={styles.backToJohnText}>Read John 1 (Bundled) →</Text>
            </Pressable>
          </View>
        )}

        {/* CHAPTER BOTTOM NAVIGATION */}
        <View style={styles.bottomNav}>
          <Pressable
            style={[styles.navBtn, !canGoPrevious && styles.navBtnDisabled]}
            disabled={!canGoPrevious}
            onPress={handlePrevChapter}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={canGoPrevious ? COLORS.gold : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.navBtnText,
                !canGoPrevious && styles.navBtnTextDisabled,
              ]}
            >
              Chapter {currentChapter - 1}
            </Text>
          </Pressable>

          <Text style={styles.chapterProgress}>
            {currentChapter} / {currentBook.chapters}
          </Text>

          <Pressable
            style={[styles.navBtn, !canGoNext && styles.navBtnDisabled]}
            disabled={!canGoNext}
            onPress={handleNextChapter}
          >
            <Text
              style={[
                styles.navBtnText,
                !canGoNext && styles.navBtnTextDisabled,
              ]}
            >
              Chapter {currentChapter + 1}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={canGoNext ? COLORS.gold : COLORS.textSecondary}
            />
          </Pressable>
        </View>

        {/* COPYRIGHT / ATTRIBUTION FOOTER */}
        <View style={styles.attributionFooter}>
          <Text style={styles.attributionText}>
            ✦ {translationInfo.name} ({translationInfo.code})
          </Text>
          <Text style={styles.copyrightText}>
            {translationInfo.copyrightNotice}
          </Text>
        </View>
      </ScrollView>

      {/* BOOK & CHAPTER SELECTOR MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Scripture</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </Pressable>
            </View>

            {/* Testament Selector Tabs */}
            <View style={styles.testamentTabs}>
              <Pressable
                style={[
                  styles.testamentTab,
                  selectedTestament === 'OT' && styles.testamentTabActive,
                ]}
                onPress={() => setSelectedTestament('OT')}
              >
                <Text
                  style={[
                    styles.testamentTabText,
                    selectedTestament === 'OT' && styles.testamentTabTextActive,
                  ]}
                >
                  Old Testament (39)
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.testamentTab,
                  selectedTestament === 'NT' && styles.testamentTabActive,
                ]}
                onPress={() => setSelectedTestament('NT')}
              >
                <Text
                  style={[
                    styles.testamentTabText,
                    selectedTestament === 'NT' && styles.testamentTabTextActive,
                  ]}
                >
                  New Testament (27)
                </Text>
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              {/* Left Column: Books List */}
              <View style={styles.booksColumn}>
                <Text style={styles.columnHeader}>BOOKS</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {booksInModal.map((b) => {
                    const isSelected = tempBook?.code === b.code;
                    const bookTitle =
                      translation === 'RCPV' && b.nameCeb ? b.nameCeb : b.name;
                    return (
                      <Pressable
                        key={b.code}
                        style={[
                          styles.bookItem,
                          isSelected && styles.bookItemActive,
                        ]}
                        onPress={() => handleSelectBook(b)}
                      >
                        <Text
                          style={[
                            styles.bookItemText,
                            isSelected && styles.bookItemTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {bookTitle}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Right Column: Chapters Grid */}
              <View style={styles.chaptersColumn}>
                <Text style={styles.columnHeader}>
                  {tempBook
                    ? `${translation === 'RCPV' && tempBook.nameCeb ? tempBook.nameCeb : tempBook.name} CHAPTERS`
                    : 'CHAPTERS'}
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.chapterGrid}>
                    {tempBook &&
                      Array.from({ length: tempBook.chapters }, (_, i) => i + 1).map(
                        (ch) => {
                          const isCurrent =
                            tempBook.code === currentBookCode &&
                            ch === currentChapter;
                          return (
                            <Pressable
                              key={ch}
                              style={[
                                styles.chapterCell,
                                isCurrent && styles.chapterCellActive,
                              ]}
                              onPress={() => handleSelectChapter(ch)}
                            >
                              <Text
                                style={[
                                  styles.chapterCellText,
                                  isCurrent && styles.chapterCellTextActive,
                                ]}
                              >
                                {ch}
                              </Text>
                            </Pressable>
                          );
                        }
                      )}
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  bookSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardSecondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  bookSelectorText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  translationPill: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 2,
  },
  translationOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  translationOptionActive: {
    backgroundColor: COLORS.gold,
  },
  translationText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  translationTextActive: {
    color: COLORS.background,
  },
  fontControls: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 2,
  },
  fontBtn: {
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  fontBtnText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  readingScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  chapterHeader: {
    alignItems: 'center',
    marginBottom: 26,
  },
  testamentLabel: {
    color: COLORS.gold,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 6,
  },
  chapterTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  goldDivider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: 14,
    borderRadius: 1,
  },
  versesContainer: {
    marginBottom: 30,
  },
  verseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  verseNumber: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
    width: 24,
    paddingTop: 4,
  },
  verseText: {
    flex: 1,
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  placeholderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  placeholderTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  placeholderBody: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 18,
  },
  backToJohnBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backToJohnText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 24,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '600',
  },
  navBtnTextDisabled: {
    color: COLORS.textSecondary,
  },
  chapterProgress: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  attributionFooter: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  attributionText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  copyrightText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 4,
  },
  testamentTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardSecondary,
  },
  testamentTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  testamentTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
    backgroundColor: COLORS.card,
  },
  testamentTabText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  testamentTabTextActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  modalBody: {
    flex: 1,
    flexDirection: 'row',
  },
  booksColumn: {
    width: '52%',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chaptersColumn: {
    width: '48%',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  columnHeader: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  bookItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 2,
  },
  bookItemActive: {
    backgroundColor: COLORS.goldMuted,
  },
  bookItemText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  bookItemTextActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  chapterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  chapterCell: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterCellActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  chapterCellText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  chapterCellTextActive: {
    color: COLORS.background,
    fontWeight: '700',
  },
});
