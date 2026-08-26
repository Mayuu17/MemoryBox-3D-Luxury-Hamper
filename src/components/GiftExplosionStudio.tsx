import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Heart,
  Wand2,
  Gift,
  X,
  CheckCircle2,
  Tag,
  SkipForward,
  RotateCcw,
  Smile,
  Layers,
  Palette,
  Eye,
} from 'lucide-react';
import { ExplosionGiftItem, SupportedLanguage } from '../types';
import { playPaperCrinkleSound, playPianoNote, playExplosionBoomSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface GiftExplosionStudioProps {
  currentLanguage: SupportedLanguage;
  recipientName: string;
  senderName: string;
  explosionTitle: string;
  onChangeTitle: (title: string) => void;
  explosionSubtitle: string;
  onChangeSubtitle: (subtitle: string) => void;
  explosionThemeColor: 'ruby_gold' | 'midnight_purple' | 'champagne_pink' | 'emerald_gold' | 'sapphire_silver';
  onChangeThemeColor: (color: 'ruby_gold' | 'midnight_purple' | 'champagne_pink' | 'emerald_gold' | 'sapphire_silver') => void;
  explosionBoxPattern: 'polka_gold' | 'hearts' | 'stripes' | 'vintage_filigree' | 'velvet_ribbon';
  onChangePattern: (pattern: 'polka_gold' | 'hearts' | 'stripes' | 'vintage_filigree' | 'velvet_ribbon') => void;
  gifts: ExplosionGiftItem[];
  onChangeGifts: (gifts: ExplosionGiftItem[]) => void;
  onSkip?: () => void;
  onRemoveFromBox?: () => void;
}

const PRESET_GIFTS_CATALOG: Array<{
  category: ExplosionGiftItem['category'];
  title: string;
  caption: string;
  imageUrl: string;
  tags: string[];
  reactionEmoji: string;
}> = [
  {
    category: 'flower_bouquet',
    title: 'Crimson Dutch Roses Bouquet 🌹',
    caption: '50 freshly bloomed velvety roses that never wither, symbolizing our eternal bond.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    tags: ['Eternal Blooms', 'Fragrant Love'],
    reactionEmoji: '🌹',
  },
  {
    category: 'teddy_bear',
    title: 'Vintage Honey Plush Bear 🧸',
    caption: 'A warm cuddle buddy for midnight study sessions and movie marathons when I am away.',
    imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
    tags: ['Soft Hugs', 'Forever Warmth'],
    reactionEmoji: '🧸',
  },
  {
    category: 'chocolates',
    title: 'Belgian Truffle Gold Selection 🍫',
    caption: '70% dark cocoa infused with roasted hazelnuts and sea salt caramel flakes.',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&auto=format&fit=crop&q=80',
    tags: ['Sweet Decadence', 'Handmade'],
    reactionEmoji: '🍫',
  },
  {
    category: 'custom_photo',
    title: 'Our Golden Sunset Memory 📸',
    caption: 'The golden hour light reflecting in your eyes when we made our forever promise.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    tags: ['Core Memory', 'Golden Hour'],
    reactionEmoji: '✨',
  },
  {
    category: 'jewelry',
    title: 'Crystal Celestial Heart Pendant 💎',
    caption: 'Wear this close to your collarbone so you always carry a fragment of my heart.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    tags: ['Starlight', 'Precious Keepsake'],
    reactionEmoji: '💎',
  },
  {
    category: 'perfume',
    title: 'French Lavender & Amber Elixir 🌸',
    caption: 'A calming artisan fragrance blending vanilla orchids, damask rose, and amber woods.',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    tags: ['Aroma', 'Sensory Charm'],
    reactionEmoji: '🌸',
  },
];

const THEME_OPTIONS: Array<{
  id: 'ruby_gold' | 'midnight_purple' | 'champagne_pink' | 'emerald_gold' | 'sapphire_silver';
  name: string;
  bgGradient: string;
  borderHex: string;
}> = [
  { id: 'ruby_gold', name: 'Royal Ruby & Gold', bgGradient: 'from-[#8B0000] via-[#5E0000] to-[#2D0000]', borderHex: '#D4AF37' },
  { id: 'midnight_purple', name: 'Midnight Amethyst', bgGradient: 'from-[#3B1E54] via-[#2A143D] to-[#160B21]', borderHex: '#E2BBE9' },
  { id: 'champagne_pink', name: 'Rose Quartz & Pearl', bgGradient: 'from-[#D87093] via-[#A84A6A] to-[#68243A]', borderHex: '#FCE4EC' },
  { id: 'emerald_gold', name: 'Imperial Emerald', bgGradient: 'from-[#0B4619] via-[#062E10] to-[#021808]', borderHex: '#EEDC82' },
  { id: 'sapphire_silver', name: 'Midnight Sapphire', bgGradient: 'from-[#1A2A44] via-[#0F1B2E] to-[#070D18]', borderHex: '#90CAF9' },
];

const PATTERN_OPTIONS: Array<{
  id: 'polka_gold' | 'hearts' | 'stripes' | 'vintage_filigree' | 'velvet_ribbon';
  label: string;
  icon: string;
}> = [
  { id: 'velvet_ribbon', label: 'Velvet Gold Ribbon', icon: '🎀' },
  { id: 'hearts', label: 'Floating Hearts', icon: '❤️' },
  { id: 'polka_gold', label: 'Golden Dust Stars', icon: '✨' },
  { id: 'vintage_filigree', label: 'Victorian Filigree', icon: '⚜️' },
  { id: 'stripes', label: 'Royal Satin Stripes', icon: '🎗️' },
];

export const GiftExplosionStudio: React.FC<GiftExplosionStudioProps> = ({
  currentLanguage,
  recipientName,
  senderName,
  explosionTitle,
  onChangeTitle,
  explosionSubtitle,
  onChangeSubtitle,
  explosionThemeColor,
  onChangeThemeColor,
  explosionBoxPattern,
  onChangePattern,
  gifts,
  onChangeGifts,
  onSkip,
  onRemoveFromBox,
}) => {
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(gifts[0]?.id || null);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState<boolean>(false);
  const [customUploadUrl, setCustomUploadUrl] = useState<string>('');
  const [customUploadTitle, setCustomUploadTitle] = useState<string>('');
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);

  const activeGift = gifts.find((g) => g.id === selectedGiftId) || gifts[0];

  const handleAddCustomImage = (url: string, title?: string, category?: ExplosionGiftItem['category']) => {
    if (!url) return;
    const newGift: ExplosionGiftItem = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title || 'Custom Surprise Keepsake ✨',
      category: category || 'custom_photo',
      imageUrl: url,
      caption: `Handpicked with love for ${recipientName || 'You'}.`,
      tags: ['Personal Surprise', 'Special Gift'],
      reactionEmoji: '🎁',
    };
    const updated = [...gifts, newGift];
    onChangeGifts(updated);
    setSelectedGiftId(newGift.id);
    playPaperCrinkleSound();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          handleAddCustomImage(result, file.name.replace(/\.[^/.]+$/, ''), 'custom_photo');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpdateActiveGift = (updates: Partial<ExplosionGiftItem>) => {
    if (!activeGift) return;
    const updated = gifts.map((g) => (g.id === activeGift.id ? { ...g, ...updates } : g));
    onChangeGifts(updated);
  };

  const handleRemoveGift = (giftId: string) => {
    const updated = gifts.filter((g) => g.id !== giftId);
    onChangeGifts(updated);
    if (selectedGiftId === giftId) {
      setSelectedGiftId(updated[0]?.id || null);
    }
    playPaperCrinkleSound();
  };

  const handleGenerateAiCaption = async () => {
    if (!activeGift) return;
    setIsGeneratingCaption(true);
    try {
      const response = await fetch('/api/gemini/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: recipientName || 'My Love',
          senderName: senderName || 'Me',
          occasion: 'love',
          tone: 'romantic',
          memories: [
            `Gift Item: ${activeGift.title}`,
            `Category: ${activeGift.category || 'Special Keepsake'}`,
            `The item will blast out of an interactive 3D gift explosion box to surprise the recipient!`,
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const snippet = data.content ? data.content.split('\n')[0] || data.content.substring(0, 120) : '';
        if (snippet) {
          handleUpdateActiveGift({ caption: snippet });
        }
      }
    } catch (e) {
      console.warn('AI caption generator fallback', e);
      handleUpdateActiveGift({
        caption: `Every time you look at this ${activeGift.title}, remember that you are the most precious miracle in my universe.`,
      });
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleTestExplosionBoom = () => {
    playExplosionBoomSound();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#8B0000', '#FFD700', '#FF69B4', '#FFF'],
    });
  };

  return (
    <div id="gift-explosion-studio-root" className="space-y-6">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EA] to-[#F5EBD7] p-5 sm:p-6 rounded-3xl border-2 border-[#D4AF37]/40 shadow-md relative overflow-hidden flex items-center justify-between flex-wrap gap-4">
        <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#D4AF37]/15 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#8B0000] to-[#B82E38] text-[#F5E6C8] border-2 border-[#D4AF37] shadow-md flex items-center justify-center text-2xl shrink-0 animate-pulse">
            💥
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#8B0000] text-[#F5E6C8] shadow-xs">
                3D Interactive Blast
              </span>
              <span className="text-xs text-[#8C6239] font-semibold">
                (गिफ्ट ब्लास्ट बॉक्स)
              </span>
            </div>
            <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#2D241E] mt-0.5">
              The 3D Gift Explosion Boom Box
            </h3>
            <p className="text-xs text-[#7A6856] max-w-xl leading-relaxed">
              When tapped by {recipientName || 'the recipient'}, the box lid pops off and all uploaded flowers, teddy bears, chocolates, and photos burst outwards across the screen in a joyful radial explosion!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestExplosionBoom}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-400 text-amber-900 hover:bg-amber-500/25 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Test Boom Sfx</span>
          </button>

          {onRemoveFromBox && (
            <button
              type="button"
              onClick={onRemoveFromBox}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove from Box</span>
            </button>
          )}

          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 text-[#7A6856] hover:text-[#2D241E] hover:bg-stone-50 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <SkipForward className="w-4 h-4 text-stone-500" />
              <span>Skip / Next</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Box Styling & Preset Tray (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Box Titles & Header */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#8B0000] flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#D4AF37]" />
              <span>Explosion Box Inscription</span>
            </h4>

            <div>
              <label className="block text-xs font-bold text-[#2D241E] mb-1">
                Box Header / Banner Message
              </label>
              <input
                type="text"
                value={explosionTitle}
                onChange={(e) => onChangeTitle(e.target.value)}
                placeholder="e.g., A Shower of Love & Surprises (गिफ्ट ब्लास्ट)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/40 font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D241E] mb-1">
                Hover / Blast Tooltip Instruction
              </label>
              <input
                type="text"
                value={explosionSubtitle}
                onChange={(e) => onChangeSubtitle(e.target.value)}
                placeholder="e.g., Tap the vibrating box to blast your surprise!"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/40"
              />
              <span className="text-[10px] text-stone-500 block mt-1">
                ✨ Automatically translated into recipient's native language.
              </span>
            </div>
          </div>

          {/* 2. Theme & Pattern Selection */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#8B0000] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#D4AF37]" />
              <span>3D Cube Velvet Theme</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {THEME_OPTIONS.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    onChangeThemeColor(th.id);
                    playPianoNote(440, 0.4);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    explosionThemeColor === th.id
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 bg-amber-50/70 shadow-xs'
                      : 'border-stone-200 hover:border-[#D4AF37]/40 bg-white'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg bg-gradient-to-br ${th.bgGradient} border border-amber-300/60 shrink-0 shadow-xs`}
                  />
                  <span className="text-xs font-bold text-[#2D241E] truncate">{th.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100">
              <label className="block text-[11px] font-bold text-[#2D241E] mb-1.5">
                Gift Box Pattern
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PATTERN_OPTIONS.map((pat) => (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => onChangePattern(pat.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition-all ${
                      explosionBoxPattern === pat.id
                        ? 'bg-[#8B0000] text-[#F5E6C8] border-[#D4AF37] shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span>{pat.icon}</span>
                    <span>{pat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Preset Quick Catalog Drawer */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#8B0000] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Instant Gift Presets</span>
              </h4>
              <span className="text-[10px] text-stone-500">Tap to append</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESET_GIFTS_CATALOG.map((catItem, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const newGift: ExplosionGiftItem = {
                      id: `exp-preset-${Date.now()}-${idx}`,
                      title: catItem.title,
                      category: catItem.category,
                      imageUrl: catItem.imageUrl,
                      caption: catItem.caption,
                      tags: catItem.tags,
                      reactionEmoji: catItem.reactionEmoji,
                    };
                    onChangeGifts([...gifts, newGift]);
                    setSelectedGiftId(newGift.id);
                    playPaperCrinkleSound();
                  }}
                  className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-[#D4AF37] text-left transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <img
                    src={catItem.imageUrl}
                    alt={catItem.title}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-lg object-cover border border-stone-300 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#2D241E] truncate">{catItem.title}</p>
                    <span className="text-[9px] text-[#8C6239] block">{catItem.reactionEmoji} Add</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Uploads & Gift Card Customizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upload Dropzone & Actions */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border-2 border-dashed border-[#D4AF37]/50 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-800">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#2D241E]">
                    Upload Custom Gift Photos (तस्वीरें अपलोड करें)
                  </h4>
                  <p className="text-xs text-[#7A6856]">
                    Upload photos of real flowers, chocolates, teddy bears, or personal selfies.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B0000] text-[#F5E6C8] hover:bg-[#A31621] text-xs font-bold cursor-pointer transition-all shadow-md">
                  <Plus className="w-4 h-4" />
                  <span>Choose Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Quick URL Input */}
            <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center gap-2">
              <input
                type="url"
                placeholder="Or paste an image web URL (https://...)"
                value={customUploadUrl}
                onChange={(e) => setCustomUploadUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customUploadUrl) {
                    handleAddCustomImage(customUploadUrl, 'Online Gift Image', 'custom_photo');
                    setCustomUploadUrl('');
                  }
                }}
                disabled={!customUploadUrl}
                className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-100 hover:bg-stone-900 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* Gift Items Carousel Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-[#8B0000]">
                Treasures in the Explosion Box ({gifts.length})
              </span>
              <span className="text-[11px] text-stone-500">
                Click any item below to edit its caption
              </span>
            </div>

            {gifts.length === 0 ? (
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-8 text-center">
                <Gift className="w-10 h-10 text-amber-500 mx-auto mb-2 opacity-70" />
                <h5 className="font-serif text-sm font-bold text-amber-900">
                  No Gift Treasures Added Yet
                </h5>
                <p className="text-xs text-amber-800 max-w-sm mx-auto mt-1">
                  Upload custom photos above or choose instant presets from the left panel to pack inside the 3D blast box.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {gifts.map((gift, idx) => {
                  const isSelected = selectedGiftId === gift.id;
                  return (
                    <motion.div
                      key={gift.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedGiftId(gift.id)}
                      className={`shrink-0 w-28 p-2 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#8B0000] ring-2 ring-[#8B0000]/40 bg-rose-50/80 shadow-md'
                          : 'border-stone-200 bg-white hover:border-amber-300 shadow-xs'
                      }`}
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-1.5 border border-stone-200 bg-stone-100">
                        <img
                          src={gift.imageUrl}
                          alt={gift.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] font-bold flex items-center justify-center backdrop-blur-xs">
                          {idx + 1}
                        </span>
                        {gift.reactionEmoji && (
                          <span className="absolute bottom-1 right-1 text-sm drop-shadow-xs">
                            {gift.reactionEmoji}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-[#2D241E] truncate">{gift.title}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Selected Gift Editor Card */}
          {activeGift && (
            <div className="bg-white rounded-2xl p-5 border-2 border-[#D4AF37]/30 shadow-md space-y-4 relative">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeGift.imageUrl}
                    alt={activeGift.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border-2 border-[#D4AF37]/50 shadow-sm"
                  />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#8B0000] tracking-widest block">
                      Editing Keepsake Item
                    </span>
                    <h4 className="text-sm font-serif font-bold text-[#2D241E]">
                      {activeGift.title}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveGift(activeGift.id)}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Remove this gift"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D241E] mb-1">
                    Gift Title / Name
                  </label>
                  <input
                    type="text"
                    value={activeGift.title}
                    onChange={(e) => handleUpdateActiveGift({ title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D241E] mb-1">
                    Reaction Emoji Icon
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['🌹', '🧸', '🍫', '📸', '💎', '🌸', '✨', '💖', '🎁'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleUpdateActiveGift({ reactionEmoji: emoji })}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center border cursor-pointer ${
                          activeGift.reactionEmoji === emoji
                            ? 'bg-amber-100 border-amber-400 scale-110 shadow-xs'
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#2D241E]">
                    Handwritten Romantic Caption (तस्वीर के बोल)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiCaption}
                    disabled={isGeneratingCaption}
                    className="flex items-center gap-1 text-[11px] text-[#8B0000] hover:text-[#5E0000] font-bold cursor-pointer disabled:opacity-50"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{isGeneratingCaption ? 'AI Writing...' : 'AI Generate Caption'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={activeGift.caption}
                  onChange={(e) => handleUpdateActiveGift({ caption: e.target.value })}
                  placeholder={`Write a tender note explaining why you picked this ${activeGift.title} for ${recipientName || 'them'}...`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/40 font-serif leading-relaxed"
                />
              </div>

              {/* Tags / Badges */}
              <div>
                <label className="block text-[11px] font-bold text-[#7A6856] mb-1">
                  Gift Tags (Separated by comma)
                </label>
                <input
                  type="text"
                  value={(activeGift.tags || []).join(', ')}
                  onChange={(e) =>
                    handleUpdateActiveGift({
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. Pure Velvet, Never Fades, Midnight Promise"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 text-stone-700"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
