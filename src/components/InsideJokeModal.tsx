import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperItem, SupportedLanguage } from '../types';
import { playPaperCrinkleSound, playPianoNote } from '../utils/audio';
import { X, Sparkles, Smile, Heart, Gift, Tag, Award, Languages } from 'lucide-react';
import { useContentTranslation } from '../context/TranslationContext';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import confetti from 'canvas-confetti';

interface InsideJokeModalProps {
  item: HamperItem;
  isOpen: boolean;
  onClose: () => void;
}

export const InsideJokeModal: React.FC<InsideJokeModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setLanguage } = useContentTranslation();
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isOpen) return null;

  const treatName = item.payload.treatName || item.title || 'Artisanal Belgian Truffles';
  const treatImage =
    item.payload.treatImage ||
    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80';
  const treatDescription =
    item.payload.treatDescription ||
    item.subtitle ||
    '70% rich dark cocoa dusted with golden flakes and hazelnut praline.';
  const insideJoke =
    item.payload.insideJokeMessage ||
    item.payload.giftTagMessage ||
    '“Pineapple on pizza is a crime against humanity — and Aryan still agrees wholeheartedly!”';

  const handleUnwrap = () => {
    playPaperCrinkleSound();
    playPianoNote(587.33, 2.0, 0.12);
    setIsRevealed(true);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#8B0000', '#FAF7F2'],
      });
    } catch (e) {}
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A1410]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/50 my-auto paper-texture overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#D4C3A3] text-xs text-[#5A4634] shadow-xs">
              <Languages className="w-3.5 h-3.5 text-[#B8860B]" />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent font-medium text-[#2D241E] focus:outline-none cursor-pointer text-xs"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8C6239] px-3 py-1 bg-white rounded-full border border-[#D4C3A3]">
              Delights & Sweet Secrets
            </span>
            <h3 className="font-serif-title text-2xl font-bold text-[#2D241E] mt-2">
              {treatName}
            </h3>
          </div>

          {/* 3D Treat Presentation / Peel Foil */}
          <div className="relative mb-6">
            {!isRevealed ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={handleUnwrap}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/60 cursor-pointer group"
              >
                <img
                  src={treatImage}
                  alt={treatName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] mb-1">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Tap to unwrap & bite!</span>
                  </div>
                  <p className="text-xs text-neutral-200">
                    A sweet treat with a hidden inside joke card underneath...
                  </p>
                </div>
              </motion.div>
            ) : (
              /* REVEALED INSIDE JOKE CARD */
              <motion.div
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF8E7] via-[#FAF3E0] to-[#F5E6C8] border-2 border-[#D4AF37] shadow-xl text-center space-y-4"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#8B0000]/10 border border-[#8B0000]/30 flex items-center justify-center">
                  <Smile className="w-6 h-6 text-[#8B0000]" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6239] block mb-1">
                    Secret Inside Joke Revealed
                  </span>
                  <p className="font-script text-3xl text-[#2D241E] leading-relaxed">
                    {insideJoke}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8D7A6] flex items-center justify-center gap-1.5 text-xs text-[#7A5826] font-medium">
                  <Heart className="w-3.5 h-3.5 fill-[#8B0000] text-[#8B0000]" />
                  <span>Only the two of you understand this memory.</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Treat description below */}
          <div className="p-4 rounded-2xl bg-white border border-[#E0D7C6] shadow-sm mb-4">
            <p className="text-xs text-[#4A3B2C] leading-relaxed font-serif">
              {treatDescription}
            </p>
          </div>

          {/* Action button */}
          {!isRevealed && (
            <button
              onClick={handleUnwrap}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Unwrap Sweet Treat to Reveal Secret</span>
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
