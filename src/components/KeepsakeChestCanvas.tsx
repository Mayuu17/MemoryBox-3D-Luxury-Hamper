import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox, HamperItem, SupportedLanguage, AmbientMood } from '../types';
import { BOX_THEMES } from '../utils/themes';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../utils/languages';
import {
  playPaperCrinkleSound,
  playWaxSealCrackSound,
  playPianoNote,
  toggleAmbientRomanticMusic,
  isMusicPlaying,
  setAmbientMoodAudio,
} from '../utils/audio';
import {
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Languages,
  BookOpen,
  MailOpen,
  Mic,
  Lock,
  Flame,
  Gift,
  HeartHandshake,
  Smile,
  Feather,
  Music,
  X,
  Sparkle,
  Camera,
  QrCode,
  Printer,
  Compass,
  RefreshCw,
  Cake,
} from 'lucide-react';
import { LetterModal } from './LetterModal';
import { ScrapbookModal } from './ScrapbookModal';
import { VoiceNoteModal } from './VoiceNoteModal';
import { TimeCapsuleModal } from './TimeCapsuleModal';
import { MemoryBuddyModal } from './MemoryBuddyModal';
import { CustomGiftModal } from './CustomGiftModal';
import { CelebrationCakeModal } from './CelebrationCakeModal';
import { LastWhisperingNoteModal } from './LastWhisperingNoteModal';
import { TogetherMemoryTimeline } from './TogetherMemoryTimeline';
import { ARCameraUnboxingModal } from './ARCameraUnboxingModal';
import { PrintableQrCardModal } from './PrintableQrCardModal';
import { useContentTranslation } from '../context/TranslationContext';
import confetti from 'canvas-confetti';

interface KeepsakeChestCanvasProps {
  box: HamperBox;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onResetToGate: () => void;
}

const MOOD_THEME_STYLES: Record<
  AmbientMood,
  {
    bgGradient: string;
    ambientGlow: string;
    badgeText: string;
    badgeColor: string;
    auraColors: string[];
  }
> = {
  romantic: {
    bgGradient: 'from-[#FFE8EC]/70 via-[#FFF4F0]/60 to-[#FDF0E6]/50',
    ambientGlow: 'from-[#FFB6C1]/40 via-[#FFA07A]/30 to-[#EAD4B4]/20',
    badgeText: '🌹 Slow Romantic Mood • Starry Rose Glow',
    badgeColor: 'bg-rose-500/10 text-rose-800 border-rose-300',
    auraColors: ['#FF69B4', '#D4AF37', '#FFC0CB'],
  },
  nostalgic: {
    bgGradient: 'from-[#FDF3E3]/70 via-[#F7E7CE]/60 to-[#EEDCC0]/50',
    ambientGlow: 'from-[#E6B870]/40 via-[#D4AF37]/30 to-[#C59B27]/20',
    badgeText: '📜 Sepia Nostalgic Mood • Golden Amber Glow',
    badgeColor: 'bg-amber-500/10 text-amber-900 border-amber-300',
    auraColors: ['#D4AF37', '#8C6239', '#F5E6C8'],
  },
  joyful: {
    bgGradient: 'from-[#FFF8DB]/70 via-[#FFEEC2]/60 to-[#FFF0B8]/50',
    ambientGlow: 'from-[#FFD700]/45 via-[#FFB347]/30 to-[#FFE4B5]/20',
    badgeText: '✨ Joyful Celebration Mood • Sparkle Warmth',
    badgeColor: 'bg-yellow-500/10 text-yellow-900 border-yellow-300',
    auraColors: ['#FFD700', '#FF8C00', '#FFFFFF'],
  },
  deep_emotional: {
    bgGradient: 'from-[#F3E5F5]/70 via-[#EDE7F6]/60 to-[#E1BEE7]/50',
    ambientGlow: 'from-[#BA68C8]/35 via-[#9575CD]/25 to-[#D1C4E9]/20',
    badgeText: '💜 Deep Emotional Resonance • Midnight Violet',
    badgeColor: 'bg-purple-500/10 text-purple-900 border-purple-300',
    auraColors: ['#8E24AA', '#5E35B1', '#D4AF37'],
  },
  cozy_candlelight: {
    bgGradient: 'from-[#FFFDF9]/80 via-[#FAF6ED]/70 to-[#F5EEDC]/60',
    ambientGlow: 'from-[#F5E6C8]/40 via-[#F3DFC1]/30 to-[#EAD4B4]/20',
    badgeText: '🕯️ Cozy Candlelight Mood • Gentle Warmth',
    badgeColor: 'bg-[#D4AF37]/15 text-[#8C6239] border-[#D4AF37]/40',
    auraColors: ['#D4AF37', '#FAF7F2', '#E2C799'],
  },
};

export const KeepsakeChestCanvas: React.FC<KeepsakeChestCanvasProps> = ({
  box,
  currentLanguage,
  onLanguageChange,
  onResetToGate,
}) => {
  const { getTranslatedBox, isTranslating, culturalIdiomNote, setLanguage } = useContentTranslation();
  const [selectedItem, setSelectedItem] = useState<HamperItem | null>(null);
  const [activeModalType, setActiveModalType] = useState<string | null>(null);
  const [isMusicActive, setIsMusicActive] = useState<boolean>(isMusicPlaying());
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [inspectedItems, setInspectedItems] = useState<Record<string, boolean>>({});
  const [currentMood, setCurrentMood] = useState<AmbientMood>('romantic');
  const [moodExplanation, setMoodExplanation] = useState<string>('');
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Deep Translated Box
  const activeBox = getTranslatedBox(box, currentLanguage) || box;

  const theme = BOX_THEMES[activeBox.theme] || BOX_THEMES.royal_velvet_burgundy;
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
  const moodTheme = MOOD_THEME_STYLES[currentMood] || MOOD_THEME_STYLES.romantic;

  // Categorize specific items for organic positioning
  const letterItem = activeBox.items.find((it) => it.type === 'letter') || activeBox.items[0];
  const scrapbookItem = activeBox.items.find((it) => it.type === 'scrapbook');
  const voiceItem = activeBox.items.find((it) => it.type === 'voice_note');
  const timeCapsuleItem = activeBox.items.find((it) => it.type === 'time_capsule');
  const insideJokeItem = activeBox.items.find((it) => it.type === 'inside_joke' || it.type === 'chocolate_truffles');
  const candleItem = activeBox.items.find((it) => it.type === 'scented_candle');
  const buddyItem = activeBox.items.find((it) => it.type === 'memory_buddy');
  const cakeItem = activeBox.items.find((it) => it.type === 'celebration_cake');
  const lastWhisperNoteItem = activeBox.items.find((it) => it.type === 'last_whisper_note');

  const customItems = activeBox.items.filter(
    (it) =>
      it !== letterItem &&
      it !== scrapbookItem &&
      it !== voiceItem &&
      it !== timeCapsuleItem &&
      it !== insideJokeItem &&
      it !== candleItem &&
      it !== buddyItem &&
      it !== cakeItem &&
      it !== lastWhisperNoteItem
  );

  const handleMusicToggle = () => {
    const playing = toggleAmbientRomanticMusic();
    setIsMusicActive(playing);
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    onLanguageChange(newLang);
  };

  const handleMoodSelect = (mood: AmbientMood) => {
    setCurrentMood(mood);
    setAmbientMoodAudio(mood);
    playPianoNote(523.25, 1.2, 0.1);
  };

  const handleOpenItem = (item: HamperItem) => {
    playPaperCrinkleSound();
    playPianoNote(587.33, 1.8, 0.08); // High D5 chime
    setInspectedItems((prev) => ({ ...prev, [item.id]: true }));
    setSelectedItem(item);
    setActiveModalType(item.type);

    try {
      confetti({
        particleCount: 28,
        spread: 50,
        origin: { y: 0.65 },
        colors: moodTheme.auraColors || ['#D4AF37', '#E2C799', '#FAF7F2', '#DB4455'],
      });
    } catch (e) {}
  };

  return (
    <div className="relative min-h-[90vh] w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 select-none flex flex-col items-center justify-center transition-colors duration-1000">
      {/* DYNAMIC AMBIENT MOOD ATMOSPHERE AURA IN BACKGROUND */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[550px] sm:h-[750px] bg-gradient-to-r ${moodTheme.ambientGlow} rounded-full blur-3xl pointer-events-none transition-all duration-1000`}
      />

      {/* TOP CRAFTSMANSHIP & MOOD SENSOR BAR */}
      <div className="relative z-20 w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-6 px-4 py-3 rounded-full bg-white/80 backdrop-blur-md border border-[#D4AF37]/35 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8B0000] text-[#F5E6C8] font-cinzel font-bold text-xs flex items-center justify-center shadow-xs">
            {box.waxSealInitials || 'MB'}
          </div>
          <div>
            <h1 className="font-serif-title text-base sm:text-lg font-bold text-[#2D241E] leading-none">
              {box.title}
            </h1>
            <p className="font-script text-sm sm:text-base text-[#8C6239] leading-tight mt-0.5">
              Handmade for {box.recipientName} with endless love
            </p>
          </div>
        </div>

        {/* Action Controls & Sensor Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* AI Mood Sensor Pill */}
          <div
            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 shadow-2xs ${moodTheme.badgeColor}`}
            title={moodExplanation || 'AI detects receiver mood and auto-tunes background music & color glow'}
          >
            <Sparkles className="w-3 h-3 animate-spin" />
            <span className="truncate max-w-[150px] sm:max-w-none">{moodTheme.badgeText}</span>
          </div>

          {/* AR Mode Trigger */}
          <button
            onClick={() => setIsARModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1 rounded-full bg-white border border-[#D4AF37]/60 text-xs font-bold text-[#8B0000] hover:bg-[#FFF8E7] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            title="Unbox with Camera in AR"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AR Filter</span>
          </button>

          {/* QR & Print Trigger */}
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1 rounded-full bg-white border border-[#D4C3A3] text-xs font-bold text-[#5A4634] hover:bg-[#FFF8E7] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            title="View QR Code & Printable Card"
          >
            <QrCode className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="hidden sm:inline">QR Tag</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D4C3A3] text-xs text-[#5A4634]">
            <Languages className="w-3.5 h-3.5 text-[#B8860B]" />
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent font-medium text-[#2D241E] focus:outline-none cursor-pointer text-xs"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Acoustic Melody Ambient Audio */}
          <button
            onClick={handleMusicToggle}
            className={`p-2 rounded-full border shadow-xs transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer ${
              isMusicActive
                ? 'bg-[#B8860B] text-white border-[#B8860B]'
                : 'bg-white border-[#D4C3A3] text-[#6B5532] hover:bg-[#F4EFE6]'
            }`}
            title="Acoustic Romance Melody"
          >
            {isMusicActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Deep Emotional Translation Indicator & Cultural Sentiment Note */}
      <AnimatePresence>
        {isTranslating ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="relative z-20 w-full max-w-4xl mb-4 p-2.5 px-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-xs text-amber-900 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-amber-700 animate-spin flex-shrink-0" />
              <span>Translating letter, memories, and reason notes with emotional cultural veracity...</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-white/70 px-2 py-0.5 rounded-full">
              Gemini 2.0 Flash
            </span>
          </motion.div>
        ) : culturalIdiomNote && currentLanguage !== 'en' ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="relative z-20 w-full max-w-4xl mb-4 p-2.5 px-4 rounded-2xl bg-[#FFF9E6] border border-[#E8D4A2] text-xs text-[#7A5826] flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B] flex-shrink-0" />
              <span className="font-medium">{culturalIdiomNote}</span>
            </div>
            <span className="text-[10px] font-bold text-[#8C6239] bg-white px-2 py-0.5 rounded-full border border-[#E8D4A2]">
              Native Mother Tongue ✨
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* THE CENTRAL KEEPSAKE CHEST CANVAS CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 md:p-12 border-2 sm:border-[3px] border-[#D4AF37]/50 luxury-box-shadow overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC]"
      >
        {/* Soft-grained Cream Leather / Velvet Lining Texture */}
        <div className="absolute inset-0 paper-texture opacity-90 pointer-events-none" />

        {/* Gold-Foil Border Frame */}
        <div className="absolute inset-3 sm:inset-5 rounded-[24px] sm:rounded-[32px] border border-[#D4AF37]/45 pointer-events-none" />
        <div className="absolute inset-5 sm:inset-7 rounded-[20px] sm:rounded-[28px] border border-[#D4AF37]/20 pointer-events-none" />

        {/* Antique Brass Corner Filigrees */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/80 pointer-events-none rounded-tl-sm" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/80 pointer-events-none rounded-tr-sm" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/80 pointer-events-none rounded-bl-sm" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/80 pointer-events-none rounded-br-sm" />

        {/* SHREDDED PAPER FILLER (Crinkled Soft Bedding with realistic randomized ribbons) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none">
          {Array.from({ length: 64 }).map((_, i) => {
            const rot = (i * 39) % 360;
            const left = (i * 17) % 94;
            const top = (i * 23) % 92;
            const width = 36 + (i % 3) * 16;
            return (
              <div
                key={i}
                className="absolute h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-[#F1E5CD] via-[#E8D4A2] to-[#FAF7F2] shadow-2xs transform"
                style={{
                  width: `${width}px`,
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: `rotate(${rot}deg)`,
                }}
              />
            );
          })}
        </div>

        {/* Hamper Watermark & Callout */}
        <div className="relative z-10 text-center mb-6 sm:mb-8">
          <span className="font-script text-2xl sm:text-3xl text-[#8C6239] block">
            ~ A Treasury of Our Moments ~
          </span>
          <p className="text-xs text-[#8A7056] font-medium tracking-wide">
            Tap any keepsake to unfasten its ribbons, read handwritten secrets, or listen to voice whispers.
          </p>
        </div>

        {/* ORGANICALLY SCATTERED ARTISANAL KEEPSAKES CANVAS (NO RIGID GRIDS!) */}
        <div className="relative z-10 min-h-[580px] sm:min-h-[640px] w-full flex flex-col md:block">
          {/* =========================================================================
              1. TILTED POLAROID PHOTO 1 (Top Left) with Rose Washi Tape
             ========================================================================= */}
          {scrapbookItem && (
            <motion.div
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 35 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(scrapbookItem)}
              className="md:absolute top-2 left-2 sm:left-6 w-full md:w-64 cursor-pointer mb-6 md:mb-0"
              style={{ transform: 'rotate(-4deg)' }}
            >
              {/* Virtual Rose Pastel Washi Tape */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 washi-tape-rose z-20" />

              {/* Polaroid Frame */}
              <div className="polaroid-frame bg-white">
                <div className="relative aspect-[4/3] w-full bg-[#FAF7F2] overflow-hidden rounded-xs border border-neutral-100">
                  <img
                    referrerPolicy="no-referrer"
                    src={
                      scrapbookItem.payload.photos?.[0]?.url ||
                      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80'
                    }
                    alt="Memory Snapshot"
                    className="w-full h-full object-cover"
                  />
                  {/* Photo Glossy Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                </div>
                <div className="mt-3 text-center">
                  <p className="font-script text-xl sm:text-2xl text-[#2D241E] leading-tight font-bold">
                    {scrapbookItem.payload.photos?.[0]?.caption || 'The day the world stood still...'}
                  </p>
                  <span className="text-[10px] tracking-widest text-[#8C6239] uppercase font-sans font-semibold block mt-0.5">
                    {scrapbookItem.payload.photos?.length || 4} Cherished Snaps • Open Album
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              2. CENTRAL DECKLED-EDGE WARM PARCHMENT LETTER (Center Main Anchor)
             ========================================================================= */}
          {letterItem && (
            <motion.div
              whileHover={{ scale: 1.03, rotate: 1, zIndex: 30 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(letterItem)}
              className="md:absolute top-12 left-1/2 md:-translate-x-1/2 w-full md:w-80 cursor-pointer mb-6 md:mb-0"
              style={{ transform: 'rotate(2deg)' }}
            >
              {/* Vintage Sage Washi Tape on top corner */}
              <div className="absolute -top-3.5 right-6 w-24 h-6 washi-tape-sage z-20" />

              {/* Parchment Letter Sheet */}
              <div className="relative bg-[#FFFDF7] p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37]/60 shadow-xl overflow-hidden vintage-diary-lines">
                {/* Red Diary Margin Line */}
                <div className="absolute top-0 bottom-0 left-6 vintage-diary-margin pointer-events-none" />

                {/* Wax Seal Stamp on Letter Fold */}
                <div className="flex items-center justify-between mb-3 pl-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B0000] uppercase tracking-wider">
                    <Feather className="w-4 h-4" />
                    <span>My Dearest Heart</span>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-[#8B0000] text-[#F5E6C8] border border-[#D4AF37] shadow-md flex items-center justify-center font-cinzel font-bold text-[10px]">
                    {box.waxSealInitials || 'MB'}
                  </div>
                </div>

                {/* Handwritten Preview Snippet */}
                <div className="pl-4">
                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#2D241E]">
                    {letterItem.payload.letterTitle || 'An Eternal Promise To You'}
                  </h3>
                  <p className="font-script text-xl sm:text-2xl text-[#3D2C1E] mt-2 line-clamp-3 leading-relaxed">
                    {letterItem.payload.letterContent ||
                      'If I had a flower for every time I thought of you, I could walk through my garden forever...'}
                  </p>
                  <p className="font-script text-lg text-[#8C6239] mt-3 text-right">
                    ~ With All My Love, {box.senderName}
                  </p>
                </div>

                {/* Tactile prompt */}
                <div className="mt-4 pt-2 border-t border-[#D4AF37]/30 pl-4 flex items-center justify-between text-[11px] text-[#8C6239] font-medium">
                  <span className="font-serif italic">Tap to unfold full letter & AI Voice</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              3. ARTISANAL BELGIAN TRUFFLES & INSIDE JOKE BOX (Top Right)
             ========================================================================= */}
          {insideJokeItem && (
            <motion.div
              whileHover={{ scale: 1.06, rotate: 0, zIndex: 35 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(insideJokeItem)}
              className="md:absolute top-4 right-2 sm:right-6 w-full md:w-60 cursor-pointer mb-6 md:mb-0"
              style={{ transform: 'rotate(5deg)' }}
            >
              {/* Gold Washi Tape */}
              <div className="absolute -top-3 left-4 w-20 h-5 washi-tape-gold z-20" />

              {/* Artisanal Chocolatier Tin / Box */}
              <div className="bg-gradient-to-br from-[#2D2218] via-[#3E2D20] to-[#1C140E] p-4 sm:p-5 rounded-2xl border-2 border-[#D4AF37]/80 shadow-2xl text-white relative overflow-hidden">
                {/* Gold Embossed Crest */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                    Sweet Treats & Secrets
                  </span>
                  <Smile className="w-4 h-4 text-[#D4AF37]" />
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#5A3E26] to-[#8C6239] border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Sparkles className="w-6 h-6 text-[#F5E6C8]" />
                  </div>
                  <div>
                    <h4 className="font-serif-title text-sm font-bold text-[#F5E6C8]">
                      {insideJokeItem.payload.treatName || 'Golden Belgian Truffles'}
                    </h4>
                    <p className="text-[11px] text-[#D4C3A3] mt-0.5 font-script text-base">
                      “Contains a secret inside joke revealed on unwrap...”
                    </p>
                  </div>
                </div>

                {/* Peel Wrapper Ribbon */}
                <div className="mt-3 pt-2 border-t border-[#D4AF37]/30 flex items-center justify-between text-[10px] text-[#E0D0B4]">
                  <span>Handcrafted Confection</span>
                  <span className="text-[#D4AF37] font-bold">Unwrap Delights →</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              4. VINTAGE CASSETTE ACOUSTIC VOICE NOTE (Bottom Left)
             ========================================================================= */}
          {voiceItem && (
            <motion.div
              whileHover={{ scale: 1.06, rotate: 0, zIndex: 35 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(voiceItem)}
              className="md:absolute bottom-4 left-4 sm:left-10 w-full md:w-64 cursor-pointer mb-6 md:mb-0"
              style={{ transform: 'rotate(3deg)' }}
            >
              {/* Lavender Washi Tape */}
              <div className="absolute -top-3.5 right-6 w-24 h-5 washi-tape-lavender z-20" />

              {/* Vintage Magnetic Tape Cassette */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border-2 border-[#8C6239]/40 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold tracking-widest text-[#8B0000] uppercase">
                    Side A • Whispered Memories
                  </span>
                  <Music className="w-3.5 h-3.5 text-[#8C6239]" />
                </div>

                {/* Cassette Spools Simulation */}
                <div className="bg-[#2D241E] p-2.5 rounded-xl flex items-center justify-between shadow-inner my-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center animate-spin-slow">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <div className="h-4 flex-1 mx-3 bg-[#1A1410] rounded-sm flex items-center justify-center">
                    <span className="text-[8px] text-[#D4AF37] tracking-widest uppercase font-mono">
                      {voiceItem.payload.durationSeconds || 45}s Audio
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center animate-spin-slow">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>

                <p className="font-script text-xl text-[#2D241E] leading-tight font-bold text-center mt-1">
                  {voiceItem.payload.voiceNoteTitle || 'Our Late Night Conversations'}
                </p>

                <div className="mt-2 text-center">
                  <span className="text-[10px] text-[#8C6239] font-sans font-semibold">
                    ▶ Play Real Voice Recording
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              5. SCENTED SOY CANDLE & GLASS VIAL (Bottom Center)
             ========================================================================= */}
          {candleItem && (
            <motion.div
              whileHover={{ scale: 1.08, zIndex: 35 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(candleItem)}
              className="md:absolute bottom-3 left-1/2 md:-translate-x-1/2 w-full md:w-56 cursor-pointer mb-6 md:mb-0"
              style={{ transform: 'rotate(-2deg)' }}
            >
              {/* Glass Amber Scented Candle */}
              <div className="bg-[#FFFDF9] p-4 rounded-2xl border-2 border-[#D4AF37]/50 shadow-xl text-center relative overflow-hidden">
                {/* Candle Flame Flicker */}
                <div className="w-4 h-7 bg-gradient-to-t from-[#FF8C00] via-[#FFD700] to-white rounded-full mx-auto shadow-lg animate-pulse mb-1" />

                <span className="text-[9px] uppercase tracking-widest text-[#8C6239] font-bold block">
                  Aromatherapy Keepsake
                </span>
                <h4 className="font-serif-title text-sm font-bold text-[#2D241E] mt-0.5">
                  {candleItem.title || 'Vanilla & Wild Roses Candle'}
                </h4>
                <p className="text-[10px] text-[#7A6856] font-script text-base mt-0.5">
                  “Scent of the cafe where we first met...”
                </p>
                <div className="mt-2 text-[10px] text-[#B8860B] font-bold">
                  Light Wick & Inhale Aroma →
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              6. TIME CAPSULE BRASS LOCK VAULT (Bottom Right)
             ========================================================================= */}
          {timeCapsuleItem && (
            <motion.div
              whileHover={{ scale: 1.06, rotate: 0, zIndex: 35 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(timeCapsuleItem)}
              className="md:absolute bottom-4 right-4 sm:right-10 w-full md:w-60 cursor-pointer mb-6 md:mb-0"
              style={{ transform: 'rotate(-4deg)' }}
            >
              {/* Honey Pastel Washi Tape */}
              <div className="absolute -top-3 left-6 w-20 h-5 washi-tape-honey z-20" />

              {/* Antique Brass Locked Vault Box */}
              <div className="bg-gradient-to-br from-[#FAF6ED] to-[#EFE6D2] p-4 sm:p-5 rounded-2xl border-2 border-[#B8860B]/60 shadow-xl text-center relative overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-[#8B0000] text-[#F5E6C8] mx-auto flex items-center justify-center shadow-md mb-2">
                  <Lock className="w-5 h-5" />
                </div>

                <span className="text-[9px] uppercase tracking-widest text-[#8B0000] font-bold block">
                  Milestone Time-Capsule
                </span>
                <h4 className="font-serif-title text-sm font-bold text-[#2D241E]">
                  {timeCapsuleItem.title || 'Sealed for Our Anniversary'}
                </h4>
                <p className="text-[10px] text-[#7A6856] mt-1 font-mono font-semibold">
                  Unlock Date: {timeCapsuleItem.lockedUntil || 'Our Next Milestone'}
                </p>

                <div className="mt-2 text-[10px] text-[#8B0000] font-bold">
                  Inspect Sealed Vault →
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              7. MEMORY BUDDY AI KEEPSAKE CHARM (Center Float)
             ========================================================================= */}
          {buddyItem && (
            <motion.div
              whileHover={{ scale: 1.08, zIndex: 40 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(buddyItem)}
              className="md:absolute top-1/2 left-8 md:-translate-y-1/2 w-full md:w-48 cursor-pointer mb-6 md:mb-0"
              style={{ transform: 'rotate(-6deg)' }}
            >
              <div className="bg-gradient-to-tr from-[#8B0000] to-[#A30000] text-[#F5E6C8] p-3.5 rounded-2xl border border-[#D4AF37] shadow-xl text-center">
                <HeartHandshake className="w-6 h-6 mx-auto mb-1 text-[#F5E6C8]" />
                <span className="text-[9px] uppercase tracking-widest block font-bold text-[#FFD700]">
                  Interactive AI
                </span>
                <p className="font-serif-title text-xs font-bold mt-0.5">
                  Chat with Memory Buddy
                </p>
                <p className="text-[9px] opacity-80 mt-0.5 font-script text-sm">
                  “Ask me anything about us!”
                </p>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              8. OCCASION CELEBRATION CAKE (The Interactive Celebration Vault)
             ========================================================================= */}
          {cakeItem && (
            <motion.div
              whileHover={{ scale: 1.07, rotate: 0, zIndex: 42 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(cakeItem)}
              className="md:absolute top-1/3 right-8 md:-translate-y-1/3 w-full md:w-56 cursor-pointer mb-6 md:mb-0"
              style={{ transform: 'rotate(5deg)' }}
            >
              {/* Gold Glaze Washi Tape */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-5 washi-tape-gold z-20" />

              <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FAF4E8] to-[#F7ECD5] p-4 rounded-2xl border-2 border-[#D4AF37] shadow-2xl text-center relative overflow-hidden group">
                {/* Lit Candle Flame Preview */}
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <div className="w-2.5 h-5 bg-gradient-to-t from-amber-500 via-yellow-400 to-white rounded-full animate-bounce shadow-md" />
                  <div className="w-2.5 h-6 bg-gradient-to-t from-amber-600 via-yellow-300 to-white rounded-full animate-pulse shadow-md" />
                  <div className="w-2.5 h-5 bg-gradient-to-t from-amber-500 via-yellow-400 to-white rounded-full animate-bounce shadow-md" />
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B0000] to-[#AA1A24] text-[#F5E6C8] border border-[#D4AF37] flex items-center justify-center text-2xl mx-auto mb-2 shadow-md">
                  🎂
                </div>

                <span className="text-[9px] uppercase tracking-widest text-[#8B0000] font-bold block">
                  Celebration Vault
                </span>
                <h4 className="font-serif-title text-xs sm:text-sm font-bold text-[#2D241E] mt-0.5">
                  {cakeItem.payload.cakeMessage || 'Occasion Celebration Cake'}
                </h4>
                <p className="text-[10px] text-[#8C6239] font-script text-base mt-0.5">
                  “Blow into mic to make a wish!”
                </p>
                <div className="mt-2 py-1 px-2 rounded-lg bg-amber-500/10 border border-amber-300/80 text-[10px] text-amber-900 font-bold flex items-center justify-center gap-1">
                  <span>Blow Candles</span>
                  <span>✨</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              9. THE LAST WHISPERING NOTE (Mandatory Bottom Parchment Letter)
             ========================================================================= */}
          {lastWhisperNoteItem && (
            <motion.div
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 45 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(lastWhisperNoteItem)}
              className="w-full mt-6 cursor-pointer relative z-20"
            >
              <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EA] to-[#F5EBD7] p-4 sm:p-5 rounded-2xl border-2 border-[#8B0000]/50 shadow-xl flex items-center justify-between gap-4 flex-wrap hover:border-[#8B0000] transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#8B0000] text-[#F5E6C8] border-2 border-[#D4AF37] shadow-md flex items-center justify-center shrink-0">
                    <Feather className="w-5 h-5 text-[#F5E6C8]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B0000] block">
                      Floor of the Chest • Final Parting Words
                    </span>
                    <h3 className="font-serif-title text-sm sm:text-base font-bold text-[#2D241E]">
                      {lastWhisperNoteItem.payload.lastNoteTitle || 'The Last Whispering Note (आखिरी संदेश)'}
                    </h3>
                    <p className="text-xs text-[#7A6856] font-script text-base line-clamp-1 mt-0.5">
                      “{lastWhisperNoteItem.payload.lastNoteParchment?.slice(0, 75)}...”
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B0000] text-[#F5E6C8] text-xs font-bold shadow-sm">
                  <span>Read Parting Letter</span>
                  <span>📜</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              10. ADDITIONAL ARTISANAL SOUVENIRS, BOUQUETS & TREATS (Dynamic 3D Stacking)
             ========================================================================= */}
          {customItems.map((cItem, cIdx) => (
            <motion.div
              key={cItem.id}
              whileHover={{ scale: 1.06, rotate: 0, zIndex: 38 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenItem(cItem)}
              className="md:absolute cursor-pointer mb-6 md:mb-0 w-full md:w-56"
              style={{
                top: cIdx % 2 === 0 ? `${18 + cIdx * 14}%` : 'auto',
                bottom: cIdx % 2 !== 0 ? `${12 + cIdx * 10}%` : 'auto',
                right: cIdx % 2 === 0 ? `${4 + cIdx * 8}%` : 'auto',
                left: cIdx % 2 !== 0 ? `${32 + cIdx * 10}%` : 'auto',
                transform: `rotate(${(cIdx % 2 === 0 ? 1 : -1) * (4 + cIdx * 3)}deg)`,
              }}
            >
              <div className="bg-[#FFFDF9] p-4 rounded-2xl border-2 border-[#D4AF37]/60 shadow-xl overflow-hidden relative">
                {/* Visual Asset Image or Icon */}
                {cItem.payload?.customImage || cItem.payload?.image ? (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5 border border-[#D4AF37]/30 shadow-inner">
                    <img
                      src={cItem.payload?.customImage || cItem.payload?.image}
                      alt={cItem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white font-cinzel">
                      {cItem.iconName || '🎁'}
                    </span>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#8B0000]/10 border border-[#8B0000]/30 flex items-center justify-center text-2xl mx-auto mb-2 text-[#8B0000]">
                    {cItem.iconName || '✨'}
                  </div>
                )}

                <h4 className="font-serif-title text-xs sm:text-sm font-bold text-[#2D241E] truncate">
                  {cItem.title}
                </h4>
                <p className="text-[10px] text-[#7A6856] line-clamp-2 mt-0.5 leading-tight font-serif italic">
                  {cItem.subtitle || cItem.payload?.customDescription || 'Handpicked keepsake'}
                </p>
                <div className="mt-2 pt-1.5 border-t border-[#D4AF37]/30 flex items-center justify-between text-[10px] text-[#8C6239] font-semibold">
                  <span>Open Keepsake</span>
                  <span>✨</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM HAMPER CHEST SCRIPT CAPTION */}
        <div className="relative z-10 mt-8 pt-4 border-t border-[#D4AF37]/35 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A6856]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-serif italic">
              All gifts are preserved in your personal cloud keepsake forever.
            </span>
          </div>

          <button
            onClick={onResetToGate}
            className="text-[11px] font-bold text-[#8C6239] hover:text-[#2D241E] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Close & Fasten Ribbon Chest</span>
            <span>🔒</span>
          </button>
        </div>
      </motion.div>

      {/* DUAL-USER SHARED MEMORY TIMELINE (TOGETHER MODE) */}
      <TogetherMemoryTimeline box={activeBox} currentLanguage={currentLanguage} />

      {/* ITEM MODALS */}
      {selectedItem && (
        <>
          {activeModalType === 'letter' && (
            <LetterModal
              item={selectedItem}
              box={activeBox}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'scrapbook' && (
            <ScrapbookModal
              item={selectedItem}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'voice_note' && (
            <VoiceNoteModal
              item={selectedItem}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'time_capsule' && (
            <TimeCapsuleModal
              item={selectedItem}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'memory_buddy' && (
            <MemoryBuddyModal
              item={selectedItem}
              box={activeBox}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
              onMoodDetected={(mood, exp) => {
                setCurrentMood(mood);
                if (exp) setMoodExplanation(exp);
              }}
            />
          )}

          {activeModalType === 'celebration_cake' && (
            <CelebrationCakeModal
              item={selectedItem}
              box={activeBox}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'last_whisper_note' && (
            <LastWhisperingNoteModal
              item={selectedItem}
              box={activeBox}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {(activeModalType === 'chocolate_truffles' ||
            activeModalType === 'inside_joke' ||
            activeModalType === 'scented_candle' ||
            activeModalType === 'custom_gift') && (
            <CustomGiftModal
              item={selectedItem}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </>
      )}

      {/* AR CAMERA MODAL */}
      <ARCameraUnboxingModal
        box={activeBox}
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        onEnterFullExperience={() => setIsARModalOpen(false)}
      />

      {/* PRINTABLE QR CARD MODAL */}
      <PrintableQrCardModal
        box={activeBox}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onLaunchAR={() => {
          setIsPrintModalOpen(false);
          setIsARModalOpen(true);
        }}
      />
    </div>
  );
};
