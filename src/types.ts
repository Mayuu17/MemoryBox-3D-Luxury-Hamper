export type BoxOccasion = 
  | 'anniversary'
  | 'birthday'
  | 'love'
  | 'apology'
  | 'friendship'
  | 'long_distance'
  | 'proposal'
  | 'gratitude'
  | 'custom';

export type EmotionalReasonCategory = BoxOccasion;

export type BoxTheme = 
  | 'royal_velvet_burgundy'
  | 'midnight_sapphire'
  | 'champagne_ivory'
  | 'emerald_elegance'
  | 'rose_quartz'
  | 'vintage_leather';

export type PaperStyle = 'parchment' | 'vintage_linen' | 'rose_petal_pressed' | 'midnight_gold';

export type GiftItemType = 
  | 'letter'
  | 'photo_gallery'
  | 'voice_note'
  | 'scrapbook'
  | 'time_capsule'
  | 'chocolate_truffles'
  | 'scented_candle'
  | 'celebration_cake'
  | 'gift_explosion_box'
  | 'last_whisper_note'
  | 'custom_gift'
  | 'inside_joke'
  | 'memory_buddy';

export interface User {
  id: string;
  name: string;
  email: string;
  initials?: string;
  createdAt: string;
  createdBoxesCount?: number;
}

export interface PhotoMemory {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotation?: number;
}

export interface ScrapbookPage {
  id: string;
  title: string;
  date?: string;
  photoUrl?: string;
  note: string;
  stickers?: string[];
  tapeColor?: string;
}

export interface ExplosionGiftItem {
  id: string;
  title: string;
  category?: 'flower_bouquet' | 'teddy_bear' | 'chocolates' | 'jewelry' | 'custom_photo' | 'perfume' | 'handwritten_note' | 'custom';
  imageUrl: string;
  caption: string;
  tags?: string[];
  reactionEmoji?: string;
}

export interface HamperItemPayload {
  // Letter
  letterTitle?: string;
  letterContent?: string;
  paperStyle?: PaperStyle;
  letterSignature?: string;

  // Photos
  photos?: PhotoMemory[];

  // Voice Note
  audioData?: string;
  durationSeconds?: number;
  voiceNoteTitle?: string;
  transcription?: string;

  // Scrapbook
  scrapbookTitle?: string;
  pages?: ScrapbookPage[];

  // Time Capsule
  unlockDate?: string;
  capsuleTitle?: string;
  capsuleMessage?: string;
  capsuleSecretPhoto?: string;

  // Treats / Treats details
  treatName?: string;
  treatDescription?: string;
  treatImage?: string;

  // Inside Joke / Delights & Teddy
  treatType?: 'chocolate_truffles' | 'teddy_bear' | 'macarons' | 'champagne';
  insideJokeQuestion?: string;
  insideJokeAnswer?: string;
  insideJokeMessage?: string;
  insideJokeSecretReward?: string;

  // Custom Item
  customName?: string;
  customCategory?: string;
  customDescription?: string;
  customImage?: string;
  giftTagMessage?: string;

  // Occasion Celebration Cake (Interactive Vault)
  cakeFlavor?: 'red_velvet' | 'belgian_chocolate' | 'vanilla_rose' | 'vintage_berry' | 'royal_truffle';
  cakeOccasion?: 'birthday' | 'anniversary' | 'love' | 'celebration';
  cakeMessage?: string;
  candleCount?: number;
  wishBannerText?: string;
  wishSecretNote?: string;
  isBlownOut?: boolean;

  // 3D Gift Explosion Boom Box (गिफ्ट ब्लास्ट बॉक्स)
  explosionTitle?: string;
  explosionSubtitle?: string;
  explosionThemeColor?: 'ruby_gold' | 'midnight_purple' | 'champagne_pink' | 'emerald_gold' | 'sapphire_silver';
  explosionBoxPattern?: 'polka_gold' | 'hearts' | 'stripes' | 'vintage_filigree' | 'velvet_ribbon';
  explosionGifts?: ExplosionGiftItem[];
  isExploded?: boolean;

  // The Last Whispering Note (आखिरी संदेश / आखिरी खत)
  lastNoteTitle?: string;
  lastNoteParchment?: string;
  lastNoteSignature?: string;
  lastNoteAudioUrl?: string;
  isLastNoteSealed?: boolean;

  // Memory Buddy context
  promptSuggestions?: string[];
}

export interface HamperItem {
  id: string;
  type: GiftItemType;
  layer: number; // 1 = Top unwrap layer, 2 = Middle sentimental, 3 = Core vault
  title: string;
  subtitle?: string;
  tag?: string;
  iconName?: string;
  isUnwrapped?: boolean;
  lockedUntil?: string; // ISO date for time capsules
  payload: HamperItemPayload;
}

export interface WhatsAppAlert {
  id: string;
  boxId?: string;
  recipientName: string;
  senderPhone?: string;
  triggerPhrase?: string;
  sentiment?: 'reconciliation' | 'appreciation' | 'love' | 'gratitude';
  detectedEmotion?: string;
  snippet?: string;
  message?: string;
  timestamp: string;
  status: 'sent' | 'delivered';
}

export type AmbientMood = 'romantic' | 'nostalgic' | 'joyful' | 'deep_emotional' | 'cozy_candlelight';

export interface SharedTimelineEntry {
  id: string;
  authorName: string;
  authorRole: 'sender' | 'receiver';
  type: 'photo' | 'voice' | 'letter' | 'souvenir' | 'milestone';
  title?: string;
  content: string;
  mediaUrl?: string;
  audioDuration?: number;
  timestamp: string;
  reactions?: string[];
}

export interface HamperBox {
  id: string;
  creatorId?: string;
  creatorEmail?: string;
  title: string;
  recipientName: string;
  senderName: string;
  senderPhone?: string;
  occasion: BoxOccasion;
  theme: BoxTheme;
  reasonWhySpecial?: string;
  reasonCategory?: BoxOccasion;
  customWishMessage?: string;
  secretPassword?: string;
  passwordHint?: string;
  createdAt: string;
  waxSealInitials: string;
  giftTagMessage?: string;
  items: HamperItem[];
  relationshipMemories: string[]; // Private anecdotes for Memory Companion
  sharedTimeline?: SharedTimelineEntry[]; // Co-Creation Together Mode memories added by recipient/sender
  whatsappAlerts?: WhatsAppAlert[];
  customSettings: {
    bgMusicEnabled: boolean;
    rosePetalsEnabled: boolean;
    shreddedPaperColor: 'gold_kraft' | 'rose_cream' | 'midnight_shreds' | 'lavender_frost';
  };
}

export interface PublicBoxMeta {
  id: string;
  creatorId?: string;
  title: string;
  recipientName: string;
  senderName: string;
  senderPhone?: string;
  occasion: BoxOccasion;
  theme: BoxTheme;
  reasonWhySpecial?: string;
  reasonCategory?: BoxOccasion;
  passwordHint?: string;
  waxSealInitials: string;
  giftTagMessage?: string;
  createdAt: string;
  itemCount: number;
  hasPassword?: boolean;
}

export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // Hindi
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'bn' // Bengali
  | 'pa' // Punjabi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'es' // Spanish
  | 'fr' // French
  | 'it' // Italian
  | 'de' // German
  | 'ar' // Arabic
  | 'ja'; // Japanese

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  greetingSample: string;
}

export interface EmotionTranslationResponse {
  language: SupportedLanguage;
  translatedText: string;
  emotionalIdiomExplanation?: string;
  poeticNote?: string;
}
