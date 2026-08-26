import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Wand2, MessageCircle, Award, Flame, Quote, SkipForward, Phone } from 'lucide-react';
import { BoxOccasion, SupportedLanguage, EmotionalReasonCategory } from '../types';
import { playPaperCrinkleSound, playPianoNote } from '../utils/audio';

interface ReasonBoxCanvasProps {
  currentLanguage: SupportedLanguage;
  recipientName: string;
  senderName: string;
  reasonCategory: EmotionalReasonCategory;
  onChangeCategory: (category: EmotionalReasonCategory) => void;
  reasonWhySpecial: string;
  onChangeReason: (reason: string) => void;
  senderPhone?: string;
  onChangeSenderPhone?: (phone: string) => void;
  onSkip?: () => void;
}

const REASON_INTENTS: { id: BoxOccasion; title: string; subtitle: string; icon: string; prompt: string }[] = [
  {
    id: 'love',
    title: 'Deep Love & Romance',
    subtitle: 'Celebrating unconditional devotion & soul connection',
    icon: '💖',
    prompt: 'You are the calm in my chaotic world and the reason my heart feels completely at home every single day.',
  },
  {
    id: 'apology',
    title: 'Heartfelt Apology & Healing',
    subtitle: 'Seeking forgiveness, mending bonds & fresh starts',
    icon: '🕊️',
    prompt: 'I am truly sorry for hurting you. Your happiness and our bond mean more to me than my ego ever could.',
  },
  {
    id: 'birthday',
    title: 'Birthday Radiance',
    subtitle: 'Celebrating the incredible gift of their existence',
    icon: '🎂',
    prompt: 'On your birthday, I want to thank the universe for bringing you into my life. May this year shine as bright as your smile.',
  },
  {
    id: 'anniversary',
    title: 'Milestone Anniversary',
    subtitle: 'Reflecting on shared journeys and timeless vows',
    icon: '🥂',
    prompt: 'Another chapter completed, and I would still choose you in every lifetime, in every universe, without a moment’s hesitation.',
  },
  {
    id: 'gratitude',
    title: 'Pure Gratitude & Support',
    subtitle: 'Acknowledging silent sacrifices & constant anchors',
    icon: '🌿',
    prompt: 'Thank you for standing by me through thick and thin, for believing in me when I forgot how to believe in myself.',
  },
  {
    id: 'friendship',
    title: 'Soul Friendship',
    subtitle: 'Honoring laughter, late-night talks & loyalty',
    icon: '🌟',
    prompt: 'From laughing till our stomachs hurt to holding space in tough times, thank you for being the truest friend I could ever ask for.',
  },
];

const EMOTIONAL_INSPIRATION_PROMPTS = [
  'What is one little quirk or habit of theirs that always makes you smile?',
  'When was the moment you realized how much they truly mean to you?',
  'What is a promise you want to make to them for the years ahead?',
  'How do they make your life softer, happier, and more meaningful?',
];

export const ReasonBoxCanvas: React.FC<ReasonBoxCanvasProps> = ({
  currentLanguage,
  recipientName,
  senderName,
  reasonCategory,
  onChangeCategory,
  reasonWhySpecial,
  onChangeReason,
  senderPhone,
  onChangeSenderPhone,
  onSkip,
}) => {
  const targetRecipient = recipientName.trim() || 'My Beloved';

  const handleSelectIntent = (intent: typeof REASON_INTENTS[0]) => {
    playPianoNote(523.25, 0.4, 0.08);
    onChangeCategory(intent.id);
    if (!reasonWhySpecial.trim()) {
      onChangeReason(intent.prompt);
    }
  };

  return (
    <div id="reason-box-canvas-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF3E0] to-[#FFFDF9] rounded-3xl p-6 border-2 border-[#D4AF37]/40 shadow-md relative overflow-hidden flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#8B1E2D]/10 border border-[#8B1E2D]/20 flex items-center justify-center text-2xl text-[#8B1E2D] shadow-xs">
            💝
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#8B1E2D]/10 text-[#8B1E2D] text-[10px] font-bold uppercase tracking-wider">
                Core Emotional Anchor
              </span>
              <span className="text-xs text-[#8C6D37] flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Heartfelt Intent
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2D241E] mt-0.5">
              Why are they special to you?
            </h3>
            <p className="text-xs text-[#7A6856] mt-0.5">
              Define the pure emotional purpose of this Keepsake Box. This foundation guides the AI Memory Companion and unboxing aura.
            </p>
          </div>
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip Intent</span>
          </button>
        )}
      </div>

      {/* 1. Core Emotional Intent Selector */}
      <div className="bg-white/90 rounded-3xl p-6 border border-[#D4AF37]/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5C4524] flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#8B1E2D] fill-current" />
            <span>Select the Core Purpose / Emotion</span>
          </label>
          <span className="text-[11px] text-[#8C6D37] font-serif italic">
            For {targetRecipient}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REASON_INTENTS.map((intent) => {
            const isSelected = reasonCategory === intent.id;
            return (
              <motion.button
                key={intent.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectIntent(intent)}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#8B1E2D] bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E0] shadow-md ring-2 ring-[#8B1E2D]/20'
                    : 'border-stone-200 bg-white/70 hover:border-[#D4AF37]/50 hover:bg-[#FAF7EE]'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-2xl">{intent.icon}</span>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#2D241E]">
                      {intent.title}
                    </h4>
                  </div>
                </div>
                <p className="text-[11px] text-[#7A6856] leading-relaxed">
                  {intent.subtitle}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Heartfelt Reason Statement Canvas */}
      <div className="bg-white/90 rounded-3xl p-6 border border-[#D4AF37]/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5C4524] flex items-center gap-2">
            <Quote className="w-4 h-4 text-[#D4AF37]" />
            <span>Your Heart's Truth ("Why {targetRecipient} is irreplaceable")</span>
          </label>
          <span className="text-[11px] text-[#8C6D37] font-mono">
            {reasonWhySpecial.length} chars
          </span>
        </div>

        {/* Cursive / Calligraphic Styled Textarea */}
        <div className="relative">
          <textarea
            rows={5}
            value={reasonWhySpecial}
            onChange={(e) => onChangeReason(e.target.value)}
            placeholder={`Write why ${targetRecipient} means the absolute world to you... (e.g. "Because no one listens the way you do, and you stood by me when everything else felt uncertain...")`}
            className="w-full p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#D4AF37]/40 text-sm font-serif leading-relaxed text-[#2D241E] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/60 shadow-inner placeholder:text-stone-400 placeholder:italic"
          />
        </div>

        {/* Emotional Quick Inspirations */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-[#8C6D37] font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Need inspiration? Tap to answer:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {EMOTIONAL_INSPIRATION_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  playPianoNote(440, 0.2, 0.05);
                  onChangeReason(
                    (reasonWhySpecial ? reasonWhySpecial + '\n\n' : '') + `✨ ${prompt}\n`
                  );
                }}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-[#FAF3E0] text-[#8C6D37] hover:text-[#5C4524] border border-[#D4AF37]/30 transition-colors cursor-pointer text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Real-Time WhatsApp Alert Link */}
      {onChangeSenderPhone && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 rounded-3xl p-5 border border-emerald-300 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Instant WhatsApp / SMS Notification Webhook
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800 text-[9px] font-bold">
                  Live Alert Hook
                </span>
              </div>
              <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                Enter your mobile number. When <strong>{targetRecipient}</strong> chats with the Memory Companion or accepts your apologies/feelings (e.g. <em>"I accept your sorry"</em>, <em>"I love this"</em>), the system will instantly send a WhatsApp / SMS alert to your phone!
              </p>

              <div className="mt-3 flex items-center gap-2 max-w-md">
                <input
                  type="tel"
                  value={senderPhone || ''}
                  onChange={(e) => onChangeSenderPhone(e.target.value)}
                  placeholder="+91 98765 43210 or +1 234 567 8900"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs font-mono text-emerald-950 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
