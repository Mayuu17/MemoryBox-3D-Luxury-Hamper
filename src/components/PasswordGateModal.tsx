import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicBoxMeta } from '../types';
import { BOX_THEMES } from '../utils/themes';
import { playWaxSealCrackSound, playBoxOpenCreakSound, playPaperCrinkleSound } from '../utils/audio';
import { Lock, KeyRound, ArrowRight, Sparkles, X, AlertCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PasswordGateModalProps {
  box: PublicBoxMeta;
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: (unlockedBox: any) => void;
}

export const PasswordGateModal: React.FC<PasswordGateModalProps> = ({
  box,
  isOpen,
  onClose,
  onUnlocked,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState(false);

  const theme = BOX_THEMES[box.theme] || BOX_THEMES.royal_velvet_burgundy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the secret password shared by your sender.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/boxes/${box.id}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Incorrect secret password. Please ask the sender!');
        setLoading(false);
        return;
      }

      // Success! Play sound sequence
      setIsSuccessUnlocked(true);
      playWaxSealCrackSound();
      playBoxOpenCreakSound();
      playPaperCrinkleSound();

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E2C799', '#DB4455', '#FAF7F2'],
        });
      } catch (err) {}

      setTimeout(() => {
        onUnlocked(data.box);
      }, 350);
    } catch (err: any) {
      setError('Network error verifying password. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1A1410]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/50 overflow-hidden"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#D4AF37]/60 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#D4AF37]/60 pointer-events-none" />

          {isSuccessUnlocked ? (
            /* Success Unlocking Animation */
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1.15, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-10 h-10 text-[#B8860B]" />
              </motion.div>
              <h3 className="font-serif-title text-2xl font-bold text-[#2D241E] mt-4">
                Seal Unfastened!
              </h3>
              <p className="text-sm text-[#7A6856] mt-2 font-script text-xl text-[#B8860B]">
                Opening your handcrafted memories...
              </p>
            </div>
          ) : (
            /* Password Input Form */
            <div>
              {/* Header Icon */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner mb-3 border border-[#D4AF37]/60"
                  style={{ backgroundColor: theme.waxSealColor }}
                >
                  <KeyRound className="w-8 h-8 text-[#F5E6C8]" />
                </div>

                <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold">
                  Protected Keepsake
                </span>
                <h2 className="font-serif-title text-2xl font-bold text-[#2D241E] mt-1">
                  Enter Secret Password
                </h2>
                <p className="text-xs text-[#7A6856] mt-1 max-w-xs">
                  {box.senderName} has locked this keepsake box with a secret password only you two share.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A4634] uppercase tracking-wider mb-1.5">
                    Secret Key / Password
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g. cafe2021, ourfirstkiss..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4C3A3] text-[#2D241E] placeholder:text-[#A89885] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm font-medium shadow-sm transition-all"
                      autoFocus
                    />
                    <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89885]" />
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{error}</p>
                      {box.passwordHint && !showHint && (
                        <button
                          type="button"
                          onClick={() => setShowHint(true)}
                          className="mt-1 underline text-rose-900 font-semibold"
                        >
                          Show Hint from {box.senderName}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Password Hint Accordion */}
                {box.passwordHint && (
                  <div className="pt-1">
                    {showHint ? (
                      <div className="p-3 rounded-xl bg-[#F0ECE1] border border-[#D4C3A3] text-xs text-[#5A4634]">
                        <div className="flex items-center gap-1.5 font-semibold text-[#8C6239] mb-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Sender's Clue:</span>
                        </div>
                        <p className="italic">"{box.passwordHint}"</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowHint(true)}
                        className="text-xs text-[#8C6239] hover:underline flex items-center gap-1 mx-auto"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Need a hint? Click here</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Unlock Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#2C1D0F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Unfasten Ribbon & Open Box</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
