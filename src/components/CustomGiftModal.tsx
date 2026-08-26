import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperItem, SupportedLanguage } from '../types';
import { X, Gift, Sparkles, Tag, Languages } from 'lucide-react';
import { useContentTranslation } from '../context/TranslationContext';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

interface CustomGiftModalProps {
  item: HamperItem;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomGiftModal: React.FC<CustomGiftModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setLanguage } = useContentTranslation();
  if (!isOpen) return null;

  const image = item.payload.customImage || item.payload.treatImage;
  const name = item.payload.customName || item.payload.treatName || item.title;
  const desc = item.payload.customDescription || item.payload.treatDescription || item.subtitle;
  const tagMessage = item.payload.giftTagMessage;
  const category = item.payload.customCategory || item.tag || 'Handmade Keepsake';

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

        {/* Gift Detail Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/50 my-auto paper-texture"
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
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8C6239] px-3 py-1 bg-white rounded-full border border-[#D4C3A3]">
              {category}
            </span>
            <h3 className="font-serif-title text-2xl font-bold text-[#2D241E] mt-2">
              {name}
            </h3>
          </div>

          {/* Image */}
          {image && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[#E0D7C6] mb-6">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          {/* Description */}
          {desc && (
            <div className="p-4 rounded-2xl bg-white border border-[#E0D7C6] shadow-sm mb-4">
              <p className="text-sm text-[#4A3B2C] leading-relaxed font-serif">
                {desc}
              </p>
            </div>
          )}

          {/* Handwritten Gift Tag Note */}
          {tagMessage && (
            <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#E8D7A6] shadow-sm flex items-start gap-3">
              <Tag className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6239] block">
                  Gift Tag Message
                </span>
                <p className="font-script text-2xl text-[#2D241E] leading-relaxed">
                  "{tagMessage}"
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
