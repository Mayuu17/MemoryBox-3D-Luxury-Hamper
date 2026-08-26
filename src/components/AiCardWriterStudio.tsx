import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wand2, Sparkles, Feather, FileText, Check, SkipForward } from 'lucide-react';
import { PaperStyle, SupportedLanguage, BoxOccasion } from '../types';
import { CREATOR_STUDIO_TRANSLATIONS } from '../utils/languages';
import { playPianoNote, playPaperCrinkleSound } from '../utils/audio';

interface AiCardWriterStudioProps {
  currentLanguage: SupportedLanguage;
  senderName: string;
  recipientName: string;
  occasion: BoxOccasion;
  letterTitle: string;
  onChangeTitle: (title: string) => void;
  letterContent: string;
  onChangeContent: (content: string) => void;
  letterSignature: string;
  onChangeSignature: (sig: string) => void;
  paperStyle: PaperStyle;
  onChangePaperStyle: (style: PaperStyle) => void;
  onSkipModule?: () => void;
}

const PAPER_STYLES: { id: PaperStyle; name: string; bgClass: string; borderClass: string; desc: string }[] = [
  {
    id: 'rose_petal_pressed',
    name: 'Rose Petal Pressed Paper',
    bgClass: 'bg-[#FFF5F5]',
    borderClass: 'border-[#F8BBD0]',
    desc: 'Soft ivory deckled paper embedded with dried rose petals',
  },
  {
    id: 'parchment',
    name: 'Antique Deckled Parchment',
    bgClass: 'bg-[#FAF3E0]',
    borderClass: 'border-[#D4AF37]',
    desc: 'Handmade aged parchment with rich warm amber hues',
  },
  {
    id: 'vintage_linen',
    name: 'Lined Vintage Linen',
    bgClass: 'bg-[#FDFBF7]',
    borderClass: 'border-[#E0D7C6]',
    desc: 'Fine Italian woven stationery with soft grey lines',
  },
  {
    id: 'midnight_gold',
    name: 'Midnight & Gold Foil',
    bgClass: 'bg-[#2B231D] text-amber-100',
    borderClass: 'border-[#D4AF37]',
    desc: 'Deep royal charcoal velvet canvas with gold foil ink',
  },
];

export const AiCardWriterStudio: React.FC<AiCardWriterStudioProps> = ({
  currentLanguage,
  senderName,
  recipientName,
  occasion,
  letterTitle,
  onChangeTitle,
  letterContent,
  onChangeContent,
  letterSignature,
  onChangeSignature,
  paperStyle,
  onChangePaperStyle,
  onSkipModule,
}) => {
  const [tone, setTone] = useState<string>('Romantic, Poetic & Tearjerker');
  const [memoriesInput, setMemoriesInput] = useState<string>('');
  const [keyMomentsInput, setKeyMomentsInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const t = CREATOR_STUDIO_TRANSLATIONS[currentLanguage] || CREATOR_STUDIO_TRANSLATIONS.en;
  const lt = t?.letter;

  const handleAiCompose = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    playPianoNote(523.25, 2.0, 0.08);

    try {
      const res = await fetch('/api/gemini/write-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: senderName || 'Sender',
          recipientName: recipientName || 'Recipient',
          occasion,
          tone,
          sharedMemories: memoriesInput,
          keyMoments: keyMomentsInput,
          language: currentLanguage,
        }),
      });

      const data = await res.json();
      if (data.letterContent) {
        onChangeContent(data.letterContent);
        if (data.letterTitle) onChangeTitle(data.letterTitle);
        if (data.recommendedPaper) onChangePaperStyle(data.recommendedPaper as PaperStyle);
        playPianoNote(659.25, 1.5, 0.1);
      } else {
        setGenerationError('Could not generate letter text. Please try again or write your custom message.');
      }
    } catch (err) {
      console.error('AI Letter generation error:', err);
      setGenerationError('Network error connecting to AI assistant.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="ai-card-writer-module" className="space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs relative overflow-hidden flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B1E2D]/10 border border-[#8B1E2D]/20 flex items-center justify-center text-[#8B1E2D]">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#2D241E]">
              {lt?.title || 'Handwritten Parchment Letter'}
            </h3>
            <p className="text-xs text-[#7A6856]">
              {lt?.aiHelperDesc || 'Let AI weave your real memories into an evocative, tearfully romantic letter in your language'}
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

      {/* AI Letter Muse Generator Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#FAF5EB] border border-[#D4AF37]/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-[#B8860B]" />
            <span className="text-sm font-serif font-bold text-[#2D241E]">
              {lt?.aiHelperTitle || 'Gemini AI Love Letter Muse'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAiCompose}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2C1D0F] font-bold text-xs shadow-xs hover:brightness-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? (lt?.generatingLetter || 'Composing heartfelt words...') : (lt?.generateLetterBtn || 'Draft Soulful Letter with Gemini AI')}</span>
          </button>
        </div>

        {generationError && (
          <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            {generationError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
              {lt?.toneLabel || 'Emotional Tone & Atmosphere'}
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
            >
              <option value="Romantic, Poetic & Tearjerker">Romantic & Poetic (गहरा व भावुक)</option>
              <option value="Warm, Cozy & Nostalgic">Warm & Nostalgic (यादों भरा)</option>
              <option value="Playful, Sweet & Loving">Playful & Sweet (प्यारा व चुलबुला)</option>
              <option value="Sincere Apology & Reconciliation">Sincere Apology & Reconciliation (सच्ची माफ़ी)</option>
              <option value="Lifelong Promises & Milestones">Lifelong Milestone (उम्र भर का साथ)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
              {lt?.memoriesPromptLabel || 'Key Memories & Nicknames to weave in'}
            </label>
            <input
              type="text"
              value={memoriesInput}
              onChange={(e) => setMemoriesInput(e.target.value)}
              placeholder={lt?.memoriesPromptPlaceholder || 'e.g. Late night calls, roadside chai, stealing jackets...'}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Paper Style Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524]">
          {lt?.paperStyleLabel || 'Parchment Sheet Style'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {PAPER_STYLES.map((ps) => {
            const isSelected = paperStyle === ps.id;
            return (
              <button
                key={ps.id}
                type="button"
                onClick={() => {
                  playPaperCrinkleSound();
                  onChangePaperStyle(ps.id);
                }}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 bg-white shadow-xs'
                    : 'border-stone-200 bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#2D241E]">{ps.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#8B1E2D]" />}
                </div>
                <p className="text-[10px] text-[#7A6856] leading-tight">{ps.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Letter Editor */}
      <div className="p-6 rounded-2xl bg-white/90 border border-[#D4AF37]/30 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1">
            Letter Title
          </label>
          <input
            type="text"
            value={letterTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder={lt?.letterTitlePlaceholder || 'To the One Who Holds My Heart...'}
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7EE] border border-stone-200 text-sm font-semibold text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1">
            Handwritten Letter Text
          </label>
          <textarea
            rows={10}
            value={letterContent}
            onChange={(e) => onChangeContent(e.target.value)}
            placeholder={lt?.letterContentPlaceholder || 'Write your personal handwritten letter here, or generate one with AI muse above...'}
            className="w-full p-4 rounded-xl bg-[#FAF7EE] border border-stone-200 font-serif text-sm leading-relaxed text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1">
            Sign-off & Love Signature
          </label>
          <input
            type="text"
            value={letterSignature}
            onChange={(e) => onChangeSignature(e.target.value)}
            placeholder={`${senderName || 'Yours Truly'} — Forever & Always`}
            className="w-full px-4 py-2 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs font-handwriting text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
          />
        </div>
      </div>
    </div>
  );
};
