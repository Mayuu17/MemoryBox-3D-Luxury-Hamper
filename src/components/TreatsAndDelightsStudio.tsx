import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Smile, Check, Cookie, SkipForward } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { CREATOR_STUDIO_TRANSLATIONS } from '../utils/languages';
import { playPaperCrinkleSound, playPianoNote } from '../utils/audio';

interface TreatsAndDelightsStudioProps {
  currentLanguage: SupportedLanguage;
  treatName: string;
  onChangeTreatName: (name: string) => void;
  treatDesc: string;
  onChangeTreatDesc: (desc: string) => void;
  treatImage: string;
  onChangeTreatImage: (img: string) => void;
  insideJokeMessage: string;
  onChangeInsideJoke: (msg: string) => void;
  onSkipModule?: () => void;
}

const TREAT_OPTIONS = [
  {
    id: 'belgian_truffles',
    name: 'Artisanal Belgian Dark Truffles',
    desc: 'Rich 70% dark cocoa dusted with roasted hazelnut praline',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
    tag: 'Chocolatier Special',
  },
  {
    id: 'heart_pralines',
    name: 'Gilded Heart Milk Pralines',
    desc: 'Silky Swiss milk chocolate infused with fleur de sel caramel',
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80',
    tag: 'Pure Romance',
  },
  {
    id: 'vanilla_macarons',
    name: 'Parisian Madagascar Macarons',
    desc: 'Delicate pastel almond shells with Bourbon vanilla ganache',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&auto=format&fit=crop&q=80',
    tag: 'French Patisserie',
  },
  {
    id: 'teddy_charm',
    name: 'Handmade Velvet Teddy Keepsake',
    desc: 'Soft plush mini teddy bear wearing a miniature satin bow',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&auto=format&fit=crop&q=80',
    tag: 'Cozy Mascot',
  },
];

export const TreatsAndDelightsStudio: React.FC<TreatsAndDelightsStudioProps> = ({
  currentLanguage,
  treatName,
  onChangeTreatName,
  treatDesc,
  onChangeTreatDesc,
  treatImage,
  onChangeTreatImage,
  insideJokeMessage,
  onChangeInsideJoke,
  onSkipModule,
}) => {
  const t = CREATOR_STUDIO_TRANSLATIONS[currentLanguage] || CREATOR_STUDIO_TRANSLATIONS.en;
  const ct = t?.delights;

  return (
    <div id="treats-delights-module" className="space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs relative overflow-hidden flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center text-[#B8860B]">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#2D241E]">
              {ct?.title || 'Sweet Treats, Inside Jokes & Keepsakes'}
            </h3>
            <p className="text-xs text-[#7A6856]">
              {ct?.subtitle || 'Artisanal chocolates, secret jokes revealed on unwrap, and milestone countdown locks'}
            </p>
          </div>
        </div>

        {onSkipModule && (
          <button
            type="button"
            onClick={() => {
              playPaperCrinkleSound();
              onSkipModule();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-[#7A6856] hover:text-[#2D241E] hover:bg-stone-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <SkipForward className="w-4 h-4 text-stone-500" />
            <span>Skip this Feature</span>
          </button>
        )}
      </div>

      {/* Treats Selection Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524]">
          {ct?.treatLabel || 'Artisanal Treat Selection'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TREAT_OPTIONS.map((opt) => {
            const isSelected = treatName === opt.name;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  playPaperCrinkleSound();
                  onChangeTreatName(opt.name);
                  onChangeTreatDesc(opt.desc);
                  onChangeTreatImage(opt.image);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex gap-3.5 items-center relative overflow-hidden ${
                  isSelected
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 bg-[#FFFDF7] shadow-xs'
                    : 'border-stone-200 bg-white/70 hover:bg-white'
                }`}
              >
                <img
                  src={opt.image}
                  alt={opt.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0 shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF3E0] text-[#8C6D37] border border-[#D4AF37]/20 font-medium">
                      {opt.tag}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#8B1E2D]" />}
                  </div>
                  <h4 className="text-xs font-bold text-[#2D241E] truncate">{opt.name}</h4>
                  <p className="text-[10px] text-[#7A6856] line-clamp-2 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Foil Crinkler & Inside Joke Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#FAF6EE] border border-[#D4AF37]/30 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-[#8B1E2D]" />
          <h4 className="text-sm font-serif font-bold text-[#2D241E]">
            Secret Foil Wrapper & Inside Joke Note
          </h4>
        </div>
        <p className="text-xs text-[#7A6856]">
          When the recipient clicks to uncrinkle the foil wrapper, this secret note will be revealed in a playful pop!
        </p>

        <div className="p-4 rounded-xl bg-white border-2 border-dashed border-[#D4AF37]/40 space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6D37]">
            Secret Foil Note (Revealed upon uncrinkling)
          </label>
          <textarea
            rows={2}
            value={insideJokeMessage}
            onChange={(e) => onChangeInsideJoke(e.target.value)}
            placeholder={ct?.insideJokePlaceholder || 'e.g. “Pineapple on pizza is still a crime against humanity, but I love you anyway!”'}
            className="w-full p-3 rounded-lg bg-[#FAF7EE] border border-stone-200 text-xs font-serif text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
          />
        </div>
      </div>
    </div>
  );
};
