import booksData from '@/assets/data/bible-books.json';
import kjvJohn from '@/assets/data/bibles/kjv/jhn.json';
import rcpvJohn from '@/assets/data/bibles/rcpv/jhn.json';
import {
  BibleBook,
  BookScriptureData,
  Testament,
  TranslationCode,
  TranslationInfo,
  VerseItem,
} from '@/types/bible';

export const TRANSLATIONS: TranslationInfo[] = [
  {
    code: 'KJV',
    name: 'King James Version',
    language: 'English',
    isPublicDomain: true,
    copyrightNotice: 'Public Domain (Free for all study use)',
  },
  {
    code: 'RCPV',
    name: 'Revisada Cebuano Popular',
    language: 'Cebuano',
    isPublicDomain: false,
    copyrightNotice: '© Philippine Bible Society (Study Edition)',
  },
  {
    code: 'NIV',
    name: 'New International Version',
    language: 'English',
    isPublicDomain: false,
    copyrightNotice: '© Biblica, Inc. (API Integration Planned)',
  },
  {
    code: 'NLT',
    name: 'New Living Translation',
    language: 'English',
    isPublicDomain: false,
    copyrightNotice: '© Tyndale House Publishers (API Integration Planned)',
  },
];

// Offline bundled book registry
const BUNDLED_BIBLES: Record<string, Record<string, BookScriptureData>> = {
  KJV: {
    JHN: kjvJohn as unknown as BookScriptureData,
  },
  RCPV: {
    JHN: rcpvJohn as unknown as BookScriptureData,
  },
};

export const BibleService = {
  getBooks(testament?: Testament): BibleBook[] {
    const list = booksData as BibleBook[];
    if (!testament) return list;
    return list.filter((b) => b.testament === testament);
  },

  getBookByCode(code: string): BibleBook | undefined {
    return (booksData as BibleBook[]).find((b) => b.code.toUpperCase() === code.toUpperCase());
  },

  getTranslations(): TranslationInfo[] {
    return TRANSLATIONS;
  },

  getChapterVerses(
    translation: TranslationCode,
    bookCode: string,
    chapter: number
  ): { verses: VerseItem[]; isBundled: boolean } {
    const upperCode = bookCode.toUpperCase();
    const translationMap = BUNDLED_BIBLES[translation];

    if (translationMap && translationMap[upperCode]) {
      const bookData = translationMap[upperCode];
      const chapterVerses = bookData.chapters[String(chapter)];
      if (chapterVerses && chapterVerses.length > 0) {
        return { verses: chapterVerses, isBundled: true };
      }
    }

    // Fallback placeholder for books/chapters not yet bundled offline
    return {
      verses: [
        {
          v: 1,
          t: `Chapter ${chapter} of ${upperCode} in ${translation} is being prepared for download or sync with your Laravel API.`,
        },
      ],
      isBundled: false,
    };
  },
};
