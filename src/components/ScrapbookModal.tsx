import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperItem, ScrapbookPage, SupportedLanguage } from '../types';
import { playPageFlipSound, playPaperCrinkleSound } from '../utils/audio';
import { X, ChevronLeft, ChevronRight, BookOpen, Heart, Calendar, Languages, Sparkles } from 'lucide-react';
import { useContentTranslation } from '../context/TranslationContext';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

interface ScrapbookModalProps {
  item: HamperItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ScrapbookModal: React.FC<ScrapbookModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setLanguage, culturalIdiomNote } = useContentTranslation();
  const pages: ScrapbookPage[] = item.payload.pages || [];
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (!isOpen || pages.length === 0) return null;

  const page = pages[currentPageIndex] || pages[0];

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      playPageFlipSound();
      playPaperCrinkleSound();
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      playPageFlipSound();
      playPaperCrinkleSound();
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

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

        {/* Scrapbook Diary Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          className="relative w-full max-w-2xl bg-[#F7F3EB] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#D4AF37]/50 my-auto paper-texture"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Book Spine Decorative Stitching */}
          <div className="absolute top-0 bottom-0 left-6 sm:left-8 w-1 border-r-2 border-dashed border-[#D4C3A3]/80 pointer-events-none hidden sm:block" />

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6 gap-3 pr-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#B8860B]" />
              <span className="font-serif-title font-bold text-lg sm:text-xl text-[#2D241E]">
                {item.payload.scrapbookTitle || item.title || "Our Memory Scrapbook"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switcher */}
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

              <span className="text-xs font-semibold text-[#8C6239] px-3 py-1 bg-white rounded-full border border-[#D4C3A3]">
                Page {currentPageIndex + 1} of {pages.length}
              </span>
            </div>
          </div>

          {/* Cultural sentiment note */}
          {culturalIdiomNote && currentLanguage !== 'en' && (
            <div className="mb-4 p-2.5 rounded-xl bg-[#FFF9E6] border border-[#E8D4A2] text-xs text-[#7A5826] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B] flex-shrink-0" />
              <span className="truncate">{culturalIdiomNote}</span>
            </div>
          )}

          {/* Page Content with Flip Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={page.id || currentPageIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Chapter Title & Date */}
              <div className="text-center sm:text-left">
                <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#2D241E]">
                  {page.title}
                </h3>
                {page.date && (
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#8C6239] mt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>{page.date}</span>
                  </div>
                )}
              </div>

              {/* Polaroid Photo Frame with Washi Tape accents */}
              {page.photoUrl && (
                <div className="relative mx-auto max-w-sm p-4 bg-white shadow-xl rounded-xl border border-[#E0D7C6] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  {/* Washi Tape */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 opacity-85 shadow-sm transform -rotate-2"
                    style={{ backgroundColor: page.tapeColor || '#D4AF37' }}
                  />

                  {/* Photo */}
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
                    <img
                      src={page.photoUrl}
                      alt={page.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Sticker Badges */}
                  {page.stickers && page.stickers.length > 0 && (
                    <div className="absolute -bottom-2 -right-2 flex gap-1 bg-white/90 p-1.5 rounded-full shadow-md border border-[#E0D7C6]">
                      {page.stickers.map((s, i) => (
                        <span key={i} className="text-base">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Handwritten Journal Note */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-[#E0D7C6] shadow-sm">
                <p className="font-script text-2xl sm:text-3xl text-[#2D241E] leading-relaxed">
                  "{page.note}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Flip Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#D4AF37]/30">
            <button
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#D4C3A3] text-xs font-semibold text-[#5A4634] hover:bg-[#F4EFE6] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            {/* Quick Page Dots */}
            <div className="flex items-center gap-1.5">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playPageFlipSound();
                    setCurrentPageIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentPageIndex
                      ? 'bg-[#B8860B] w-6'
                      : 'bg-[#D4C3A3] hover:bg-[#B8860B]/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPageIndex === pages.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-xs font-semibold text-[#2C1D0F] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
