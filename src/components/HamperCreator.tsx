import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HamperBox,
  HamperItem,
  BoxOccasion,
  BoxTheme,
  PaperStyle,
  ScrapbookPage,
  User,
  SupportedLanguage,
  EmotionalReasonCategory,
  ExplosionGiftItem,
} from '../types';
import { BOX_THEMES } from '../utils/themes';
import { playWaxSealCrackSound, playPaperCrinkleSound, playPianoNote } from '../utils/audio';
import {
  Sparkles,
  Heart,
  KeyRound,
  Lock,
  Wand2,
  Mail,
  BookOpen,
  Mic,
  Clock,
  Gift,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Scissors,
  Globe,
  Cookie,
  Bot,
  MessageCircle,
  HelpCircle,
  SkipForward,
  X,
  Eye,
  Cake,
  Feather,
  Scroll,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUPPORTED_LANGUAGES, CREATOR_STUDIO_TRANSLATIONS } from '../utils/languages';
import { LANGUAGE_DEFAULTS } from '../utils/languagePresets';

import { VirtualGiftTable } from './VirtualGiftTable';
import { ReasonBoxCanvas } from './ReasonBoxCanvas';
import { AiCardWriterStudio } from './AiCardWriterStudio';
import { PolaroidScrapbookStudio } from './PolaroidScrapbookStudio';
import { CassetteRecorderStudio } from './CassetteRecorderStudio';
import { TreatsAndDelightsStudio } from './TreatsAndDelightsStudio';
import { TimeCapsuleStudio } from './TimeCapsuleStudio';
import { SouvenirAndMemoryBuddyStudio } from './SouvenirAndMemoryBuddyStudio';
import { VortexHeartStudioConfig } from './VortexHeartStudioConfig';
import { OccasionCakeStudio } from './OccasionCakeStudio';
import { LastWhisperNoteStudio } from './LastWhisperNoteStudio';
import { GiftExplosionStudio } from './GiftExplosionStudio';
import { MagicMirrorPreview, MagicMirrorData } from './MagicMirrorPreview';

interface HamperCreatorProps {
  onBoxCreated: (box: HamperBox) => void;
  onCancel: () => void;
  currentUser?: User | null;
  onRequireAuth?: () => void;
}

export const HamperCreator: React.FC<HamperCreatorProps> = ({
  onBoxCreated,
  onCancel,
  currentUser,
}) => {
  // Language State
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const t = CREATOR_STUDIO_TRANSLATIONS[currentLanguage] || CREATOR_STUDIO_TRANSLATIONS.en;

  // Magic Mirror State
  const [isMobileMirrorOpen, setIsMobileMirrorOpen] = useState<boolean>(false);
  const [isMirrorExpanded, setIsMirrorExpanded] = useState<boolean>(false);
  const [mirrorTriggerTimestamp, setMirrorTriggerTimestamp] = useState<number>(Date.now());

  // Stepper state (1 to 9)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workshop Table state
  const [shreddedPaperColor, setShreddedPaperColor] = useState<string>('gold_kraft');
  const [aromaMood, setAromaMood] = useState<string>('warm_vanilla');
  const [giftTagTo, setGiftTagTo] = useState<string>('');
  const [giftTagFrom, setGiftTagFrom] = useState<string>(currentUser?.name || '');
  const [giftTagMessage, setGiftTagMessage] = useState<string>('');
  const [selectedStickers, setSelectedStickers] = useState<string[]>(['handle_love', 'inside_joke']);

  // Basics & Security Lock state
  const [title, setTitle] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>(currentUser?.name || '');
  const [occasion, setOccasion] = useState<BoxOccasion>('anniversary');
  const [theme, setTheme] = useState<BoxTheme>('royal_velvet_burgundy');
  const [secretPassword, setSecretPassword] = useState<string>('');
  const [passwordHint, setPasswordHint] = useState<string>('');
  const [waxSealInitials, setWaxSealInitials] = useState<string>(currentUser?.initials || '');

  // Emotional Reason & WhatsApp Notifications
  const [reasonCategory, setReasonCategory] = useState<EmotionalReasonCategory>('love');
  const [reasonWhySpecial, setReasonWhySpecial] = useState<string>(
    'You make even the quietest ordinary moments feel magical, and you have stood by me through thick and thin.'
  );
  const [customWishMessage, setCustomWishMessage] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');

  // AI Letter Writer state
  const [letterTitle, setLetterTitle] = useState<string>('To the One Who Holds My Heart');
  const [letterContent, setLetterContent] = useState<string>('');
  const [letterSignature, setLetterSignature] = useState<string>('');
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('rose_petal_pressed');

  // Scrapbook state
  const [scrapbookTitle, setScrapbookTitle] = useState<string>('Our Cherished Chapters');
  const [pages, setPages] = useState<ScrapbookPage[]>([
    {
      id: 'page-1',
      title: 'How It All Began',
      date: 'Our First Encounter',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      note: 'The very first moment our eyes met, time stood still.',
      stickers: ['✨', '☕', '❤️'],
      tapeColor: '#D4AF37',
    },
    {
      id: 'page-2',
      title: 'Our Sweetest Adventure',
      date: 'That Unforgettable Weekend',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      note: 'Laughing until our stomachs hurt and making promises for the future.',
      stickers: ['🌊', '🌅'],
      tapeColor: '#E8B4B8',
    },
  ]);

  // Cassette Voice Note state
  const [voiceTitle, setVoiceTitle] = useState<string>('A Spoken Whisper for You');
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [audioData, setAudioData] = useState<string | undefined>(undefined);
  const [durationSeconds, setDurationSeconds] = useState<number>(45);

  // Treats & Inside Joke state
  const [treatName, setTreatName] = useState<string>('Artisanal Belgian Dark Truffles');
  const [treatDesc, setTreatDesc] = useState<string>('Rich 70% dark cocoa dusted with roasted hazelnut praline');
  const [treatImage, setTreatImage] = useState<string>(
    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80'
  );
  const [insideJokeMessage, setInsideJokeMessage] = useState<string>(
    '“Pineapple on pizza is a crime against humanity — and we both know it!”'
  );

  // Time Capsule state
  const [timeCapsuleTitle, setTimeCapsuleTitle] = useState<string>('Secret Future Milestone Vault');
  const [timeCapsuleDate, setTimeCapsuleDate] = useState<string>(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [timeCapsuleMessage, setTimeCapsuleMessage] = useState<string>(
    'No matter where life takes us, my love for you will always remain constant.'
  );

  // Custom Souvenir & Relationship Notes state
  const [customItemName, setCustomItemName] = useState<string>('Our First Roadtrip Souvenir');
  const [customItemDesc, setCustomItemDesc] = useState<string>(
    'Picked up during our wild midnight drive to the hills where we watched sunrise together.'
  );
  const [customItemImage, setCustomItemImage] = useState<string>(
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80'
  );
  const [customItemTag, setCustomItemTag] = useState<string>('Keepsake Souvenir');
  const [relationshipNotes, setRelationshipNotes] = useState<string[]>([
    'We always order extra garlic bread and fight over the last piece.',
    'Our song played in the car during that midnight drive in the rain.',
    'You always steal my sweaters because you say they smell like home.',
  ]);

  // Occasion Celebration Cake state
  const [cakeFlavor, setCakeFlavor] = useState<'red_velvet' | 'belgian_chocolate' | 'vanilla_rose' | 'vintage_berry' | 'royal_truffle'>('red_velvet');
  const [cakeOccasion, setCakeOccasion] = useState<'birthday' | 'anniversary' | 'love' | 'celebration'>('anniversary');
  const [cakeMessage, setCakeMessage] = useState<string>('Happy 4th Anniversary Ananya ✨');
  const [candleCount, setCandleCount] = useState<number>(4);
  const [wishBannerText, setWishBannerText] = useState<string>('Make a Wish My Love! ✨');
  const [wishSecretNote, setWishSecretNote] = useState<string>(
    'May our laughter always outlive the storms, and may every sunrise find us holding hands forever.'
  );

  // The Last Whispering Note state (Mandatory Sentimental Parchment Slot)
  const [lastNoteTitle, setLastNoteTitle] = useState<string>('The Last Whispering Note (आखिरी संदेश)');
  const [lastNoteParchment, setLastNoteParchment] = useState<string>(
    `And so, as you reach the bottom of this little universe I built for you, know that everything packed inside here is just a humble shadow of how endlessly you are cherished.\n\nThank you for choosing to walk by my side. Whenever the world gets too noisy or the days grow long, come back to this box, play my voice, read these pages, and remember that you will always be my greatest miracle.\n\nSleep with a smile tonight.`
  );
  const [lastNoteSignature, setLastNoteSignature] = useState<string>(
    `~ With All My Heart, ${senderName || currentUser?.name || 'Me'} ❤️`
  );

  // 3D Gift Explosion Boom Box state (गिफ्ट ब्लास्ट बॉक्स)
  const [includeExplosionBox, setIncludeExplosionBox] = useState<boolean>(true);
  const [explosionTitle, setExplosionTitle] = useState<string>('A Shower of Love & Surprises (गिफ्ट ब्लास्ट)');
  const [explosionSubtitle, setExplosionSubtitle] = useState<string>('Tap the vibrating box below to blast every treasure into the air!');
  const [explosionThemeColor, setExplosionThemeColor] = useState<'ruby_gold' | 'midnight_purple' | 'champagne_pink' | 'emerald_gold' | 'sapphire_silver'>('ruby_gold');
  const [explosionBoxPattern, setExplosionBoxPattern] = useState<'polka_gold' | 'hearts' | 'stripes' | 'vintage_filigree' | 'velvet_ribbon'>('velvet_ribbon');
  const [explosionGifts, setExplosionGifts] = useState<ExplosionGiftItem[]>([
    {
      id: 'exp-1',
      title: 'Crimson Dutch Roses Bouquet 🌹',
      category: 'flower_bouquet',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      caption: '50 freshly bloomed velvety roses that never wither, symbolizing our eternal bond.',
      tags: ['Eternal Blooms', 'Fragrant Love'],
      reactionEmoji: '🌹',
    },
    {
      id: 'exp-2',
      title: 'Vintage Honey Plush Bear 🧸',
      category: 'teddy_bear',
      imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
      caption: 'A cuddle buddy for midnight study sessions and movie marathons when I am away.',
      tags: ['Soft Hugs', 'Forever Warmth'],
      reactionEmoji: '🧸',
    },
    {
      id: 'exp-3',
      title: 'Belgian Truffle Gold Selection 🍫',
      category: 'chocolates',
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&auto=format&fit=crop&q=80',
      caption: 'Rich 70% dark cocoa dusted with roasted hazelnut praline.',
      tags: ['Sweet Decadence', 'Handmade'],
      reactionEmoji: '🍫',
    },
  ]);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [languageNotice, setLanguageNotice] = useState<string | null>(null);

  // Apply language presets across all 13 sections
  const applyLanguagePreset = (lang: SupportedLanguage, showNotice: boolean = true) => {
    const preset = LANGUAGE_DEFAULTS[lang] || LANGUAGE_DEFAULTS.en;
    if (!preset) return;

    setTitle(preset.title);
    setRecipientName(preset.recipientNameDefault);
    setSenderName(currentUser?.name || preset.senderNameDefault);
    setGiftTagTo(preset.giftTagTo);
    setGiftTagFrom(currentUser?.name || preset.giftTagFrom);
    setGiftTagMessage(preset.giftTagMessage);
    setReasonWhySpecial(preset.reasonWhySpecial);
    setCustomWishMessage(preset.customWishMessage);
    setLetterTitle(preset.letterTitle);
    setLetterContent(preset.letterContent);
    setLetterSignature(preset.letterSignature);
    setPaperStyle(preset.paperStyle);
    setPages(preset.scrapbookPages);
    setVoiceTitle(preset.voiceTitle);
    setCakeMessage(preset.cakeMessage);
    setWishBannerText(preset.wishBannerText);
    setWishSecretNote(preset.wishSecretNote);
    setTreatName(preset.treatName);
    setTreatDesc(preset.treatDesc);
    setInsideJokeMessage(preset.insideJokeMessage);
    setTimeCapsuleTitle(preset.timeCapsuleTitle);
    setTimeCapsuleMessage(preset.timeCapsuleMessage);
    setCustomItemName(preset.customItemName);
    setCustomItemDesc(preset.customItemDesc);
    setCustomItemTag(preset.customItemTag);
    setRelationshipNotes(preset.relationshipNotes);
    setExplosionTitle(preset.explosionTitle);
    setExplosionSubtitle(preset.explosionSubtitle);
    setExplosionGifts(preset.explosionGifts);
    setLastNoteTitle(preset.lastNoteTitle);
    setLastNoteParchment(preset.lastNoteParchment);
    setLastNoteSignature(preset.lastNoteSignature);
    setPasswordHint(preset.passwordHint);

    triggerMirrorSync();

    if (showNotice) {
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
      const langName = langObj ? `${langObj.nativeName} (${langObj.name})` : lang;
      setLanguageNotice(`✨ All hamper sections (Love Letter, Cake, Scrapbook, Treats, Whispering Note & Gift Blast) have been converted to ${langName}!`);
      setTimeout(() => setLanguageNotice(null), 6000);
    }
  };

  const handleLanguageSelect = (newLang: SupportedLanguage) => {
    playPianoNote(523.25);
    setCurrentLanguage(newLang);
    applyLanguagePreset(newLang, true);
  };

  // Magic Mirror Data Bundle
  const magicMirrorData: MagicMirrorData = {
    theme,
    recipientName: recipientName || giftTagTo,
    senderName: senderName || giftTagFrom,
    occasion,
    waxSealInitials,
    secretPassword,
    passwordHint,
    reasonCategory,
    reasonWhySpecial,
    customWishMessage,
    shreddedPaperColor,
    giftTagTo,
    giftTagFrom,
    giftTagMessage,
    letterTitle,
    letterContent,
    paperStyle,
    pages,
    voiceTitle,
    treatName,
    treatDesc,
    insideJokeMessage,
    customItemName,
    timeCapsuleTitle,
    cakeMessage,
    cakeFlavor,
    lastNoteTitle,
    lastNoteParchment,
    explosionTitle,
    explosionGiftsCount: explosionGifts.length,
    triggerTimestamp: mirrorTriggerTimestamp,
  };

  const triggerMirrorSync = () => {
    setMirrorTriggerTimestamp(Date.now());
  };

  const toggleSticker = (stickerId: string) => {
    if (selectedStickers.includes(stickerId)) {
      setSelectedStickers(selectedStickers.filter((s) => s !== stickerId));
    } else {
      setSelectedStickers([...selectedStickers, stickerId]);
    }
  };

  const stepsList = [
    { step: 1, label: t?.tabs?.workshop || 'Packing Table', icon: Scissors },
    { step: 2, label: t?.tabs?.basics || 'Basics & Lock', icon: KeyRound },
    { step: 3, label: t?.tabs?.whySpecial || 'Why Special?', icon: Heart },
    { step: 4, label: t?.tabs?.vortexHeart || 'Vortex Heart', icon: Sparkles },
    { step: 5, label: t?.tabs?.letter || 'AI Love Letter', icon: Mail },
    { step: 6, label: t?.tabs?.scrapbook || 'Photo Scrapbook', icon: BookOpen },
    { step: 7, label: t?.tabs?.voice || 'Voice Note', icon: Mic },
    { step: 8, label: t?.tabs?.cake || 'Celebration Cake', icon: Cake },
    { step: 9, label: t?.tabs?.delights || 'Treats & Delights', icon: Cookie },
    { step: 10, label: t?.tabs?.customMemory || 'Souvenir & AI', icon: Gift },
    { step: 11, label: t?.tabs?.giftBlast || 'Gift Blast 💥', icon: Sparkles },
    { step: 12, label: t?.tabs?.lastNote || 'The Last Note 📜', icon: Feather },
    { step: 13, label: t?.tabs?.seal || 'Seal & Share', icon: CheckCircle },
  ];

  // Final submission
  const handleFinalSubmit = async () => {
    const finalRecipient = recipientName.trim() || giftTagTo.trim() || 'My Dearest Love';
    const finalSender = senderName.trim() || giftTagFrom.trim() || currentUser?.name || 'Someone Who Loves You';

    setIsSaving(true);
    playWaxSealCrackSound();

    const finalItems: HamperItem[] = [
      // Layer 1: Treats & Custom Keepsake Souvenir
      {
        id: `item-treat-${Date.now()}`,
        type: 'inside_joke',
        layer: 1,
        title: treatName,
        subtitle: 'Artisanal delights with secret foil inside joke',
        tag: 'Sweet Delight',
        payload: {
          treatName,
          treatDescription: treatDesc,
          treatImage,
          insideJokeMessage,
          giftTagMessage: 'Because you make life sweeter every day.',
        },
      },
      {
        id: `item-custom-${Date.now()}`,
        type: 'custom_gift',
        layer: 1,
        title: customItemName || 'Special Keepsake Souvenir',
        subtitle: customItemDesc || 'Handcrafted especially for you',
        tag: customItemTag || 'Handmade Keepsake',
        payload: {
          customName: customItemName,
          customDescription: customItemDesc,
          customImage: customItemImage,
          giftTagMessage: customItemTag,
        },
      },
      // Layer 2: Interactive Photo Scrapbook, Celebration Cake & 3D Gift Explosion Boom Box
      {
        id: `item-scrapbook-${Date.now()}`,
        type: 'scrapbook',
        layer: 2,
        title: scrapbookTitle || 'Our Memory Journal',
        subtitle: 'Flip through our cherished snapshots and chapters',
        tag: 'Photo Scrapbook',
        payload: {
          scrapbookTitle,
          pages,
        },
      },
      ...(includeExplosionBox && explosionGifts.length > 0
        ? [
            {
              id: `item-explosion-${Date.now()}`,
              type: 'gift_explosion_box' as const,
              layer: 2 as const,
              title: explosionTitle || 'The 3D Gift Explosion Boom Box',
              subtitle: explosionSubtitle || 'Tap the box to blast every treasure into the air!',
              tag: '3D Gift Blast',
              iconName: 'Sparkles',
              payload: {
                explosionTitle: explosionTitle || 'A Shower of Love & Surprises (गिफ्ट ब्लास्ट)',
                explosionSubtitle: explosionSubtitle || 'Tap the box to blast every treasure into the air!',
                explosionThemeColor,
                explosionBoxPattern,
                explosionGifts,
                isExploded: false,
              },
            },
          ]
        : []),
      {
        id: `item-cake-${Date.now()}`,
        type: 'celebration_cake',
        layer: 2,
        title: 'Occasion Celebration Cake',
        subtitle: 'A 3D velvet cake with lit candles. Blow into your mic to make a wish!',
        tag: 'Interactive Cake',
        iconName: 'Cake',
        payload: {
          cakeFlavor,
          cakeOccasion,
          cakeMessage: cakeMessage || `Happy Celebration ${finalRecipient} ✨`,
          candleCount,
          wishBannerText,
          wishSecretNote,
          isBlownOut: false,
        },
      },
      // Layer 3: Core Vault (Letter, Voice Note, Time Capsule, Memory Companion, and The Last Note)
      {
        id: `item-letter-${Date.now()}`,
        type: 'letter',
        layer: 3,
        title: letterTitle || 'The Hand-Penned Love Letter',
        subtitle: 'A heartfelt letter written from the depths of my soul',
        tag: 'Core Letter',
        payload: {
          letterTitle,
          letterContent:
            letterContent ||
            `My Dearest ${finalRecipient},\n\nEvery day spent knowing you is a memory I treasure deeply. Thank you for bringing so much light into my life.\n\nWith all my love,\n${finalSender}`,
          paperStyle,
          letterSignature: letterSignature || `${finalSender} — With All My Heart`,
        },
      },
      {
        id: `item-voice-${Date.now()}`,
        type: 'voice_note',
        layer: 3,
        title: voiceTitle || 'Spoken Voice Recording',
        subtitle: 'Listen to my voice message with your headphones on',
        tag: 'Voice Memory',
        payload: {
          voiceNoteTitle: voiceTitle,
          transcription: voiceTranscript,
          audioData: audioData || undefined,
          durationSeconds: durationSeconds > 0 ? durationSeconds : 45,
        },
      },
      {
        id: `item-capsule-${Date.now()}`,
        type: 'time_capsule',
        layer: 3,
        title: timeCapsuleTitle || 'Secret Time-Capsule Vault',
        subtitle: 'Locked until our upcoming milestone date',
        tag: 'Time Capsule',
        lockedUntil: new Date(timeCapsuleDate).toISOString(),
        payload: {
          capsuleTitle: timeCapsuleTitle,
          capsuleMessage: timeCapsuleMessage,
          unlockDate: new Date(timeCapsuleDate).toISOString(),
        },
      },
      {
        id: `item-buddy-${Date.now()}`,
        type: 'memory_buddy',
        layer: 3,
        title: 'Memory Companion Chatbot',
        subtitle: 'Chat with an AI that knows our special moments',
        tag: 'Memory Buddy',
        payload: {
          promptSuggestions: [
            `Tell me what ${finalSender} loves most about me.`,
            `What is our favorite inside joke?`,
            `What does this hamper box celebrate?`,
          ],
        },
      },
      {
        id: `item-last-note-${Date.now()}`,
        type: 'last_whisper_note',
        layer: 3,
        title: lastNoteTitle || 'The Last Whispering Note (आखिरी संदेश)',
        subtitle: 'The mandatory bottom-most parchment letter with my parting thoughts',
        tag: 'The Final Note',
        iconName: 'Feather',
        payload: {
          lastNoteTitle: lastNoteTitle || 'The Last Whispering Note (आखिरी संदेश)',
          lastNoteParchment:
            lastNoteParchment ||
            `And so, as you reach the bottom of this little universe I built for you, know that everything packed inside here is just a humble shadow of how endlessly you are cherished.\n\nThank you for choosing to walk by my side. Whenever the world gets too noisy, come back to this box, play my voice, read these pages, and remember that you will always be my greatest miracle.`,
          lastNoteSignature: lastNoteSignature || `${finalSender} — Forever Your Safe Harbor ❤️`,
          isLastNoteSealed: true,
        },
      },
    ];

    const boxPayload: Partial<HamperBox> = {
      creatorId: currentUser?.id,
      creatorEmail: currentUser?.email,
      title: title || `To ${finalRecipient} — A Handcrafted Keepsake`,
      recipientName: finalRecipient,
      senderName: finalSender,
      senderPhone: senderPhone.trim() || undefined,
      reasonCategory: reasonCategory || 'love',
      reasonWhySpecial: reasonWhySpecial.trim() || undefined,
      customWishMessage: customWishMessage.trim() || undefined,
      occasion,
      theme,
      secretPassword: secretPassword.trim(),
      passwordHint: passwordHint.trim(),
      waxSealInitials:
        waxSealInitials ||
        `${finalSender.charAt(0).toUpperCase()} & ${finalRecipient.charAt(0).toUpperCase()}`,
      giftTagMessage: giftTagMessage || `Made with utmost love for ${finalRecipient}.`,
      items: finalItems,
      relationshipMemories: relationshipNotes,
      customSettings: {
        bgMusicEnabled: true,
        rosePetalsEnabled: true,
        shreddedPaperColor: (shreddedPaperColor as any) || 'gold_kraft',
      },
    };

    try {
      const res = await fetch('/api/boxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boxPayload),
      });

      const data = await res.json();
      if (data.box) {
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#D4AF37', '#8B1E2D', '#FAF7F2', '#EEDC82'],
          });
        } catch (e) {}
        onBoxCreated(data.box);
      }
    } catch (err) {
      console.error('Error creating box:', err);
      alert('Failed to save hamper box. Please check connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      {/* Top Bar with Language Selector & Mirror Fast Action */}
      <div className="flex flex-col gap-4 mb-6 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/35 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8C6D37] block">
              {t?.studioSubtitle || 'Handcraft a personalized emotional virtual keepsake hamper'}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E]">
              {t?.studioTitle || 'Artisan Gift Creator Studio'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Mobile Mirror Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMirrorOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-[#231C16] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs flex items-center gap-1.5 text-xs font-serif font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>The Magic Mirror</span>
            </button>

            {/* Prominent Language Selector Dropdown */}
            <div className="flex items-center gap-2 bg-[#FAF7EE] px-3.5 py-2 rounded-xl border border-[#D4AF37]/40 shadow-2xs">
              <Globe className="w-4 h-4 text-[#8B1E2D]" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#8C6D37]">
                  {t?.languageSelectLabel || 'Crafting Language (आपकी भाषा):'}
                </span>
                <select
                  value={currentLanguage}
                  onChange={(e) => handleLanguageSelect(e.target.value as SupportedLanguage)}
                  className="bg-transparent text-xs font-bold text-[#2D241E] focus:outline-hidden cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="text-black">
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Instant Language Auto-Fill Button */}
            <button
              type="button"
              onClick={() => {
                playPianoNote(587.33);
                applyLanguagePreset(currentLanguage, true);
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#B8860B] text-white text-xs font-bold shadow-xs hover:brightness-110 active:scale-95 cursor-pointer flex items-center gap-1.5"
              title="Auto-fill and translate all 13 sections with selected language content"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#F5E6C8]" />
              <span>Auto-Fill All in {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName || 'Language'}</span>
            </button>
          </div>
        </div>

        {/* Quick Language Switcher Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-[#D4AF37]/20 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D37] shrink-0 mr-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#8B1E2D]" /> Quick Select:
          </span>
          {[
            { code: 'mr', label: 'मराठी (Marathi)' },
            { code: 'hi', label: 'हिंदी (Hindi)' },
            { code: 'en', label: 'English' },
            { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
            { code: 'bn', label: 'বাংলা (Bengali)' },
            { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
            { code: 'ta', label: 'தமிழ் (Tamil)' },
            { code: 'te', label: 'తెలుగు (Telugu)' },
            { code: 'es', label: 'Español' },
            { code: 'ja', label: '日本語' },
          ].map((langItem) => {
            const isSelected = currentLanguage === langItem.code;
            return (
              <button
                key={langItem.code}
                type="button"
                onClick={() => handleLanguageSelect(langItem.code as SupportedLanguage)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B1E2D] text-[#FAF7EE] shadow-xs ring-1 ring-[#D4AF37]'
                    : 'bg-[#FAF7EE] text-[#5C4524] hover:bg-[#F3EDE0] border border-[#D4AF37]/30'
                }`}
              >
                {langItem.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Conversion Notification Banner */}
      <AnimatePresence>
        {languageNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#FFF9E6] via-[#FFF3D6] to-[#FFF9E6] border-2 border-[#D4AF37] shadow-md flex items-center justify-between gap-3 text-xs text-[#5C3D11]"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#B8860B] shrink-0 animate-bounce" />
              <span className="font-semibold text-sm leading-relaxed">{languageNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setLanguageNotice(null)}
              className="p-1 rounded-lg hover:bg-[#D4AF37]/20 text-[#5C3D11] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Step Navigator Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        {stepsList.map((s) => {
          const Icon = s.icon;
          const isCurrent = currentStep === s.step;
          const isDone = currentStep > s.step;

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => {
                playPaperCrinkleSound();
                setCurrentStep(s.step);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2C1D0F] shadow-md ring-2 ring-[#D4AF37]/40 font-bold'
                  : isDone
                  ? 'bg-white/90 border border-[#D4AF37]/40 text-[#8B1E2D] hover:bg-white'
                  : 'bg-white/60 border border-stone-200 text-[#7A6856] hover:bg-white'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isCurrent
                    ? 'bg-[#2C1D0F] text-[#D4AF37]'
                    : isDone
                    ? 'bg-[#8B1E2D]/15 text-[#8B1E2D]'
                    : 'bg-stone-200/80 text-stone-600'
                }`}
              >
                {s.step}
              </span>
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{s.label}</span>
              {isDone && <span className="text-[10px] text-emerald-600 font-bold ml-0.5">✓</span>}
            </button>
          );
        })}
      </div>

      {/* SPLIT WORKSPACE: LEFT (STUDIO STEP) & RIGHT (THE MAGIC MIRROR PREVIEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: ACTIVE STEP CREATOR WORKSHOP */}
        <div className="lg:col-span-7 xl:col-span-7">
          <div className="bg-[#FAF7EE]/90 backdrop-blur-md rounded-3xl p-5 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/40 relative">
            <AnimatePresence mode="wait">
              {/* STEP 1: VIRTUAL GIFT TABLE WORKSHOP */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <VirtualGiftTable
                    currentLanguage={currentLanguage}
                    shreddedPaperColor={shreddedPaperColor}
                    onSelectBedding={(color) => {
                      setShreddedPaperColor(color);
                      triggerMirrorSync();
                    }}
                    aromaMood={aromaMood}
                    onSelectAroma={(aroma) => {
                      setAromaMood(aroma);
                      triggerMirrorSync();
                    }}
                    giftTagTo={giftTagTo || recipientName}
                    giftTagFrom={giftTagFrom || senderName}
                    giftTagMessage={giftTagMessage}
                    onUpdateTag={(to, from, msg) => {
                      setGiftTagTo(to);
                      setGiftTagFrom(from);
                      setGiftTagMessage(msg);
                      if (to && !recipientName) setRecipientName(to);
                      if (from && !senderName) setSenderName(from);
                      triggerMirrorSync();
                    }}
                    selectedStickers={selectedStickers}
                    onToggleSticker={(s) => {
                      toggleSticker(s);
                      triggerMirrorSync();
                    }}
                    onSkip={() => {
                      playPaperCrinkleSound();
                      setCurrentStep(2);
                    }}
                  />
                </motion.div>
              )}

          {/* STEP 2: BASICS, THEME & SECURITY PASSWORD */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-[#D4AF37]/30 pb-4">
                <h2 className="font-serif text-2xl font-bold text-[#2D241E]">
                  Recipient, Theme & Secret Password
                </h2>
                <p className="text-xs text-[#7A6856] mt-1">
                  The recipient must enter this secret keyword to unlock the keepsake box.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1.5">
                    To (Recipient Name) *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => {
                      setRecipientName(e.target.value);
                      if (!giftTagTo) setGiftTagTo(e.target.value);
                    }}
                    placeholder="e.g. Ananya"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37]/40 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1.5">
                    From (Your Name) *
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => {
                      setSenderName(e.target.value);
                      if (!giftTagFrom) setGiftTagFrom(e.target.value);
                    }}
                    placeholder="e.g. Aryan"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37]/40 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1.5">
                    Box Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`To My Dearest ${recipientName || 'Love'}`}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37]/40 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1.5">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as BoxOccasion)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37]/40 focus:outline-hidden"
                  >
                    <option value="anniversary">Anniversary Celebration</option>
                    <option value="birthday">Birthday Keepsake</option>
                    <option value="love">Pure Love & Romance</option>
                    <option value="long_distance">Long Distance Love Box</option>
                    <option value="apology">Sincere Apology & Reconciliation</option>
                    <option value="proposal">Marriage / Relationship Proposal</option>
                    <option value="friendship">Lifelong Friendship</option>
                    <option value="gratitude">Heartfelt Gratitude</option>
                  </select>
                </div>
              </div>

              {/* Keepsake Trunk Theme Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-2">
                  Keepsake Box Velvet & Texture Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.values(BOX_THEMES).map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setTheme(th.id)}
                      className={`p-3 rounded-2xl cursor-pointer border-2 transition-all flex flex-col items-center text-center ${
                        theme === th.id
                          ? 'border-[#D4AF37] bg-white shadow-md ring-2 ring-[#D4AF37]/30'
                          : 'border-stone-200 bg-white/60 hover:bg-white'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full mb-1.5 shadow-inner border border-white/40"
                        style={{ backgroundColor: th.boxBg }}
                      />
                      <span className="text-xs font-bold text-[#2D241E] leading-tight">
                        {th.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Secret Keyword Password Gate */}
              <div className="p-5 rounded-2xl bg-[#FFF9E6] border border-[#E8D7A6] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#8C6239] font-bold text-sm">
                  <KeyRound className="w-4 h-4 text-[#B8860B]" />
                  <span>Secret Password Lock</span>
                </div>
                <p className="text-xs text-[#7A5826]">
                  Set a secret keyword only you and {recipientName || 'your recipient'} know.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C4524] mb-1">
                      Secret Password *
                    </label>
                    <input
                      type="text"
                      value={secretPassword}
                      onChange={(e) => setSecretPassword(e.target.value)}
                      placeholder="e.g. lonavalarain2022"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C4524] mb-1">
                      Password Hint (Optional)
                    </label>
                    <input
                      type="text"
                      value={passwordHint}
                      onChange={(e) => setPasswordHint(e.target.value)}
                      placeholder="e.g. The hill station where we got soaked in the rain..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REASON BOX CANVAS & WHATSAPP NOTIFICATIONS ⭐ */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ReasonBoxCanvas
                currentLanguage={currentLanguage}
                recipientName={recipientName}
                senderName={senderName}
                reasonCategory={reasonCategory}
                onChangeCategory={setReasonCategory}
                reasonWhySpecial={reasonWhySpecial}
                onChangeReason={setReasonWhySpecial}
                senderPhone={senderPhone}
                onChangeSenderPhone={setSenderPhone}
                onSkip={() => {
                  playPaperCrinkleSound();
                  setCurrentStep(4);
                }}
              />
            </motion.div>
          )}

          {/* STEP 4: VORTEX HEART VISUAL SETUP & WISH OVERLAY ✨ */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <VortexHeartStudioConfig
                currentLanguage={currentLanguage}
                reasonCategory={reasonCategory}
                customMessage={customWishMessage}
                onChangeCustomMessage={setCustomWishMessage}
                onChangeCategory={setReasonCategory}
                recipientName={recipientName}
                senderName={senderName}
                onSkip={() => {
                  playPaperCrinkleSound();
                  setCurrentStep(5);
                }}
              />
            </motion.div>
          )}

          {/* STEP 5: AI LETTER WRITER */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AiCardWriterStudio
                currentLanguage={currentLanguage}
                senderName={senderName}
                recipientName={recipientName}
                occasion={occasion}
                letterTitle={letterTitle}
                onChangeTitle={setLetterTitle}
                letterContent={letterContent}
                onChangeContent={setLetterContent}
                letterSignature={letterSignature}
                onChangeSignature={setLetterSignature}
                paperStyle={paperStyle}
                onChangePaperStyle={setPaperStyle}
                onSkipModule={() => {
                  playPaperCrinkleSound();
                  setCurrentStep(6);
                }}
              />
            </motion.div>
          )}

          {/* STEP 6: POLAROID SCRAPBOOK STUDIO */}
          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PolaroidScrapbookStudio
                currentLanguage={currentLanguage}
                scrapbookTitle={scrapbookTitle}
                onChangeTitle={setScrapbookTitle}
                pages={pages}
                onChangePages={setPages}
                onSkipModule={() => {
                  playPaperCrinkleSound();
                  setCurrentStep(7);
                }}
              />
            </motion.div>
          )}

          {/* STEP 7: CASSETTE VOICE RECORDER */}
          {currentStep === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CassetteRecorderStudio
                currentLanguage={currentLanguage}
                voiceTitle={voiceTitle}
                onChangeTitle={setVoiceTitle}
                voiceTranscript={voiceTranscript}
                onChangeTranscript={setVoiceTranscript}
                audioData={audioData}
                onChangeAudioData={setAudioData}
                durationSeconds={durationSeconds}
                onChangeDuration={setDurationSeconds}
                onSkipModule={() => {
                  playPaperCrinkleSound();
                  setCurrentStep(8);
                }}
              />
            </motion.div>
          )}

          {/* STEP 8: OCCASION CELEBRATION CAKE STUDIO */}
          {currentStep === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-[#D4AF37]/30 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6239] block">
                  Interactive Core Section
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2D241E] mt-0.5">
                  The Interactive Celebration Vault (Occasion Cake) 🎂
                </h2>
                <p className="text-xs text-[#7A6856] mt-1">
                  Customize a 3D celebration cake. When the recipient opens it, they will blow out the lit candles using their microphone!
                </p>
              </div>

              <OccasionCakeStudio
                currentLanguage={currentLanguage}
                cakeItem={{
                  id: 'studio-cake',
                  type: 'celebration_cake',
                  layer: 2,
                  title: 'Occasion Celebration Cake',
                  payload: {
                    cakeFlavor,
                    cakeOccasion,
                    cakeMessage,
                    candleCount,
                    wishBannerText,
                    wishSecretNote,
                  },
                }}
                recipientName={recipientName || giftTagTo}
                senderName={senderName || giftTagFrom}
                boxOccasion={occasion}
                onUpdate={(updated) => {
                  if (updated.payload.cakeFlavor) setCakeFlavor(updated.payload.cakeFlavor);
                  if (updated.payload.cakeOccasion) setCakeOccasion(updated.payload.cakeOccasion);
                  if (updated.payload.cakeMessage !== undefined) setCakeMessage(updated.payload.cakeMessage);
                  if (updated.payload.candleCount) setCandleCount(updated.payload.candleCount);
                  if (updated.payload.wishBannerText) setWishBannerText(updated.payload.wishBannerText);
                  if (updated.payload.wishSecretNote) setWishSecretNote(updated.payload.wishSecretNote);
                  triggerMirrorSync();
                }}
              />
            </motion.div>
          )}

          {/* STEP 9: TREATS, WRAPPER CRINKLER & TIME CAPSULE */}
          {currentStep === 9 && (
            <motion.div
              key="step-9"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <TreatsAndDelightsStudio
                currentLanguage={currentLanguage}
                treatName={treatName}
                onChangeTreatName={setTreatName}
                treatDesc={treatDesc}
                onChangeTreatDesc={setTreatDesc}
                treatImage={treatImage}
                onChangeTreatImage={setTreatImage}
                insideJokeMessage={insideJokeMessage}
                onChangeInsideJoke={setInsideJokeMessage}
                onSkipModule={() => {
                  playPaperCrinkleSound();
                  setCurrentStep(10);
                }}
              />

              <TimeCapsuleStudio
                currentLanguage={currentLanguage}
                capsuleTitle={timeCapsuleTitle}
                onChangeTitle={setTimeCapsuleTitle}
                capsuleDate={timeCapsuleDate}
                onChangeDate={setTimeCapsuleDate}
                capsuleMessage={timeCapsuleMessage}
                onChangeMessage={setTimeCapsuleMessage}
                recipientName={recipientName}
                onSkipModule={() => {
                  playPaperCrinkleSound();
                  setCurrentStep(10);
                }}
              />
            </motion.div>
          )}

          {/* STEP 10: CUSTOM SOUVENIR & RELATIONSHIP NOTES (MEMORY BUDDY) */}
          {currentStep === 10 && (
            <motion.div
              key="step-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SouvenirAndMemoryBuddyStudio
                currentLanguage={currentLanguage}
                customItemName={customItemName}
                onChangeCustomName={setCustomItemName}
                customItemDesc={customItemDesc}
                onChangeCustomDesc={setCustomItemDesc}
                customItemImage={customItemImage}
                onChangeCustomImage={setCustomItemImage}
                customItemTag={customItemTag}
                onChangeCustomTag={setCustomItemTag}
                relationshipNotes={relationshipNotes}
                onChangeRelationshipNotes={setRelationshipNotes}
                recipientName={recipientName}
                onSkipModule={() => {
                  playPaperCrinkleSound();
                  setCurrentStep(11);
                }}
              />
            </motion.div>
          )}

          {/* STEP 11: 3D GIFT EXPLOSION BOOM BOX STUDIO */}
          {currentStep === 11 && (
            <motion.div
              key="step-11"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GiftExplosionStudio
                currentLanguage={currentLanguage}
                recipientName={recipientName || giftTagTo}
                senderName={senderName || giftTagFrom}
                explosionTitle={explosionTitle}
                onChangeTitle={setExplosionTitle}
                explosionSubtitle={explosionSubtitle}
                onChangeSubtitle={setExplosionSubtitle}
                explosionThemeColor={explosionThemeColor}
                onChangeThemeColor={setExplosionThemeColor}
                explosionBoxPattern={explosionBoxPattern}
                onChangePattern={setExplosionBoxPattern}
                gifts={explosionGifts}
                onChangeGifts={(newGifts) => {
                  setExplosionGifts(newGifts);
                  triggerMirrorSync();
                }}
                onSkip={() => {
                  playPaperCrinkleSound();
                  setCurrentStep(12);
                }}
                onRemoveFromBox={() => {
                  setIncludeExplosionBox(false);
                  setExplosionGifts([]);
                  playPaperCrinkleSound();
                  setCurrentStep(12);
                }}
              />
            </motion.div>
          )}

          {/* STEP 12: THE LAST WHISPERING NOTE (MANDATORY BOTTOM PARCHMENT) */}
          {currentStep === 12 && (
            <motion.div
              key="step-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-[#D4AF37]/30 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8B0000] block">
                  Mandatory Chest Keepsake
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2D241E] mt-0.5">
                  The Last Whispering Note (आखिरी संदेश / आखिरी खत) 📜
                </h2>
                <p className="text-xs text-[#7A6856] mt-1">
                  Placed at the absolute bottom of the chest. It opens with an emotional typewriter keystroke animation for your final farewell or eternal promise.
                </p>
              </div>

              <LastWhisperNoteStudio
                currentLanguage={currentLanguage}
                noteItem={{
                  id: 'studio-last-note',
                  type: 'last_whisper_note',
                  layer: 3,
                  title: lastNoteTitle,
                  payload: {
                    lastNoteTitle,
                    lastNoteParchment,
                    lastNoteSignature,
                  },
                }}
                recipientName={recipientName || giftTagTo}
                senderName={senderName || giftTagFrom}
                boxOccasion={occasion}
                onUpdate={(updated) => {
                  if (updated.payload.lastNoteTitle) setLastNoteTitle(updated.payload.lastNoteTitle);
                  if (updated.payload.lastNoteParchment !== undefined) setLastNoteParchment(updated.payload.lastNoteParchment);
                  if (updated.payload.lastNoteSignature) setLastNoteSignature(updated.payload.lastNoteSignature);
                  triggerMirrorSync();
                }}
              />
            </motion.div>
          )}

          {/* STEP 13: FINAL REVIEW & GOLD WAX SEAL */}
          {currentStep === 13 && (
            <motion.div
              key="step-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 border-b border-[#D4AF37]/30 pb-6">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8C6D37]">
                  Keepsake Masterpiece
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#2D241E]">
                  Ready to Seal Your MemoryBox
                </h2>
                <p className="text-xs text-[#7A6856] max-w-md mx-auto">
                  Review all packed items across 3 layers before stamping your personalized gold wax seal.
                </p>
              </div>

              {/* Summary Bento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/90 border border-stone-200 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#8C6D37]">Layer 1: Treats & Keepsake</span>
                  <p className="text-xs font-bold text-[#2D241E]">{treatName}</p>
                  <p className="text-[11px] text-[#7A6856]">{customItemName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 border border-stone-200 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#8C6D37]">Layer 2: Scrapbook</span>
                  <p className="text-xs font-bold text-[#2D241E]">{scrapbookTitle}</p>
                  <p className="text-[11px] text-[#7A6856]">{pages.length} Polaroid chapter memories</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 border border-stone-200 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#8C6D37]">Layer 3: Core Vault</span>
                  <p className="text-xs font-bold text-[#2D241E]">{letterTitle}</p>
                  <p className="text-[11px] text-[#7A6856]">Voice Note + Time Capsule + AI Companion</p>
                </div>
              </div>

              {/* Emotional Purpose Badge */}
              {reasonWhySpecial && (
                <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#E8D7A6] flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#8B1E2D] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#8C6D37]">
                      Registry Emotional Purpose ({reasonCategory.toUpperCase()}):
                    </span>
                    <p className="text-xs font-serif italic text-[#2D241E] mt-0.5">
                      “{reasonWhySpecial}”
                    </p>
                    {senderPhone && (
                      <p className="text-[10px] text-emerald-700 font-bold mt-1">
                        📱 WhatsApp alert notifications active for: {senderPhone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Wax Seal Initials */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#FAF6EE] border border-[#D4AF37]/40 shadow-xs flex items-center justify-between flex-wrap gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1">
                    Wax Seal Custom Monogram / Initials
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={waxSealInitials}
                    onChange={(e) => setWaxSealInitials(e.target.value)}
                    placeholder={`${(senderName || 'A').charAt(0)} & ${(recipientName || 'B').charAt(0)}`}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-serif font-bold text-[#2D241E]"
                  />
                </div>

                <div className="w-14 h-14 rounded-full bg-[#8B1E2D] border-2 border-[#D4AF37] shadow-md flex items-center justify-center text-white font-serif font-bold text-sm tracking-wider">
                  {waxSealInitials || `${(senderName || 'A').charAt(0)}&${(recipientName || 'B').charAt(0)}`}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

            {/* Bottom Stepper Navigation */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#D4AF37]/30 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      playPaperCrinkleSound();
                      setCurrentStep(currentStep - 1);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-[#5A4634] hover:bg-[#F4EFE6] transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 rounded-xl bg-white/60 text-xs font-bold text-[#7A6856] hover:bg-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {currentStep > 1 && currentStep < 13 && (
                  <button
                    type="button"
                    onClick={() => {
                      playPaperCrinkleSound();
                      setCurrentStep(currentStep + 1);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#8C6D37] hover:text-[#5A4634] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
                    title="Skip this feature and move to next step"
                  >
                    <SkipForward className="w-4 h-4 text-[#B8860B]" />
                    <span>Skip this Feature</span>
                  </button>
                )}

                {currentStep < 13 ? (
                  <button
                    type="button"
                    onClick={() => {
                      playPaperCrinkleSound();
                      setCurrentStep(currentStep + 1);
                    }}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2C1D0F] text-xs font-bold shadow-md hover:brightness-105 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleFinalSubmit}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1E2D] via-[#A32236] to-[#8B1E2D] text-white text-sm font-serif font-bold shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 active:scale-98 border border-[#D4AF37]"
                  >
                    {isSaving ? (
                      <span>Stamping Monogram Wax Seal...</span>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                        <span>Seal & Create Keepsake Box</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE MAGIC MIRROR PREVIEW (DESKTOP DOCKED FRAME) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-5 sticky top-6">
          <MagicMirrorPreview
            data={magicMirrorData}
            isExpanded={isMirrorExpanded}
            onToggleExpand={() => setIsMirrorExpanded(!isMirrorExpanded)}
          />
        </div>
      </div>

      {/* MOBILE FLOATING MIRROR TRIGGER */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsMobileMirrorOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-[#1C1713] to-[#2D241E] text-[#D4AF37] border-2 border-[#D4AF37] shadow-2xl flex items-center gap-2 font-serif text-xs font-bold active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" />
          <span>Magic Mirror Preview</span>
        </button>
      </div>

      {/* MOBILE MODAL OVERLAY */}
      <AnimatePresence>
        {isMobileMirrorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-md max-h-[92vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-2 px-1 text-white">
                <span className="font-serif font-bold text-xs text-[#D4AF37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Magic Mirror Mobile Preview</span>
                </span>
                <button
                  onClick={() => setIsMobileMirrorOpen(false)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto rounded-3xl">
                <MagicMirrorPreview data={magicMirrorData} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
