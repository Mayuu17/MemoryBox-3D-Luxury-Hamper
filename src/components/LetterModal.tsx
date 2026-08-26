import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox, HamperItem, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import { playPaperCrinkleSound } from '../utils/audio';
import { X, Languages, Sparkles, Volume2, VolumeX, Type, RefreshCw, Feather } from 'lucide-react';
import { useContentTranslation } from '../context/TranslationContext';

interface LetterModalProps {
  item: HamperItem;
  box: HamperBox;
  isOpen: boolean;
  onClose: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({
  item,
  box,
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setLanguage, translateSingleText, isTranslating: isGlobalTranslating } = useContentTranslation();
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(currentLanguage || 'en');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedSignature, setTranslatedSignature] = useState<string | null>(null);
  const [poeticNote, setPoeticNote] = useState<string | null>(null);
  const [idiomNote, setIdiomNote] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [fontMode, setFontMode] = useState<'cursive' | 'serif'>('cursive');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const rawContent = item.payload.letterContent || '';
  const rawTitle = item.payload.letterTitle || item.title || 'A Letter For You';
  const rawSignature = item.payload.letterSignature || `${box.senderName} — With All My Heart`;

  // Sync with global currentLanguage
  useEffect(() => {
    if (currentLanguage) {
      setCurrentLang(currentLanguage);
      handleLanguageChange(currentLanguage);
    }
  }, [currentLanguage, rawContent, item.id]);

  const handleLanguageChange = async (langCode: SupportedLanguage) => {
    setCurrentLang(langCode);
    if (langCode === 'en') {
      setTranslatedText(null);
      setTranslatedTitle(null);
      setTranslatedSignature(null);
      setPoeticNote(null);
      setIdiomNote(null);
      return;
    }

    // Check if the item already has pre-translated payload from box-level translation
    if (item.payload.letterContent && item.payload.letterContent !== rawContent) {
      setTranslatedText(item.payload.letterContent);
      setTranslatedTitle(item.payload.letterTitle || rawTitle);
      setTranslatedSignature(item.payload.letterSignature || rawSignature);
    }

    setIsTranslating(true);
    playPaperCrinkleSound();

    try {
      const res = await translateSingleText(rawContent, langCode, {
        contextType: 'love_letter',
        recipientName: box.recipientName,
        senderName: box.senderName,
      });

      if (res.translatedText) {
        setTranslatedText(res.translatedText);
        setPoeticNote(res.poeticNote || null);
        setIdiomNote(res.emotionalIdiomExplanation || null);
      }
    } catch (err) {
      console.error('Translation failed', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = translatedText || rawContent;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  if (!isOpen) return null;

  const displayTitle = translatedTitle || rawTitle;
  const displaySignature = translatedSignature || rawSignature;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (isSpeaking) window.speechSynthesis.cancel();
            onClose();
          }}
          className="fixed inset-0 bg-[#1A1410]/85 backdrop-blur-md"
        />

        {/* Letter Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#D4AF37]/50 my-auto paper-texture"
        >
          {/* Top Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-[#D4AF37]/30">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D4C3A3] shadow-sm text-xs text-[#5A4634]">
                <Languages className="w-3.5 h-3.5 text-[#B8860B]" />
                <select
                  value={currentLang}
                  onChange={(e) => {
                    const newLang = e.target.value as SupportedLanguage;
                    setLanguage(newLang);
                    handleLanguageChange(newLang);
                  }}
                  className="bg-transparent font-medium text-[#2D241E] focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Mode Toggle */}
              <button
                type="button"
                onClick={() => setFontMode(fontMode === 'cursive' ? 'serif' : 'cursive')}
                className="p-2 rounded-full bg-white border border-[#D4C3A3] hover:bg-[#F4EFE6] text-[#6B5532] shadow-sm transition-all cursor-pointer"
                title="Toggle Handwriting vs Serif Typography"
              >
                <Type className="w-3.5 h-3.5" />
              </button>

              {/* Voice Read Aloud Toggle */}
              <button
                type="button"
                onClick={toggleSpeech}
                className={`p-2 rounded-full border shadow-sm transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-[#B8860B] text-white border-[#B8860B]'
                    : 'bg-white border-[#D4C3A3] text-[#6B5532] hover:bg-[#F4EFE6]'
                }`}
                title="Read letter aloud"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Letter Body */}
          <div className="relative">
            {/* Vintage Rose Petal Decoration */}
            <div className="absolute -top-4 -right-2 opacity-15 pointer-events-none select-none">
              <Feather className="w-24 h-24 text-[#8B0000]" />
            </div>

            {/* Letter Header */}
            <div className="text-center mb-8">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8C6239] block mb-1">
                Handwritten Keepsake
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2D241E]">
                {displayTitle}
              </h2>
              <div className="w-16 h-0.5 bg-[#D4AF37]/60 mx-auto mt-2" />
            </div>

            {/* Translation Loading State */}
            {isTranslating ? (
              <div className="py-16 text-center">
                <RefreshCw className="w-8 h-8 text-[#B8860B] animate-spin mx-auto mb-3" />
                <p className="font-serif text-lg font-semibold text-[#2D241E]">
                  Translating with deep emotional idioms...
                </p>
                <p className="text-xs text-[#7A6856] mt-1">
                  Rendering heartfelt poetry in your mother tongue with Gemini AI
                </p>
              </div>
            ) : (
              <div>
                {/* Poetic & Cultural Idiom Note if translated */}
                {poeticNote && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3.5 rounded-2xl bg-[#FFF9E6] border border-[#E8D4A2] text-xs text-[#7A5826] shadow-sm flex items-start gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-[#B8860B] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#5C3F12]">Cultural Emotion Note: </span>
                      <span>{poeticNote}</span>
                      {idiomNote && <p className="mt-1 text-[11px] opacity-90 italic">"{idiomNote}"</p>}
                    </div>
                  </motion.div>
                )}

                {/* Letter Content Text */}
                <div
                  className={`text-[#2C2117] leading-relaxed whitespace-pre-line text-lg sm:text-xl selection:bg-[#E2C799] ${
                    fontMode === 'cursive'
                      ? 'font-script text-2xl sm:text-3xl leading-loose font-medium'
                      : 'font-serif text-lg sm:text-xl leading-relaxed'
                  }`}
                >
                  {translatedText || rawContent}
                </div>

                {/* Handwritten Sign-off */}
                <div className="mt-12 pt-6 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#8C6239] block">
                      Forever Yours,
                    </span>
                    <p className="font-script text-3xl text-[#2D241E] font-bold mt-1">
                      {displaySignature}
                    </p>
                  </div>

                  {/* Wax Seal Stamp */}
                  <div className="w-16 h-16 rounded-full bg-[#8B0000] border border-[#D4AF37]/60 shadow-lg flex items-center justify-center text-center text-[#F5E6C8] font-cinzel font-bold text-sm tracking-wider">
                    {box.waxSealInitials || 'A & A'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
