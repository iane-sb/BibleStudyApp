import booksData from '@/assets/data/bible-books.json';
import {
  BibleBook,
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
    copyrightNotice: '© Biblica, Inc. (Offline Study Edition)',
  },
  {
    code: 'NLT',
    name: 'New Living Translation',
    language: 'English',
    isPublicDomain: false,
    copyrightNotice: '© Tyndale House Publishers (Offline Study Edition)',
  },
];

type TranslationData = Record<string, string[][]>;

// Lazy memory cache for active translations
const translationCache: Partial<Record<TranslationCode, TranslationData>> = {};

function getTranslationData(code: TranslationCode): TranslationData | null {
  if (translationCache[code]) {
    return translationCache[code]!;
  }

  try {
    let data: TranslationData | null = null;
    switch (code) {
      case 'KJV':
        data = require('@/assets/data/bibles/kjv.json') as TranslationData;
        break;
      case 'RCPV':
        data = require('@/assets/data/bibles/rcpv.json') as TranslationData;
        break;
      case 'NIV':
        data = require('@/assets/data/bibles/niv.json') as TranslationData;
        break;
      case 'NLT':
        data = require('@/assets/data/bibles/nlt.json') as TranslationData;
        break;
      default:
        break;
    }

    if (data) {
      translationCache[code] = data;
      return data;
    }
  } catch (error) {
    console.warn(`[BibleService] Error loading offline data for ${code}:`, error);
  }

  return null;
}

export const BibleService = {
  getBooks(testament?: Testament): BibleBook[] {
    const list = booksData as BibleBook[];
    if (!testament) return list;
    return list.filter((b) => b.testament === testament);
  },

  getBookByCode(code: string): BibleBook | undefined {
    return (booksData as BibleBook[]).find(
      (b) => b.code.toUpperCase() === code.toUpperCase()
    );
  },

  getTranslations(): TranslationInfo[] {
    return TRANSLATIONS;
  },

  isOfflineAvailable(translation: TranslationCode): boolean {
    return ['KJV', 'RCPV', 'NIV', 'NLT'].includes(translation);
  },

  getChapterVerses(
    translation: TranslationCode,
    bookCode: string,
    chapter: number
  ): { verses: VerseItem[]; isBundled: boolean } {
    const upperCode = bookCode.toUpperCase();
    const data = getTranslationData(translation);

    if (data && data[upperCode]) {
      const chapterIdx = chapter - 1;
      const chapterVerses = data[upperCode][chapterIdx];
      if (chapterVerses && chapterVerses.length > 0) {
        return {
          verses: chapterVerses.map((verseText, idx) => ({
            v: idx + 1,
            t: verseText,
          })),
          isBundled: true,
        };
      }
    }

    // Fallback placeholder in the rare case a chapter is out of range
    return {
      verses: [
        {
          v: 1,
          t: `Chapter ${chapter} of ${upperCode} in ${translation} could not be loaded offline.`,
        },
      ],
      isBundled: false,
    };
  },

  searchVerses(
    query: string,
    translation: TranslationCode,
    limit: number = 20
  ): Array<{ bookCode: string; chapter: number; verse: number; text: string }> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const data = getTranslationData(translation);
    if (!data) return [];

    const results: Array<{
      bookCode: string;
      chapter: number;
      verse: number;
      text: string;
    }> = [];

    const books = booksData as BibleBook[];
    for (const book of books) {
      const bookVerses = data[book.code];
      if (!bookVerses) continue;

      for (let chIdx = 0; chIdx < bookVerses.length; chIdx++) {
        const ch = bookVerses[chIdx];
        for (let vIdx = 0; vIdx < ch.length; vIdx++) {
          const text = ch[vIdx];
          if (text.toLowerCase().includes(trimmed)) {
            results.push({
              bookCode: book.code,
              chapter: chIdx + 1,
              verse: vIdx + 1,
              text,
            });
            if (results.length >= limit) return results;
          }
        }
      }
    }

    return results;
  },
};
