import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox, HamperItem, SupportedLanguage, AmbientMood } from '../types';
import { BOX_THEMES } from '../utils/themes';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../utils/languages';
import {
  playPaperCrinkleSound,
  playBoxOpenCreakSound,
  playPianoNote,
  toggleAmbientRomanticMusic,
  isMusicPlaying,
  setAmbientMoodAudio,
} from '../utils/audio';
import {
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Languages,
  BookOpen,
  MailOpen,
  Mic,
  Lock,
  Flame,
  Disc,
  HeartHandshake,
  Gift,
  Layers,
  CheckCircle2,
  Share2,
  Eye,
  Flower2,
  Camera,
  QrCode,
  RefreshCw,
  Cake,
  Feather,
} from 'lucide-react';
import { LetterModal } from './LetterModal';
import { ScrapbookModal } from './ScrapbookModal';
import { VoiceNoteModal } from './VoiceNoteModal';
import { TimeCapsuleModal } from './TimeCapsuleModal';
import { MemoryBuddyModal } from './MemoryBuddyModal';
import { CustomGiftModal } from './CustomGiftModal';
import { CelebrationCakeModal } from './CelebrationCakeModal';
import { LastWhisperingNoteModal } from './LastWhisperingNoteModal';
import { TogetherMemoryTimeline } from './TogetherMemoryTimeline';
import { ARCameraUnboxingModal } from './ARCameraUnboxingModal';
import { PrintableQrCardModal } from './PrintableQrCardModal';
import { GiftExplosionBoomModal } from './GiftExplosionBoomModal';
import { useContentTranslation } from '../context/TranslationContext';
import confetti from 'canvas-confetti';

interface UnboxingExperienceProps {
  box: HamperBox;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onResetToGate: () => void;
}

export const UnboxingExperience: React.FC<UnboxingExperienceProps> = ({
  box,
  currentLanguage,
  onLanguageChange,
  onResetToGate,
}) => {
  const { getTranslatedBox, isTranslating, culturalIdiomNote, setLanguage } = useContentTranslation();
  const [activeLayer, setActiveLayer] = useState<number>(1); // 1, 2, 3
  const [unwrappedItems, setUnwrappedItems] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<HamperItem | null>(null);
  const [activeModalType, setActiveModalType] = useState<string | null>(null);
  const [isMusicActive, setIsMusicActive] = useState<boolean>(isMusicPlaying());

  // Deep Translated Box
  const activeBox = getTranslatedBox(box, currentLanguage) || box;

  const theme = BOX_THEMES[activeBox.theme] || BOX_THEMES.royal_velvet_burgundy;
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  // Group items by layer from the translated box
  const layer1Items = activeBox.items.filter((it) => it.layer === 1);
  const layer2Items = activeBox.items.filter((it) => it.layer === 2);
  const layer3Items = activeBox.items.filter((it) => it.layer === 3);

  const layer1Complete = layer1Items.every((it) => unwrappedItems[it.id]);
  const layer2Complete = layer2Items.every((it) => unwrappedItems[it.id]);

  const handleMusicToggle = () => {
    const playing = toggleAmbientRomanticMusic();
    setIsMusicActive(playing);
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    onLanguageChange(newLang);
  };

  const handleItemClick = (item: HamperItem) => {
    // Play paper tearing/crinkle sound effect
    playPaperCrinkleSound();

    // Mark as unwrapped
    setUnwrappedItems((prev) => ({ ...prev, [item.id]: true }));

    // Trigger sweet sparkle sound
    playPianoNote(523.25, 2.0, 0.08);

    setSelectedItem(item);
    setActiveModalType(item.type);

    // If unwrapping final core item, trigger soft confetti
    if (item.layer === 3) {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#D4AF37', '#DB4455', '#FAF7F2'],
        });
      } catch (e) {}
    }
  };

  const getIcon = (type: string, iconName?: string) => {
    switch (type) {
      case 'letter':
        return <MailOpen className="w-6 h-6 text-[#8B0000]" />;
      case 'scrapbook':
        return <BookOpen className="w-6 h-6 text-[#B8860B]" />;
      case 'voice_note':
        return <Mic className="w-6 h-6 text-[#B8860B]" />;
      case 'time_capsule':
        return <Lock className="w-6 h-6 text-[#B8860B]" />;
      case 'chocolate_truffles':
        return <Sparkles className="w-6 h-6 text-[#D4AF37]" />;
      case 'scented_candle':
        return <Flame className="w-6 h-6 text-[#D49B4B]" />;
      case 'memory_buddy':
        return <HeartHandshake className="w-6 h-6 text-[#8B0000]" />;
      case 'celebration_cake':
        return <Cake className="w-6 h-6 text-[#D4AF37]" />;
      case 'last_whisper_note':
        return <Feather className="w-6 h-6 text-[#8B0000]" />;
      case 'gift_explosion_box':
        return <span className="text-2xl select-none">💥</span>;
      default:
        return <Gift className="w-6 h-6 text-[#B8860B]" />;
    }
  };

  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white/70 backdrop-blur-md border border-[#D4AF37]/40 shadow-sm mb-4">
        {/* Left: Box Sender & Recipient Greetings */}
        <div>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8C6239] block">
            {t.unboxingTitle}
          </span>
          <h2 className="font-serif-title text-lg sm:text-xl font-bold text-[#2D241E]">
            {activeBox.title}
          </h2>
        </div>

        {/* Right Controls: Multilingual Selector + Music Audio Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#D4C3A3] text-xs text-[#5A4634] shadow-sm">
            <Languages className="w-3.5 h-3.5 text-[#B8860B]" />
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent font-medium text-[#2D241E] focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Ambient Acoustic Music Toggle */}
          <button
            onClick={handleMusicToggle}
            className={`p-2.5 rounded-full border shadow-sm transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              isMusicActive
                ? 'bg-[#B8860B] text-white border-[#B8860B]'
                : 'bg-white border-[#D4C3A3] text-[#6B5532] hover:bg-[#F4EFE6]'
            }`}
            title="Acoustic Piano Melody"
          >
            {isMusicActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isMusicActive ? 'Melody Playing' : 'Play Music'}
            </span>
          </button>
        </div>
      </div>

      {/* Deep Emotional Translation Indicator & Cultural Idiom Note */}
      <AnimatePresence>
        {isTranslating ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-300 text-xs text-amber-900 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-700 animate-spin flex-shrink-0" />
              <span>Translating letter, memories, and reason notes with emotional cultural veracity...</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-white/70 px-2 py-0.5 rounded-full">
              Gemini 2.0 Flash
            </span>
          </motion.div>
        ) : culturalIdiomNote && currentLanguage !== 'en' ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-6 p-3 rounded-2xl bg-[#FFF9E6] border border-[#E8D4A2] text-xs text-[#7A5826] flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B8860B] flex-shrink-0" />
              <span className="font-medium">{culturalIdiomNote}</span>
            </div>
            <span className="text-[10px] font-bold text-[#8C6239] bg-white px-2 py-0.5 rounded-full border border-[#E8D4A2]">
              Native Mother Tongue ✨
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Layer Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
        {[
          { num: 1, title: 'Layer 1: Delights & Aromas', count: layer1Items.length, ready: true },
          { num: 2, title: 'Layer 2: Keepsakes & Diary', count: layer2Items.length, ready: true },
          { num: 3, title: 'Layer 3: The Core Vault', count: layer3Items.length, ready: true },
        ].map((layer) => (
          <button
            key={layer.num}
            onClick={() => {
              playPaperCrinkleSound();
              setActiveLayer(layer.num);
            }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer ${
              activeLayer === layer.num
                ? 'bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] shadow-md scale-105'
                : 'bg-white/80 border border-[#D4C3A3] text-[#6B5532] hover:bg-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Layer {layer.num}</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">({layer.count})</span>
          </button>
        ))}
      </div>

      {/* OPEN HAMPER TRUNK DISPLAY */}
      <div className="relative rounded-3xl p-6 sm:p-10 border-2 border-[#D4AF37]/50 luxury-box-shadow overflow-hidden min-h-[500px]">
        {/* Box Interior Velvet Gradient */}
        <div className={`absolute inset-0 ${theme.bodyGradient} ${theme.velvetTexture}`} />

        {/* Interior Gold Filigree Rim */}
        <div className="absolute inset-3 sm:inset-5 rounded-2xl border border-[#D4AF37]/35 pointer-events-none" />

        {/* ORGANIC SHREDDED PAPER BEDDING (Virtual Paper Shavings) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 select-none">
          {Array.from({ length: 48 }).map((_, i) => {
            const rot = (i * 37) % 360;
            const left = (i * 21) % 95;
            const top = (i * 19) % 90;
            return (
              <div
                key={i}
                className={`absolute w-12 sm:w-16 h-1.5 sm:h-2 rounded-full ${theme.paperShredColor} transform`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: `rotate(${rot}deg)`,
                  filter: 'blur(0.3px)',
                }}
              />
            );
          })}
        </div>

        {/* Layer Header Label inside the Box */}
        <div className="relative z-10 text-center mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#D4AF37] block mb-1">
            {activeLayer === 1
              ? t.layer1Title
              : activeLayer === 2
              ? t.layer2Title
              : t.layer3Title}
          </span>
          <p className="text-xs text-[#E6D4B5]/80 max-w-md mx-auto">
            {activeLayer === 1
              ? 'Taste and smell the sweet opening aromas before diving deeper into the trunk.'
              : activeLayer === 2
              ? 'Uncover cherished snapshots, custom souvenirs, and our digital memory journal.'
              : 'The deepest, most intimate treasures — handwritten vows, voice notes, and memory vault.'}
          </p>
        </div>

        {/* ACTIVE LAYER GIFTS GRID */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(activeLayer === 1
            ? layer1Items
            : activeLayer === 2
            ? layer2Items
            : layer3Items
          ).map((item, idx) => {
            const isUnwrapped = unwrappedItems[item.id];
            const isCoreLetter = item.type === 'letter';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleItemClick(item)}
                className={`relative cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md overflow-hidden ${
                  isCoreLetter
                    ? 'bg-gradient-to-br from-[#FAF7F2] via-[#FFF8E7] to-[#F2E8D7] border-[#D4AF37] shadow-xl sm:col-span-2 lg:col-span-2'
                    : isUnwrapped
                    ? 'bg-[#FAF7F2]/95 border-[#D4AF37]/60 shadow-lg'
                    : 'bg-[#FAF7F2]/85 border-[#D4AF37]/35 hover:border-[#D4AF37] shadow-md'
                }`}
              >
                {/* Organic Paper Shavings nest behind individual gift */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />

                {/* Gift Tag Badge / Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#8B0000]/10 text-[#8B0000] border border-[#8B0000]/20">
                    {item.tag || item.type.replace('_', ' ')}
                  </span>

                  {isUnwrapped && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unwrapped</span>
                    </div>
                  )}
                </div>

                {/* Main Icon & Title */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-[#D4C3A3] flex items-center justify-center flex-shrink-0">
                    {getIcon(item.type, item.iconName)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#2D241E] leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#7A6856] mt-1 line-clamp-2 leading-relaxed">
                      {item.subtitle || 'Click to peel wrapper & discover the keepsake inside.'}
                    </p>
                  </div>
                </div>

                {/* Peel Wrapper Prompt Button */}
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/25 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8C6239] flex items-center gap-1 group-hover:underline">
                    <span>{isUnwrapped ? 'Revisit Keepsake' : 'Unwrap & Open'}</span>
                    <Sparkles className="w-3 h-3 text-[#B8860B]" />
                  </span>

                  {item.lockedUntil && (
                    <span className="text-[10px] font-medium text-[#8B0000] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Time-Capsule</span>
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Layer Peeling Progression / Next Layer Navigation */}
        <div className="relative z-10 mt-10 pt-6 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#E6D4B5] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>
              Layer {activeLayer} of 3 — Unpeel all items to experience every emotion.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeLayer > 1 && (
              <button
                onClick={() => {
                  playPaperCrinkleSound();
                  setActiveLayer(activeLayer - 1);
                }}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold border border-white/30 transition-all cursor-pointer"
              >
                ← Back to Layer {activeLayer - 1}
              </button>
            )}

            {activeLayer < 3 && (
              <button
                onClick={() => {
                  playPaperCrinkleSound();
                  playBoxOpenCreakSound();
                  setActiveLayer(activeLayer + 1);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] text-xs font-bold shadow-lg hover:brightness-105 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Peel Layer & Reveal Deeper Vault</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ITEM MODALS */}
      {selectedItem && (
        <>
          {activeModalType === 'letter' && (
            <LetterModal
              item={selectedItem}
              box={activeBox}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'scrapbook' && (
            <ScrapbookModal
              item={selectedItem}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'voice_note' && (
            <VoiceNoteModal
              item={selectedItem}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'time_capsule' && (
            <TimeCapsuleModal
              item={selectedItem}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'memory_buddy' && (
            <MemoryBuddyModal
              item={selectedItem}
              box={activeBox}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
              onMoodDetected={(mood) => {
                setAmbientMoodAudio(mood);
              }}
            />
          )}

          {activeModalType === 'celebration_cake' && (
            <CelebrationCakeModal
              item={selectedItem}
              box={activeBox}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'last_whisper_note' && (
            <LastWhisperingNoteModal
              item={selectedItem}
              box={activeBox}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {activeModalType === 'gift_explosion_box' && (
            <GiftExplosionBoomModal
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
              recipientName={activeBox.recipientName}
              senderName={activeBox.senderName}
              explosionTitle={selectedItem.payload?.explosionTitle || selectedItem.title}
              explosionSubtitle={selectedItem.payload?.explosionSubtitle || selectedItem.subtitle}
              explosionThemeColor={selectedItem.payload?.explosionThemeColor || 'ruby_gold'}
              explosionBoxPattern={selectedItem.payload?.explosionBoxPattern || 'velvet_ribbon'}
              gifts={selectedItem.payload?.explosionGifts || []}
              currentLanguage={currentLanguage}
            />
          )}

          {(activeModalType === 'chocolate_truffles' ||
            activeModalType === 'inside_joke' ||
            activeModalType === 'scented_candle' ||
            activeModalType === 'custom_gift') && (
            <CustomGiftModal
              item={selectedItem}
              isOpen={Boolean(selectedItem)}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </>
      )}

      {/* DUAL-USER SHARED MEMORY TIMELINE (TOGETHER MODE) */}
      <div className="w-full mt-10">
        <TogetherMemoryTimeline box={activeBox} currentLanguage={currentLanguage} />
      </div>
    </div>
  );
};
