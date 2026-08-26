import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Eye, RotateCcw, Volume2, Flame, CheckCircle, SkipForward } from 'lucide-react';
import { EmotionalReasonCategory, BoxOccasion, SupportedLanguage } from '../types';
import { VortexHeartAnimation } from './VortexHeartAnimation';
import { playPianoNote, playPaperCrinkleSound } from '../utils/audio';

interface VortexHeartStudioConfigProps {
  currentLanguage: SupportedLanguage;
  reasonCategory: EmotionalReasonCategory | BoxOccasion;
  customMessage: string;
  onChangeCustomMessage: (msg: string) => void;
  onChangeCategory: (cat: EmotionalReasonCategory) => void;
  recipientName: string;
  senderName: string;
  onSkip?: () => void;
}

export const VortexHeartStudioConfig: React.FC<VortexHeartStudioConfigProps> = ({
  currentLanguage,
  reasonCategory,
  customMessage,
  onChangeCustomMessage,
  onChangeCategory,
  recipientName,
  senderName,
  onSkip,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const predefinedWishes = [
    { id: 'love', label: 'I Love You', cat: 'love' as EmotionalReasonCategory, desc: 'Romantic deep devotion' },
    { id: 'apology', label: 'I Am Sorry', cat: 'apology' as EmotionalReasonCategory, desc: 'Sincere reconciliation' },
    { id: 'birthday', label: 'Happy Birthday', cat: 'birthday' as EmotionalReasonCategory, desc: 'Joyful celebration' },
    { id: 'anniversary', label: 'Happy Anniversary', cat: 'anniversary' as EmotionalReasonCategory, desc: 'Milestone love' },
    { id: 'gratitude', label: 'Thank You', cat: 'gratitude' as EmotionalReasonCategory, desc: 'Heartfelt appreciation' },
    { id: 'friendship', label: 'Forever Friends', cat: 'friendship' as EmotionalReasonCategory, desc: 'Lifelong companionship' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-[#D4AF37]/30 pb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8C6D37] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ff2a6d]" />
            Mathematical Visual Experience
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#2D241E]">
            Vortex Heart Visual Setup & Wish Overlay
          </h2>
          <p className="text-xs text-[#7A6856] mt-0.5">
            480+ glowing neon rose (#ff2a6d) particles swirling via vector attraction into a dual-pump beating heart.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSkip && (
            <button
              type="button"
              onClick={() => {
                playPaperCrinkleSound();
                onSkip();
              }}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-[#7A6856] hover:text-[#2D241E] hover:bg-stone-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <SkipForward className="w-3.5 h-3.5 text-stone-500" />
              <span>Skip / Next</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playPianoNote(523.25);
              setIsPreviewOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff2a6d] to-[#8B1E2D] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Live Preview Simulation</span>
          </button>
        </div>
      </div>

      {/* Physics & Particle Info Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-black/90 border border-[#ff2a6d]/40 text-white space-y-1 shadow-inner">
          <div className="flex items-center justify-between text-xs text-[#ff2a6d] font-bold">
            <span>Particle Dynamics</span>
            <Flame className="w-4 h-4 text-[#ff2a6d]" />
          </div>
          <p className="text-lg font-bold font-mono text-white">480+ Particles</p>
          <p className="text-[10px] text-stone-300">
            Vector trajectory swirling in outer orbit and converging into parametric heart.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/90 border border-[#ff2a6d]/40 text-white space-y-1 shadow-inner">
          <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
            <span>Dual-Pump Heartbeat</span>
            <Heart className="w-4 h-4 text-[#ff2a6d] fill-[#ff2a6d]" />
          </div>
          <p className="text-lg font-bold font-mono text-white">Systolic Pulse</p>
          <p className="text-[10px] text-stone-300">
            Sinusoidal heartbeat bounce with silky neon motion trails and radial glow.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/90 border border-[#D4AF37]/40 text-white space-y-1 shadow-inner">
          <div className="flex items-center justify-between text-xs text-[#D4AF37] font-bold">
            <span>Wish Center Overlay</span>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-lg font-bold font-serif text-[#FAF7EE] truncate">
            {customMessage || 'Dynamic Intent'}
          </p>
          <p className="text-[10px] text-stone-300">
            Golden cursive calligraphy inside cavity before transitioning into box.
          </p>
        </div>
      </div>

      {/* Predefined Intent Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524]">
          Choose Emotional Intent (Heart Cavity Wish):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {predefinedWishes.map((w) => {
            const isSelected = reasonCategory === w.cat;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  playPianoNote(587.33);
                  onChangeCategory(w.cat);
                  onChangeCustomMessage('');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#ff2a6d] bg-white shadow-md ring-2 ring-[#ff2a6d]/30'
                    : 'border-stone-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2D241E] font-serif">{w.label}</span>
                  {isSelected && <CheckCircle className="w-4 h-4 text-[#ff2a6d]" />}
                </div>
                <span className="text-[10px] text-[#7A6856] mt-1">{w.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Handwritten Wish Input */}
      <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5C4524]">
            Custom Handwritten Overlay Message (Optional Override):
          </label>
          <span className="text-[10px] text-[#8C6D37] italic font-serif">
            Appears in center of beating heart
          </span>
        </div>

        <input
          type="text"
          value={customMessage}
          onChange={(e) => onChangeCustomMessage(e.target.value)}
          placeholder={`e.g. I Love You Forever, ${recipientName || 'My Dear'} ❤️`}
          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7EE] border border-stone-200 text-sm font-serif font-bold text-[#2D241E] focus:ring-2 focus:ring-[#ff2a6d]/40 focus:outline-hidden"
        />

        <p className="text-[11px] text-[#7A6856] leading-relaxed">
          The receiver will watch 480+ glowing neon particles swirl together into a beating heart, with this exact calligraphy fading in right inside the glowing heart cavity!
        </p>
      </div>

      {/* Full-Screen Simulation Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 bg-black">
            <VortexHeartAnimation
              reasonCategory={reasonCategory}
              customMessage={customMessage}
              recipientName={recipientName}
              senderName={senderName}
              durationMs={6000}
              onComplete={() => setIsPreviewOpen(false)}
            />
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
            >
              ✕ Close Preview
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
