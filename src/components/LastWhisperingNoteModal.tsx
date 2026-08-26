import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperItem, HamperBox, SupportedLanguage } from '../types';
import { playPaperCrinkleSound, playWaxSealCrackSound, playPianoNote } from '../utils/audio';
import {
  X,
  Sparkles,
  Heart,
  Feather,
  Languages,
  Volume2,
  VolumeX,
  CheckCircle2,
  RefreshCw,
  Scroll,
} from 'lucide-react';
import { useContentTranslation } from '../context/TranslationContext';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import confetti from 'canvas-confetti';

interface LastWhisperingNoteModalProps {
  item?: HamperItem;
  box: HamperBox;
  isOpen: boolean;
  onClose: () => void;
}

export const LastWhisperingNoteModal: React.FC<LastWhisperingNoteModalProps> = ({
  item,
  box,
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setLanguage, getTranslatedBox, isTranslating, culturalIdiomNote } =
    useContentTranslation();

  const activeBox = getTranslatedBox(box, currentLanguage) || box;
  const activeItem = item || activeBox.items.find((it) => it.type === 'last_whisper_note');

  const title =
    activeItem?.payload?.lastNoteTitle ||
    activeItem?.title ||
    'The Last Whispering Note (आखिरी संदेश)';

  const fullContent =
    activeItem?.payload?.lastNoteParchment ||
    `And so, as you reach the bottom of this little universe I crafted for you, know that every single keepsake here is just a whisper of how endlessly you are cherished.\n\nThank you for existing in my world. Whenever life gets overwhelming, return to this box, play my voice, read these words, and remember you will forever be my favorite miracle.\n\nGoodnight, my dearest love.`;

  const signature =
    activeItem?.payload?.lastNoteSignature ||
    `~ With All My Heart, ${box.senderName}`;

  // Typewriter effect state
  const [displayedContent, setDisplayedContent] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isSealBroken, setIsSealBroken] = useState<boolean>(false);

  // Auto-typewriter animation
  useEffect(() => {
    if (!isOpen) {
      setDisplayedContent('');
      setIsTyping(true);
      setIsSealBroken(false);
      return;
    }

    // Play initial seal crack / paper unroll sound
    playPaperCrinkleSound();
    playWaxSealCrackSound();

    let currentIndex = 0;
    setDisplayedContent('');
    setIsTyping(true);

    const typingSpeed = fullContent.length > 300 ? 18 : 28;

    const interval = setInterval(() => {
      if (currentIndex < fullContent.length) {
        setDisplayedContent(fullContent.slice(0, currentIndex + 1));
        currentIndex++;
        // Play soft typewriter keystroke click occasionally
        if (currentIndex % 12 === 0) {
          playPianoNote(440 + (currentIndex % 5) * 40, 0.4, 0.02);
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
        try {
          confetti({
            particleCount: 30,
            spread: 45,
            origin: { y: 0.8 },
            colors: ['#D4AF37', '#8B0000', '#F5E6C8'],
          });
        } catch (e) {}
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [isOpen, fullContent, currentLanguage]);

  const handleSkipTyping = () => {
    setDisplayedContent(fullContent);
    setIsTyping(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Deep ambient romantic backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Golden Warm Glow in Background */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[800px] h-[550px] sm:h-[800px] bg-[#8B0000]/25 rounded-full blur-3xl pointer-events-none" />

        {/* PARCHMENT CARD CONTAINER */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 35 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 35 }}
          transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl border-2 sm:border-[3px] border-[#D4AF37]/70 my-auto text-[#2D241E] overflow-hidden luxury-box-shadow select-none z-10"
        >
          {/* Deckled Edge / Vintage Paper Texture */}
          <div className="absolute inset-0 paper-texture opacity-80 pointer-events-none" />

          {/* Gold Foil Margin Frame */}
          <div className="absolute inset-3 sm:inset-5 rounded-[22px] sm:rounded-[30px] border border-[#D4AF37]/50 pointer-events-none" />

          {/* Antique Brass Filigrees */}
          <div className="absolute top-5 left-5 w-7 h-7 border-t-2 border-l-2 border-[#D4AF37]/80 pointer-events-none rounded-tl-xs" />
          <div className="absolute top-5 right-5 w-7 h-7 border-t-2 border-r-2 border-[#D4AF37]/80 pointer-events-none rounded-tr-xs" />
          <div className="absolute bottom-5 left-5 w-7 h-7 border-b-2 border-l-2 border-[#D4AF37]/80 pointer-events-none rounded-bl-xs" />
          <div className="absolute bottom-5 right-5 w-7 h-7 border-b-2 border-r-2 border-[#D4AF37]/80 pointer-events-none rounded-br-xs" />

          {/* Top Bar with Language Selector & Close */}
          <div className="flex items-center justify-between mb-6 relative z-20">
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#D4C3A3] text-xs text-[#5A4634] shadow-xs">
              <Languages className="w-3.5 h-3.5 text-[#B8860B]" />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent font-medium text-[#2D241E] focus:outline-hidden cursor-pointer text-xs"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#8C6239] hover:text-[#2D241E] hover:bg-[#EEDCC0]/50 transition-colors cursor-pointer"
                title="Close Note"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SENDER WAX SEAL HEADER */}
          <div className="flex flex-col items-center justify-center text-center mb-6 relative z-10">
            <div className="w-14 h-14 rounded-full bg-[#8B0000] text-[#F5E6C8] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center font-cinzel font-bold text-lg mb-2">
              {box.waxSealInitials || 'MB'}
            </div>

            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B0000] flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#8B0000]" />
              <span>{title}</span>
              <Feather className="w-3.5 h-3.5 text-[#8B0000]" />
            </span>

            <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#2D241E] mt-1">
              Parting Words & Eternal Blessing
            </h2>
          </div>

          {/* Cultural Sentiment Note if non-English */}
          {culturalIdiomNote && currentLanguage !== 'en' && (
            <div className="relative z-10 mb-4 p-2.5 rounded-2xl bg-[#FFF9E6] border border-[#E8D4A2] text-xs text-[#7A5826] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B] flex-shrink-0" />
                <span className="font-medium text-[11px]">{culturalIdiomNote}</span>
              </div>
            </div>
          )}

          {/* =========================================================================
              THE TYPEWRITTEN PARCHMENT CONTENT SHEET
             ========================================================================= */}
          <div className="relative z-10 bg-[#FFFDF7] p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/50 shadow-inner min-h-[220px] max-h-[50vh] overflow-y-auto vintage-diary-lines">
            {/* Red Margin Guide Line */}
            <div className="absolute top-0 bottom-0 left-6 sm:left-8 vintage-diary-margin pointer-events-none" />

            <div className="pl-4 sm:pl-6">
              <p className="font-script text-xl sm:text-2xl text-[#2D241E] leading-relaxed whitespace-pre-line font-medium">
                {displayedContent}
                {isTyping && (
                  <span className="inline-block w-2 h-5 bg-[#8B0000] ml-1 animate-pulse" />
                )}
              </p>

              {/* Signature Line */}
              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mt-6 pt-4 border-t border-[#D4AF37]/30 text-right"
                >
                  <p className="font-script text-2xl text-[#8B0000] font-bold">
                    {signature}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest text-[#8C6239] font-sans block mt-0.5">
                    Sealed in Heart • Forever Preserved
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* BOTTOM CONTROLS & SKIP OPTION */}
          <div className="relative z-10 mt-6 pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs text-[#8C6239]">
            {isTyping ? (
              <button
                type="button"
                onClick={handleSkipTyping}
                className="text-[11px] font-bold text-[#8B0000] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Read Full Letter Instantly</span>
                <span>⚡</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Whispering note completed</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A30000] text-[#F5E6C8] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-[#F5E6C8] fill-current" />
              <span>Keep in My Heart</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
