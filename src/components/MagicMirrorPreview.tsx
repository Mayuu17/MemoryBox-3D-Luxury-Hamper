import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BoxTheme,
  BoxOccasion,
  PaperStyle,
  ScrapbookPage,
  EmotionalReasonCategory,
} from '../types';
import { BOX_THEMES } from '../utils/themes';
import {
  playPaperCrinkleSound,
  playWaxSealCrackSound,
  playWrapperTearingSound,
  playBoxOpenCreakSound,
  playPianoNote,
} from '../utils/audio';
import {
  Sparkles,
  Heart,
  KeyRound,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle,
  Maximize2,
  Minimize2,
  Sparkle,
  Music,
  BookOpen,
  Mail,
  Cookie,
  Mic,
  Gift,
  Flame,
  Volume2,
  Cake,
  Feather,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface MagicMirrorData {
  theme: BoxTheme;
  recipientName: string;
  senderName: string;
  occasion: BoxOccasion;
  waxSealInitials: string;
  secretPassword: string;
  passwordHint: string;
  reasonCategory: EmotionalReasonCategory;
  reasonWhySpecial: string;
  customWishMessage: string;
  shreddedPaperColor: string;
  giftTagTo: string;
  giftTagFrom: string;
  giftTagMessage: string;
  letterTitle: string;
  letterContent: string;
  paperStyle: PaperStyle;
  pages: ScrapbookPage[];
  voiceTitle: string;
  treatName: string;
  treatDesc: string;
  insideJokeMessage: string;
  customItemName: string;
  timeCapsuleTitle: string;
  cakeMessage?: string;
  cakeFlavor?: string;
  lastNoteTitle?: string;
  lastNoteParchment?: string;
  explosionTitle?: string;
  explosionGiftsCount?: number;
  triggerEvent?: string;
  triggerTimestamp?: number;
}

interface MagicMirrorPreviewProps {
  data: MagicMirrorData;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

export const MagicMirrorPreview: React.FC<MagicMirrorPreviewProps> = ({
  data,
  isExpanded = false,
  onToggleExpand,
  className = '',
}) => {
  // Simulation Mode State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [unboxingStage, setUnboxingStage] = useState<'locked' | 'unlocked' | 'unwrapping' | 'opened'>('locked');
  const [typedPassword, setTypedPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeItemPreview, setActiveItemPreview] = useState<string | null>(null);

  // Live Micro-Animation Triggers
  const [activeAnimationLayer, setActiveAnimationLayer] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState<number>(0);
  const previousDataRef = useRef<MagicMirrorData>(data);

  const themeConfig = BOX_THEMES[data.theme] || BOX_THEMES.royal_velvet_burgundy;
  const displayName = data.recipientName || data.giftTagTo || 'Recipient';
  const displaySender = data.senderName || data.giftTagFrom || 'Sender';
  const displayInitials =
    data.waxSealInitials ||
    `${displaySender.charAt(0).toUpperCase() || 'A'} & ${displayName.charAt(0).toUpperCase() || 'B'}`;

  // Detect property changes and trigger specific live animation layers in the mirror
  useEffect(() => {
    const prev = previousDataRef.current;
    let newLayer: string | null = null;

    if (prev.theme !== data.theme) {
      newLayer = 'ribbon_slide';
      playPaperCrinkleSound();
    } else if (prev.reasonWhySpecial !== data.reasonWhySpecial || prev.customWishMessage !== data.customWishMessage) {
      newLayer = 'particle_heart';
      playPianoNote(523.25, 1.2, 0.08);
    } else if (prev.letterContent !== data.letterContent || prev.paperStyle !== data.paperStyle) {
      newLayer = 'letter_glow';
    } else if (prev.pages.length !== data.pages.length || JSON.stringify(prev.pages) !== JSON.stringify(data.pages)) {
      newLayer = 'polaroid_shimmer';
      playPaperCrinkleSound();
    } else if (prev.waxSealInitials !== data.waxSealInitials) {
      newLayer = 'wax_stamp';
      playWaxSealCrackSound();
    } else if (prev.shreddedPaperColor !== data.shreddedPaperColor) {
      newLayer = 'paper_cushion';
      playPaperCrinkleSound();
    }

    if (newLayer) {
      setActiveAnimationLayer(newLayer);
      setPulseKey((k) => k + 1);
      const timer = setTimeout(() => {
        setActiveAnimationLayer(null);
      }, 2200);
      return () => clearTimeout(timer);
    }

    previousDataRef.current = data;
  }, [
    data.theme,
    data.reasonWhySpecial,
    data.customWishMessage,
    data.letterContent,
    data.paperStyle,
    data.pages,
    data.waxSealInitials,
    data.shreddedPaperColor,
    data.triggerTimestamp,
  ]);

  // Start Interactive Unboxing Simulation
  const handleStartSimulation = () => {
    setIsSimulating(true);
    setTypedPassword('');
    setPasswordError(false);
    setActiveItemPreview(null);

    if (data.secretPassword && data.secretPassword.trim().length > 0) {
      setUnboxingStage('locked');
      playPianoNote(440, 1.2, 0.08);
    } else {
      setUnboxingStage('unlocked');
      triggerUnwrappingSequence();
    }
  };

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!data.secretPassword || typedPassword.trim().toLowerCase() === data.secretPassword.trim().toLowerCase()) {
      setPasswordError(false);
      setUnboxingStage('unlocked');
      playWaxSealCrackSound();
      triggerUnwrappingSequence();
    } else {
      setPasswordError(true);
      playPianoNote(220, 0.8, 0.2); // Low rejection tone
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const handleAutoFillPassword = () => {
    if (data.secretPassword) {
      setTypedPassword(data.secretPassword);
      playPianoNote(659.25, 0.8, 0.1);
    }
  };

  const triggerUnwrappingSequence = () => {
    setUnboxingStage('unwrapping');
    // Step 1: Wrapper Tearing & Ribbon Untying Sound
    playWrapperTearingSound();

    setTimeout(() => {
      // Step 2: Box Lid Creak & Golden Chimes
      playBoxOpenCreakSound();
      setUnboxingStage('opened');

      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#D4AF37', '#8B1E2D', '#FAF7F2', '#EEDC82'],
        });
      } catch (e) {}
    }, 900);
  };

  const handleResetSimulation = () => {
    playPaperCrinkleSound();
    setIsSimulating(false);
    setUnboxingStage('locked');
    setTypedPassword('');
    setActiveItemPreview(null);
  };

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-b from-[#1C1713]/95 via-[#231C16]/95 to-[#16120E]/95 border-2 border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col text-stone-100 backdrop-blur-xl transition-all duration-300 ${className}`}
      id="magic-mirror-preview-frame"
    >
      {/* GLOWING ORNATE FRAME CORNERS & HEADER */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] rounded-br-3xl pointer-events-none" />

      {/* Frame Gloss Overlay */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* TOP STATUS BAR: Mirror Header */}
      <div className="relative z-10 px-4 py-3 border-b border-[#D4AF37]/30 bg-black/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-serif font-bold text-xs text-[#F5E6C8] tracking-wider uppercase">
                The Magic Mirror
              </span>
            </div>
            <span className="text-[10px] text-[#C5A059] block">
              {isSimulating ? '🎬 Interactive Unboxing Simulation' : '⚡ Live Receiver Synced View'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#D4AF37] transition-all cursor-pointer"
              title={isExpanded ? 'Dock to Sidebar' : 'Expand Mirror'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {!isSimulating ? (
            <button
              onClick={handleStartSimulation}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] text-[#2D241E] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer font-serif"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Simulate Unboxing</span>
            </button>
          ) : (
            <button
              onClick={handleResetSimulation}
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[#F5E6C8] text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Exit Test</span>
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE NOTIFICATION BADGE FOR SENDER UPDATES */}
      <AnimatePresence>
        {activeAnimationLayer && (
          <motion.div
            key={pulseKey}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-20 px-3 py-1.5 bg-gradient-to-r from-[#8B1E2D] to-[#5C101B] border-b border-[#D4AF37]/50 text-center text-[11px] font-bold text-[#F5E6C8] flex items-center justify-center gap-2 shadow-inner"
          >
            {activeAnimationLayer === 'ribbon_slide' && (
              <>
                <Sparkle className="w-3 h-3 text-[#D4AF37] animate-spin" />
                <span>✨ Silk Ribbon updated & synchronized in real-time</span>
              </>
            )}
            {activeAnimationLayer === 'particle_heart' && (
              <>
                <Heart className="w-3 h-3 text-rose-400 fill-current animate-pulse" />
                <span>❤️ Wish intent & heart aura pulsing in receiver view</span>
              </>
            )}
            {activeAnimationLayer === 'letter_glow' && (
              <>
                <Mail className="w-3 h-3 text-[#D4AF37]" />
                <span>📜 Handwritten letter parchment formatted for receiver</span>
              </>
            )}
            {activeAnimationLayer === 'polaroid_shimmer' && (
              <>
                <BookOpen className="w-3 h-3 text-[#D4AF37]" />
                <span>📷 Scrapbook photo album stacked inside chest</span>
              </>
            )}
            {activeAnimationLayer === 'wax_stamp' && (
              <>
                <Flame className="w-3 h-3 text-amber-400" />
                <span>🔥 Victorian wax monogram stamped to seal</span>
              </>
            )}
            {activeAnimationLayer === 'paper_cushion' && (
              <>
                <Gift className="w-3 h-3 text-[#D4AF37]" />
                <span>🎁 Shredded paper cushion arranged under keepsakes</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN MIRROR BODY CONTAINER */}
      <div className="relative flex-1 p-4 sm:p-5 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[420px] overflow-hidden">
        {/* Background Candlelight Reflection in Glass */}
        <div className="absolute inset-0 bg-radial from-[#D4AF37]/10 via-transparent to-black/60 pointer-events-none" />

        {/* ----------------- MODE A: LIVE SYNC VIEW (NON-SIMULATION) ----------------- */}
        {!isSimulating ? (
          <div className="relative w-full max-w-sm flex flex-col items-center justify-center py-2">
            {/* Real-time Beating Heart Aura if Wish Intent has content */}
            {data.reasonWhySpecial && (
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.35, 0.65, 0.35],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-64 h-64 rounded-full bg-radial from-rose-500/30 via-amber-500/15 to-transparent blur-xl pointer-events-none"
              />
            )}

            {/* THE KEEPSAKE 3D BOX MODEL PREVIEW */}
            <motion.div
              layout
              className="relative w-64 h-52 sm:w-72 sm:h-56 rounded-2xl p-4 flex flex-col items-center justify-between border-2 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              style={{
                backgroundColor: themeConfig.boxColor,
                borderColor: themeConfig.borderAccent || '#D4AF37',
              }}
              onClick={handleStartSimulation}
              title="Click to simulate unboxing"
            >
              {/* Silk Ribbon Cross */}
              <div
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-7 shadow-md transition-colors duration-500"
                style={{ backgroundColor: themeConfig.ribbonColor }}
              >
                <div className="w-full h-full bg-gradient-to-r from-white/20 via-transparent to-black/20" />
              </div>
              <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-7 shadow-md transition-colors duration-500"
                style={{ backgroundColor: themeConfig.ribbonColor }}
              >
                <div className="w-full h-full bg-gradient-to-b from-white/20 via-transparent to-black/20" />
              </div>

              {/* Top Gift Tag Ribbon */}
              <div className="relative z-10 w-full flex items-center justify-between">
                <div className="px-2.5 py-1 rounded-md bg-[#FAF7EE]/95 border border-[#D4AF37]/60 text-[10px] text-[#2D241E] shadow-sm flex items-center gap-1 font-serif">
                  <span>To:</span>
                  <span className="font-bold">{displayName}</span>
                </div>
                {data.secretPassword ? (
                  <div className="px-2 py-0.5 rounded-full bg-black/60 border border-[#D4AF37]/50 text-[10px] text-amber-300 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Protected</span>
                  </div>
                ) : (
                  <div className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-[10px] text-emerald-300 flex items-center gap-1">
                    <Unlock className="w-2.5 h-2.5" />
                    <span>Open Access</span>
                  </div>
                )}
              </div>

              {/* CENTER WAX SEAL MONOGRAM */}
              <motion.div
                key={displayInitials}
                animate={
                  activeAnimationLayer === 'wax_stamp'
                    ? { scale: [1, 1.25, 1], rotate: [0, -5, 5, 0] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.5 }}
                className="relative z-20 w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-[#EEDC82] shadow-xl flex flex-col items-center justify-center text-white font-serif font-bold text-base tracking-widest cursor-pointer group"
                style={{
                  backgroundColor: themeConfig.waxColor || '#8B1E2D',
                }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                <span className="drop-shadow-md">{displayInitials}</span>
                <span className="text-[7px] uppercase tracking-tighter opacity-80 text-amber-200">Seal</span>
              </motion.div>

              {/* Bottom Sender Badge */}
              <div className="relative z-10 w-full flex items-center justify-between text-[10px]">
                <span className="text-[#F5E6C8]/80 drop-shadow-sm font-serif">
                  From: <span className="font-bold text-white">{displaySender}</span>
                </span>
                <span className="text-amber-200/90 font-mono text-[9px]">
                  {data.pages.length} Polaroids • {data.occasion.toUpperCase()}
                </span>
              </div>
            </motion.div>

            {/* REAL-TIME WISH INTENT & SENTIMENT CARD */}
            {data.reasonWhySpecial && (
              <motion.div
                layout
                className="mt-4 w-full p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-xs text-stone-200 relative overflow-hidden"
              >
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#D4AF37] mb-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-current" />
                  <span>Sender's Wish Intent Preview</span>
                </div>
                <p className="font-serif italic text-stone-100 text-[11px] leading-relaxed line-clamp-2">
                  “{data.reasonWhySpecial}”
                </p>
              </motion.div>
            )}

            {/* INSTRUCTION PROMPT */}
            <div className="mt-4 flex items-center gap-2 text-center text-[11px] text-[#C5A059]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>Updates made in studio reflect instantly in this frame.</span>
            </div>
          </div>
        ) : (
          /* ----------------- MODE B: INTERACTIVE UNBOXING SIMULATION ----------------- */
          <div className="relative w-full max-w-sm flex flex-col items-center justify-center">
            {/* STAGE 1: PASSWORD GATE SIMULATION */}
            {unboxingStage === 'locked' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-5 rounded-2xl bg-black/60 border border-[#D4AF37]/50 backdrop-blur-md text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#8B1E2D]/80 border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="font-serif font-bold text-sm text-[#F5E6C8]">Secret Keepsake Lock</h4>
                  <p className="text-[11px] text-stone-300 mt-1">
                    Your loved one will be prompted to enter the secret password you configured.
                  </p>
                  {data.passwordHint && (
                    <p className="text-[10px] text-amber-300 font-mono mt-1 bg-amber-950/40 py-1 px-2 rounded-md border border-amber-500/30">
                      💡 Hint: "{data.passwordHint}"
                    </p>
                  )}
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={typedPassword}
                      onChange={(e) => setTypedPassword(e.target.value)}
                      placeholder="Enter password..."
                      className={`w-full px-3 py-2 rounded-xl bg-white/10 border text-xs text-white placeholder-stone-400 focus:outline-hidden text-center font-mono ${
                        passwordError ? 'border-rose-500 ring-2 ring-rose-500/50' : 'border-[#D4AF37]/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {passwordError && (
                    <p className="text-[10px] text-rose-400 font-bold">
                      Incorrect password. Please try again or auto-fill.
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2D241E] text-xs font-bold shadow-md hover:brightness-110 cursor-pointer font-serif"
                    >
                      Unlock Box
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoFillPassword}
                      className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-amber-200 text-[11px] font-semibold transition-all cursor-pointer"
                      title="Auto-fill with configured password"
                    >
                      Auto-Fill
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STAGE 2: UNWRAPPING ANIMATION (Wrapper Tearing & Ribbon Release) */}
            {unboxingStage === 'unwrapping' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center py-8 space-y-4"
              >
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]"
                  />
                  <Flame className="w-10 h-10 text-amber-400 animate-pulse" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#F5E6C8] animate-pulse">
                  Tearing Wrapper & Breaking Wax Seal...
                </h4>
                <p className="text-[11px] text-stone-400">Untying satin ribbon and releasing keepsake lid</p>
              </motion.div>
            )}

            {/* STAGE 3: UNBOXED CHEST & INSPECTION */}
            {unboxingStage === 'opened' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-3"
              >
                {/* Unboxed Header */}
                <div className="p-3 rounded-2xl bg-white/10 border border-[#D4AF37]/40 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-serif font-bold text-xs text-[#F5E6C8] block">
                        Keepsake Chest Opened
                      </span>
                      <span className="text-[9px] text-stone-300">
                        {displayName}'s unboxing experience verified
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleStartSimulation}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-amber-200 transition-all cursor-pointer"
                  >
                    Replay
                  </button>
                </div>

                {/* Cushion & Items Carousel */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Item 1: Handwritten Letter */}
                  <div
                    onClick={() => setActiveItemPreview(activeItemPreview === 'letter' ? null : 'letter')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeItemPreview === 'letter'
                        ? 'bg-[#8B1E2D]/80 border-[#D4AF37] text-white shadow-lg'
                        : 'bg-white/5 border-stone-700 hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 mb-1">
                      <Mail className="w-3 h-3" />
                      <span>AI Letter</span>
                    </div>
                    <p className="text-[11px] font-serif font-semibold truncate">
                      {data.letterTitle || 'Personal Letter'}
                    </p>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Click to read</span>
                  </div>

                  {/* Item 2: Scrapbook Polaroids */}
                  <div
                    onClick={() => setActiveItemPreview(activeItemPreview === 'scrapbook' ? null : 'scrapbook')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeItemPreview === 'scrapbook'
                        ? 'bg-[#8B1E2D]/80 border-[#D4AF37] text-white shadow-lg'
                        : 'bg-white/5 border-stone-700 hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 mb-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Scrapbook</span>
                    </div>
                    <p className="text-[11px] font-serif font-semibold truncate">
                      {data.pages.length} Polaroids
                    </p>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Click to flip</span>
                  </div>

                  {/* Item 3: Treats & Inside Joke */}
                  <div
                    onClick={() => setActiveItemPreview(activeItemPreview === 'treat' ? null : 'treat')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeItemPreview === 'treat'
                        ? 'bg-[#8B1E2D]/80 border-[#D4AF37] text-white shadow-lg'
                        : 'bg-white/5 border-stone-700 hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 mb-1">
                      <Cookie className="w-3 h-3" />
                      <span>Treats & Joke</span>
                    </div>
                    <p className="text-[11px] font-serif font-semibold truncate">
                      {data.treatName || 'Sweet Delights'}
                    </p>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Secret foil note</span>
                  </div>

                  {/* Item 4: Voice Note */}
                  <div
                    onClick={() => setActiveItemPreview(activeItemPreview === 'voice' ? null : 'voice')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeItemPreview === 'voice'
                        ? 'bg-[#8B1E2D]/80 border-[#D4AF37] text-white shadow-lg'
                        : 'bg-white/5 border-stone-700 hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 mb-1">
                      <Mic className="w-3 h-3" />
                      <span>Voice Note</span>
                    </div>
                    <p className="text-[11px] font-serif font-semibold truncate">
                      {data.voiceTitle || 'Audio Whisper'}
                    </p>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Cassette player</span>
                  </div>

                  {/* Item 5: Occasion Cake */}
                  <div
                    onClick={() => setActiveItemPreview(activeItemPreview === 'cake' ? null : 'cake')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeItemPreview === 'cake'
                        ? 'bg-[#8B1E2D]/80 border-[#D4AF37] text-white shadow-lg'
                        : 'bg-white/5 border-stone-700 hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 mb-1">
                      <Cake className="w-3 h-3" />
                      <span>Celebration Cake</span>
                    </div>
                    <p className="text-[11px] font-serif font-semibold truncate">
                      {data.cakeMessage || 'Occasion Cake'}
                    </p>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Mic candle blow</span>
                  </div>

                  {/* Item 6: Last Whispering Note */}
                  <div
                    onClick={() => setActiveItemPreview(activeItemPreview === 'last_note' ? null : 'last_note')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeItemPreview === 'last_note'
                        ? 'bg-[#8B1E2D]/80 border-[#D4AF37] text-white shadow-lg'
                        : 'bg-white/5 border-stone-700 hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 mb-1">
                      <Feather className="w-3 h-3" />
                      <span>Final Note</span>
                    </div>
                    <p className="text-[11px] font-serif font-semibold truncate">
                      {data.lastNoteTitle || 'Floor Parchment'}
                    </p>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Chest floor secret</span>
                  </div>
                </div>

                {/* ACTIVE ITEM PREVIEW DRAWER */}
                <AnimatePresence>
                  {activeItemPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 rounded-2xl bg-black/80 border border-[#D4AF37]/50 text-xs overflow-hidden"
                    >
                      {activeItemPreview === 'letter' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase text-[#D4AF37]">
                            Letter Excerpt:
                          </span>
                          <p className="font-serif italic text-stone-200 leading-relaxed text-[11px]">
                            {data.letterContent
                              ? `“${data.letterContent.substring(0, 140)}...”`
                              : '“My love for you grows with each passing day. Thank you for being my light.”'}
                          </p>
                        </div>
                      )}
                      {activeItemPreview === 'scrapbook' && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase text-[#D4AF37]">
                            Polaroid Chapters ({data.pages.length}):
                          </span>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {data.pages.slice(0, 3).map((page, idx) => (
                              <div
                                key={page.id || idx}
                                className="w-20 shrink-0 p-1.5 bg-white rounded-lg shadow-sm text-stone-900"
                              >
                                <img
                                  src={page.photoUrl}
                                  alt={page.title}
                                  className="w-full h-12 object-cover rounded-sm"
                                />
                                <p className="text-[8px] font-bold truncate mt-1">{page.title}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {activeItemPreview === 'treat' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase text-[#D4AF37]">
                            Secret Inside Joke Foil:
                          </span>
                          <p className="font-mono text-amber-200 text-[10px] bg-amber-950/40 p-2 rounded-lg border border-amber-500/20">
                            {data.insideJokeMessage || '“Pineapple on pizza is our eternal debate!”'}
                          </p>
                        </div>
                      )}
                      {activeItemPreview === 'voice' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase text-[#D4AF37]">
                            Cassette Reel Status:
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-stone-300 bg-white/10 p-2 rounded-lg">
                            <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span>Audio track ready with vintage tape hiss & piano backdrop</span>
                          </div>
                        </div>
                      )}
                      {activeItemPreview === 'cake' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase text-[#D4AF37]">
                            Interactive Occasion Cake:
                          </span>
                          <p className="font-serif text-stone-200 text-[11px]">
                            🎂 {data.cakeMessage || 'Happy Celebration!'} (Flavor: {data.cakeFlavor || 'Red Velvet'})
                          </p>
                          <p className="text-[10px] text-amber-300/80 italic">
                            Mic blow listener active — blow on mic to extinguish lit candles.
                          </p>
                        </div>
                      )}
                      {activeItemPreview === 'last_note' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase text-[#D4AF37]">
                            The Last Whispering Note (Chest Floor):
                          </span>
                          <p className="font-serif italic text-stone-200 leading-relaxed text-[11px]">
                            {data.lastNoteParchment
                              ? `“${data.lastNoteParchment.substring(0, 140)}...”`
                              : '“And so, as you reach the bottom of this little universe I crafted for you, know that every single keepsake here is just a whisper of how endlessly you are cherished...”'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER VERIFICATION CHECKS */}
      <div className="relative z-10 px-4 py-2.5 border-t border-[#D4AF37]/30 bg-black/40 flex items-center justify-between text-[10px] text-[#C5A059]">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            <span>Lock: {data.secretPassword ? 'Encrypted' : 'Public'}</span>
          </span>
          <span>•</span>
          <span>Theme: {themeConfig.name}</span>
        </div>
        <div className="font-serif font-bold text-[#F5E6C8]">MemoryBox Artisan Studio</div>
      </div>
    </div>
  );
};
