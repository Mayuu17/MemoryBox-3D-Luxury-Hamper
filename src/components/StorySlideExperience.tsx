import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox, HamperItem, SupportedLanguage } from '../types';
import { BOX_THEMES } from '../utils/themes';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../utils/languages';
import {
  playPaperCrinkleSound,
  playWaxSealCrackSound,
  playBoxOpenCreakSound,
  playPianoNote,
  startAmbientRomanticMusic,
  stopAmbientRomanticMusic,
  isMusicPlaying,
  toggleAmbientRomanticMusic,
} from '../utils/audio';
import {
  Sparkles,
  Heart,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Languages,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Gift,
  Smile,
  Flame,
  MailOpen,
  BookOpen,
  Mic,
  HeartHandshake,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  RefreshCw,
} from 'lucide-react';
import { LetterModal } from './LetterModal';
import { ScrapbookModal } from './ScrapbookModal';
import { VoiceNoteModal } from './VoiceNoteModal';
import { TimeCapsuleModal } from './TimeCapsuleModal';
import { MemoryBuddyModal } from './MemoryBuddyModal';
import { CustomGiftModal } from './CustomGiftModal';
import { InsideJokeModal } from './InsideJokeModal';
import { useContentTranslation } from '../context/TranslationContext';
import confetti from 'canvas-confetti';

interface StorySlideExperienceProps {
  box: HamperBox;
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const NO_BUTTON_RESPONSES = [
  "Are you sure? Try again 😉",
  "No is disabled by Cupid 💘",
  "Oops! The button ran away 🏃‍♂️",
  "You know you want to see it! 🥰",
  "Resistance is futile ✨",
  "Wrong answer! Try the golden button 💖",
];

export const StorySlideExperience: React.FC<StorySlideExperienceProps> = ({
  box,
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
}) => {
  const { getTranslatedBox, isTranslating, culturalIdiomNote, setLanguage } = useContentTranslation();
  // Slides: 1 = Hook Teaser, 2 = Password Gate, 3 = Unboxing Pop-up Animation, 4 = Interactive Exploration Canvas
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Playful 'No' button evasive positions
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);

  // Unboxing & audio states
  const [isMusicActive, setIsMusicActive] = useState<boolean>(isMusicPlaying());
  const [unwrappedItems, setUnwrappedItems] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<HamperItem | null>(null);
  const [activeModalType, setActiveModalType] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<number>(1);

  // Deep Translated Box
  const activeBox = getTranslatedBox(box, currentLanguage) || box;

  const theme = BOX_THEMES[activeBox.theme] || BOX_THEMES.royal_velvet_burgundy;
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    onLanguageChange(newLang);
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(1);
      setPasswordInput('');
      setPasswordError(null);
      setShowHint(false);
    }
  }, [isOpen, box.id]);

  if (!isOpen) return null;

  // Handle Playful 'No' button evasion
  const handleNoInteraction = () => {
    playPaperCrinkleSound();
    setNoAttempts((prev) => prev + 1);
    // Move to random offset within container bounds
    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 140;
    setNoPosition({ x: randomX, y: randomY });
  };

  // Handle 'Yes' clicked in Slide 1
  const handleYesHook = () => {
    playPianoNote(523.25, 2.0, 0.12);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#8B0000', '#FAF7F2'],
      });
    } catch (e) {}

    // Check if box has password
    if (box.secretPassword && box.secretPassword.trim().length > 0) {
      setCurrentSlide(2);
    } else {
      // Direct unboxing
      triggerUnboxingSequence();
    }
  };

  // Handle Password Unlock
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setIsVerifying(true);

    const entered = passwordInput.trim().toLowerCase();
    const actual = (box.secretPassword || '').trim().toLowerCase();

    if (actual && entered !== actual) {
      setIsVerifying(false);
      setPasswordError(
        box.passwordHint
          ? `Incorrect code. Hint: ${box.passwordHint}`
          : 'Incorrect password. Ask the sender for the secret code!'
      );
      playPaperCrinkleSound();
      return;
    }

    setIsVerifying(false);
    triggerUnboxingSequence();
  };

  const triggerUnboxingSequence = () => {
    playWaxSealCrackSound();
    setCurrentSlide(3);

    // Start acoustic piano music
    startAmbientRomanticMusic();
    setIsMusicActive(true);

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#8B0000', '#FAF7F2', '#E2C799'],
      });
    } catch (e) {}

    // Transition automatically to Slide 4 after 3.2s
    setTimeout(() => {
      playBoxOpenCreakSound();
      setCurrentSlide(4);
    }, 3200);
  };

  const handleItemClick = (item: HamperItem) => {
    playPaperCrinkleSound();
    playPianoNote(659.25, 2.0, 0.08);

    setUnwrappedItems((prev) => ({ ...prev, [item.id]: true }));
    setSelectedItem(item);
    setActiveModalType(item.type);

    if (item.layer === 3) {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#D4AF37', '#DB4455', '#FAF7F2'],
        });
      } catch (e) {}
    }
  };

  const handleMusicToggle = () => {
    const playing = toggleAmbientRomanticMusic();
    setIsMusicActive(playing);
  };

  // Filter items by layer
  const layer1Items = box.items.filter((it) => it.layer === 1);
  const layer2Items = box.items.filter((it) => it.layer === 2);
  const layer3Items = box.items.filter((it) => it.layer === 3);

  const getIcon = (type: string) => {
    switch (type) {
      case 'letter':
        return <MailOpen className="w-6 h-6 text-[#8B0000]" />;
      case 'scrapbook':
        return <BookOpen className="w-6 h-6 text-[#B8860B]" />;
      case 'voice_note':
        return <Mic className="w-6 h-6 text-[#B8860B]" />;
      case 'time_capsule':
        return <Lock className="w-6 h-6 text-[#B8860B]" />;
      case 'inside_joke':
      case 'chocolate_truffles':
        return <Sparkles className="w-6 h-6 text-[#D4AF37]" />;
      case 'scented_candle':
        return <Flame className="w-6 h-6 text-[#D49B4B]" />;
      case 'memory_buddy':
        return <HeartHandshake className="w-6 h-6 text-[#8B0000]" />;
      default:
        return <Gift className="w-6 h-6 text-[#B8860B]" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15100C]/90 backdrop-blur-xl p-2 sm:p-4 overflow-y-auto">
        {/* Story Card Container (Phone/Story Aspect Ratio on Desktop, Fluid on Mobile) */}
        <div className="relative w-full max-w-lg md:max-w-2xl min-h-[620px] max-h-[92vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border-2 border-[#D4AF37]/50 flex flex-col overflow-hidden paper-texture">
          {/* Top Story Slide Progress Bars (Snapchat / Instagram style) */}
          <div className="relative z-30 p-4 pb-2 flex items-center gap-1.5">
            {[1, 2, 3, 4].map((step) => {
              const isActive = currentSlide === step;
              const isPast = currentSlide > step;
              return (
                <div
                  key={step}
                  className="flex-1 h-1.5 rounded-full bg-black/10 overflow-hidden"
                >
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isPast
                        ? 'bg-[#B8860B] w-full'
                        : isActive
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#8B0000] w-full animate-pulse'
                        : 'w-0'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Floating Top Controls: Language Selector, Music, and Exit */}
          <div className="relative z-30 px-4 py-2 flex items-center justify-between border-b border-[#D4AF37]/20">
            {/* Sender / Box Monogram */}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-cinzel font-bold text-[#F5E6C8] shadow-xs"
                style={{ backgroundColor: theme.waxSealColor }}
              >
                {box.waxSealInitials || 'MB'}
              </div>
              <span className="text-xs font-serif-title font-bold text-[#2D241E] truncate max-w-[140px] sm:max-w-[220px]">
                {box.title}
              </span>
            </div>

            {/* Right Tools */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-[#D4C3A3] text-[11px] text-[#5A4634] shadow-xs">
                <Languages className="w-3 h-3 text-[#B8860B]" />
                <select
                  value={currentLanguage}
                  onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                  className="bg-transparent font-medium text-[#2D241E] focus:outline-none cursor-pointer text-[11px]"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Music Toggle */}
              <button
                onClick={handleMusicToggle}
                className={`p-1.5 rounded-full border shadow-xs transition-all cursor-pointer ${
                  isMusicActive
                    ? 'bg-[#B8860B] text-white border-[#B8860B]'
                    : 'bg-white/80 border-[#D4C3A3] text-[#6B5532]'
                }`}
                title="Melody"
              >
                {isMusicActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SLIDE CONTENT AREA */}
          <div className="relative flex-1 flex flex-col justify-center p-6 sm:p-8 overflow-y-auto">
            {/* SLIDE 1: THE HOOK TEASER */}
            {currentSlide === 1 && (
              <motion.div
                key="slide1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center my-auto space-y-6"
              >
                {/* Floating Heart / Wax Seal */}
                <div className="w-20 h-20 mx-auto rounded-full bg-[#8B0000] border-4 border-[#D4AF37] shadow-2xl flex items-center justify-center text-[#F5E6C8] font-cinzel font-bold text-2xl tracking-wider animate-bounce">
                  <Heart className="w-10 h-10 fill-current text-[#F5E6C8]" />
                </div>

                <div>
                  <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#8C6239] block mb-2">
                    A Special Surprise from {box.senderName}
                  </span>
                  <h2 className="font-serif-title text-2xl sm:text-4xl font-bold text-[#2D241E] leading-tight">
                    "Hey {box.recipientName}! I made something special for you, do you wanna see it?"
                  </h2>
                  <p className="text-xs text-[#7A6856] mt-3 max-w-md mx-auto italic font-serif">
                    {box.giftTagMessage ||
                      'Handmade with love, cherished memories, and secret treasures.'}
                  </p>
                </div>

                {/* Interactive Yes / No Buttons */}
                <div className="relative pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[110px]">
                  {/* Glowing 'Yes' Button */}
                  <button
                    onClick={handleYesHook}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-sm tracking-wide shadow-xl hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer z-10"
                  >
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Yes! Show me now ❤️</span>
                  </button>

                  {/* Playful Evasive 'No' Button */}
                  <motion.button
                    animate={{ x: noPosition.x, y: noPosition.y }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    onMouseEnter={handleNoInteraction}
                    onClick={handleNoInteraction}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/80 border border-[#D4C3A3] text-xs font-semibold text-[#7A6856] hover:bg-white transition-all cursor-pointer shadow-xs"
                  >
                    {noAttempts > 0
                      ? NO_BUTTON_RESPONSES[(noAttempts - 1) % NO_BUTTON_RESPONSES.length]
                      : 'No, maybe later'}
                  </motion.button>
                </div>

                {noAttempts > 1 && (
                  <p className="text-[11px] font-medium text-[#8B0000] animate-pulse">
                    Psst... {box.senderName} spent hours putting this together just for you!
                  </p>
                )}
              </motion.div>
            )}

            {/* SLIDE 2: THE PASSWORD VALIDATION GATE */}
            {currentSlide === 2 && (
              <motion.div
                key="slide2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="my-auto space-y-6 max-w-md mx-auto w-full"
              >
                {/* Virtual Handwritten Gift Tag */}
                <div className="relative p-6 rounded-2xl bg-[#FFF8E7] border-2 border-[#D4AF37]/60 shadow-lg paper-texture text-left">
                  {/* Tag eyelet and thread */}
                  <div className="w-4 h-4 rounded-full bg-white border border-[#D4AF37] absolute top-3 right-3 shadow-inner" />

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6239]">
                      Personal Gift Tag
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-serif text-[#7A6856]">To:</span>
                      <span className="font-script text-2xl text-[#2D241E] font-bold">
                        {box.recipientName}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-serif text-[#7A6856]">From:</span>
                      <span className="font-script text-2xl text-[#2D241E] font-bold">
                        {box.senderName}
                      </span>
                    </div>
                  </div>

                  <p className="font-serif italic text-xs text-[#5A4634] mt-3 pt-3 border-t border-[#E8D7A6]">
                    "{box.giftTagMessage || 'A secret vault of our moments together.'}"
                  </p>
                </div>

                {/* Password Input Form */}
                <form onSubmit={handleUnlockSubmit} className="space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#8B0000]/10 border border-[#8B0000]/30 flex items-center justify-center mb-2">
                      <Lock className="w-6 h-6 text-[#8B0000]" />
                    </div>
                    <h3 className="font-serif-title text-xl font-bold text-[#2D241E]">
                      Unlock with Secret Code
                    </h3>
                    <p className="text-xs text-[#7A6856] mt-0.5">
                      Enter the secret keyword {box.senderName} set for this hamper.
                    </p>
                  </div>

                  {passwordError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 text-center">
                      {passwordError}
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter secret code..."
                      className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border border-[#D4C3A3] text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none shadow-inner text-center font-medium tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6856] hover:text-[#2D241E] p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Hint Toggle */}
                  {box.passwordHint && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs font-semibold text-[#8C6239] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{showHint ? 'Hide whisper hint' : 'Whisper a hint'}</span>
                      </button>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 p-3 rounded-xl bg-white border border-[#E0D7C6] text-xs text-[#5A4634] italic font-serif"
                        >
                          Hint: "{box.passwordHint}"
                        </motion.div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-sm shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <span>Unfastening Seal...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Break Seal & Unlock Hamper</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* SLIDE 3: THE UNBOXING POP-UP & UNFASTENING ANIMATION */}
            {currentSlide === 3 && (
              <motion.div
                key="slide3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center my-auto space-y-6"
              >
                {/* 3D Trunk Opening Animation */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  {/* Glowing Aura */}
                  <div className="absolute inset-0 bg-[#D4AF37]/30 rounded-full blur-2xl animate-ping" />

                  {/* Central Box Body */}
                  <motion.div
                    animate={{ rotateY: [0, 15, -15, 0], scale: [0.9, 1.05, 1] }}
                    transition={{ duration: 2.5, ease: 'easeInOut' }}
                    className="relative w-40 h-36 rounded-2xl shadow-2xl border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: theme.boxBg }}
                  >
                    {/* Gold Satin Ribbon that unties */}
                    <motion.div
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.4, y: -20 }}
                      transition={{ duration: 1.8, delay: 0.8 }}
                      className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-lg flex items-center justify-center"
                    >
                      <span className="text-[10px] font-bold text-[#2D241E] uppercase tracking-widest">
                        Untying Satin Ribbon...
                      </span>
                    </motion.div>

                    {/* Wax seal popping */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 0], opacity: [1, 1, 0] }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="w-12 h-12 rounded-full bg-[#8B0000] border-2 border-[#D4AF37] shadow-xl flex items-center justify-center text-white font-cinzel font-bold text-sm"
                    >
                      {box.waxSealInitials || 'MB'}
                    </motion.div>
                  </motion.div>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#B8860B] block mb-1">
                    Unveiling Keepsake Trunk
                  </span>
                  <h3 className="font-serif-title text-3xl font-bold text-[#2D241E]">
                    Unfastening the Ribbons...
                  </h3>
                  <p className="text-xs text-[#7A6856] mt-2">
                    Playing soothing acoustic piano melody & revealing your surprises!
                  </p>
                </div>
              </motion.div>
            )}

            {/* SLIDE 4: INTERACTIVE EXPLORATION CANVAS */}
            {currentSlide === 4 && (
              <motion.div
                key="slide4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Layer Navigator */}
                <div className="flex items-center justify-between gap-2 border-b border-[#D4AF37]/30 pb-3">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          playPaperCrinkleSound();
                          setActiveLayer(l);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          activeLayer === l
                            ? 'bg-[#B8860B] text-white shadow-sm'
                            : 'bg-white/80 border border-[#D4C3A3] text-[#6B5532]'
                        }`}
                      >
                        Layer {l}
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] font-semibold text-[#8C6239]">
                    Tap each item to unwrap ✨
                  </span>
                </div>

                {/* Open Box Interior Bedding with Shredded Paper Texture */}
                <div className="relative rounded-2xl p-4 sm:p-6 border-2 border-[#D4AF37]/40 overflow-hidden min-h-[360px] flex flex-col justify-center">
                  {/* Velvet background */}
                  <div className={`absolute inset-0 ${theme.bodyGradient}`} />

                  {/* Organic Shredded Paper Filler Shavings */}
                  <div className="absolute inset-0 pointer-events-none opacity-30">
                    {Array.from({ length: 32 }).map((_, i) => {
                      const rot = (i * 43) % 360;
                      const left = (i * 27) % 92;
                      const top = (i * 23) % 88;
                      return (
                        <div
                          key={i}
                          className="absolute w-12 h-1.5 rounded-full bg-[#E2C799] transform"
                          style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            transform: `rotate(${rot}deg)`,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Items Grid */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {(activeLayer === 1
                      ? layer1Items
                      : activeLayer === 2
                      ? layer2Items
                      : layer3Items
                    ).map((item, idx) => {
                      const isUnwrapped = unwrappedItems[item.id];
                      const isLetter = item.type === 'letter';

                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleItemClick(item)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md relative overflow-hidden ${
                            isLetter
                              ? 'bg-[#FAF7F2] border-[#D4AF37] shadow-lg sm:col-span-2'
                              : isUnwrapped
                              ? 'bg-white/95 border-[#D4AF37]/60 shadow-md'
                              : 'bg-white/85 border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-[#D4C3A3] flex items-center justify-center flex-shrink-0">
                              {getIcon(item.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6239] px-2 py-0.5 rounded-full bg-[#8B0000]/10 text-[#8B0000]">
                                  {item.tag || item.type.replace('_', ' ')}
                                </span>
                                {isUnwrapped && (
                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                    Opened ✓
                                  </span>
                                )}
                              </div>

                              <h4 className="font-serif-title font-bold text-sm text-[#2D241E] truncate">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-[#7A6856] line-clamp-1 mt-0.5">
                                {item.subtitle || 'Click to reveal keepsake...'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Layer Navigator Footer */}
                  <div className="relative z-10 mt-6 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
                    <span className="text-white/80 text-[11px]">
                      Layer {activeLayer} of 3
                    </span>
                    <div className="flex gap-2">
                      {activeLayer > 1 && (
                        <button
                          onClick={() => {
                            playPaperCrinkleSound();
                            setActiveLayer(activeLayer - 1);
                          }}
                          className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold cursor-pointer"
                        >
                          ← Prev Layer
                        </button>
                      )}
                      {activeLayer < 3 && (
                        <button
                          onClick={() => {
                            playPaperCrinkleSound();
                            setActiveLayer(activeLayer + 1);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#D4AF37] hover:brightness-105 text-[#2D241E] text-[11px] font-bold cursor-pointer"
                        >
                          Next Layer →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ACTIVE ITEM MODALS */}
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
              />
            )}

            {(activeModalType === 'inside_joke' ||
              activeModalType === 'chocolate_truffles' ||
              activeModalType === 'scented_candle') && (
              <InsideJokeModal
                item={selectedItem}
                isOpen={Boolean(selectedItem)}
                onClose={() => setSelectedItem(null)}
              />
            )}

            {activeModalType === 'custom_gift' && (
              <CustomGiftModal
                item={selectedItem}
                isOpen={Boolean(selectedItem)}
                onClose={() => setSelectedItem(null)}
              />
            )}
          </>
        )}
      </div>
    </AnimatePresence>
  );
};
