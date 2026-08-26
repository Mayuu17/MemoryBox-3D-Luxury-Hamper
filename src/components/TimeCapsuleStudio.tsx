import React from 'react';
import { motion } from 'motion/react';
import { Lock, Clock, Calendar, Key, AlertCircle, Sparkles, SkipForward } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { CREATOR_STUDIO_TRANSLATIONS } from '../utils/languages';
import { playWaxSealCrackSound, playPaperCrinkleSound } from '../utils/audio';

interface TimeCapsuleStudioProps {
  currentLanguage: SupportedLanguage;
  capsuleTitle: string;
  onChangeTitle: (title: string) => void;
  capsuleDate: string;
  onChangeDate: (date: string) => void;
  capsuleMessage: string;
  onChangeMessage: (msg: string) => void;
  recipientName: string;
  onSkipModule?: () => void;
}

export const TimeCapsuleStudio: React.FC<TimeCapsuleStudioProps> = ({
  currentLanguage,
  capsuleTitle,
  onChangeTitle,
  capsuleDate,
  onChangeDate,
  capsuleMessage,
  onChangeMessage,
  recipientName,
  onSkipModule,
}) => {
  const t = CREATOR_STUDIO_TRANSLATIONS[currentLanguage] || CREATOR_STUDIO_TRANSLATIONS.en;
  const tct = (t as any)?.timeCapsule || {};

  const targetDate = capsuleDate ? new Date(capsuleDate) : new Date(Date.now() + 30 * 86400000);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div id="time-capsule-module" className="space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs relative overflow-hidden flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B1E2D]/10 border border-[#8B1E2D]/20 flex items-center justify-center text-[#8B1E2D]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#2D241E]">
              {tct?.title || 'Encrypted Future Time-Capsule'}
            </h3>
            <p className="text-xs text-[#7A6856]">
              {tct?.subtitle || 'Lock a secret milestone letter or surprise that cannot be opened until a future date'}
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

      {/* Vault Preview Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2B231D] via-[#3D3128] to-[#1C1714] border-2 border-[#D4AF37]/50 shadow-xl text-stone-200 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
              Encrypted Time-Capsule Vault
            </span>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/50 text-amber-300 border border-[#D4AF37]/40 font-mono">
            {diffDays} Days Remaining
          </span>
        </div>

        <div className="text-center py-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-16 h-16 mx-auto rounded-full bg-[#1C1714] border-2 border-[#D4AF37] flex items-center justify-center text-2xl shadow-lg shadow-black/40 mb-3"
          >
            🔒
          </motion.div>
          <h4 className="text-sm font-serif font-bold text-amber-100">
            {capsuleTitle || 'Our Future Milestone Vault'}
          </h4>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            This encrypted vault stays locked inside {recipientName || 'the recipient'}'s hamper box until the designated milestone date arrives.
          </p>
        </div>
      </div>

      {/* Date and Details Picker */}
      <div className="p-5 rounded-2xl bg-white/90 border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
              Time Capsule Title
            </label>
            <input
              type="text"
              value={capsuleTitle}
              onChange={(e) => onChangeTitle(e.target.value)}
              placeholder={tct?.titlePlaceholder || 'e.g. Open on Our 1st Anniversary!'}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs font-semibold text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
              Unlock Milestone Date
            </label>
            <input
              type="date"
              value={capsuleDate}
              onChange={(e) => {
                playWaxSealCrackSound();
                onChangeDate(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#8C6D37] mb-1">
            Secret Encrypted Message / Promise
          </label>
          <textarea
            rows={3}
            value={capsuleMessage}
            onChange={(e) => onChangeMessage(e.target.value)}
            placeholder={tct?.messagePlaceholder || 'Type your secret surprise promise, ticket voucher, or future letter...'}
            className="w-full p-3 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs font-serif leading-relaxed text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
          />
        </div>
      </div>
    </div>
  );
};
