import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperItem, SupportedLanguage } from '../types';
import { playPianoNote } from '../utils/audio';
import { X, Play, Pause, RotateCcw, Volume2, Sparkles, Mic, Languages } from 'lucide-react';
import { useContentTranslation } from '../context/TranslationContext';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

interface VoiceNoteModalProps {
  item: HamperItem;
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceNoteModal: React.FC<VoiceNoteModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setLanguage } = useContentTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 - 100
  const duration = item.payload.durationSeconds || 45;
  const transcription = item.payload.transcription;

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 100 / (duration * 10);
        });
      }, 100);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  const handlePlayToggle = () => {
    if (!isPlaying) {
      // Play warm chime
      playPianoNote(440, 2.0, 0.1);
      setTimeout(() => playPianoNote(554.37, 2.0, 0.1), 150);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

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

        {/* Vintage Cassette & Gramophone Card */}
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

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#8B0000]/10 border border-[#8B0000]/30 flex items-center justify-center mb-2">
              <Mic className="w-7 h-7 text-[#8B0000]" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8C6239]">
              Spoken Audio Message
            </span>
            <h3 className="font-serif-title text-2xl font-bold text-[#2D241E] mt-1">
              {item.payload.voiceNoteTitle || item.title}
            </h3>
          </div>

          {/* Animated Vinyl / Turntable Disc */}
          <div className="my-6 flex justify-center">
            <div
              className={`w-36 h-36 rounded-full bg-[#1C1613] border-4 border-[#3D2C21] relative flex items-center justify-center shadow-xl ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              {/* Vinyl grooves */}
              <div className="w-28 h-28 rounded-full border border-neutral-700/60" />
              <div className="w-20 h-20 rounded-full border border-neutral-700/60 absolute" />
              
              {/* Center label */}
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] border-2 border-[#AA771C] absolute flex items-center justify-center text-center">
                <Sparkles className="w-4 h-4 text-[#2C1D0F]" />
              </div>
            </div>
          </div>

          {/* Waveform Visualization Bars */}
          <div className="flex items-center justify-center gap-1 h-12 px-4 py-2 bg-white/70 rounded-2xl border border-[#D4C3A3]">
            {Array.from({ length: 28 }).map((_, i) => {
              const active = (i / 28) * 100 <= progress;
              const height = 12 + ((i * 17) % 28);
              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    active ? 'bg-[#8B0000]' : 'bg-[#D4C3A3]/60'
                  }`}
                  style={{
                    height: isPlaying ? `${height}px` : `${Math.max(6, height * 0.4)}px`,
                  }}
                />
              );
            })}
          </div>

          {/* Controls & Timeline */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full bg-white border border-[#D4C3A3] text-[#6B5532] hover:bg-[#F4EFE6] transition-colors"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlayToggle}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-sm tracking-wide shadow-lg flex items-center gap-2 hover:brightness-105 transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause Message</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play Voice Note ({duration}s)</span>
                </>
              )}
            </button>

            <div className="text-xs font-mono text-[#8C6239] font-semibold">
              {Math.floor((progress / 100) * duration)}s / {duration}s
            </div>
          </div>

          {/* Audio Transcript Box */}
          {transcription && (
            <div className="mt-6 p-4 rounded-2xl bg-white/90 border border-[#E0D7C6] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6239] block mb-1">
                Voice Transcript
              </span>
              <p className="font-script text-2xl text-[#2D241E] leading-relaxed">
                "{transcription}"
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
