import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wind, Tag, Stamp, Scissors, Feather, Heart, SkipForward } from 'lucide-react';
import { playPaperCrinkleSound, playWaxSealCrackSound, playPianoNote } from '../utils/audio';
import { SupportedLanguage } from '../types';
import { CREATOR_STUDIO_TRANSLATIONS, CreatorStudioTranslation } from '../utils/languages';

interface VirtualGiftTableProps {
  currentLanguage: SupportedLanguage;
  shreddedPaperColor: string;
  onSelectBedding: (color: string) => void;
  aromaMood: string;
  onSelectAroma: (aroma: string) => void;
  giftTagTo: string;
  giftTagFrom: string;
  giftTagMessage: string;
  onUpdateTag: (to: string, from: string, message: string) => void;
  selectedStickers: string[];
  onToggleSticker: (sticker: string) => void;
  onSkip?: () => void;
}

const BEDDING_OPTIONS = [
  { id: 'ivory_crinkle', name: 'Ivory Cream Tissue', hex: '#FAF3E0', border: '#E2D4B7', desc: 'Soft artisanal cream shavings' },
  { id: 'rose_blush', name: 'Rose Petal Blush', hex: '#FCE4EC', border: '#F8BBD0', desc: 'Crinkled dusty rose paper' },
  { id: 'gold_kraft', name: 'Golden Vintage Kraft', hex: '#EEDC82', border: '#D4AF37', desc: 'Warm natural gold fiber paper' },
  { id: 'midnight_champagne', name: 'Midnight & Champagne', hex: '#2B231D', border: '#D4AF37', desc: 'Dark velvet base with gold foil' },
];

const AROMA_MOODS = [
  { id: 'warm_vanilla', name: 'Warm Amber Vanilla', icon: '🕯️', desc: 'Cozy spiced amber, bourbon vanilla & cinnamon' },
  { id: 'rose_garden', name: 'English Rose Petals', icon: '🌹', desc: 'Fresh morning dew, damask rose & velvet peony' },
  { id: 'lavender_mist', name: 'Midnight French Lavender', icon: '🌿', desc: 'Calming dried lavender buds & wild bergamot' },
  { id: 'candlelit_sandalwood', name: 'Sacred Mysore Sandalwood', icon: '✨', desc: 'Smoked cedar, golden honey & royal sandalwood' },
];

const STICKER_TRAY = [
  { id: 'inside_joke', label: 'Inside Joke 🤫', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'open_midnight', label: 'Open At Midnight 🌙', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { id: 'handle_love', label: 'Handle With Love ❤️', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  { id: 'top_secret', label: 'Top Secret 🔒', color: 'bg-stone-100 text-stone-900 border-stone-300' },
  { id: 'our_song', label: 'Our Song 🎶', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'forever_always', label: 'Forever & Always ✨', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
];

export const VirtualGiftTable: React.FC<VirtualGiftTableProps> = ({
  currentLanguage,
  shreddedPaperColor,
  onSelectBedding,
  aromaMood,
  onSelectAroma,
  giftTagTo,
  giftTagFrom,
  giftTagMessage,
  onUpdateTag,
  selectedStickers,
  onToggleSticker,
  onSkip,
}) => {
  const t = CREATOR_STUDIO_TRANSLATIONS[currentLanguage] || CREATOR_STUDIO_TRANSLATIONS.en;
  const wt = t.tableWorkshop;

  return (
    <div id="virtual-gift-table-container" className="space-y-6">
      {/* Workshop Station Header */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-sm relative overflow-hidden flex items-center justify-between flex-wrap gap-3">
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#D4AF37]/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B1E2D]/10 border border-[#8B1E2D]/20 flex items-center justify-center text-[#8B1E2D] shadow-xs">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#2D241E] tracking-wide">
              {wt.title}
            </h3>
            <p className="text-xs text-[#7A6856]">
              {wt.subtitle}
            </p>
          </div>
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={() => {
              playPaperCrinkleSound();
              onSkip();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-[#7A6856] hover:text-[#2D241E] hover:bg-stone-100 text-xs font-bold transition-all cursor-pointer shadow-xs z-10"
          >
            <SkipForward className="w-4 h-4 text-stone-500" />
            <span>Skip Dressing Table</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Shredded Paper Bedding Studio */}
        <div id="workshop-bedding-station" className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Feather className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="text-sm font-serif font-bold text-[#2D241E]">
                {wt.beddingTitle}
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF3E0] text-[#8C6D37] border border-[#D4AF37]/30 font-medium">
              Tactile Filler
            </span>
          </div>
          <p className="text-xs text-[#7A6856] leading-relaxed">
            {wt.beddingSubtitle}
          </p>

          {/* Color Options Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {BEDDING_OPTIONS.map((opt) => {
              const isSelected = shreddedPaperColor === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    playPaperCrinkleSound();
                    onSelectBedding(opt.id);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 bg-[#FAF7EE] shadow-xs'
                      : 'border-stone-200 hover:border-[#D4AF37]/50 bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-5 h-5 rounded-full border shadow-2xs"
                      style={{ backgroundColor: opt.hex, borderColor: opt.border }}
                    />
                    {isSelected && (
                      <span className="text-[10px] text-[#8B1E2D] font-bold">✓ Selected</span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-[#2D241E]">{opt.name}</div>
                  <div className="text-[10px] text-[#7A6856] mt-0.5">{opt.desc}</div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              playPaperCrinkleSound();
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FAF3E0] to-[#F5E6C8] border border-[#D4AF37]/40 text-[#5C4524] text-xs font-semibold hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {wt.scatterBeddingBtn}
          </button>
        </div>

        {/* 2. Scent & Aroma Atmosphere */}
        <div id="workshop-aroma-station" className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#8B1E2D]" />
              <h4 className="text-sm font-serif font-bold text-[#2D241E]">
                {wt.aromaTitle}
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FCE4EC] text-[#8B1E2D] border border-[#8B1E2D]/20 font-medium">
              Atmosphere
            </span>
          </div>
          <p className="text-xs text-[#7A6856] leading-relaxed">
            {wt.aromaSubtitle}
          </p>

          <div className="space-y-2">
            {AROMA_MOODS.map((aroma) => {
              const isSelected = aromaMood === aroma.id;
              return (
                <button
                  key={aroma.id}
                  type="button"
                  onClick={() => {
                    playPianoNote(440);
                    onSelectAroma(aroma.id);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#8B1E2D]/50 bg-[#FDF2F4] ring-1 ring-[#8B1E2D]/20 shadow-2xs'
                      : 'border-stone-200 hover:border-[#8B1E2D]/30 bg-white/60 hover:bg-white'
                  }`}
                >
                  <span className="text-xl">{aroma.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#2D241E] flex items-center justify-between">
                      <span>{aroma.name}</span>
                      {isSelected && <span className="text-[10px] text-[#8B1E2D] font-bold">Active Scent</span>}
                    </div>
                    <div className="text-[10px] text-[#7A6856] truncate">{aroma.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Calligraphy Gift Tag & Twine station */}
        <div id="workshop-tag-station" className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#C5A059]" />
              <h4 className="text-sm font-serif font-bold text-[#2D241E]">
                {wt.tagTitle}
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7EE] text-[#5C4524] border border-[#D4AF37]/30 font-medium">
              Calligraphy
            </span>
          </div>
          <p className="text-xs text-[#7A6856]">
            {wt.tagSubtitle}
          </p>

          {/* Virtual Calligraphy Card Tag Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE0] border-2 border-dashed border-[#D4AF37]/40 relative shadow-xs">
            {/* Eyelet & Twine */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-[#C5A059] border-2 border-white shadow-xs" />
              <div className="w-0.5 h-3 bg-[#A67C52]" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#8C6D37] uppercase tracking-wider block mb-1">
                    To (Calligraphy)
                  </label>
                  <input
                    type="text"
                    value={giftTagTo}
                    onChange={(e) => onUpdateTag(e.target.value, giftTagFrom, giftTagMessage)}
                    placeholder="Recipient's Name..."
                    className="w-full text-xs font-handwriting text-[#2D241E] px-2.5 py-1.5 rounded-lg bg-white/80 border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#8C6D37] uppercase tracking-wider block mb-1">
                    From (Calligraphy)
                  </label>
                  <input
                    type="text"
                    value={giftTagFrom}
                    onChange={(e) => onUpdateTag(giftTagTo, e.target.value, giftTagMessage)}
                    placeholder="Your Name..."
                    className="w-full text-xs font-handwriting text-[#2D241E] px-2.5 py-1.5 rounded-lg bg-white/80 border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#8C6D37] uppercase tracking-wider block mb-1">
                  Tag Dedication Note
                </label>
                <input
                  type="text"
                  value={giftTagMessage}
                  onChange={(e) => onUpdateTag(giftTagTo, giftTagFrom, e.target.value)}
                  placeholder="Handmade with utmost care and affection for you..."
                  className="w-full text-xs text-[#2D241E] px-2.5 py-1.5 rounded-lg bg-white/80 border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-hidden italic"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Aesthetic Stamp Stickers Tray */}
        <div id="workshop-stickers-station" className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stamp className="w-4 h-4 text-[#8B1E2D]" />
              <h4 className="text-sm font-serif font-bold text-[#2D241E]">
                {wt.stickersTitle}
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7EE] text-[#5C4524] border border-[#D4AF37]/30 font-medium">
              Wax & Stamps
            </span>
          </div>
          <p className="text-xs text-[#7A6856]">
            {wt.stickersSubtitle}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {STICKER_TRAY.map((sticker) => {
              const isSelected = selectedStickers.includes(sticker.id);
              return (
                <button
                  key={sticker.id}
                  type="button"
                  onClick={() => {
                    playWaxSealCrackSound();
                    onToggleSticker(sticker.id);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-xs ' + sticker.color
                      : 'border-stone-200 bg-white/70 hover:bg-white text-[#5C4524]'
                  }`}
                >
                  <span className="truncate">{sticker.label}</span>
                  <span className="text-xs ml-1">
                    {isSelected ? '✓' : '+'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[#8C6D37] italic bg-[#FAF7EE] p-2.5 rounded-xl border border-[#D4AF37]/20 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#8B1E2D] shrink-0" />
            <span>Click any sticker to paste it on your wrapped gifts!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
