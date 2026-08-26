import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperItem, SupportedLanguage } from '../types';
import { X, Lock, Unlock, Clock, Sparkles, AlertCircle, Languages } from 'lucide-react';
import { useContentTranslation } from '../context/TranslationContext';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

interface TimeCapsuleModalProps {
  item: HamperItem;
  isOpen: boolean;
  onClose: () => void;
}

export const TimeCapsuleModal: React.FC<TimeCapsuleModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setLanguage } = useContentTranslation();
  const unlockDateStr = item.lockedUntil || item.payload.unlockDate || '';
  const unlockDate = unlockDateStr ? new Date(unlockDateStr) : new Date(Date.now() + 86400000);
  
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = unlockDate.getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [unlockDateStr]);

  if (!isOpen) return null;

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

        {/* Time Capsule Vault */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/50 my-auto paper-texture"
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

          {/* Icon */}
          <div className="text-center mb-6">
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 shadow-inner border-2 ${
                timeLeft.isExpired
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                  : 'bg-[#8B0000]/10 text-[#8B0000] border-[#8B0000]/40'
              }`}
            >
              {timeLeft.isExpired ? (
                <Unlock className="w-8 h-8" />
              ) : (
                <Lock className="w-8 h-8" />
              )}
            </div>

            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8C6239]">
              {timeLeft.isExpired ? 'Vault Unlocked' : 'Time-Capsule Vault'}
            </span>
            <h3 className="font-serif-title text-2xl font-bold text-[#2D241E] mt-1">
              {item.payload.capsuleTitle || item.title}
            </h3>
          </div>

          {!timeLeft.isExpired ? (
            /* Locked State with Live Countdown Clock */
            <div className="space-y-6 text-center">
              <div className="p-3 rounded-xl bg-[#FFF8E7] border border-[#E8D7A6] text-xs text-[#7A5826] flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#B8860B]" />
                <span>
                  Unlocks automatically on{' '}
                  <strong className="text-[#4A3210]">
                    {unlockDate.toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                </span>
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 py-2">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Mins', val: timeLeft.minutes },
                  { label: 'Secs', val: timeLeft.seconds },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-sm"
                  >
                    <span className="font-serif-title text-2xl sm:text-3xl font-bold text-[#8B0000] block">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C6239]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/70 border border-[#E0D7C6]">
                <p className="text-xs text-[#7A6856] italic">
                  "Some memories are meant to bloom at the exact moment the stars align. Come back when the timer hits zero to discover the secret surprise."
                </p>
              </div>
            </div>
          ) : (
            /* Unlocked Revealed State */
            <div className="space-y-4 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">The time has come! The seal has vanished.</span>
              </div>

              {item.payload.capsuleSecretPhoto && (
                <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-[#E0D7C6]">
                  <img
                    src={item.payload.capsuleSecretPhoto}
                    alt="Secret Surprise"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-sm">
                <p className="font-script text-2xl sm:text-3xl text-[#2D241E] leading-relaxed">
                  "{item.payload.capsuleMessage || 'Congratulations! You unlocked the deepest secret of this box.'}"
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
