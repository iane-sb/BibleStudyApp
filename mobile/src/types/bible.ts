export type Testament = 'OT' | 'NT';

export type TranslationCode = 'KJV' | 'RCPV' | 'NIV' | 'NLT';

export interface TranslationInfo {
  code: TranslationCode;
  name: string;
  language: string;
  isPublicDomain: boolean;
  copyrightNotice?: string;
}

export interface BibleBook {
  id: number;
  number: number;
  code: string;
  name: string;
  nameCeb?: string;
  testament: Testament;
  chapters: number;
}

export interface VerseItem {
  v: number;
  t: string;
}

export interface BookScriptureData {
  translation: TranslationCode;
  bookCode: string;
  bookName: string;
  testament: Testament;
  chapters: Record<string, VerseItem[]>;
}
