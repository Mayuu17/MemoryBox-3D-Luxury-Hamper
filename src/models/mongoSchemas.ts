import mongoose, { Schema, Document } from 'mongoose';

/**
 * PRODUCTION-READY MONGOOSE SCHEMAS FOR MEMORYBOX PLATFORM
 * Supports Lifetime Storage of digital hampers, items, multimedia payloads,
 * password hashes, relationship memories for Gemini memory buddy, and creator metadata.
 */

// 1. Scrapbook Page Sub-Schema
export interface IScrapbookPage {
  id: string;
  title: string;
  date?: string;
  photoUrl?: string;
  note: string;
  stickers: string[];
  tapeColor: string;
}

export const ScrapbookPageSchema = new Schema<IScrapbookPage>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String },
  photoUrl: { type: String },
  note: { type: String, required: true },
  stickers: [{ type: String }],
  tapeColor: { type: String, default: '#D4AF37' },
});

// 2. Hamper Item Sub-Schema
export interface IHamperItem {
  id: string;
  type:
    | 'letter'
    | 'photo_gallery'
    | 'voice_note'
    | 'scrapbook'
    | 'time_capsule'
    | 'chocolate_truffles'
    | 'scented_candle'
    | 'custom_gift'
    | 'inside_joke'
    | 'memory_buddy';
  layer: number; // 1 = Top unwrap layer, 2 = Sentimental middle, 3 = Deep vault
  title: string;
  subtitle?: string;
  tag?: string;
  iconName?: string;
  isUnwrapped?: boolean;
  lockedUntil?: Date;
  payload: {
    // Letter
    letterTitle?: string;
    letterContent?: string;
    paperStyle?: string;
    letterSignature?: string;

    // Photos
    photos?: Array<{
      id: string;
      url: string;
      caption: string;
      date?: string;
      rotation?: number;
    }>;

    // Voice Note
    audioData?: string; // Base64 audio/webm or CDN URL
    durationSeconds?: number;
    voiceNoteTitle?: string;
    transcription?: string;

    // Scrapbook
    scrapbookTitle?: string;
    pages?: IScrapbookPage[];

    // Time Capsule
    unlockDate?: Date;
    capsuleTitle?: string;
    capsuleMessage?: string;
    capsuleSecretPhoto?: string;

    // Treats & Delights
    treatName?: string;
    treatDescription?: string;
    treatImage?: string;
    treatType?: string;
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

    // Memory Buddy
    promptSuggestions?: string[];
  };
}

export const HamperItemSchema = new Schema<IHamperItem>({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'letter',
      'photo_gallery',
      'voice_note',
      'scrapbook',
      'time_capsule',
      'chocolate_truffles',
      'scented_candle',
      'custom_gift',
      'inside_joke',
      'memory_buddy',
    ],
    required: true,
  },
  layer: { type: Number, required: true, default: 1, min: 1, max: 3 },
  title: { type: String, required: true },
  subtitle: { type: String },
  tag: { type: String },
  iconName: { type: String },
  isUnwrapped: { type: Boolean, default: false },
  lockedUntil: { type: Date },
  payload: { type: Schema.Types.Mixed, default: {} },
});

// 3. Main Hamper Box Document
export interface IHamperBoxDocument extends Document {
  id: string;
  creatorId?: string;
  creatorEmail?: string;
  title: string;
  recipientName: string;
  senderName: string;
  occasion:
    | 'anniversary'
    | 'birthday'
    | 'love'
    | 'apology'
    | 'friendship'
    | 'long_distance'
    | 'proposal'
    | 'gratitude'
    | 'custom';
  theme: string;
  secretPassword?: string;
  passwordHint?: string;
  waxSealInitials: string;
  giftTagMessage?: string;
  items: IHamperItem[];
  relationshipMemories: string[]; // Fed directly to Gemini AI Memory Buddy
  customSettings: {
    bgMusicEnabled: boolean;
    rosePetalsEnabled: boolean;
    shreddedPaperColor: string;
  };
  viewsCount: number;
  unlockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const HamperBoxSchema = new Schema<IHamperBoxDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    creatorId: { type: String, index: true },
    creatorEmail: { type: String, index: true },
    title: { type: String, required: true, trim: true },
    recipientName: { type: String, required: true, trim: true },
    senderName: { type: String, required: true, trim: true },
    occasion: {
      type: String,
      enum: [
        'anniversary',
        'birthday',
        'love',
        'apology',
        'friendship',
        'long_distance',
        'proposal',
        'gratitude',
        'custom',
      ],
      default: 'love',
    },
    theme: {
      type: String,
      default: 'royal_velvet_burgundy',
    },
    secretPassword: { type: String, trim: true },
    passwordHint: { type: String, trim: true },
    waxSealInitials: { type: String, required: true, default: 'M & B' },
    giftTagMessage: { type: String, trim: true },
    items: [HamperItemSchema],
    relationshipMemories: [{ type: String }],
    customSettings: {
      bgMusicEnabled: { type: Boolean, default: true },
      rosePetalsEnabled: { type: Boolean, default: true },
      shreddedPaperColor: { type: String, default: 'gold_kraft' },
    },
    viewsCount: { type: Number, default: 0 },
    unlockedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// 4. User Schema
export interface IUserDocument extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  initials: string;
  createdBoxes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    initials: { type: String, default: 'MB' },
    createdBoxes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Model exports (with fallback guard for runtime environments)
export const HamperBoxModel =
  mongoose.models.HamperBox || mongoose.model<IHamperBoxDocument>('HamperBox', HamperBoxSchema);

export const UserModel =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
