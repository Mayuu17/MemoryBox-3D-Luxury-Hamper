import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Plus,
  Trash2,
  Mic,
  Feather,
  Camera,
  Music,
  Lock,
  Clock,
  Gift,
  CheckCircle2,
  Scissors,
  Wand2,
  Flame,
  Bot,
  HelpCircle,
  Eye,
  Settings,
  X,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HamperItem, BoxTheme, PaperStyle, SupportedLanguage } from '../types';
import { BOX_THEMES } from '../utils/themes';
import { playPaperCrinkleSound, playPianoNote, playWaxSealCrackSound } from '../utils/audio';

interface DragDropGiftWorkshopProps {
  currentLanguage: SupportedLanguage;
  theme: BoxTheme;
  recipientName: string;
  senderName: string;
  shreddedPaperColor: string;
  items: HamperItem[];
  onAddItem: (item: HamperItem) => void;
  onRemoveItem: (itemId: string) => void;
  onOpenSpeakToWrite: () => void;
  onOpenLetterStudio: () => void;
  onOpenScrapbookStudio: () => void;
  onOpenVoiceStudio: () => void;
  onOpenTreatsStudio: () => void;
  onOpenTimeCapsuleStudio: () => void;
  onOpenMemoryBuddyStudio: () => void;
  onOpenExplosionStudio?: () => void;
  onToggleShreddedPaper: () => void;
  onActionTriggered: (action: 'welcome' | 'bedding' | 'item_dropped' | 'speak_letter' | 'scrapbook' | 'voice' | 'capsule' | 'seal') => void;
}

interface TrayGiftDefinition {
  id: string;
  type: HamperItem['type'];
  name: Record<SupportedLanguage, string>;
  subtitle: Record<SupportedLanguage, string>;
  icon: string;
  visualAssetUrl?: string;
  color: string;
  defaultPayload: any;
  actionKey: 'speak_letter' | 'scrapbook' | 'voice' | 'capsule' | 'item_dropped';
}

const TRAY_GIFTS: TrayGiftDefinition[] = [
  {
    id: 'gift-explosion',
    type: 'gift_explosion_box',
    name: {
      hi: 'गिफ्ट ब्लास्ट बॉक्स (3D Explosion)',
      mr: 'गिफ्ट ब्लास्ट बॉक्स (धमाकेदार सरप्राइज)',
      gu: 'ગિફ્ટ બ્લાસ્ટ બોક્સ (3D સરપ્રાઈઝ)',
      bn: 'গিফট ব্লাস্ট বক্স (3D এক্সপ্লোশন)',
      pa: 'ਗਿਫਟ ਬਲਾਸਟ ਬਾਕਸ (3D ਸਰਪ੍ਰਾਈਜ਼)',
      ta: 'பரிசு வெடிப்பு பெட்டி (Gift Explosion)',
      te: 'గిఫ్ట్ బ్లాస్ట్ బాక్స్ (3D సర్ప్రైజ్)',
      es: 'Caja Explosiva de Regalos 3D',
      fr: 'Boîte Explosion Cadeaux 3D',
      it: 'Scatola Esplosiva di Regali 3D',
      de: '3D Geschenk-Explosionsbox',
      ar: 'صندوق انفجار الهدايا ثلاثي الأبعاد',
      ja: '3D ギフト爆発ボックス',
      en: '3D Gift Explosion Boom Box',
    },
    subtitle: {
      hi: 'टैप करते ही फूल, टेडी, चॉकलेट्स हवा में उड़ेंगे',
      mr: 'टॅप करताच फुले, टेडी, चॉकलेट्स हवेत उडतील',
      gu: 'ટેપ કરતા જ ગુલાબ, ટેડી અને ફોટોઝ ઉડશે',
      bn: 'ট্যাপ করলেই উপহারগুলো বাতাসে উড়বে',
      pa: 'ਟੈਪ ਕਰਦੇ ਹੀ ਤੋਹਫ਼ੇ ਹਵਾ ਵਿੱਚ ਉੱਡਣਗੇ',
      ta: 'தொட்டதும் பரிசுகள் காற்றில் பறக்கும்',
      te: 'ట్యాప్ చేయగానే బహుమతులు గాల్లో ఎగురుతాయి',
      es: '¡Toca la caja y los regalos explotarán con confeti!',
      fr: 'Touchez la boîte pour faire jaillir vos cadeaux',
      it: 'Tocca la scatola per un\'esplosione di sorprese',
      de: 'Beim Antippen explodieren Geschenke & Konfetti',
      ar: 'المس الصندوق لتتفجر الهدايا والورود المبهجة',
      ja: 'タップすると花束やぬいぐるみが宙に飛び出します',
      en: 'Tapping triggers a joyful radial burst of gifts & flowers',
    },
    icon: '💥',
    visualAssetUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    color: 'from-red-800 to-amber-950',
    defaultPayload: {
      explosionTitle: 'A Shower of Love & Surprises (गिफ्ट ब्लास्ट)',
      explosionSubtitle: 'Tap the box to blast every treasure into the air!',
      explosionThemeColor: 'ruby_gold',
      explosionBoxPattern: 'velvet_ribbon',
      explosionGifts: [
        {
          id: 'exp-1',
          title: 'Royal Crimson Roses Bouquet 🌹',
          category: 'flower_bouquet',
          imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
          caption: '50 velvety roses that never wither.',
          tags: ['Eternal Blooms', 'Fragrant Love'],
          reactionEmoji: '🌹',
        },
        {
          id: 'exp-2',
          title: 'Vintage Honey Plush Teddy 🧸',
          category: 'teddy_bear',
          imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
          caption: 'A cuddle buddy for when I am away.',
          tags: ['Cuddle Buddy', 'Soft Warmth'],
          reactionEmoji: '🧸',
        },
      ],
      isExploded: false,
    },
    actionKey: 'item_dropped',
  },
  {
    id: 'gift-chocolates',
    type: 'chocolate_truffles',
    name: {
      hi: 'बेल्जियन डार्क चॉकलेट्स',
      mr: 'बेल्जियन डार्क चॉकलेटांचा बॉक्स',
      gu: 'બેલ્જિયન ડાર્ક ચોકલેટ્સ',
      bn: 'বেলজিয়ান চকোলেট',
      pa: 'ਬੈਲਜੀਅਨ ਚਾਕਲੇਟਸ',
      ta: 'பெல்ஜிய சாக்லேட்',
      te: 'బెల్జియన్ చాక్లెట్లు',
      es: 'Bombones Belgas de Chocolate',
      fr: 'Truffes au Chocolat Belge',
      it: 'Tartufi di Cioccolato Belga',
      de: 'Belgische Schokoladentrüffel',
      ar: 'شوكولاتة بلجيكية فاخرة',
      ja: 'ベルギー産生チョコレート',
      en: 'Belgian Dark Truffles',
    },
    subtitle: {
      hi: 'रिश्ते में मिठास घोलने के लिए',
      mr: 'नात्यात गोडवा भरण्यासाठी',
      gu: 'સંબંધમાં મીઠાશ ઉમેરવા માટે',
      bn: 'সম্পর্কে মিষ্টতা বাড়াতে',
      pa: 'ਰਿਸ਼ਤੇ ਵਿੱਚ ਮਿਠਾਸ ਲਈ',
      ta: 'இனிமையான தருணங்களுக்கு',
      te: 'మధురమైన క్షణాల కోసం',
      es: 'Para endulzar su corazón',
      fr: 'Une touche de douceur fondante',
      it: 'Per addolcire la giornata',
      de: 'Für süße Momente zu zweit',
      ar: 'لإضفاء لمسة من الحلاوة',
      ja: '二人の甘いひとときに',
      en: 'Rich artisan cocoa dusted with hazelnut praline',
    },
    icon: '🍫',
    visualAssetUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
    color: 'from-amber-800 to-yellow-950',
    defaultPayload: {
      treatName: 'Artisanal Belgian Dark Truffles',
      treatDesc: 'Handcrafted cocoa truffles dusted with roasted hazelnut praline',
      insideJoke: 'Remember that dessert we couldn\'t stop giggling over?',
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
    },
    actionKey: 'item_dropped',
  },
  {
    id: 'gift-bouquet',
    type: 'custom_gift',
    name: {
      hi: 'ताजे लाल गुलाबों का गुलदस्ता',
      mr: 'ताज्या लाल गुलाबांचा गुच्छ',
      gu: 'તાજા લાલ ગુલાબનો ગુલદસ્તો',
      bn: 'তাজা লাল গোলাপের তোড়া',
      pa: 'ਤਾਜ਼ੇ ਲਾਲ ਗੁਲਾਬਾਂ ਦਾ ਗੁਲਦਸਤਾ',
      ta: 'சிவப்பு ரோஜா கொத்து',
      te: 'ఎరుపు గులాబీల గుత్తి',
      es: 'Ramo de Rosas Carmesí',
      fr: 'Bouquet de Roses Rouges Fraîches',
      it: 'Bouquet di Rose Rosse Fresche',
      de: 'Frischer Roter Rosenstrauß',
      ar: 'باقة ورود حمراء نضرة',
      ja: '真紅のフレッシュローズブーケ',
      en: 'Fresh Crimson Rose Bouquet',
    },
    subtitle: {
      hi: 'ताजगी और अटूट प्यार की खुशबू',
      mr: 'सुवासिक आणि अविरत प्रेमाची भेट',
      gu: 'પ્રેમની તાજગી ફેલાવવા માટે',
      bn: 'চিরন্তন প্রেমের সুবাস',
      pa: 'ਤਾਜ਼ਗੀ ਅਤੇ ਸੱਚੇ ਪਿਆਰ ਦਾ ਪ੍ਰਤੀਕ',
      ta: 'அழகான ரோஜா மலர்கள்',
      te: 'తాజా సువాసనల కోసం',
      es: 'Flores aromáticas recién cortadas',
      fr: 'Le parfum doux de la passion',
      it: 'Petali vellutati e profumati',
      de: 'Echte samtige Rosenknospen',
      ar: 'عبير رومانسي خلاب',
      ja: 'みずみずしい薔薇の香り',
      en: 'Hand-picked blooming velvety crimson roses',
    },
    icon: '🌹',
    visualAssetUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    color: 'from-rose-800 to-red-950',
    defaultPayload: {
      customName: 'Lush Crimson Velvet Roses',
      customDescription: 'A timeless arrangement of fresh-cut blooming velvety roses tied in gold satin ribbon.',
      customImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
      giftTagMessage: 'Because every flower pales compared to you.',
    },
    actionKey: 'item_dropped',
  },
  {
    id: 'gift-letter',
    type: 'letter',
    name: {
      hi: 'प्यार भरा खत (बोलकर लिखें)',
      mr: 'हस्तलिखित प्रेमपत्र (बोलून लिहा)',
      gu: 'દિલનો પત્ર (બોલીને લખો)',
      bn: 'প্রেমপত্র (মুখে বলে লিখুন)',
      pa: 'ਪਿਆਰ ਦਾ ਖ਼ਤ (ਬੋਲ ਕੇ ਲਿਖੋ)',
      ta: 'காதல் கடிதம் (பேசி எழுதுங்கள்)',
      te: 'ప్రేమలేఖ (మాట్లాడి రాయండి)',
      es: 'Carta de Amor en Pergamino',
      fr: 'Lettre d\'Amour Manuscrite',
      it: 'Lettera d\'Amore su Pergamena',
      de: 'Handgeschriebener Liebesbrief',
      ar: 'رسالة حب مكتوبة بخط اليد',
      ja: '羊皮紙のラブレター',
      en: 'Scroll Parchment Letter',
    },
    subtitle: {
      hi: 'माइक दबाएं और बोलें, AI सुंदर खत लिखेगा',
      mr: 'माइक दाबा आणि बोला, AI सुंदर पत्र लिहील',
      gu: 'માઈક દબાવો અને બોલો, AI પત્ર લખશે',
      bn: 'মাইক চেপে কথা বলুন, AI চিঠি লিখবে',
      pa: 'ਮਾਈਕ ਦਬਾਓ ਤੇ ਬੋਲੋ, AI ਖ਼ਤ ਲਿਖੇਗਾ',
      ta: 'மைக்கை அழுத்தி தமிழில் பேசவும்',
      te: 'మైక్ నొక్కి మాట్లాడండి, AI రాస్తుంది',
      es: 'Habla y la IA escribirá una carta poética',
      fr: 'Dictez vos mots doux avec l\'IA',
      it: 'Parla e l\'IA scriverà la tua lettera',
      de: 'Sprich ins Mikrofon für Poesie',
      ar: 'تحدث وسيصيغ الذكاء الاصطناعي رسالتك',
      ja: 'マイクで話してAIが手紙を作成',
      en: 'Speak naturally to generate cursive letter',
    },
    icon: '📜',
    color: 'from-amber-700 to-orange-900',
    defaultPayload: {
      letterTitle: 'To the Light of My Life',
      letterContent: 'Every single second with you is a memory I keep safe in my heart. Thank you for being my constant sunshine and my truest comfort.',
      letterSignature: 'Yours Always',
      paperStyle: 'rose_petal_pressed',
    },
    actionKey: 'speak_letter',
  },
  {
    id: 'gift-scrapbook',
    type: 'scrapbook',
    name: {
      hi: 'तस्वीरों वाली पोलरॉइड डायरी',
      mr: 'पोलरॉइड फोटो स्क्रॅपबुक',
      gu: 'પોલેરોઇડ ફોટો સ્ક્રૅપબુક',
      bn: 'ছবি দিয়ে সাজানো স্ক্র্যাপবুক',
      pa: 'ਫ਼ੋਟੋਆਂ ਵਾਲੀ ਸਕ੍ਰੈਪਬੁੱਕ',
      ta: 'புகைப்பட நினைவுகள் புத்தகம்',
      te: 'ఫోటోల జ్ఞాపకాల ఆల్బమ్',
      es: 'Álbum Polaroid de Recuerdos',
      fr: 'Scrapbook de Photos Polaroid',
      it: 'Scrapbook di Foto Polaroid',
      de: 'Polaroid-Fotoalbum',
      ar: 'ألبوم صور بولارويد للذكريات',
      ja: 'ポラロイド写真スクラップブック',
      en: 'Polaroid Scrapbook Album',
    },
    subtitle: {
      hi: 'फोन गैलरी से 1-टैप फोटो लगाएं',
      mr: 'फोन गॅलरीतून थेट फोटो जोडा',
      gu: 'ફોટો આલ્બમ અને ખાસ ક્ષણો',
      bn: 'মোবাইল গ্যালারি থেকে ছবি যুক্ত করুন',
      pa: 'ਫ਼ੋਨ ਗੈਲਰੀ ਚੋਂ ਫ਼ੋਟੋਆਂ ਚੁਣੋ',
      ta: 'போட்டோக்களை எளிதாக சேர்க்கவும்',
      te: 'మీ ఫోన్ నుండి ఫోటోలను జోడించండి',
      es: 'Sube fotos directamente de tu galería',
      fr: 'Importez vos photos depuis la galerie',
      it: 'Aggiungi foto dalla tua galleria',
      de: 'Fotos direkt aus der Galerie einfügen',
      ar: 'أضف الصور مباشرة من هاتفك',
      ja: 'スマホのギャラリーから写真を貼る',
      en: 'Pick snapshots directly from camera roll',
    },
    icon: '📸',
    color: 'from-purple-800 to-indigo-950',
    defaultPayload: {
      scrapbookTitle: 'Our Cherished Chapters',
      pages: [
        {
          id: 'p1',
          title: 'Where It All Began',
          date: 'Day One',
          photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
          note: 'The very moment time stopped and we knew our lives had changed forever.',
          stickers: ['✨', '❤️'],
          tapeColor: '#D4AF37',
        },
      ],
    },
    actionKey: 'scrapbook',
  },
  {
    id: 'gift-voice',
    type: 'voice_note',
    name: {
      hi: 'विंटेज कैसेट आवाज (Voice Note)',
      mr: 'विंटेज कॅसेट व्हॉईस नोट',
      gu: 'વિંટેજ કૅસેટ વૉઇસ નોટ',
      bn: 'ভয়েস রেকর্ড ক্যাসেট',
      pa: 'ਵਿੰਟੇਜ ਕੈਸੇਟ ਵੌਇਸ ਨੋਟ',
      ta: 'விண்டேஜ் குரல் பதிவு',
      te: 'వాయిస్ మెసేజ్ క్యాసెట్',
      es: 'Nota de Voz en Casete Retro',
      fr: 'Note Vocale sur Cassette Vintage',
      it: 'Messaggio Vocale su Cassetta Vintage',
      de: 'Vintage-Kassetten-Sprachnachricht',
      ar: 'تسجيل صوتي على شريط كاسيت كلاسيكي',
      ja: 'ヴィンテージカセットの音声メッセージ',
      en: 'Vintage Cassette Voice Note',
    },
    subtitle: {
      hi: 'अपनी असली आवाज 60 सेकंड में रिकॉर्ड करें',
      mr: 'तुमचा खरा आवाज ६० सेकंदात रेकॉर्ड करा',
      gu: 'તમારો અસલી અવાજ રેકોર્ડ કરો (૬૦ સેકન્ડ)',
      bn: '৬০ সেকেন্ডে নিজের কণ্ঠে কথা রেকর্ড করুন',
      pa: 'ਆਪਣੀ ਅਸਲ ਆਵਾਜ਼ ਰਿਕਾਰਡ ਕਰੋ',
      ta: 'உங்கள் குரலை 60 வினாடிகளில் பதிவு செய்யுங்கள்',
      te: 'మీ గొంతును 60 సెకన్లలో రికార్డ్ చేయండి',
      es: 'Graba tu voz real hasta 60 segundos',
      fr: 'Enregistrez votre vraie voix (max 60s)',
      it: 'Registra la tua vera voce (max 60s)',
      de: 'Nimm deine echte Stimme auf (max 60s)',
      ar: 'سجل صوتك الحقيقي حتى 60 ثانية',
      ja: 'あなたの本物の声を60秒で録音',
      en: 'Record your real heartbeat voice (max 60s)',
    },
    icon: '🎙️',
    color: 'from-rose-800 to-pink-950',
    defaultPayload: {
      voiceNoteTitle: 'A Whisper for You',
      durationSeconds: 45,
      transcription: 'A heartfelt spoken recording directly from my soul to yours.',
    },
    actionKey: 'voice',
  },
  {
    id: 'gift-balloons',
    type: 'custom_gift',
    name: {
      hi: 'उड़ते हुए दिल के गुब्बारे',
      mr: 'हवेतील गुलाबाचे फुगे',
      gu: 'હાર્ટ બલૂન ડેકોરેશન',
      bn: 'ভাসমান হৃদপিণ্ড বেলুন',
      pa: 'ਦਿਲ ਦੇ ਆਕਾਰ ਦੇ ਗੁਬਾਰੇ',
      ta: 'இதய வடிவ பலூன்கள்',
      te: 'తేలియాడే హార్ట్ బెలూన్లు',
      es: 'Globos Flotantes de Corazón',
      fr: 'Ballons Cœur Flottants',
      it: 'Palloncini a Cuore Fluttuanti',
      de: 'Schwebende Herzballons',
      ar: 'بالونات قلب هوائية طافية',
      ja: '浮かぶハートのバルーン',
      en: 'Floating Heart Helium Balloons',
    },
    subtitle: {
      hi: 'डिब्बा खोलते ही ऊपर उड़ने वाली खुशी',
      mr: 'बॉक्स उघडताच हवेत उडणारे फुगे',
      gu: 'જાદુઈ ક્ષણો અને ઉજવણી',
      bn: 'বক্স খুললেই আনন্দময় বিস্ময়',
      pa: 'ਖੋਲ੍ਹਦੇ ਹੀ ਉੱਡਣ ਵਾਲੇ ਖੁਸ਼ੀ ਦੇ ਗੁਬਾਰੇ',
      ta: 'மகிழ்ச்சியான தருணங்கள்',
      te: 'ఆనందకరమైన వేడుక',
      es: 'Sorpresa festiva al abrir la caja',
      fr: 'Une envolée de bonheur doré',
      it: 'Soffici palloncini celebrativi',
      de: 'Festliche schwebende Überraschung',
      ar: 'مفاجأة مبهجة ترتفع في الهواء',
      ja: '開けた瞬間に浮かび上がるサプライズ',
      en: 'Gleaming floating balloons with golden strings',
    },
    icon: '🎈',
    visualAssetUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
    color: 'from-pink-600 to-rose-900',
    defaultPayload: {
      customName: 'Floating Heart Helium Balloons',
      customDescription: 'Shimmering pastel heart balloons that float upwards with celebration ribbons when the keepsake box unlocks.',
      customImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
      giftTagMessage: 'May your spirit always soar as high as these balloons.',
    },
    actionKey: 'item_dropped',
  },
  {
    id: 'gift-candle',
    type: 'scented_candle',
    name: {
      hi: 'महकती वैनिला मोमबत्ती',
      mr: 'सुवासिक वॅनिला मेणबत्ती',
      gu: 'સુગંધિત સોય મીણબત્તી',
      bn: 'সুগন্ধি মোমবাতি',
      pa: 'ਸੁਗੰਧਿਤ ਮੋਮਬੱਤੀ',
      ta: 'நறுமண மெழுகுவர்த்தி',
      te: 'సువాసన కొవ్వొత్తి',
      es: 'Vela Aromática de Vainilla Francesa',
      fr: 'Bougie Parfumée Vanille & Ambre',
      it: 'Candela Profumata alla Vaniglia',
      de: 'Duftkerze mit Holzdocht',
      ar: 'شمعة فانيليا فرنسية عطرية',
      ja: 'フレンチバニラのアロマキャンドル',
      en: 'Amber Vanilla Soy Candle',
    },
    subtitle: {
      hi: 'लकड़ी की आवाज के साथ जलने वाली मोमबत्ती',
      mr: 'लाकडी वातीच्या आवाजासह शांत करणारी',
      gu: 'રૂમમાં સુખદ સુગંધ ફેલાવતી',
      bn: 'ঘরের মধ্যে স্নিগ্ধ সুবাস ছড়ায়',
      pa: 'ਕੁਦਰਤੀ ਸੁਗੰਧ ਅਤੇ ਨਿੱਘ',
      ta: 'அமைதியான நறுமணம்',
      te: 'ప్రశాంతమైన సువాసన',
      es: 'Con mecha de madera que crepita',
      fr: 'Mèche en bois qui crépite doucement',
      it: 'Fiamma calda e cera di soia naturale',
      de: 'Sanftes Knistern aus Bienenwachs',
      ar: 'شعلة هادئة ورائحة دافئة تريح الروح',
      ja: 'パチパチと音がする木製芯のアロマ',
      en: 'Crackling wooden wick with warm amber notes',
    },
    icon: '🕯️',
    visualAssetUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
    color: 'from-orange-800 to-amber-950',
    defaultPayload: {
      customName: 'Candlelight Serenade',
      customCategory: 'Aromatherapy',
      customDescription: 'Warm French vanilla, spiced cinnamon bark, and smoked amber notes with wooden crackling wick.',
      customImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
      giftTagMessage: 'Light this whenever you need a warm embrace.',
    },
    actionKey: 'item_dropped',
  },
  {
    id: 'gift-capsule',
    type: 'time_capsule',
    name: {
      hi: 'भविष्य की तारीख का गुप्त लॉकर (Time Capsule)',
      mr: 'भविष्यातील तारखेचा सीलबंद लॉकर',
      gu: 'ભવિષ્યની તારીખનો ટાઈમ કેપ્સ્યુલ',
      bn: 'ভবিষ্যতের জন্য সিল করা টাইম ক্যাপসুল',
      pa: 'ਭਵਿੱਖ ਦੀ ਤਾਰੀਖ਼ ਦਾ ਖ਼ੁਫ਼ੀਆ ਲਾਕਰ',
      ta: 'எதிர்கால ரகசிய பெட்டகம்',
      te: 'టైమ్ క్యాప్సూల్ లాకర్',
      es: 'Cápsula del Tiempo con Candado de Fecha',
      fr: 'Capsule Temporelle Verrouillée',
      it: 'Capsula del Tempo con Lucchetto a Data',
      de: 'Versiegelte Zeitkapsel für die Zukunft',
      ar: 'كبسولة زمنية مقفلة لتاريخ مستقبلي',
      ja: '未来の記念日に開くタイムカプセル',
      en: 'Future Milestone Time Capsule',
    },
    subtitle: {
      hi: 'आने वाली सालगिरह या जन्मदिन पर ही खुलेगा',
      mr: 'पुढील वाढदिवस किंवा ॲनिव्हर्सरीला उघडेल',
      gu: 'આવતી એનિવર્સરી કે બર્થડે પર અનલોક થશે',
      bn: 'নির্দিষ্ট তারিখের আগে খোলা যাবে না',
      pa: 'ਖ਼ਾਸ ਦਿਨ ਤੇ ਹੀ ਤਾਲਾ ਖੁੱਲ੍ਹੇਗਾ',
      ta: 'குறிப்பிட்ட நாளில் மட்டுமே திறக்கும்',
      te: 'ఆ నిర్దిష్ట తేదీన మాత్రమే తెరుచుకుంటుంది',
      es: 'Se desbloqueará solo en esa fecha especial',
      fr: 'Verrouillé jusqu\'à votre anniversaire',
      it: 'Si aprirà solo nel giorno stabilito',
      de: 'Öffnet sich erst an eurem Meilenstein-Tag',
      ar: 'يفتح تلقائياً في التاريخ المحدد للاحتفال',
      ja: '指定した特別な記念日になるまで鍵がかかります',
      en: 'Locks secret message until exact future date',
    },
    icon: '⏳',
    color: 'from-amber-800 to-zinc-900',
    defaultPayload: {
      capsuleTitle: 'Secret Milestone Promise',
      unlockDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      capsuleMessage: 'No matter what changes around us, our bond will only grow stronger with each passing sunrise.',
    },
    actionKey: 'capsule',
  },
  {
    id: 'gift-custom-souvenir',
    type: 'custom_gift',
    name: {
      hi: '“मेरा अपना आइडिया” कस्टम यादगार (Custom Souvenir)',
      mr: '“माझी स्वतःची कल्पना” खास भेट',
      gu: '“મારો પોતાનો વિચાર” કસ્ટમ સોવેનિયર',
      bn: '“আমার নিজস্ব চিন্তা” কাস্টম উপহার',
      pa: '“ਮੇਰਾ ਆਪਣਾ ਵਿਚਾਰ” ਯਾਦਗਾਰੀ ਤੋਹਫ਼ਾ',
      ta: '“எனது சொந்த யோசனை” தனிப்பயன் பரிசு',
      te: '“నా స్వంత ఆలోచన” ప్రత్యేక బహుమతి',
      es: '“Mi Propia Idea” Recuerdo Personalizado',
      fr: '“Mon Idée Personnalisée” Souvenir Unique',
      it: '“La Mia Idea” Souvenir Personalizzato',
      de: '“Meine eigene Idee” Personalisiertes Andenken',
      ar: '“فكرتي الخاصة” تذكار مخصص وفريد',
      ja: '「自分だけのアイデア」特注記念品バッジ',
      en: '“My Own Idea” Custom Souvenir Badge',
    },
    subtitle: {
      hi: 'अपनी पसंद का कोई भी यादगार तोहफा जोड़ें',
      mr: 'तुमच्या आवडीची कोणतीही खास वस्तू जोडा',
      gu: 'તમારી પસંદગીની કોઈપણ ખાસ ભેટ ઉમેરો',
      bn: 'আপনার মনের মতো যে কোনো উপহার সাজান',
      pa: 'ਆਪਣੀ ਪਸੰਦ ਦਾ ਤੋਹਫ਼ਾ ਸ਼ਾਮਲ ਕਰੋ',
      ta: 'உங்கள் விருப்பப்படி எந்த பரிசையும் சேர்க்கலாம்',
      te: 'మీకు నచ్చిన బహుమతిని సులభంగా తయారు చేయండి',
      es: 'Inventa cualquier regalo único o promesa',
      fr: 'Ajoutez n\'importe quel objet sentimental',
      it: 'Crea un souvenir su misura per voi due',
      de: 'Erfinde ein ganz eigenes magisches Andenken',
      ar: 'أضف أي هدية مخصصة أو وعد من القلب',
      ja: '二人の思い出の品やオリジナルの誓いを追加',
      en: 'Invent your own custom keepsake or token',
    },
    icon: '✨',
    visualAssetUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    color: 'from-amber-600 to-yellow-800',
    defaultPayload: {
      customName: 'Our Midnight Stargazing Ticket',
      customCategory: 'Personal Token',
      customDescription: 'A handcrafted golden voucher for a lifetime of late night drives, warm coffees, and uninterrupted listening.',
      customImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      giftTagMessage: 'Valid anytime, anywhere, with no expiry date.',
    },
    actionKey: 'item_dropped',
  },
  {
    id: 'gift-memory-buddy',
    type: 'memory_buddy',
    name: {
      hi: 'मेमोरी बडी (AI दोस्त)',
      mr: 'मेमरी बडी (तुमचा AI मित्र)',
      gu: 'મેમરી બડી (AI યાદ સાથી)',
      bn: 'মেমোরি বাডি (AI বন্ধু)',
      pa: 'ਮੈਮਰੀ ਬੱਡੀ (AI ਸਾਥੀ)',
      ta: 'நினைவுத் தோழன் (AI பாட்)',
      te: 'మెమరీ బడ్డీ (AI స్నేహితుడు)',
      es: 'Guardián AI de Recuerdos',
      fr: 'Gardien IA de la Boîte',
      it: 'Custode AI dei Ricordi',
      de: 'Intimer AI-Erinnerungsbegleiter',
      ar: 'رفيق الذكريات الذكي داخل الصندوق',
      ja: '二人の思い出を覚えているAIバディ',
      en: 'AI Memory Companion Living in Box',
    },
    subtitle: {
      hi: 'डिब्बे में रहने वाला आपका प्यारा AI साथी',
      mr: 'बॉक्समध्ये राहणारा तुमचा वैयक्तिक AI मित्र',
      gu: 'બોક્સમાં રહેતો તમારો AI સાથી',
      bn: 'বক্সের ভেতর থাকা আপনার AI সাথী',
      pa: 'ਤੁਹਾਡੀਆਂ ਯਾਦਾਂ ਨੂੰ ਜਾਣਨ ਵਾਲਾ AI',
      ta: 'பெட்டியில் இருக்கும் உங்கள் AI நண்பன்',
      te: 'పెట్టెలో ఉండే మీ AI స్నేహితుడు',
      es: 'Habla con tus recuerdos dentro de la caja',
      fr: 'Le gardien interactif de vos histoires',
      it: 'Un custode interattivo per la vostra storia',
      de: 'Kennt alle eure gemeinsamen Anekdoten',
      ar: 'يتحدث بذكرياتكم وأسراركم الجميلة',
      ja: '二人の思い出を覚えているAI執事',
      en: 'Interactive companion trained on relationship memories',
    },
    icon: '🤖',
    color: 'from-teal-800 to-emerald-950',
    defaultPayload: {
      name: 'Memory Buddy Keepsake Pin',
      shortTag: 'AI Memory Companion',
      description: 'Your intimate AI companion living inside this box, ready to reminisce 24/7.',
    },
    actionKey: 'item_dropped',
  },
];

export const DragDropGiftWorkshop: React.FC<DragDropGiftWorkshopProps> = ({
  currentLanguage,
  theme,
  recipientName,
  senderName,
  shreddedPaperColor,
  items,
  onAddItem,
  onRemoveItem,
  onOpenSpeakToWrite,
  onOpenLetterStudio,
  onOpenScrapbookStudio,
  onOpenVoiceStudio,
  onOpenTreatsStudio,
  onOpenTimeCapsuleStudio,
  onOpenMemoryBuddyStudio,
  onOpenExplosionStudio,
  onToggleShreddedPaper,
  onActionTriggered,
}) => {
  const [isDragOverBox, setIsDragOverBox] = useState<boolean>(false);
  const [justPackedItemId, setJustPackedItemId] = useState<string | null>(null);
  const [is3dExpanded, setIs3dExpanded] = useState<boolean>(true);

  const themeConfig = BOX_THEMES[theme] || BOX_THEMES.royal_velvet_burgundy;

  const handleDragStart = (e: React.DragEvent, gift: TrayGiftDefinition) => {
    e.dataTransfer.setData('application/json', JSON.stringify(gift));
    playPianoNote(392.0, 0.2, 0.05);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragOverBox) setIsDragOverBox(true);
  };

  const handleDragLeave = () => {
    setIsDragOverBox(false);
  };

  const packGiftIntoBox = (gift: TrayGiftDefinition) => {
    setIsDragOverBox(false);
    playPaperCrinkleSound();
    playPianoNote(523.25, 0.4, 0.12);

    const newItem: HamperItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: gift.type,
      title: gift.name[currentLanguage] || gift.name.en,
      subtitle: gift.subtitle[currentLanguage] || gift.subtitle.en,
      layer: items.length < 3 ? 1 : items.length < 6 ? 2 : 3,
      iconName: gift.icon,
      isUnwrapped: false,
      payload: gift.defaultPayload,
    };

    onAddItem(newItem);
    setJustPackedItemId(newItem.id);
    setTimeout(() => setJustPackedItemId(null), 1200);

    onActionTriggered(gift.actionKey);

    confetti({
      particleCount: 24,
      spread: 60,
      origin: { y: 0.45 },
      colors: ['#D4AF37', '#E8B4B8', '#FAF7EE', '#C5A059'],
    });
  };

  const handleDropOnBox = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverBox(false);
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const gift = JSON.parse(dataStr) as TrayGiftDefinition;
        packGiftIntoBox(gift);
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleItemClick = (item: HamperItem) => {
    playPianoNote(440, 0.3, 0.08);
    if (item.type === 'letter') onOpenLetterStudio();
    else if (item.type === 'scrapbook') onOpenScrapbookStudio();
    else if (item.type === 'voice_note') onOpenVoiceStudio();
    else if (item.type === 'gift_explosion_box') {
      if (onOpenExplosionStudio) onOpenExplosionStudio();
    }
    else if (item.type === 'chocolate_truffles' || item.type === 'inside_joke') onOpenTreatsStudio();
    else if (item.type === 'time_capsule') onOpenTimeCapsuleStudio();
    else onOpenMemoryBuddyStudio();
  };

  return (
    <div className="w-full space-y-6">
      {/* ---------------------------------------------------- */}
      {/* UPPER SECTION: 3D LUXURY KEEPSAKE CHEST VAULT VIEW */}
      {/* ---------------------------------------------------- */}
      <div className="relative w-full bg-gradient-to-b from-[#1F1915] via-[#2B231D] to-[#17120F] border-2 border-[#D4AF37]/50 rounded-3xl p-6 shadow-2xl overflow-hidden text-stone-200">
        {/* Floating Rose Petals & Sparkle Ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-4 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-4 right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl" />
        </div>

        {/* Box Top Header Bar */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#E5C158] flex items-center gap-2 shadow-inner">
              <Gift className="w-4 h-4 text-[#D4AF37]" />
              <span>3D Luxury Keepsake Vault ({items.length} Gifts Packed)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Shredded Bedding paper toggle */}
            <button
              type="button"
              onClick={() => {
                playPaperCrinkleSound();
                onToggleShreddedPaper();
                onActionTriggered('bedding');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-[#D4AF37]/40 text-[#E5C158] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Toggle Silk Cushion Paper Bedding"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Crinkled Paper Bedding</span>
            </button>
          </div>
        </div>

        {/* 3D Perspective Keepsake Chest Container / Drop Target */}
        <div
          style={{ perspective: '1200px' }}
          className="w-full flex justify-center py-2"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDropOnBox}
            style={{
              transform: is3dExpanded ? 'rotateX(8deg)' : 'none',
              transformStyle: 'preserve-3d',
              boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.6), 0 20px 40px rgba(0,0,0,0.4)',
            }}
            className={`relative w-full min-h-[320px] md:min-h-[360px] rounded-3xl border-4 transition-all duration-300 flex flex-col justify-between p-6 ${
              isDragOverBox
                ? 'border-emerald-400 bg-emerald-950/50 ring-8 ring-emerald-400/20 scale-[1.01]'
                : 'border-[#D4AF37]/70 bg-gradient-to-b from-[#2E251E] via-[#241C16] to-[#191410]'
            }`}
          >
            {/* Box Inner Bedding: Shredded Paper Shavings & Velvet Texture */}
            {shreddedPaperColor && (
              <div className="absolute inset-2 pointer-events-none opacity-30 overflow-hidden flex flex-wrap gap-2 p-2">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${Math.floor((i % 7) * 8 + 16)}px`,
                      backgroundColor:
                        shreddedPaperColor === 'rose_cream'
                          ? '#E8B4B8'
                          : shreddedPaperColor === 'midnight_shreds'
                          ? '#1A181B'
                          : shreddedPaperColor === 'lavender_frost'
                          ? '#CDB4DB'
                          : '#D4AF37',
                      transform: `rotate(${(i * 37) % 180}deg) translate(${((i * 13) % 15) - 7}px)`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Box Rim Gold Ribbon Trim */}
            <div className="absolute -top-1.5 left-10 right-10 h-2.5 bg-gradient-to-r from-[#8B6508] via-[#F3E5AB] to-[#8B6508] rounded-full shadow-md opacity-90" />

            {/* Calligraphy Recipient Tag on Corner */}
            <div className="absolute -top-3.5 right-6 bg-[#FAF3E0] border-2 border-[#D4AF37] shadow-xl px-4 py-1.5 rounded-xl transform rotate-2 z-20 flex items-center gap-1.5">
              <span className="text-[10px] text-[#8C6D37] uppercase font-bold tracking-wider">To:</span>
              <span className="text-xs font-serif font-bold text-[#4A2E18]">
                {recipientName || 'My Beloved'}
              </span>
            </div>

            {/* Empty State vs Packed Gifts Grid with 3D Depth */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-3xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-4xl mb-3 shadow-inner"
                >
                  🎁
                </motion.div>
                <h4 className="text-lg font-serif font-bold text-[#F3E5AB]">
                  The Vault Is Ready to Be Filled
                </h4>
                <p className="text-xs text-stone-300 max-w-md mt-1 leading-relaxed">
                  Drag and drop items from the gift tray below—<strong>Fresh Velvet Roses, Artisan Chocolates, Scroll Letters, or Voice Tapes</strong>—or click <em>"Add to Box"</em> directly!
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs font-bold text-[#E5C158]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Interactive 3D Gift Stacking Activated</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 relative z-10 my-auto py-2">
                <AnimatePresence>
                  {items.map((item) => {
                    const isJustPacked = justPackedItemId === item.id;
                    const matchingTray = TRAY_GIFTS.find((g) => g.type === item.type);

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ scale: 0.6, y: -25, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                        className={`relative group bg-[#382D24]/90 hover:bg-[#43362B] border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-2xl p-3.5 shadow-lg transition-all cursor-pointer ${
                          isJustPacked ? 'ring-4 ring-[#D4AF37] scale-105' : ''
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        {/* Explicit Skip / Remove from Box Overlay Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playPaperCrinkleSound();
                            onRemoveItem(item.id);
                          }}
                          className="absolute -top-2.5 -right-2.5 px-2 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-md z-30 opacity-90 hover:opacity-100 transition-all cursor-pointer"
                          title="Skip / Remove from Box"
                        >
                          <X className="w-3 h-3" />
                          <span>Skip</span>
                        </button>

                        {/* Item Visual Asset or Icon */}
                        {matchingTray?.visualAssetUrl ? (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2 border border-[#D4AF37]/40 shadow-xs group-hover:scale-105 transition-transform">
                            <img
                              src={matchingTray.visualAssetUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-0.5 right-0.5 text-xs">
                              {item.iconName || matchingTray.icon}
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-black/40 border border-[#D4AF37]/40 flex items-center justify-center text-2xl mx-auto shadow-inner group-hover:scale-110 transition-transform mb-2">
                            {item.iconName || '🎁'}
                          </div>
                        )}

                        {/* Item Title & Subtitle */}
                        <div className="text-center">
                          <p className="text-xs font-serif font-bold text-[#F3E5AB] truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-stone-300 truncate mt-0.5">
                            {item.subtitle || 'Keepsake Item'}
                          </p>
                        </div>

                        {/* Edit & Customize Hint */}
                        <div className="mt-2 pt-1.5 border-t border-stone-600/60 flex items-center justify-between text-[9px] text-stone-400 group-hover:text-[#D4AF37]">
                          <span className="flex items-center gap-1">
                            <Settings className="w-2.5 h-2.5" />
                            <span>Customize</span>
                          </span>
                          <span className="text-rose-400 hover:underline">
                            Remove
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Box Bottom Info Ribbon */}
            <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/30 text-[11px] text-[#E5C158] relative z-10">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Theme: {themeConfig.name}</span>
              </span>
              <span className="font-serif italic font-bold text-stone-300">
                ~ Handcrafted by {senderName || 'Sender'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* BOTTOM SECTION: INTERACTIVE LUXURY GIFT TRAY */}
      {/* ---------------------------------------------------- */}
      <div className="w-full bg-[#FFFDF9] border border-[#D4AF37]/40 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm md:text-base font-serif font-bold text-[#2D241E] flex items-center gap-2">
              <span>💎</span>
              <span>Sensory Keepsake Tray (Drag or 1-Tap Pack into Box)</span>
            </h3>
            <p className="text-xs text-[#7A6856]">
              All items are <strong>100% optional</strong>. Drag any item into the 3D vault above, or tap <strong>"Add to Box"</strong>!
            </p>
          </div>

          {/* Quick Speak-to-Write Trigger */}
          <button
            type="button"
            onClick={onOpenSpeakToWrite}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Mic className="w-4 h-4" />
            <span>Speak-to-Write Letter</span>
          </button>
        </div>

        {/* Gift Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TRAY_GIFTS.map((gift) => {
            const isAlreadyPacked = items.some((it) => it.type === gift.type);

            return (
              <motion.div
                key={gift.id}
                draggable
                onDragStart={(e: any) => handleDragStart(e, gift)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-grab active:cursor-grabbing select-none group"
              >
                {/* Top Badge if already packed */}
                {isAlreadyPacked && (
                  <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300 shadow-xs flex items-center gap-0.5 z-10">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Packed
                  </span>
                )}

                {/* Gift Visual */}
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#D4AF37]/30 flex items-center justify-center text-2xl mx-auto shadow-xs group-hover:scale-110 transition-transform mb-2 overflow-hidden">
                    {gift.icon}
                  </div>
                  <h4 className="text-xs font-serif font-bold text-[#2D241E] text-center leading-tight">
                    {gift.name[currentLanguage] || gift.name.en}
                  </h4>
                  <p className="text-[10px] text-[#7A6856] text-center mt-1 line-clamp-2 leading-relaxed">
                    {gift.subtitle[currentLanguage] || gift.subtitle.en}
                  </p>
                </div>

                {/* Action button: 1-Tap Pack into Box */}
                <div className="mt-3 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => packGiftIntoBox(gift)}
                    className="w-full py-1.5 px-2 rounded-xl bg-[#FAF3E0] hover:bg-[#D4AF37] text-[#8C6D37] hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Box</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
