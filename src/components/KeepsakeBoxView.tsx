import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicBoxMeta, HamperBox, HamperItem, SupportedLanguage } from '../types';
import { BOX_THEMES } from '../utils/themes';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../utils/languages';
import {
  playWaxSealCrackSound,
  playBoxOpenCreakSound,
  playPaperCrinkleSound,
  playPianoNote,
} from '../utils/audio';
import {
  Lock,
  Sparkles,
  Heart,
  Gift,
  KeyRound,
  Camera,
  QrCode,
  Eye,
  CheckCircle2,
  Layers,
  RotateCcw,
  BookOpen,
  MailOpen,
  Mic,
  Cake,
  Feather,
  Clock,
  Smile,
  X,
  AlertCircle,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LetterModal } from './LetterModal';
import { ScrapbookModal } from './ScrapbookModal';
import { VoiceNoteModal } from './VoiceNoteModal';
import { TimeCapsuleModal } from './TimeCapsuleModal';
import { MemoryBuddyModal } from './MemoryBuddyModal';
import { CustomGiftModal } from './CustomGiftModal';
import { CelebrationCakeModal } from './CelebrationCakeModal';
import { LastWhisperingNoteModal } from './LastWhisperingNoteModal';
import { GiftExplosionBoomModal } from './GiftExplosionBoomModal';
import { ARCameraUnboxingModal } from './ARCameraUnboxingModal';
import { PrintableQrCardModal } from './PrintableQrCardModal';

export type BoxPhase = 'closed' | 'untying_ribbon' | 'opening_lid' | 'vortex_burst' | 'opened_interior';

interface KeepsakeBoxViewProps {
  box: PublicBoxMeta | HamperBox;
  hasPassword?: boolean;
  onOpenGate?: () => void;
  unlockedBoxData?: HamperBox | null;
  onBoxUnlocked?: (box: HamperBox) => void;
  currentLanguage?: SupportedLanguage;
}

export const KeepsakeBoxView: React.FC<KeepsakeBoxViewProps> = ({
  box,
  hasPassword = true,
  onOpenGate,
  unlockedBoxData = null,
  onBoxUnlocked,
  currentLanguage = 'en',
}) => {
  const [boxPhase, setBoxPhase] = useState<BoxPhase>(unlockedBoxData ? 'opened_interior' : 'closed');
  const [isHovered, setIsHovered] = useState(false);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // In-box password verification state
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Full loaded hamper data
  const [fullHamper, setFullHamper] = useState<HamperBox | null>(
    (box as any).items ? (box as HamperBox) : unlockedBoxData || null
  );

  // Unwrapped items tracking
  const [unwrappedItems, setUnwrappedItems] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<HamperItem | null>(null);
  const [activeModalType, setActiveModalType] = useState<string | null>(null);
  const [activeLayerFilter, setActiveLayerFilter] = useState<number | 'all'>('all');

  const theme = BOX_THEMES[box.theme] || BOX_THEMES.royal_velvet_burgundy;
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  // Sync if unlockedBoxData updates from parent
  useEffect(() => {
    if (unlockedBoxData) {
      setFullHamper(unlockedBoxData);
      if (boxPhase === 'closed') {
        startSequentialOpening(unlockedBoxData);
      }
    }
  }, [unlockedBoxData]);

  // Execute 3-Stage Opening Sequence
  const startSequentialOpening = (boxData: HamperBox) => {
    setFullHamper(boxData);
    setIsKeypadOpen(false);

    // Stage 1: Crack Wax Seal & Untie Satin Ribbon
    setBoxPhase('untying_ribbon');
    playWaxSealCrackSound();
    playPianoNote(523.25, 1.2, 0.1);

    // Stage 2: Lift & Hinge Open 3D Box Lid
    setTimeout(() => {
      setBoxPhase('opening_lid');
      playBoxOpenCreakSound();
      playPaperCrinkleSound();
    }, 650);

    // Stage 3: Particle Vortex Heart & Starburst Eruption
    setTimeout(() => {
      setBoxPhase('vortex_burst');
      playPianoNote(659.25, 1.5, 0.12);
      playPianoNote(783.99, 1.8, 0.15);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#D4AF37', '#E2C799', '#DB4455', '#FAF7F2', '#FF69B4'],
        });
      } catch (e) {}
    }, 1400);

    // Stage 4: Viewport Camera glides smoothly INSIDE the Keepsake Chest
    setTimeout(() => {
      setBoxPhase('opened_interior');
      if (onBoxUnlocked) {
        onBoxUnlocked(boxData);
      }
    }, 2500);
  };

  // Direct click on Wax Seal or Box
  const handleBoxClick = () => {
    if (boxPhase !== 'closed') return;

    if (hasPassword && !fullHamper?.items) {
      // Open inline 3D keypad
      setIsKeypadOpen(true);
      playPaperCrinkleSound();
    } else {
      // Direct unlock
      fetchFullBoxAndOpen('');
    }
  };

  // Handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordError('Please enter the secret password.');
      return;
    }

    setIsVerifying(true);
    setPasswordError('');

    await fetchFullBoxAndOpen(passwordInput.trim());
    setIsVerifying(false);
  };

  const fetchFullBoxAndOpen = async (pwd: string) => {
    try {
      const res = await fetch(`/api/boxes/${box.id}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || 'Incorrect secret password. Please ask your sender!');
        playPianoNote(300, 0.5, 0.08);
        return;
      }

      startSequentialOpening(data.box);
    } catch (err) {
      setPasswordError('Network error verifying password.');
    }
  };

  // Click on a nested item inside the chest
  const handleNestedItemClick = (item: HamperItem) => {
    playPaperCrinkleSound();
    playPianoNote(587.33, 1.2, 0.1);
    setUnwrappedItems((prev) => ({ ...prev, [item.id]: true }));
    setSelectedItem(item);
    setActiveModalType(item.type);

    if (item.layer === 3) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.65 },
          colors: ['#D4AF37', '#DB4455', '#FAF7F2'],
        });
      } catch (e) {}
    }
  };

  // Re-close chest
  const handleCloseChest = () => {
    playBoxOpenCreakSound();
    setBoxPhase('closed');
    setIsKeypadOpen(false);
    setPasswordInput('');
    setPasswordError('');
  };

  const itemsList = fullHamper?.items || [];
  const filteredItems =
    activeLayerFilter === 'all'
      ? itemsList
      : itemsList.filter((it) => it.layer === activeLayerFilter);

  // Helper to map icons for nested items
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'letter':
        return <MailOpen className="w-5 h-5 text-[#8B0000]" />;
      case 'scrapbook':
        return <BookOpen className="w-5 h-5 text-[#B8860B]" />;
      case 'voice_note':
        return <Mic className="w-5 h-5 text-[#8C6239]" />;
      case 'celebration_cake':
        return <Cake className="w-5 h-5 text-[#DB4455]" />;
      case 'gift_explosion_box':
        return <Gift className="w-5 h-5 text-[#8B0000]" />;
      case 'time_capsule':
        return <Clock className="w-5 h-5 text-[#4B6B94]" />;
      case 'memory_buddy':
      case 'custom_gift':
        return <Heart className="w-5 h-5 text-[#8B0000]" />;
      case 'last_whisper_note':
        return <Feather className="w-5 h-5 text-[#B8860B]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#B8860B]" />;
    }
  };

  return (
    <div
      id="3d-unboxing-viewport"
      className="relative flex flex-col items-center justify-center min-h-[85vh] w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Soft Ambient Candlelight Halo behind the 3D Box */}
      <div
        className="absolute w-[360px] md:w-[620px] h-[360px] md:h-[520px] rounded-full blur-3xl opacity-60 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${theme.ambientGlow} 0%, rgba(212, 175, 55, 0.18) 50%, transparent 75%)`,
        }}
      />

      {/* Top Status & Viewport Controls */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 z-30 flex-wrap">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/50 bg-white/80 backdrop-blur-md shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-[#8B6B38]">
            {boxPhase === 'opened_interior' ? 'Inside The Keepsake Chest' : `${box.occasion.replace('_', ' ')} Keepsake Chest`}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
        </motion.div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2">
          {boxPhase === 'opened_interior' && (
            <button
              onClick={handleCloseChest}
              className="px-3.5 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/50 text-xs font-bold text-[#6B5233] hover:bg-[#FAF7F2] shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-3 h-3 text-[#B8860B]" />
              <span>Close & Re-seal Chest</span>
            </button>
          )}

          <button
            onClick={() => setIsARModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/40 text-xs font-bold text-[#8B0000] hover:bg-[#FFF8E7] shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#8B0000]" />
            <span className="hidden sm:inline">AR Filter</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-white/90 border border-[#D4C3A3] text-xs font-bold text-[#5A4634] hover:bg-[#FFF8E7] shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="hidden sm:inline">Gift Tag QR</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3D TACTILE BOX STAGE (CSS 3D PERSPECTIVE VIEWPORT) */}
      {/* ========================================================================= */}
      <div
        className="relative w-full max-w-[560px] sm:max-w-[640px] md:max-w-[720px] transition-all duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: boxPhase === 'opened_interior' ? 'rotateX(14deg) translateY(-10px)' : 'rotateX(0deg)',
        }}
      >
        {/* ========================================================================= */}
        {/* CLOSED BOX CONTAINER & MULTI-STAGE OPENING ANIMATIONS */}
        {/* ========================================================================= */}

        {/* 1. HANGING 3D CALLIGRAPHY GIFT TAG */}
        <AnimatePresence>
          {boxPhase === 'closed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotate: isHovered ? [0, -5, 4, 0] : [0, 2, -2, 0],
              }}
              exit={{ opacity: 0, scale: 0.6, y: -40 }}
              transition={{
                repeat: Infinity,
                duration: isHovered ? 2.5 : 5,
                ease: 'easeInOut',
              }}
              className="absolute -top-12 -left-4 sm:-left-8 z-40 transform origin-top-right drop-shadow-2xl pointer-events-none"
            >
              {/* Golden Thread String */}
              <div className="w-0.5 h-10 bg-[#8B6B38] mx-auto opacity-80 shadow-xs" />

              <div
                className={`${theme.tagBg} border-2 border-[#D4AF37] rounded-2xl p-4 sm:p-5 w-48 sm:w-56 shadow-2xl relative overflow-hidden transform -rotate-6`}
              >
                {/* Brass Eyelet Ring */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#B8860B] bg-[#2C241E]/15 shadow-inner" />

                <div className="pt-2 text-center">
                  <span className="text-[9px] tracking-widest uppercase font-bold text-[#8C6239] block mb-0.5">
                    Handmade Keepsake Hamper
                  </span>
                  <p className="font-script text-2xl sm:text-3xl text-[#2D241E] leading-tight font-bold">
                    To: {box.recipientName}
                  </p>
                  <p className="font-script text-lg sm:text-xl text-[#7A5835] -mt-1">
                    From: {box.senderName}
                  </p>

                  {box.giftTagMessage && (
                    <p className="mt-2 text-[11px] italic text-[#5A4634] border-t border-[#D4AF37]/35 pt-2 line-clamp-2 leading-relaxed">
                      "{box.giftTagMessage}"
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. 3D CHEST BODY (CAVITY & WALLS) */}
        <div
          className={`relative w-full rounded-3xl ${theme.boxBorder} border-4 transition-all duration-700 overflow-hidden shadow-2xl`}
          style={{
            transformStyle: 'preserve-3d',
            backgroundColor: '#1E140F',
          }}
        >
          {/* Inner Depth Cavity & Velvet Wall Texture */}
          <div className="relative w-full min-h-[380px] sm:min-h-[460px] p-6 sm:p-8 flex flex-col justify-between chest-inner-shadow">
            {/* Box Outer Velvet Texture & Gradient */}
            <div className={`absolute inset-0 ${theme.lidGradient} opacity-90`} />

            {/* Velvet Lining Grain */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

            {/* Gold Filigree Corner Accents */}
            <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#D4AF37] z-20 pointer-events-none rounded-tl-md" />
            <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#D4AF37] z-20 pointer-events-none rounded-tr-md" />
            <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#D4AF37] z-20 pointer-events-none rounded-bl-md" />
            <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#D4AF37] z-20 pointer-events-none rounded-br-md" />

            {/* ========================================================================= */}
            {/* PHASE: CLOSED LID WITH SATIN RIBBONS & WAX SEAL */}
            {/* ========================================================================= */}
            <AnimatePresence>
              {boxPhase !== 'opened_interior' && (
                <motion.div
                  key="lid-and-ribbons"
                  initial={false}
                  animate={{
                    rotateX:
                      boxPhase === 'opening_lid' || boxPhase === 'vortex_burst' ? -115 : 0,
                    y:
                      boxPhase === 'opening_lid' || boxPhase === 'vortex_burst' ? -80 : 0,
                    z:
                      boxPhase === 'opening_lid' || boxPhase === 'vortex_burst' ? 50 : 0,
                    opacity: boxPhase === 'vortex_burst' ? 0.2 : 1,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    transformOrigin: 'top center',
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={handleBoxClick}
                  className="absolute inset-0 z-30 rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
                >
                  {/* Outer Lid Velvet Finish & Gold Borders */}
                  <div className={`absolute inset-0 ${theme.lidGradient} ${theme.velvetTexture}`} />
                  <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-[#D4AF37]/50 pointer-events-none" />
                  <div className="absolute inset-4 sm:inset-5 rounded-xl border border-[#D4AF37]/25 pointer-events-none" />

                  {/* 3D SATIN RIBBON CROSS (VERTICAL) */}
                  <motion.div
                    animate={{
                      scaleY: boxPhase === 'untying_ribbon' ? 0 : 1,
                      opacity: boxPhase === 'untying_ribbon' ? 0 : 1,
                      y: boxPhase === 'untying_ribbon' ? -100 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                    className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-16 ${theme.ribbonGradient} shadow-xl z-10 opacity-95 flex items-center justify-center`}
                  >
                    <div className="w-0.5 h-full bg-[#AA771C]/40 border-r border-[#FFF8DC]/40" />
                  </motion.div>

                  {/* 3D SATIN RIBBON CROSS (HORIZONTAL) */}
                  <motion.div
                    animate={{
                      scaleX: boxPhase === 'untying_ribbon' ? 0 : 1,
                      opacity: boxPhase === 'untying_ribbon' ? 0 : 1,
                      x: boxPhase === 'untying_ribbon' ? 100 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                    className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-14 sm:h-16 ${theme.ribbonGradient} shadow-xl z-10 opacity-95 flex items-center justify-center`}
                  >
                    <div className="h-0.5 w-full bg-[#AA771C]/40 border-b border-[#FFF8DC]/40" />
                  </motion.div>

                  {/* CENTRAL WAX SEAL & CLICK/UNLOCK INTERACTION */}
                  <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-6">
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.08 : 1,
                        rotate: isHovered ? 6 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-2xl relative flex items-center justify-center p-1 cursor-pointer"
                      style={{
                        backgroundColor: theme.waxSealColor,
                        boxShadow:
                          '0 12px 35px rgba(0,0,0,0.6), inset 0 0 15px rgba(255,255,255,0.2), inset 0 0 25px rgba(0,0,0,0.7)',
                        border: '3px solid rgba(212, 175, 55, 0.7)',
                      }}
                    >
                      <div className="absolute inset-1 rounded-full border border-white/25" />

                      <div className="text-center">
                        <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-[#F5E6C8] drop-shadow-md block">
                          {box.waxSealInitials || 'M & B'}
                        </span>
                        <span className="text-[9px] tracking-widest uppercase text-[#E0C68E] font-bold block -mt-0.5">
                          Keepsake
                        </span>
                      </div>

                      {/* Glossy light reflection */}
                      <div className="absolute top-2 left-4 w-6 h-3 bg-white/30 rounded-full blur-[1px] transform -rotate-45" />
                    </motion.div>

                    {/* Unlock / Open Action Prompt Button */}
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37] text-[#F5E6C8] shadow-2xl"
                    >
                      {hasPassword ? (
                        <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                      ) : (
                        <Gift className="w-4 h-4 text-[#D4AF37]" />
                      )}
                      <span className="text-xs sm:text-sm font-bold tracking-wide">
                        {hasPassword
                          ? 'Click Wax Seal or Enter Secret Password'
                          : 'Click to Open Keepsake Chest'}
                      </span>
                    </motion.div>

                    {box.passwordHint && (
                      <p className="mt-3 text-[11px] text-[#EAD4B4]/90 italic max-w-xs">
                        Hint: {box.passwordHint}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* INLINE 3D KEYPAD MODAL (IF LOCKED WITH PASSWORD) */}
            {/* ========================================================================= */}
            <AnimatePresence>
              {isKeypadOpen && boxPhase === 'closed' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-x-4 sm:inset-x-12 top-10 bottom-10 z-40 bg-[#FAF7F2]/98 rounded-2xl p-6 shadow-2xl border-2 border-[#D4AF37] flex flex-col justify-between paper-texture overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-[#8B0000]" />
                      <h4 className="font-serif-title font-bold text-lg text-[#2D241E]">
                        Unlock Secret Chest
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsKeypadOpen(false)}
                      className="p-1 rounded-full hover:bg-black/5 text-[#7A6856]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4 my-auto py-2">
                    <p className="text-xs text-[#7A6856] text-center">
                      Enter the secret word or date provided by{' '}
                      <span className="font-bold text-[#2D241E]">{box.senderName}</span>
                    </p>

                    <div className="relative">
                      <input
                        type="text"
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="Type secret password..."
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#D4AF37]/60 text-center font-bold text-sm text-[#2D241E] placeholder:text-gray-400 focus:outline-hidden focus:border-[#8B0000] shadow-inner"
                        autoFocus
                      />
                    </div>

                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{passwordError}</span>
                      </motion.div>
                    )}

                    {box.passwordHint && (
                      <div className="flex items-center justify-center gap-1 text-[11px] text-[#8C6239] bg-[#F5EEDC] p-2 rounded-lg">
                        <HelpCircle className="w-3 h-3 text-[#B8860B]" />
                        <span>Clue: {box.passwordHint}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <span>Verifying Key...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Turn Key & Open Chest</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* PHASE: VORTEX BURST & STARBURSTS FOUNTAIN */}
            {/* ========================================================================= */}
            <AnimatePresence>
              {boxPhase === 'vortex_burst' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.2, y: 40 }}
                  animate={{ opacity: 1, scale: 1.2, y: -60 }}
                  exit={{ opacity: 0, scale: 1.5, y: -120 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none"
                >
                  <div className="relative">
                    <Heart className="w-28 h-28 fill-[#8B0000] text-[#D4AF37] animate-pulse drop-shadow-[0_0_35px_rgba(212,175,55,0.9)]" />
                    <Sparkles className="w-12 h-12 text-[#FFD700] absolute -top-4 -right-4 animate-bounce" />
                    <Sparkles className="w-10 h-10 text-[#FF69B4] absolute -bottom-2 -left-4 animate-spin" />
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-script text-3xl sm:text-4xl text-[#F5E6C8] drop-shadow-lg mt-3 text-center"
                  >
                    A Universe of Love For You...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* PHASE: LOOK INSIDE THE CHEST (डिब्बे के अंदर झांकना) */}
            {/* ========================================================================= */}
            {boxPhase === 'opened_interior' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-20 w-full h-full flex flex-col justify-between"
              >
                {/* Shredded Crinkle Paper Bedding Texture in the Bottom of the Chest */}
                <div className="absolute inset-0 rounded-2xl shredded-paper-bedding opacity-90 pointer-events-none shadow-inner border border-[#D4AF37]/30" />

                {/* Soft Candlelight Amber Bedding Glow */}
                <div className="absolute inset-0 bg-radial from-[#FFE6B0]/25 via-transparent to-[#1F140F]/80 rounded-2xl pointer-events-none" />

                {/* Top Chest Navigation / Layer Switcher */}
                <div className="relative z-10 flex items-center justify-between gap-2 mb-4 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-[#D4AF37]/40 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-[#F5E6C8] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Nestled Keepsakes ({itemsList.length})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {(['all', 1, 2, 3] as const).map((layer) => (
                      <button
                        key={layer}
                        onClick={() => setActiveLayerFilter(layer)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          activeLayerFilter === layer
                            ? 'bg-[#D4AF37] text-[#2C1D0F] shadow-xs'
                            : 'text-[#E0C68E] hover:bg-white/10'
                        }`}
                      >
                        {layer === 'all' ? 'All' : `Layer ${layer}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* NESTLED HANDCRAFTED GIFTS GRID INSIDE BEDDING */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 py-2">
                  {filteredItems.map((item, idx) => {
                    const isUnwrapped = unwrappedItems[item.id];
                    const isLetter = item.type === 'letter';

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: idx * 0.08, duration: 0.4 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleNestedItemClick(item)}
                        className={`relative cursor-pointer rounded-2xl p-3.5 sm:p-4 transition-all duration-300 border backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-lg ${
                          isLetter
                            ? 'bg-gradient-to-br from-[#FFF9E8] via-[#F7EDD9] to-[#EFE2C8] border-[#D4AF37] col-span-2'
                            : isUnwrapped
                            ? 'bg-[#FAF7F2]/95 border-[#D4AF37]/80 ring-1 ring-[#D4AF37]/50'
                            : 'bg-[#FAF7F2]/88 border-[#D4AF37]/40 hover:border-[#D4AF37]'
                        }`}
                      >
                        {/* Shimmer Nesting Bedding Shadow Behind Item */}
                        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#D4AF37]/15 rounded-full blur-lg pointer-events-none" />

                        <div>
                          {/* Tag & Unwrap Status */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B0000]/10 text-[#8B0000] border border-[#8B0000]/20 truncate">
                              {item.tag || item.type.replace('_', ' ')}
                            </span>

                            {isUnwrapped && (
                              <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Opened</span>
                              </span>
                            )}
                          </div>

                          {/* Icon & Title */}
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-[#D4C3A3] flex items-center justify-center shrink-0">
                              {getItemIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-serif-title font-bold text-xs sm:text-sm text-[#2D241E] truncate">
                                {item.title}
                              </h5>
                              <p className="text-[10px] text-[#7A6856] line-clamp-1">
                                {item.subtitle || 'Click to explore & experience.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Click Prompt */}
                        <div className="mt-3 pt-2 border-t border-[#D4AF37]/25 flex items-center justify-between text-[10px] font-bold text-[#8C6239]">
                          <span>{isUnwrapped ? 'Revisit ✨' : 'Unwrap 🎁'}</span>
                          <Sparkles className="w-3 h-3 text-[#B8860B]" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bottom Bedding Whisper Banner */}
                <div className="relative z-10 mt-4 text-center pt-2 border-t border-[#D4AF37]/30">
                  <p className="text-[11px] text-[#F5E6C8] font-script text-lg">
                    "Every treasure placed inside was handcrafted with eternal love."
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* 3D Box Base Shadow */}
        <div className="w-[90%] h-8 bg-black/40 mx-auto rounded-full blur-xl -mt-4 transform scale-y-50 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* BOX METADATA & OCCASION TITLE */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-8 text-center max-w-xl"
      >
        <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D241E] leading-tight">
          {box.title}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#7A6856]">
          {boxPhase === 'opened_interior'
            ? `Explore the ${itemsList.length} tactile keepsakes embedded in this handmade hamper.`
            : `Contains ${box.itemCount || 7} handcrafted memories, letters, and timeless surprises.`}
        </p>
      </motion.div>

      {/* ========================================================================= */}
      {/* INTERACTIVE ITEM MODAL STUDIOS */}
      {/* ========================================================================= */}
      {selectedItem && fullHamper && (
        <>
          {activeModalType === 'letter' && (
            <LetterModal
              item={selectedItem}
              box={fullHamper}
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
              box={fullHamper}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'celebration_cake' && (
            <CelebrationCakeModal
              item={selectedItem}
              box={fullHamper}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'last_whisper_note' && (
            <LastWhisperingNoteModal
              item={selectedItem}
              box={fullHamper}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'gift_explosion_box' && (
            <GiftExplosionBoomModal
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
              recipientName={fullHamper.recipientName}
              senderName={fullHamper.senderName}
              explosionTitle={selectedItem.payload?.explosionTitle || selectedItem.title}
              explosionSubtitle={selectedItem.payload?.explosionSubtitle || selectedItem.subtitle}
              explosionThemeColor={selectedItem.payload?.explosionThemeColor || 'ruby_gold'}
              explosionBoxPattern={selectedItem.payload?.explosionBoxPattern || 'velvet_ribbon'}
              gifts={selectedItem.payload?.explosionGifts || []}
              currentLanguage={currentLanguage}
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

      {/* AR Camera Modal */}
      <ARCameraUnboxingModal
        box={(fullHamper || box) as HamperBox}
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        onEnterFullExperience={() => {
          setIsARModalOpen(false);
          handleBoxClick();
        }}
      />

      {/* Printable QR Card Modal */}
      <PrintableQrCardModal
        box={(fullHamper || box) as HamperBox}
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
