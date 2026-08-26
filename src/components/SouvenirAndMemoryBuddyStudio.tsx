import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Bot, Plus, Trash2, Sparkles, BookOpen, Heart, Award, SkipForward } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { CREATOR_STUDIO_TRANSLATIONS } from '../utils/languages';
import { playPianoNote, playPaperCrinkleSound } from '../utils/audio';

interface SouvenirAndMemoryBuddyStudioProps {
  currentLanguage: SupportedLanguage;
  customItemName: string;
  onChangeCustomName: (name: string) => void;
  customItemDesc: string;
  onChangeCustomDesc: (desc: string) => void;
  customItemImage: string;
  onChangeCustomImage: (img: string) => void;
  customItemTag: string;
  onChangeCustomTag: (tag: string) => void;
  relationshipNotes: string[];
  onChangeRelationshipNotes: (notes: string[]) => void;
  recipientName: string;
  onSkipModule?: () => void;
}

const PRESET_SOUVENIRS = [
  {
    name: 'First Roadtrip Highway Stone',
    desc: 'Picked up on our wild midnight drive to the hills where we watched sunrise.',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    tag: 'Keepsake Pebble',
  },
  {
    name: 'Vintage Cinema Ticket Stubs',
    desc: 'From that terrible horror movie where we spent the whole time laughing.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    tag: 'Cinema Stubs',
  },
  {
    name: 'Engraved Brass Pocket Compass',
    desc: 'Always pointing the way back to each other no matter the distance.',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    tag: 'Gilded Compass',
  },
];

export const SouvenirAndMemoryBuddyStudio: React.FC<SouvenirAndMemoryBuddyStudioProps> = ({
  currentLanguage,
  customItemName,
  onChangeCustomName,
  customItemDesc,
  onChangeCustomDesc,
  customItemImage,
  onChangeCustomImage,
  customItemTag,
  onChangeCustomTag,
  relationshipNotes,
  onChangeRelationshipNotes,
  recipientName,
  onSkipModule,
}) => {
  const [newMemoryInput, setNewMemoryInput] = useState<string>('');

  const t = CREATOR_STUDIO_TRANSLATIONS[currentLanguage] || CREATOR_STUDIO_TRANSLATIONS.en;
  const cm = t?.customMemory;

  const handleAddMemory = () => {
    if (newMemoryInput.trim()) {
      playPianoNote(587.33);
      onChangeRelationshipNotes([...relationshipNotes, newMemoryInput.trim()]);
      setNewMemoryInput('');
    }
  };

  const handleRemoveMemory = (index: number) => {
    onChangeRelationshipNotes(relationshipNotes.filter((_, i) => i !== index));
  };

  const handleSelectPresetSouvenir = (preset: typeof PRESET_SOUVENIRS[0]) => {
    playPaperCrinkleSound();
    onChangeCustomName(preset.name);
    onChangeCustomDesc(preset.desc);
    onChangeCustomImage(preset.image);
    onChangeCustomTag(preset.tag);
  };

  return (
    <div id="souvenir-buddy-module" className="space-y-6">
      {/* 1. Custom Souvenir Keepsake Section */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center text-[#B8860B]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#2D241E]">
                {cm?.customItemTitle || 'Physical Keepsake Souvenir'}
              </h3>
              <p className="text-xs text-[#7A6856]">
                Add a real token of affection (cinema ticket, pressed flower, keychain, milestone pebble)
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

        {/* Quick Inspiration presets */}
        <div>
          <label className="block text-[10px] font-semibold text-[#8C6D37] mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Artisan Souvenir Ideas:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_SOUVENIRS.map((ps, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPresetSouvenir(ps)}
                className="p-2.5 rounded-xl border border-stone-200 bg-white hover:border-[#D4AF37] hover:bg-[#FAF7EE] text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <span className="text-xs font-semibold text-[#2D241E] truncate">{ps.name}</span>
                <span className="text-[10px] text-[#8C6D37] mt-0.5">{ps.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
              Keepsake Name
            </label>
            <input
              type="text"
              value={customItemName}
              onChange={(e) => onChangeCustomName(e.target.value)}
              placeholder={cm?.customItemPlaceholder || 'e.g. Our First Concert Ticket'}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs font-semibold text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
              Souvenir Category / Tag
            </label>
            <input
              type="text"
              value={customItemTag}
              onChange={(e) => onChangeCustomTag(e.target.value)}
              placeholder={cm?.customItemTagPlaceholder || 'e.g. Handmade Souvenir'}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
            Story Behind This Keepsake
          </label>
          <textarea
            rows={2}
            value={customItemDesc}
            onChange={(e) => onChangeCustomDesc(e.target.value)}
            placeholder="Why is this physical keepsake special to both of you..."
            className="w-full p-3 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs font-serif leading-relaxed text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* 2. Relationship Notes for Memory Companion AI Chatbot */}
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE0] rounded-2xl p-5 border border-[#D4AF37]/35 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B1E2D]/10 border border-[#8B1E2D]/20 flex items-center justify-center text-[#8B1E2D]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#2D241E]">
              {cm?.memoryBuddyTrainerTitle || 'Train Your AI Memory Companion (MemoryBuddy)'}
            </h3>
            <p className="text-xs text-[#7A6856]">
              {cm?.memoryBuddyTrainerSubtitle || 'Teach the AI your inside stories so the recipient can chat with your memories'}
            </p>
          </div>
        </div>

        {/* Vintage Notebook Paper Display */}
        <div className="p-4 rounded-xl bg-white border border-[#E0D7C6] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D37]">
              Confidential Relationship Notes ({relationshipNotes.length} Trained Memories)
            </span>
            <span className="text-[10px] text-stone-400">MemoryBuddy v2.5</span>
          </div>

          {relationshipNotes.length === 0 ? (
            <div className="text-center py-4 text-xs text-stone-400 font-serif italic">
              No private memories added yet. Add a few memories below so the AI companion can reminisce with {recipientName || 'your loved one'}!
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {relationshipNotes.map((mem, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF7EE] border border-stone-200 text-xs text-[#2D241E]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Heart className="w-3.5 h-3.5 text-[#8B1E2D] shrink-0" />
                    <span className="truncate">{mem}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMemory(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add Memory Input Field */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newMemoryInput}
              onChange={(e) => setNewMemoryInput(e.target.value)}
              placeholder={cm?.memoryInputPlaceholder || 'Type a secret inside story, milestone, or special phrase...'}
              className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMemory();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddMemory}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2C1D0F] text-xs font-bold shadow-xs hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{cm?.addMemoryBtn || 'Add Memory'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
