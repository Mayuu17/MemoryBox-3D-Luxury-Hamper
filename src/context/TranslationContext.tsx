import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HamperBox, HamperItem, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

interface TranslationContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isTranslating: boolean;
  culturalIdiomNote: string | null;
  getTranslatedBox: (box: HamperBox | null, overrideLang?: SupportedLanguage) => HamperBox | null;
  translateBoxDirectly: (box: HamperBox, targetLang: SupportedLanguage) => Promise<HamperBox>;
  translateSingleText: (
    text: string,
    targetLang: SupportedLanguage,
    context?: { contextType?: string; recipientName?: string; senderName?: string }
  ) => Promise<{ translatedText: string; poeticNote?: string; emotionalIdiomExplanation?: string }>;
  clearTranslationCache: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const CACHE_KEY_PREFIX = 'mb_box_trans_';

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [culturalIdiomNote, setCulturalIdiomNote] = useState<string | null>(null);

  // In-memory cache for deep translated boxes: { [boxId]: { [langCode]: HamperBox } }
  const [boxCache, setBoxCache] = useState<Record<string, Partial<Record<SupportedLanguage, HamperBox>>>>(() => {
    try {
      const stored = sessionStorage.getItem('mb_deep_translation_cache');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // In-memory cache for single translated text snippets: { `${targetLang}:${textHash}`: result }
  const [textCache, setTextCache] = useState<Record<string, { translatedText: string; poeticNote?: string; emotionalIdiomExplanation?: string }>>({});

  // Sync cache changes to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('mb_deep_translation_cache', JSON.stringify(boxCache));
    } catch (e) {
      console.warn('Session storage quota exceeded for translation cache', e);
    }
  }, [boxCache]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    if (lang === 'en') {
      setCulturalIdiomNote(null);
    }
  }, []);

  /**
   * Translates an entire HamperBox's emotional user-generated core data using Gemini 2.0/2.5 Flash
   */
  const translateBoxDirectly = useCallback(
    async (box: HamperBox, targetLang: SupportedLanguage): Promise<HamperBox> => {
      if (!box || targetLang === 'en') {
        return box;
      }

      // Check in-memory / session cache first
      if (boxCache[box.id]?.[targetLang]) {
        const cached = boxCache[box.id]![targetLang]!;
        return cached;
      }

      setIsTranslating(true);
      try {
        const response = await fetch('/api/gemini/translate-box-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            box,
            targetLanguage: targetLang,
            recipientName: box.recipientName,
            senderName: box.senderName,
          }),
        });

        if (!response.ok) {
          throw new Error(`Translation API error: ${response.statusText}`);
        }

        const data = await response.json();
        const translatedBox: HamperBox = data.translatedBox || box;

        if (data.culturalIdiomNote) {
          setCulturalIdiomNote(data.culturalIdiomNote);
        }

        // Cache the translated box in state and sessionStorage
        setBoxCache((prev) => ({
          ...prev,
          [box.id]: {
            ...(prev[box.id] || {}),
            [targetLang]: translatedBox,
          },
        }));

        return translatedBox;
      } catch (err) {
        console.error('Failed deep translation for hamper box:', err);
        return box;
      } finally {
        setIsTranslating(false);
      }
    },
    [boxCache]
  );

  /**
   * Returns the synchronously available translated HamperBox if cached,
   * otherwise triggers background translation and returns original box temporarily.
   */
  const getTranslatedBox = useCallback(
    (box: HamperBox | null, overrideLang?: SupportedLanguage): HamperBox | null => {
      if (!box) return null;
      const targetLang = overrideLang || currentLanguage;
      if (targetLang === 'en') return box;

      const cached = boxCache[box.id]?.[targetLang];
      if (cached) {
        return cached;
      }

      // Trigger asynchronous background translation if not already in flight
      if (!isTranslating) {
        translateBoxDirectly(box, targetLang).catch(() => {});
      }

      return box;
    },
    [boxCache, currentLanguage, isTranslating, translateBoxDirectly]
  );

  /**
   * Translates single emotional text with cultural idiom notes
   */
  const translateSingleText = useCallback(
    async (
      text: string,
      targetLang: SupportedLanguage,
      context?: { contextType?: string; recipientName?: string; senderName?: string }
    ) => {
      if (!text || targetLang === 'en') {
        return { translatedText: text };
      }

      const cacheKey = `${targetLang}:${text.slice(0, 80)}`;
      if (textCache[cacheKey]) {
        return textCache[cacheKey];
      }

      try {
        const res = await fetch('/api/gemini/translate-emotion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            targetLanguage: targetLang,
            contextType: context?.contextType || 'personal_letter',
            recipientName: context?.recipientName || 'Beloved',
            senderName: context?.senderName || 'Sender',
          }),
        });

        if (!res.ok) throw new Error('Translation failed');
        const data = await res.json();
        const result = {
          translatedText: data.translatedText || text,
          poeticNote: data.poeticNote,
          emotionalIdiomExplanation: data.emotionalIdiomExplanation,
        };

        setTextCache((prev) => ({ ...prev, [cacheKey]: result }));
        return result;
      } catch (err) {
        console.error('Error translating single text:', err);
        return { translatedText: text };
      }
    },
    [textCache]
  );

  const clearTranslationCache = useCallback(() => {
    setBoxCache({});
    setTextCache({});
    sessionStorage.removeItem('mb_deep_translation_cache');
  }, []);

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        isTranslating,
        culturalIdiomNote,
        getTranslatedBox,
        translateBoxDirectly,
        translateSingleText,
        clearTranslationCache,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useContentTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useContentTranslation must be used within a TranslationProvider');
  }
  return context;
};
