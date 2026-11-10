import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  success: '#8BB89B',
};

export default function BibleScreen() {
  const params = useLocalSearchParams<{
    book?: string;
    chapter?: string;
    translation?: string;
  }>();

  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  // Navigation & Reader State
  const [currentBookCode, setCurrentBookCode] = useState<string>('JHN');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [translation, setTranslation] = useState<TranslationCode>('KJV');
  const [fontSize, setFontSize] = useState<number>(18);

  // Selector Modal State
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [translationModalVisible, setTranslationModalVisible] = useState<boolean>(false);
  const [selectedTestament, setSelectedTestament] = useState<Testament>('NT');
  const [tempBook, setTempBook] = useState<BibleBook | null>(null);

  // Handle incoming deep link or router params
  useEffect(() => {
    if (params.book && typeof params.book === 'string') {
      const code = params.book.toUpperCase();
      if (BibleService.getBookByCode(code)) {
        setCurrentBookCode(code);
      }
    }
    if (params.chapter) {
      const ch = parseInt(String(params.chapter), 10);
      if (!isNaN(ch) && ch > 0) {
        setCurrentChapter(ch);
      }
    }
    if (params.translation && typeof params.translation === 'string') {
      const tr = params.translation.toUpperCase() as TranslationCode;
      if (TRANSLATIONS.some((t) => t.code === tr)) {
        setTranslation(tr);
      }
    }
  }, [params.book, params.chapter, params.translation]);

  // Reset scroll to top when chapter or book or translation changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentBookCode, currentChapter, translation]);

  // All books
  const allBooks = useMemo(() => BibleService.getBooks(), []);

  // Active book metadata
  const currentBook = useMemo(() => {
    return (
      BibleService.getBookByCode(currentBookCode) ?? {
        id: 43,
        number: 43,
        code: 'JHN',
        name: 'John',
        nameCeb: 'Juan',
        testament: 'NT' as Testament,
        chapters: 21,
      }
    );
  }, [currentBookCode]);

  const currentBookIndex = useMemo(() => {
    return allBooks.findIndex((b) => b.code === currentBook.code);
  }, [allBooks, currentBook.code]);

  // Current translation info
  const translationInfo = useMemo(() => {
    return TRANSLATIONS.find((t) => t.code === translation) ?? TRANSLATIONS[0];
  }, [translation]);

  // Current chapter verses (fully offline for all translations)
  const chapterData = useMemo(() => {
    return BibleService.getChapterVerses(translation, currentBookCode, currentChapter);
  }, [translation, currentBookCode, currentChapter]);

  // Books list filtered by testament for the picker modal
  const booksInModal = useMemo(() => {
    return BibleService.getBooks(selectedTestament);
  }, [selectedTestament]);

  // Displayed book name depending on active translation
  const displayedBookName =
    translation === 'RCPV' && currentBook.nameCeb
      ? currentBook.nameCeb
      : currentBook.name;

  // Chapter navigation helpers (allows continuous reading across books)
  const canGoPrevious = currentChapter > 1 || currentBookIndex > 0;
  const canGoNext =
    currentChapter < currentBook.chapters || currentBookIndex < allBooks.length - 1;

  const prevButtonLabel = useMemo(() => {
    if (currentChapter > 1) {
      return `Chapter ${currentChapter - 1}`;
    }
    if (currentBookIndex > 0) {
      const prevBook = allBooks[currentBookIndex - 1];
      const name = translation === 'RCPV' && prevBook.nameCeb ? prevBook.nameCeb : prevBook.name;
      return `${name} ${prevBook.chapters}`;
    }
    return '';
  }, [currentChapter, currentBookIndex, allBooks, translation]);

  const nextButtonLabel = useMemo(() => {
    if (currentChapter < currentBook.chapters) {
      return `Chapter ${currentChapter + 1}`;
    }
    if (currentBookIndex < allBooks.length - 1) {
      const nextBook = allBooks[currentBookIndex + 1];
      const name = translation === 'RCPV' && nextBook.nameCeb ? nextBook.nameCeb : nextBook.name;
      return `${name} 1`;
    }
    return '';
  }, [currentChapter, currentBook.chapters, currentBookIndex, allBooks, translation]);

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter((c) => c - 1);
    } else if (currentBookIndex > 0) {
      const prevBook = allBooks[currentBookIndex - 1];
      setCurrentBookCode(prevBook.code);
      setCurrentChapter(prevBook.chapters);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter((c) => c + 1);
    } else if (currentBookIndex < allBooks.length - 1) {
      const nextBook = allBooks[currentBookIndex + 1];
      setCurrentBookCode(nextBook.code);
      setCurrentChapter(1);
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
        <Pressable
          style={styles.bookSelectorButton}
          onPress={openBookPicker}
          accessibilityRole="button"
          accessibilityLabel="Select book and chapter"
        >
          <Text style={styles.bookSelectorText} numberOfLines={1}>
            {displayedBookName} {currentChapter}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.gold} />
        </Pressable>

        {/* Translation Switcher & Font Controls */}
        <View style={styles.headerRightControls}>
          {/* Translation Toggle Pills (All 4 translations) */}
          <View style={styles.translationPill}>
            {TRANSLATIONS.map((t) => {
              const active = translation === t.code;
              return (
                <Pressable
                  key={t.code}
                  style={[
                    styles.translationOption,
                    active && styles.translationOptionActive,
                  ]}
                  onPress={() => setTranslation(t.code)}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch translation to ${t.code}`}
                >
                  <Text
                    style={[
                      styles.translationText,
                      active && styles.translationTextActive,
                    ]}
                  >
                    {t.code}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Font Size Adjusters */}
          <View style={styles.fontControls}>
            <Pressable
              style={styles.fontBtn}
              onPress={() => setFontSize((s) => Math.max(14, s - 1))}
              accessibilityRole="button"
              accessibilityLabel="Decrease font size"
            >
              <Text style={styles.fontBtnText}>A-</Text>
            </Pressable>
            <Pressable
              style={styles.fontBtn}
              onPress={() => setFontSize((s) => Math.min(28, s + 1))}
              accessibilityRole="button"
              accessibilityLabel="Increase font size"
            >
              <Text style={styles.fontBtnText}>A+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* SCRIPTURE READING VIEW */}
      <ScrollView
        ref={scrollRef}
        style={styles.readingScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CHAPTER HEADING */}
        <View style={styles.chapterHeader}>
          <View style={styles.testamentBadgeRow}>
            <Text style={styles.testamentLabel}>
              {currentBook.testament === 'OT' ? 'OLD TESTAMENT' : 'NEW TESTAMENT'}
            </Text>
            <View style={styles.offlinePill}>
              <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
              <Text style={styles.offlinePillText}>OFFLINE</Text>
            </View>
          </View>

          <Text style={styles.chapterTitle}>
            {displayedBookName} {currentChapter}
          </Text>

          <Pressable
            style={styles.translationSubtitleBtn}
            onPress={() => setTranslationModalVisible(true)}
          >
            <Text style={styles.translationSubTitle}>
              {translationInfo.name} ({translationInfo.code})
            </Text>
            <Ionicons name="information-circle-outline" size={15} color={COLORS.gold} />
          </Pressable>

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
            <Ionicons name="alert-circle-outline" size={36} color={COLORS.gold} />
            <Text style={styles.placeholderTitle}>Chapter Not Found</Text>
            <Text style={styles.placeholderBody}>
              {currentBook.name} Chapter {currentChapter} in {translationInfo.name} could not be loaded.
            </Text>
            <Pressable
              style={styles.backToJohnBtn}
              onPress={() => {
                setCurrentBookCode('JHN');
                setCurrentChapter(1);
              }}
            >
              <Text style={styles.backToJohnText}>Go to John 1 →</Text>
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
              numberOfLines={1}
            >
              {prevButtonLabel}
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
              numberOfLines={1}
            >
              {nextButtonLabel}
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
          <View style={styles.footerBadge}>
            <Ionicons name="cloud-done-outline" size={15} color={COLORS.gold} />
            <Text style={styles.attributionText}>
              {translationInfo.name} ({translationInfo.code}) · Complete Offline Bible
            </Text>
          </View>
          <Text style={styles.copyrightText}>
            {translationInfo.copyrightNotice}
          </Text>
        </View>
      </ScrollView>

      {/* TRANSLATION SELECTION / INFO MODAL */}
      <Modal
        visible={translationModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setTranslationModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.translationModalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Bible Translations</Text>
                <Text style={styles.modalSubtitle}>All 4 translations are 100% available offline</Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setTranslationModalVisible(false)}
              >
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={styles.translationList} showsVerticalScrollIndicator={false}>
              {TRANSLATIONS.map((item) => {
                const isSelected = translation === item.code;
                return (
                  <Pressable
                    key={item.code}
                    style={[
                      styles.translationCard,
                      isSelected && styles.translationCardActive,
                    ]}
                    onPress={() => {
                      setTranslation(item.code);
                      setTranslationModalVisible(false);
                    }}
                  >
                    <View style={styles.translationCardHeader}>
                      <View style={styles.translationCodeBadge}>
                        <Text style={styles.translationCodeText}>{item.code}</Text>
                      </View>
                      <View style={styles.translationNameCol}>
                        <Text style={styles.translationCardTitle}>{item.name}</Text>
                        <Text style={styles.translationCardLang}>{item.language}</Text>
                      </View>
                      {isSelected ? (
                        <Ionicons name="checkmark-circle" size={22} color={COLORS.gold} />
                      ) : (
                        <Ionicons name="ellipse-outline" size={22} color={COLORS.textSecondary} />
                      )}
                    </View>

                    <View style={styles.translationCardStatus}>
                      <Ionicons name="cloud-done" size={13} color={COLORS.success} />
                      <Text style={styles.translationCardStatusText}>
                        Downloaded · Full Old & New Testament
                      </Text>
                    </View>

                    {item.copyrightNotice && (
                      <Text style={styles.translationNoticeText}>
                        {item.copyrightNotice}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  bookSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardSecondary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
    flexShrink: 1,
    maxWidth: '42%',
  },
  bookSelectorText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
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
    paddingHorizontal: 7,
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
    paddingHorizontal: 6,
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
    paddingVertical: 22,
    paddingBottom: 40,
  },
  chapterHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  testamentBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  testamentLabel: {
    color: COLORS.gold,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 184, 155, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  offlinePillText: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  chapterTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  translationSubtitleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: COLORS.cardSecondary,
  },
  translationSubTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  goldDivider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: 14,
    borderRadius: 1,
  },
  versesContainer: {
    marginBottom: 28,
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
    width: 26,
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
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 24,
    gap: 8,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
    maxWidth: '42%',
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  navBtnText: {
    color: COLORS.gold,
    fontSize: 12,
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
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  attributionText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  copyrightText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 320,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
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
  translationModalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 24,
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
  modalSubtitle: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  translationList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  translationCard: {
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  translationCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(216, 181, 109, 0.08)',
  },
  translationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  translationCodeBadge: {
    backgroundColor: COLORS.goldMuted,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  translationCodeText: {
    color: COLORS.gold,
    fontWeight: '800',
    fontSize: 13,
  },
  translationNameCol: {
    flex: 1,
  },
  translationCardTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  translationCardLang: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  translationCardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  translationCardStatusText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '600',
  },
  translationNoticeText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 6,
    fontStyle: 'italic',
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
