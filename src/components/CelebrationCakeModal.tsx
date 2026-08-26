import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperItem, HamperBox, SupportedLanguage } from '../types';
import { playPianoNote } from '../utils/audio';
import {
  X,
  Sparkles,
  Mic,
  MicOff,
  Flame,
  RotateCcw,
  Languages,
  Heart,
  Volume2,
  PartyPopper,
  Wind,
  CheckCircle2,
} from 'lucide-react';
import { useContentTranslation } from '../context/TranslationContext';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import confetti from 'canvas-confetti';

interface CelebrationCakeModalProps {
  item: HamperItem;
  box?: HamperBox;
  isOpen: boolean;
  onClose: () => void;
  onBlownOut?: () => void;
}

export const CelebrationCakeModal: React.FC<CelebrationCakeModalProps> = ({
  item,
  box,
  isOpen,
  onClose,
  onBlownOut,
}) => {
  const { currentLanguage, setLanguage, getTranslatedBox } = useContentTranslation();
  const activeBox = box ? (getTranslatedBox(box, currentLanguage) || box) : undefined;
  const activeItem = activeBox?.items.find((it) => it.id === item.id) || item;

  const cakeFlavor = activeItem.payload.cakeFlavor || 'red_velvet';
  const cakeOccasion = activeItem.payload.cakeOccasion || 'anniversary';
  const recipientName = activeBox?.recipientName || 'My Love';
  const cakeMessage = activeItem.payload.cakeMessage || `Happy ${activeBox?.occasion === 'birthday' ? 'Birthday' : 'Celebration'} ${recipientName} ✨`;
  const candleCount = Math.min(Math.max(activeItem.payload.candleCount || 3, 1), 7);
  const wishBannerText = activeItem.payload.wishBannerText || 'Make a Wish! ✨';
  const wishSecretNote = activeItem.payload.wishSecretNote || 'May every dream in your heart find its way into the stars, and may life always bring you reasons to smile.';

  const [isBlownOut, setIsBlownOut] = useState<boolean>(Boolean(activeItem.payload.isBlownOut));
  const [micActive, setMicActive] = useState<boolean>(false);
  const [micPermissionState, setMicPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [showWishLetter, setShowWishLetter] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Setup Web Audio API Mic Blow Listener
  const startMicListening = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicPermissionState('denied');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;
      setMicPermissionState('granted');
      setMicActive(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.2;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      let blowStreak = 0;

      const checkAudioLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average energy, specifically focusing on low/mid noise typical of blowing
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round(avg * 1.5)));

        // Blow detection threshold: sustained breath noise or high sudden surge
        if (avg > 48) {
          blowStreak += 1;
          if (blowStreak >= 3) {
            triggerBlowOut();
            return;
          }
        } else {
          blowStreak = Math.max(0, blowStreak - 1);
        }

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
    } catch (err) {
      console.warn('Microphone access for cake blow listener:', err);
      setMicPermissionState('denied');
      setMicActive(false);
    }
  };

  const stopMicListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setMicActive(false);
    setAudioLevel(0);
  };

  useEffect(() => {
    if (isOpen && !isBlownOut) {
      startMicListening();
    }
    return () => {
      stopMicListening();
    };
  }, [isOpen, isBlownOut]);

  // Blow out triggered
  const triggerBlowOut = () => {
    if (isBlownOut) return;
    setIsBlownOut(true);
    stopMicListening();

    // Play celebration audio chord
    playPianoNote(523.25, 2.5, 0.1);
    setTimeout(() => playPianoNote(659.25, 2.5, 0.1), 100);
    setTimeout(() => playPianoNote(783.99, 3.0, 0.12), 200);
    setTimeout(() => playPianoNote(1046.50, 3.5, 0.15), 300);

    // Launch celebratory fireworks confetti explosion
    try {
      const end = Date.now() + 2500;
      const colors = ['#D4AF37', '#FF69B4', '#FF4500', '#00CED1', '#FFD700', '#FFFFFF'];

      (function frame() {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors,
      });
    } catch (e) {}

    setTimeout(() => {
      setShowWishLetter(true);
    }, 1200);

    if (onBlownOut) {
      onBlownOut();
    }
  };

  const handleRelight = () => {
    setIsBlownOut(false);
    setShowWishLetter(false);
    playPianoNote(440, 1.2, 0.08);
    startMicListening();
  };

  if (!isOpen) return null;

  // Cake flavor styles
  const flavorStyles: Record<
    string,
    {
      topFrosting: string;
      tierBg: string;
      accentColor: string;
      plateBg: string;
      dripColor: string;
      flavorName: string;
    }
  > = {
    red_velvet: {
      topFrosting: 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF3EB] to-[#F2E8DC]',
      tierBg: 'bg-gradient-to-r from-[#7A1220] via-[#941A2B] to-[#6A0E1A]',
      accentColor: '#D4AF37',
      plateBg: 'from-[#E8D4A2] via-[#D4AF37] to-[#B8860B]',
      dripColor: 'bg-[#FAF3EB]',
      flavorName: 'Royal Red Velvet & Cream Frosting',
    },
    belgian_chocolate: {
      topFrosting: 'bg-gradient-to-b from-[#3D2518] via-[#4A2E1D] to-[#2E1A0F]',
      tierBg: 'bg-gradient-to-r from-[#24140B] via-[#331C0F] to-[#1E0F07]',
      accentColor: '#FFD700',
      plateBg: 'from-[#D4AF37] via-[#AA771C] to-[#5C3D11]',
      dripColor: 'bg-[#2E1A0F]',
      flavorName: 'Rich Belgian Dark Chocolate Ganache',
    },
    vanilla_rose: {
      topFrosting: 'bg-gradient-to-b from-[#FFF2F5] via-[#FFE4EC] to-[#FFD1DE]',
      tierBg: 'bg-gradient-to-r from-[#F7C6D0] via-[#F4B4C2] to-[#E99EAF]',
      accentColor: '#D4AF37',
      plateBg: 'from-[#F7D6DC] via-[#E8B4B8] to-[#D4AF37]',
      dripColor: 'bg-[#FFF2F5]',
      flavorName: 'French Vanilla Rose & Champagne',
    },
    vintage_berry: {
      topFrosting: 'bg-gradient-to-b from-[#F9EBF8] via-[#F0D5ED] to-[#E4BDDF]',
      tierBg: 'bg-gradient-to-r from-[#5B214B] via-[#6D2859] to-[#48183B]',
      accentColor: '#F5E6C8',
      plateBg: 'from-[#E4BDDF] via-[#D4AF37] to-[#6D2859]',
      dripColor: 'bg-[#F9EBF8]',
      flavorName: 'Vintage Forest Berry & Mascarpone',
    },
    royal_truffle: {
      topFrosting: 'bg-gradient-to-b from-[#FFFDF0] via-[#FAF5DD] to-[#EFE7C4]',
      tierBg: 'bg-gradient-to-r from-[#D4AF37] via-[#E2C799] to-[#B8860B]',
      accentColor: '#8B0000',
      plateBg: 'from-[#FFFDF0] via-[#D4AF37] to-[#8B0000]',
      dripColor: 'bg-[#FFFDF0]',
      flavorName: 'Ivory Gold Truffle & Almond Cream',
    },
  };

  const currentFlavor = flavorStyles[cakeFlavor] || flavorStyles.red_velvet;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Cinematic Backdrop with atmospheric starry glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Ambient Warm Golden Glow behind cake */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* MAIN CAKE VAULT CONTAINER */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#1C140E] via-[#2A1E15] to-[#120C07] rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 md:p-10 shadow-2xl border-2 border-[#D4AF37]/50 my-auto text-white overflow-hidden luxury-box-shadow select-none z-10"
        >
          {/* Subtle gold filigree corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/60 pointer-events-none rounded-tl-sm" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/60 pointer-events-none rounded-tr-sm" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/60 pointer-events-none rounded-bl-sm" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/60 pointer-events-none rounded-br-sm" />

          {/* Top Header Bar with Language Selector & Close Button */}
          <div className="flex items-center justify-between mb-4 relative z-20">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-xs text-[#F5E6C8] shadow-xs">
              <Languages className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent font-medium text-white focus:outline-hidden cursor-pointer text-xs"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-black">
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#E6D4B5] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Cake Vault"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title Header */}
          <div className="text-center mb-6 relative z-10">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>The Celebration Vault</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FAF7F2] mt-1">
              {cakeOccasion === 'birthday'
                ? 'Birthday Celebration Cake'
                : cakeOccasion === 'anniversary'
                ? 'Anniversary Milestone Cake'
                : 'Celebration Love Cake'}
            </h2>
            <p className="text-xs text-[#D4C3A3] mt-1 font-serif italic">
              {currentFlavor.flavorName}
            </p>
          </div>

          {/* =========================================================================
              THE 3D-STYLED CELEBRATION CAKE WITH CANDLES & DYNAMIC FLAMES
             ========================================================================= */}
          <div className="relative my-6 sm:my-8 flex flex-col items-center justify-center min-h-[260px]">
            {/* CANDLES ROW (Standing on top of cake) */}
            <div className="relative z-20 flex items-end justify-center gap-4 sm:gap-6 mb-[-6px]">
              {Array.from({ length: candleCount }).map((_, cIdx) => (
                <div key={cIdx} className="flex flex-col items-center relative">
                  {/* FLAME & SMOKE CONTAINER */}
                  <AnimatePresence>
                    {!isBlownOut ? (
                      <motion.div
                        key="flame"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0, y: -10 }}
                        className="relative flex flex-col items-center cursor-pointer"
                        onClick={triggerBlowOut}
                      >
                        {/* Outer Flame Glow */}
                        <div className="absolute -top-3 w-8 h-10 bg-amber-400/40 rounded-full blur-md animate-pulse" />

                        {/* Animated Flame Teardrop */}
                        <div className="w-4 h-7 bg-gradient-to-t from-[#FF4500] via-[#FFD700] to-[#FFFFFF] rounded-full shadow-lg transform origin-bottom animate-bounce-slow" />

                        {/* Inner Blue Core */}
                        <div className="absolute bottom-0.5 w-1.5 h-2 bg-cyan-400 rounded-full opacity-80" />
                      </motion.div>
                    ) : (
                      /* Wispy Smoke Particles after blow */
                      <motion.div
                        key="smoke"
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.8, 0], y: -30, scale: 1.5, x: (cIdx % 2 === 0 ? 8 : -8) }}
                        transition={{ duration: 1.8, ease: 'easeOut' }}
                        className="w-3 h-6 rounded-full bg-white/40 blur-xs"
                      />
                    )}
                  </AnimatePresence>

                  {/* Candle Wick */}
                  <div className="w-0.5 h-2 bg-stone-800" />

                  {/* Candle Stick */}
                  <div
                    className="w-3.5 sm:w-4 h-12 sm:h-14 rounded-t-sm shadow-md border-x border-t border-white/40 flex flex-col justify-between overflow-hidden"
                    style={{
                      background:
                        cIdx % 3 === 0
                          ? 'linear-gradient(to right, #D4AF37, #FFF8DC, #B8860B)'
                          : cIdx % 3 === 1
                          ? 'linear-gradient(to right, #FF69B4, #FFE4E1, #FF1493)'
                          : 'linear-gradient(to right, #4169E1, #E0FFFF, #0000CD)',
                    }}
                  >
                    {/* Spiral gold stripes */}
                    <div className="w-full h-1 bg-white/50 transform -rotate-12 mt-1" />
                    <div className="w-full h-1 bg-white/50 transform -rotate-12" />
                    <div className="w-full h-1 bg-white/50 transform -rotate-12 mb-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* CAKE TIER 1 (Top Tier with Frosted Inscription) */}
            <div className="relative z-10 w-64 sm:w-80 h-24 sm:h-28 rounded-3xl shadow-2xl flex flex-col items-center justify-between p-3 border-2 border-[#D4AF37]/70 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF3EB] to-[#F2E8DC]">
              {/* Pearl Border Icing on top rim */}
              <div className="absolute top-1 left-2 right-2 flex justify-between px-1 pointer-events-none opacity-80">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-white shadow-xs border border-[#E8D4A2]" />
                ))}
              </div>

              {/* Hand-piped Script Message on Top of Cake */}
              <div className="my-auto text-center px-4">
                <span className="font-script text-2xl sm:text-3xl font-bold text-[#7A1220] tracking-wide block leading-tight drop-shadow-xs">
                  {cakeMessage}
                </span>
              </div>

              {/* Frosting Drips hanging down */}
              <div className="absolute -bottom-1 left-0 right-0 flex justify-around pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-b-full bg-[#FAF3EB] shadow-xs"
                    style={{ height: `${6 + (i % 4) * 4}px` }}
                  />
                ))}
              </div>
            </div>

            {/* CAKE TIER 2 (Bottom Sponge Tier with Velvety Rich Texture) */}
            <div
              className={`relative z-0 w-72 sm:w-96 h-20 sm:h-24 -mt-3 rounded-3xl shadow-2xl border-2 border-[#D4AF37]/50 flex items-center justify-center p-3 overflow-hidden ${currentFlavor.tierBg}`}
            >
              {/* Gold leaf / strawberry accent dots */}
              <div className="absolute inset-0 flex items-center justify-around opacity-60">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#FFD700] shadow-md animate-pulse" />
                ))}
              </div>

              {/* Velvet Ribbons & Cream Swirls */}
              <div className="text-center font-serif text-[11px] tracking-widest uppercase text-[#F5E6C8] font-bold">
                ★ {box.waxSealInitials || 'A & A'} ★
              </div>
            </div>

            {/* GOLDEN LUXURY CAKE PEDESTAL / STAND */}
            <div className="relative w-80 sm:w-[420px] h-6 bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] rounded-full shadow-2xl border border-white/60 -mt-2 flex items-center justify-center">
              <div className="w-48 h-1.5 bg-white/40 rounded-full" />
            </div>
          </div>

          {/* =========================================================================
              INTERACTIVE BLOW DETECTOR OR CELEBRATION WISH BANNER
             ========================================================================= */}
          {!isBlownOut ? (
            <div className="relative z-20 mt-4 p-4 rounded-2xl bg-white/10 border border-[#D4AF37]/40 backdrop-blur-md text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD700]">
                <Wind className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span>{micPermissionState === 'granted' ? 'Microphone Active — Blow into your mic!' : 'Blow out the candles!'}</span>
              </div>

              {/* Live Audio Level Meter Indicator */}
              {micPermissionState === 'granted' && (
                <div className="w-full max-w-xs mx-auto space-y-1">
                  <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden p-0.5 border border-[#D4AF37]/30">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#E6D4B5]/80 font-mono">
                    Breath Sensor: {audioLevel}% (Blow hard to extinguish)
                  </span>
                </div>
              )}

              {/* Action Buttons: Blow directly or enable mic */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={triggerBlowOut}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] text-[#2D241E] font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Wind className="w-4 h-4 text-[#8B0000]" />
                  <span>Blow Out Candles (Click to Blow)</span>
                </button>

                {micPermissionState !== 'granted' && (
                  <button
                    type="button"
                    onClick={startMicListening}
                    className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Enable Live Mic Blow</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* WISH BANNER & GLOWING SCRIPT DISPLAY */
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative z-20 mt-4 p-5 rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EB] text-[#2D241E] border-2 border-[#D4AF37] shadow-2xl text-center space-y-3"
            >
              <div className="flex items-center justify-center gap-2">
                <PartyPopper className="w-5 h-5 text-[#B8860B]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B0000]">
                  Candles Extinguished • Wishes Sent to the Universe
                </span>
                <PartyPopper className="w-5 h-5 text-[#B8860B]" />
              </div>

              {/* Glowing Handwritten Wish Title */}
              <h3 className="font-script text-3xl sm:text-4xl font-bold text-[#8B0000] leading-tight">
                {wishBannerText}
              </h3>

              {/* Secret Wish Blessing Note */}
              <p className="font-serif italic text-xs sm:text-sm text-[#5C4524] max-w-md mx-auto leading-relaxed border-t border-[#D4AF37]/30 pt-2">
                “{wishSecretNote}”
              </p>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRelight}
                  className="px-4 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#5C4524] font-semibold text-xs border border-stone-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Relight Candles 🕯️</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A30000] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer"
                >
                  <span>Continue Unboxing ✨</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
