import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Image, Plus, Trash2, Sparkles, Pin, Upload, Camera, SkipForward, X } from 'lucide-react';
import { ScrapbookPage, SupportedLanguage } from '../types';
import { CREATOR_STUDIO_TRANSLATIONS } from '../utils/languages';
import { playPaperCrinkleSound, playPianoNote } from '../utils/audio';

interface PolaroidScrapbookStudioProps {
  currentLanguage: SupportedLanguage;
  scrapbookTitle: string;
  onChangeTitle: (title: string) => void;
  pages: ScrapbookPage[];
  onChangePages: (pages: ScrapbookPage[]) => void;
  onSkipModule?: () => void;
}

const PRESET_PHOTO_IDEAS = [
  {
    title: 'First Coffee Date ☕',
    date: 'Autumn Afternoon',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
    note: 'Where time stopped and we talked for 4 continuous hours without checking our phones once.',
  },
  {
    title: 'Rainy Roadtrip 🌧️',
    date: 'Monsoon Memories',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    note: 'Singing along to our favorite playlist at the top of our lungs with the windows rolled down.',
  },
  {
    title: 'Sunset Stargazing ✨',
    date: 'Golden Hour',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    note: 'The sky turned shades of lavender and gold, just like our dreams.',
  },
  {
    title: 'Birthday Celebration 🎂',
    date: 'Midnight Surprise',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    note: 'The joyful smile on your face when blowing out the candles made my whole year.',
  },
];

const TAPE_COLORS = [
  { id: '#D4AF37', name: 'Gold Foil' },
  { id: '#E8B4B8', name: 'Blush Rose' },
  { id: '#A3B18A', name: 'Sage Green' },
  { id: '#CDB4DB', name: 'Lavender Mist' },
];

export const PolaroidScrapbookStudio: React.FC<PolaroidScrapbookStudioProps> = ({
  currentLanguage,
  scrapbookTitle,
  onChangeTitle,
  pages,
  onChangePages,
  onSkipModule,
}) => {
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const t = CREATOR_STUDIO_TRANSLATIONS[currentLanguage] || CREATOR_STUDIO_TRANSLATIONS.en;
  const st = t?.scrapbook;

  const handleAddPage = () => {
    playPaperCrinkleSound();
    const newPage: ScrapbookPage = {
      id: `page-${Date.now()}`,
      title: `Chapter ${pages.length + 1}: Precious Memory`,
      date: 'Cherished Milestone',
      photoUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
      note: 'A timeless chapter we will always smile looking back on.',
      stickers: ['✨', '❤️'],
      tapeColor: '#D4AF37',
    };
    onChangePages([...pages, newPage]);
  };

  const handleApplyPreset = (preset: typeof PRESET_PHOTO_IDEAS[0], pageIdx: number) => {
    playPianoNote(523.25);
    const updated = [...pages];
    updated[pageIdx] = {
      ...updated[pageIdx],
      title: preset.title,
      date: preset.date,
      photoUrl: preset.url,
      note: preset.note,
    };
    onChangePages(updated);
  };

  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>, pageIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playPaperCrinkleSound();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const updated = [...pages];
        updated[pageIdx] = {
          ...updated[pageIdx],
          photoUrl: event.target.result as string,
        };
        onChangePages(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerGalleryPicker = (pageIdx: number) => {
    fileInputRefs.current[pageIdx]?.click();
  };

  return (
    <div id="scrapbook-studio-module" className="space-y-6">
      {/* Header with 100% Optional / Skip Indicator */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs relative overflow-hidden flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center text-[#B8860B]">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif font-bold text-[#2D241E]">
                {st?.title || 'Polaroid Memory Scrapbook'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                100% Optional
              </span>
            </div>
            <p className="text-xs text-[#7A6856]">
              {st?.subtitle || 'Tilted photos with washi tapes, handwritten cursive dates, and nostalgic stories'}
            </p>
          </div>
        </div>

        {onSkipModule && (
          <button
            type="button"
            onClick={onSkipModule}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip Scrapbook</span>
          </button>
        )}
      </div>

      {/* Scrapbook Main Title */}
      <div className="bg-white/70 p-4 rounded-2xl border border-stone-200 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1.5">
          Scrapbook Album Title
        </label>
        <input
          type="text"
          value={scrapbookTitle}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="e.g. Our Unwritten Chapters & Milestones"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/30 text-sm font-semibold text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37]/40 focus:outline-hidden"
        />
      </div>

      {/* Pages list */}
      <div className="space-y-5">
        {pages.map((page, idx) => (
          <motion.div
            key={page.id || idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-white/90 border border-[#D4AF37]/30 shadow-sm relative space-y-4"
          >
            {/* Washi Tape Accent */}
            <div
              className="absolute -top-2 left-10 w-20 h-4 rounded-xs shadow-2xs opacity-80 rotate-[-3deg] border border-black/10"
              style={{ backgroundColor: page.tapeColor || '#D4AF37' }}
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-[#8B1E2D]" />
                <span className="text-xs font-serif font-bold text-[#2D241E]">
                  Chapter {idx + 1}
                </span>
              </div>

              {/* Explicit Skip / Remove chapter button */}
              <button
                type="button"
                onClick={() => {
                  playPaperCrinkleSound();
                  onChangePages(pages.filter((_, i) => i !== idx));
                }}
                className="text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1.5 cursor-pointer font-semibold transition-colors"
                title="Skip or remove this chapter"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Skip / Remove from Box</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Input and Preview */}
              <div className="space-y-3">
                {/* Native Photo Gallery Trigger */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1.5 flex items-center justify-between">
                    <span>Photo Source</span>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      1-Tap Native Gallery
                    </span>
                  </label>

                  {/* Hidden Native File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      fileInputRefs.current[idx] = el;
                    }}
                    onChange={(e) => handleNativeFileUpload(e, idx)}
                    className="hidden"
                  />

                  {/* 1-Tap Trigger Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerGalleryPicker(idx)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#B8860B] hover:brightness-105 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose from Phone Gallery / Files</span>
                    </button>
                  </div>

                  <div className="mt-2">
                    <input
                      type="text"
                      value={page.photoUrl || ''}
                      onChange={(e) => {
                        const copy = [...pages];
                        copy[idx].photoUrl = e.target.value;
                        onChangePages(copy);
                      }}
                      placeholder="Or paste image web link..."
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Instant Idea Pill Bar */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8C6D37] mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>Quick Memory Inspiration:</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_PHOTO_IDEAS.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPreset(preset, idx)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-stone-100 hover:bg-[#FAF3E0] hover:text-[#8B1E2D] transition-colors border border-stone-200 cursor-pointer"
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Washi Tape Selector */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8C6D37] mb-1">
                    {st?.washiTapeLabel || 'Pastel Washi Tape'}
                  </label>
                  <div className="flex items-center gap-2">
                    {TAPE_COLORS.map((tape) => (
                      <button
                        key={tape.id}
                        type="button"
                        onClick={() => {
                          const copy = [...pages];
                          copy[idx].tapeColor = tape.id;
                          onChangePages(copy);
                        }}
                        className={`w-6 h-6 rounded-md border shadow-2xs cursor-pointer transition-all ${
                          page.tapeColor === tape.id ? 'ring-2 ring-[#8B1E2D] scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: tape.id }}
                        title={tape.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Chapter Details and Note */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
                      Chapter Title
                    </label>
                    <input
                      type="text"
                      value={page.title}
                      onChange={(e) => {
                        const copy = [...pages];
                        copy[idx].title = e.target.value;
                        onChangePages(copy);
                      }}
                      placeholder={st?.photoCaptionPlaceholder || 'e.g. Starry Night Walk'}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs font-semibold text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
                      Date / Moment
                    </label>
                    <input
                      type="text"
                      value={page.date || ''}
                      onChange={(e) => {
                        const copy = [...pages];
                        copy[idx].date = e.target.value;
                        onChangePages(copy);
                      }}
                      placeholder={st?.photoDatePlaceholder || 'e.g. October 14th'}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
                    Cursive Reflection Note
                  </label>
                  <textarea
                    rows={3}
                    value={page.note}
                    onChange={(e) => {
                      const copy = [...pages];
                      copy[idx].note = e.target.value;
                      onChangePages(copy);
                    }}
                    placeholder={st?.photoNotePlaceholder || 'Write your cursive journal reflection here...'}
                    className="w-full p-3 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs font-serif leading-relaxed text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Live Polaroid Preview Card with 1-Tap Tap-to-Change */}
            {page.photoUrl && (
              <div className="pt-2 border-t border-stone-100 flex items-center justify-center">
                <div
                  onClick={() => triggerGalleryPicker(idx)}
                  className="bg-white p-3 pb-5 rounded-lg shadow-md border border-stone-200 max-w-xs rotate-[-1deg] hover:rotate-0 transition-transform cursor-pointer group relative"
                  title="Click to change photo from gallery"
                >
                  <div className="relative overflow-hidden rounded-sm mb-2">
                    <img
                      src={page.photoUrl}
                      alt={page.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                      <Camera className="w-4 h-4" />
                      <span>Tap to Replace Photo</span>
                    </div>
                  </div>
                  <div className="text-center font-handwriting text-xs text-[#2D241E]">
                    {page.title}
                  </div>
                  {page.date && (
                    <div className="text-center text-[10px] text-[#8C6D37] mt-0.5">
                      {page.date}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddPage}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-[#D4AF37]/50 text-xs font-bold text-[#8C6D37] bg-white/50 hover:bg-[#FAF7EE] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-99"
      >
        <Plus className="w-4 h-4 text-[#D4AF37]" />
        <span>{st?.addPhotoBtn || 'Add Another Polaroid Snapshot'}</span>
      </button>
    </div>
  );
};
