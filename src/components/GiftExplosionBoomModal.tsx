import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Heart,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Volume2,
  Gift,
  Eye,
  Smile,
  Globe,
  Share2,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExplosionGiftItem, SupportedLanguage } from '../types';
import { useContentTranslation } from '../context/TranslationContext';
import { playExplosionBoomSound, playPartyFanfareSound, playPianoNote, playPaperCrinkleSound } from '../utils/audio';

interface GiftExplosionBoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderName: string;
  explosionTitle?: string;
  explosionSubtitle?: string;
  explosionThemeColor?: 'ruby_gold' | 'midnight_purple' | 'champagne_pink' | 'emerald_gold' | 'sapphire_silver';
  explosionBoxPattern?: 'polka_gold' | 'hearts' | 'stripes' | 'vintage_filigree' | 'velvet_ribbon';
  gifts: ExplosionGiftItem[];
  currentLanguage?: SupportedLanguage;
}

const THEME_STYLES = {
  ruby_gold: {
    boxBg: 'from-[#8B0000] via-[#630000] to-[#360000]',
    ribbon: 'from-[#D4AF37] via-[#FFDF73] to-[#AA7C11]',
    glow: 'rgba(212, 175, 55, 0.4)',
    border: 'border-[#D4AF37]',
  },
  midnight_purple: {
    boxBg: 'from-[#3B1E54] via-[#2A143D] to-[#160B21]',
    ribbon: 'from-[#E2BBE9] via-[#F3D7FB] to-[#9B51E0]',
    glow: 'rgba(226, 187, 233, 0.4)',
    border: 'border-[#E2BBE9]',
  },
  champagne_pink: {
    boxBg: 'from-[#D87093] via-[#A84A6A] to-[#68243A]',
    ribbon: 'from-[#FCE4EC] via-[#FFF0F5] to-[#E8B4B8]',
    glow: 'rgba(248, 187, 208, 0.4)',
    border: 'border-[#F8BBD0]',
  },
  emerald_gold: {
    boxBg: 'from-[#0B4619] via-[#062E10] to-[#021808]',
    ribbon: 'from-[#EEDC82] via-[#FFF8DC] to-[#C5A059]',
    glow: 'rgba(238, 220, 130, 0.4)',
    border: 'border-[#EEDC82]',
  },
  sapphire_silver: {
    boxBg: 'from-[#1A2A44] via-[#0F1B2E] to-[#070D18]',
    ribbon: 'from-[#90CAF9] via-[#E3F2FD] to-[#42A5F5]',
    glow: 'rgba(144, 202, 249, 0.4)',
    border: 'border-[#90CAF9]',
  },
};

export const GiftExplosionBoomModal: React.FC<GiftExplosionBoomModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  senderName,
  explosionTitle,
  explosionSubtitle,
  explosionThemeColor = 'ruby_gold',
  explosionBoxPattern = 'velvet_ribbon',
  gifts = [],
}) => {
  const { currentLanguage } = useContentTranslation();

  // Animation Stage: 'closed_vibrating' | 'exploding' | 'gallery_revealed'
  const [animationStage, setAnimationStage] = useState<'closed_vibrating' | 'exploding' | 'gallery_revealed'>('closed_vibrating');
  const [spotlightGiftId, setSpotlightGiftId] = useState<string | null>(null);
  const [hasExplodedOnce, setHasExplodedOnce] = useState<boolean>(false);

  const themeStyle = THEME_STYLES[explosionThemeColor] || THEME_STYLES.ruby_gold;
  const activeSpotlightGift = gifts.find((g) => g.id === spotlightGiftId) || null;

  // Reset stage when opened
  useEffect(() => {
    if (isOpen) {
      if (!hasExplodedOnce) {
        setAnimationStage('closed_vibrating');
        setSpotlightGiftId(null);
      }
    }
  }, [isOpen, hasExplodedOnce]);

  const triggerExplosionBoom = () => {
    setAnimationStage('exploding');
    setHasExplodedOnce(true);
    playExplosionBoomSound();

    // Trigger multi-angle celebration confetti burst
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.55, x: 0.5 },
      colors: ['#D4AF37', '#FFD700', '#FF416C', '#FF4B2B', '#FFF', '#9B51E0'],
      ticks: 300,
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#D4AF37', '#E8B4B8', '#FFF'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#D4AF37', '#E8B4B8', '#FFF'],
      });
      playPartyFanfareSound();
    }, 400);

    setTimeout(() => {
      setAnimationStage('gallery_revealed');
    }, 1200);
  };

  const handleReplayExplosion = () => {
    setSpotlightGiftId(null);
    setAnimationStage('closed_vibrating');
  };

  const handleSpotlightReaction = () => {
    playPianoNote(783.99, 1.2, 0.1);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF69B4', '#FFD700', '#D4AF37'],
    });
  };

  const handleNavigateSpotlight = (direction: 'prev' | 'next') => {
    if (!spotlightGiftId || gifts.length <= 1) return;
    const currentIndex = gifts.findIndex((g) => g.id === spotlightGiftId);
    if (currentIndex === -1) return;

    playPaperCrinkleSound();
    if (direction === 'prev') {
      const prevIdx = (currentIndex - 1 + gifts.length) % gifts.length;
      setSpotlightGiftId(gifts[prevIdx].id);
    } else {
      const nextIdx = (currentIndex + 1) % gifts.length;
      setSpotlightGiftId(gifts[nextIdx].id);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="gift-explosion-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-hidden">
        {/* Animated Background Ambience */}
        <div className="absolute inset-0 bg-radial from-[#8B0000]/20 via-black/40 to-black/80 pointer-events-none" />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-4xl h-[90vh] max-h-[820px] bg-gradient-to-b from-[#1C1412] via-[#120E0D] to-[#0A0707] rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="px-5 py-3.5 border-b border-[#D4AF37]/25 flex items-center justify-between bg-black/40 backdrop-blur-md z-30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#8B0000]/80 border border-[#D4AF37] flex items-center justify-center text-sm shadow-xs animate-bounce">
                💥
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold text-[#F5E6C8] tracking-wide">
                  {explosionTitle || 'The 3D Gift Explosion Boom Box'}
                </h3>
                <span className="text-[10px] text-[#D4AF37]/90 font-medium">
                  {recipientName ? `Handpicked treasures for ${recipientName}` : 'Handcrafted Surprises'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {animationStage === 'gallery_revealed' && (
                <button
                  type="button"
                  onClick={handleReplayExplosion}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Blast Again</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-900/50 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN STAGE CONTENT */}
          <div className="relative flex-1 overflow-hidden flex items-center justify-center p-4">
            {/* STAGE 1: VIBRATING CLOSED 3D GIFT BOX */}
            {animationStage === 'closed_vibrating' && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto z-20">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-1.5"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0000]/70 text-[#F5E6C8] border border-[#D4AF37] text-[11px] font-bold shadow-md uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span>Special Delivery From {senderName || 'Sender'}</span>
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white text-balance drop-shadow-md">
                    {explosionTitle || 'A Shower of Love & Surprises'}
                  </h2>
                  <p className="text-xs text-amber-200/80 font-medium">
                    {explosionSubtitle || 'Tap the vibrating box below to blast every secret gift into the air!'}
                  </p>
                </motion.div>

                {/* THE 3D CUBIC GIFT BOX BUTTON WITH TREMOR VIBRATION */}
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={triggerExplosionBoom}
                  className="relative cursor-pointer group select-none my-4"
                >
                  {/* Floating Pulsing Glow Ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      ease: 'easeInOut',
                    }}
                    className="absolute -inset-8 rounded-full blur-2xl pointer-events-none"
                    style={{ backgroundColor: themeStyle.glow }}
                  />

                  {/* Vibrating Cubic Box Container */}
                  <motion.div
                    animate={{
                      rotateZ: [-2, 2, -2, 2, 0],
                      x: [-2, 2, -1, 1, 0],
                      y: [-1, 1, -2, 2, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.35,
                      ease: 'linear',
                    }}
                    className={`w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-br ${themeStyle.boxBg} ${themeStyle.border} border-4 shadow-2xl relative flex items-center justify-center overflow-hidden`}
                  >
                    {/* Pattern Overlay */}
                    {explosionBoxPattern === 'polka_gold' && (
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:14px_14px]" />
                    )}
                    {explosionBoxPattern === 'hearts' && (
                      <div className="absolute inset-0 opacity-15 flex items-center justify-center text-4xl select-none">
                        ❤️ ✨ 💖
                      </div>
                    )}
                    {explosionBoxPattern === 'vintage_filigree' && (
                      <div className="absolute inset-0 opacity-20 border-8 border-dashed border-[#D4AF37]" />
                    )}

                    {/* Gold Satin Ribbon Cross */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-md border-y border-amber-600/40" />
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-b from-amber-400 via-yellow-200 to-amber-500 shadow-md border-x border-amber-600/40" />

                    {/* Rosette Bow on Top Center */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-400 border-2 border-amber-200 shadow-xl flex items-center justify-center text-2xl drop-shadow-lg"
                    >
                      🎀
                    </motion.div>

                    {/* Floating Shimmer Sparkles */}
                    <div className="absolute top-2 left-2 text-yellow-300 text-sm animate-ping">✨</div>
                    <div className="absolute bottom-2 right-2 text-amber-200 text-sm animate-pulse">✨</div>
                  </motion.div>

                  {/* Pulsing Tap Banner Pill */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-[#4A2800] text-xs font-extrabold shadow-lg uppercase tracking-wider"
                  >
                    <span>💥 Tap to Blast the Surprise!</span>
                  </motion.div>
                </motion.div>

                <p className="text-[11px] text-stone-400 italic">
                  Contains {gifts.length} custom-wrapped keepsakes ready to burst!
                </p>
              </div>
            )}

            {/* STAGE 2: THE EXPLOSION BOOM ANIMATION IN PROGRESS */}
            {animationStage === 'exploding' && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Detached Flying Lid */}
                <motion.div
                  initial={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
                  animate={{ y: -380, rotate: 180, scale: 1.4, opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="absolute z-30 w-44 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-300 shadow-2xl flex items-center justify-center text-3xl"
                >
                  🎀
                </motion.div>

                {/* Central Radial Flash */}
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="w-48 h-48 rounded-full bg-gradient-to-tr from-amber-300 via-rose-400 to-yellow-200 blur-xl absolute"
                />

                {/* Radial Gift Items Bursting Outward */}
                {gifts.map((gift, idx) => {
                  const angle = (idx / gifts.length) * (2 * Math.PI) + 0.2;
                  const distance = 160 + (idx % 2) * 50;
                  const targetX = Math.cos(angle) * distance;
                  const targetY = Math.sin(angle) * distance;

                  return (
                    <motion.div
                      key={gift.id}
                      initial={{ x: 0, y: 0, scale: 0.1, rotate: 0, opacity: 0 }}
                      animate={{
                        x: targetX,
                        y: targetY,
                        scale: 1,
                        rotate: (idx % 2 === 0 ? 1 : -1) * (15 + idx * 8),
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.85,
                        delay: idx * 0.08,
                        type: 'spring',
                        stiffness: 140,
                        damping: 14,
                      }}
                      className="absolute z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1.5 bg-white/95 border-2 border-[#D4AF37] shadow-2xl flex flex-col items-center"
                    >
                      <img
                        src={gift.imageUrl}
                        alt={gift.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* STAGE 3: INTERACTIVE FLOATING GALLERY GRID */}
            {animationStage === 'gallery_revealed' && (
              <div className="w-full h-full flex flex-col justify-between overflow-y-auto pr-1 scrollbar-thin">
                {/* Gallery Intro Banner */}
                <div className="text-center py-2 shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] px-3 py-0.5 rounded-full bg-[#8B0000]/60 border border-[#D4AF37]/40 shadow-xs">
                    ✨ Surprise Unveiled ✨
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F5E6C8] mt-1">
                    {explosionTitle || 'Every Thoughtful Gift, Picked For You'}
                  </h3>
                  <p className="text-xs text-stone-300">
                    Click on any floating keepsake to open full screen and read {senderName || 'the sender'}'s note.
                  </p>
                </div>

                {/* Grid of Settled Floating Keepsakes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4 my-auto p-2">
                  {gifts.map((gift, index) => (
                    <motion.div
                      key={gift.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ scale: 1.05, y: -6 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        playPianoNote(523.25 + index * 40, 0.6);
                        setSpotlightGiftId(gift.id);
                      }}
                      className="group p-3 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-[#D4AF37]/35 hover:border-[#D4AF37] backdrop-blur-md shadow-lg cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 border border-white/20 bg-stone-900">
                        <img
                          src={gift.imageUrl}
                          alt={gift.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {gift.reactionEmoji && (
                          <div className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs border border-white/30 flex items-center justify-center text-sm shadow-md">
                            {gift.reactionEmoji}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                          {gift.title}
                        </h4>
                        <p className="text-[10px] text-stone-300 line-clamp-2 mt-0.5 font-serif italic">
                          "{gift.caption}"
                        </p>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-[#D4AF37]">
                        <span>View Details</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center py-2 text-[11px] text-stone-400">
                  Tap any photo above to inspect in romantic spotlight 🔍
                </div>
              </div>
            )}
          </div>

          {/* SPOTLIGHT INSPECTION MODAL DRAWER */}
          <AnimatePresence>
            {activeSpotlightGift && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="relative w-full max-w-2xl bg-gradient-to-b from-[#2A1D1A] to-[#17100E] rounded-3xl border-2 border-[#D4AF37] shadow-2xl p-6 overflow-hidden flex flex-col md:flex-row gap-6"
                >
                  {/* Close Spotlight Button */}
                  <button
                    type="button"
                    onClick={() => setSpotlightGiftId(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center z-10 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Left: Big Image View */}
                  <div className="md:w-1/2 flex flex-col justify-between space-y-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-xl bg-stone-950">
                      <img
                        src={activeSpotlightGift.imageUrl}
                        alt={activeSpotlightGift.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {activeSpotlightGift.reactionEmoji && (
                        <span className="absolute bottom-2 right-2 text-2xl drop-shadow-md">
                          {activeSpotlightGift.reactionEmoji}
                        </span>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleNavigateSpotlight('prev')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold cursor-pointer transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavigateSpotlight('next')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold cursor-pointer transition-all"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Romantic Letter Note & Reaction */}
                  <div className="md:w-1/2 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-[#8B0000] text-[#F5E6C8] border border-[#D4AF37]/40">
                          Handpicked Keepsake
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-[#F5E6C8]">
                        {activeSpotlightGift.title}
                      </h3>

                      {/* Handwritten Cursive Parchment Note */}
                      <div className="p-4 rounded-2xl bg-[#FAF5EA] text-[#2D241E] border border-[#D4AF37]/50 shadow-inner font-serif relative">
                        <div className="absolute top-2 right-2 text-[#8B0000]/30 text-lg select-none">
                          🖋️
                        </div>
                        <p className="text-xs sm:text-sm italic leading-relaxed">
                          "{activeSpotlightGift.caption}"
                        </p>
                        <span className="text-[10px] text-[#8C6239] block mt-2 font-sans font-semibold text-right">
                          ~ With Endless Love, {senderName || 'Sender'}
                        </span>
                      </div>

                      {/* Tags */}
                      {activeSpotlightGift.tags && activeSpotlightGift.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {activeSpotlightGift.tags.map((tg, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-stone-300 border border-white/15"
                            >
                              #{tg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Celebration Action Button */}
                    <button
                      type="button"
                      onClick={handleSpotlightReaction}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#8B0000] via-[#B82E38] to-[#8B0000] hover:from-[#A31621] hover:to-[#B82E38] text-[#F5E6C8] border border-[#D4AF37] text-xs font-bold shadow-md cursor-pointer transition-all transform active:scale-95"
                    >
                      <Heart className="w-4 h-4 text-rose-300 fill-rose-300 animate-pulse" />
                      <span>Send Heart Blast ❤️</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
