import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Sparkles, Wand2, X, Check, Volume2, RefreshCw, Feather } from 'lucide-react';
import { PaperStyle, SupportedLanguage } from '../types';
import { playPaperCrinkleSound, playPianoNote } from '../utils/audio';

interface SpeakToWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  senderName: string;
  recipientName: string;
  occasion: string;
  onSaveLetter: (letterData: {
    letterTitle: string;
    letterContent: string;
    paperStyle: PaperStyle;
    letterSignature: string;
    giftTagNote?: string;
  }) => void;
}

const BCP47_LANG_CODE_MAP: Record<SupportedLanguage, string> = {
  hi: 'hi-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
  pa: 'pa-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  de: 'de-DE',
  ar: 'ar-SA',
  ja: 'ja-JP',
  en: 'en-US',
};

const SPEAK_PROMPTS_BY_LANG: Record<SupportedLanguage, {
  modalTitle: string;
  modalSubtitle: string;
  micReady: string;
  micListening: string;
  micHint: string;
  samplePhrase: string;
  transformBtn: string;
  transforming: string;
  reviewTitle: string;
  saveBtn: string;
  cancelBtn: string;
}> = {
  hi: {
    modalTitle: 'बोलकर खत लिखें (Speak to Write)',
    modalSubtitle: 'आप अपनी भाषा में दिल की बात बोलिए, Gemini AI उसे एक खूबसूरत हस्तलिखित पत्र में बदल देगा।',
    micReady: 'माइक दबाएं और बोलना शुरू करें',
    micListening: 'सुन रहे हैं... दिल खोलकर बोलिए!',
    micHint: 'जैसे: पहली मुलाकात की याद, कोई खास किस्सा या अपने प्यार का इज़हार...',
    samplePhrase: 'उदाहरण: "सुनो, जब हम पहली बार मिले थे तब बारिश हो रही थी और मुझे तुमसे पहली नज़र में प्यार हो गया था..."',
    transformBtn: 'जादुई खत में बदलें (Transform with AI)',
    transforming: 'आपकी आवाज़ को खूबसूरत खत में ढाला जा रहा है...',
    reviewTitle: 'आपका सुंदर हस्तलिखित खत',
    saveBtn: 'यह खत डिब्बे में रखें',
    cancelBtn: 'रद्द करें',
  },
  mr: {
    modalTitle: 'बोलून पत्र लिहा (Speak to Write)',
    modalSubtitle: 'तुम्ही मराठीत मनातील भावना बोला, Gemini AI त्याचे अत्यंत सुंदर आणि भावुक पत्रात रूपांतर करेल.',
    micReady: 'माइकवर दाबा आणि बोलायला सुरुवात करा',
    micListening: 'ऐकत आहोत... मनातलं मनमोकळेपणाने बोला!',
    micHint: 'उदा: पहिली भेट, एखादा गोड प्रसंग किंवा तुमच्या प्रेमाची कबुली...',
    samplePhrase: 'उदाहरण: "तुझ्यासोबत घालवलेला प्रत्येक क्षण माझ्यासाठी खूप खास आहे, तू माझ्या आयुष्यातील सर्वात सुंदर गोष्ट आहेस..."',
    transformBtn: 'सुंदर पत्रात रूपांतर करा',
    transforming: 'तुमच्या शब्दांचे सुंदर पत्रात रूपांतर होत आहे...',
    reviewTitle: 'तुमचे हस्तलिखित पत्र',
    saveBtn: 'हे पत्र डब्यात ठेवा',
    cancelBtn: 'रद्द करा',
  },
  gu: {
    modalTitle: 'બોલીને પત્ર લખો (Speak to Write)',
    modalSubtitle: 'તમે તમારી માતૃભાષામાં દિલની વાત બોલો, Gemini AI તેને એક સુંદર પત્રમાં ફેરવી આપશે.',
    micReady: 'માઈક દબાવો અને બોલવાનું શરૂ કરો',
    micListening: 'સાંભળી રહ્યા છીએ... દિલ ખોલીને બોલો!',
    micHint: 'જેમ કે: પહેલી મુલાકાતની યાદ, કોઈ ખાસ પળ કે પ્રેમની વાત...',
    samplePhrase: 'ઉદાહરણ: "તારા વગર મારું જીવન અધૂરું છે, તારું હાસ્ય મારી સૌથી મોટી ખુશી છે..."',
    transformBtn: 'સુંદર પત્રમાં ફેરવો',
    transforming: 'તમારા શબ્દોનું પત્રમાં રૂપાંતર થઈ રહ્યું છે...',
    reviewTitle: 'તમારો હસ્તલિખિત પત્ર',
    saveBtn: 'આ પત્ર બોક્સમાં મૂકો',
    cancelBtn: 'રદ કરો',
  },
  bn: {
    modalTitle: 'মুখে বলে চিঠি লিখুন (Speak to Write)',
    modalSubtitle: 'আপনি আপনার ভাষায় মনের কথা বলুন, Gemini AI সেটিকে একটি মধুর চিঠিতে রূপান্তর করবে।',
    micReady: 'মাইক চাপুন ও কথা বলুন',
    micListening: 'শুনছি... মন খুলে বলুন!',
    micHint: 'যেমন: প্রথম দেখার মুহূর্ত বা ভালোবাসার অনুভূতি...',
    samplePhrase: 'উদাহরণ: "তুমি আমার জীবনের সবচেয়ে সুন্দর উপহার..."',
    transformBtn: 'সুন্দর চিঠিতে রূপান্তর করুন',
    transforming: 'চিঠি তৈরি হচ্ছে...',
    reviewTitle: 'আপনার আবেগঘন চিঠি',
    saveBtn: 'চিঠিটি বাক্সে রাখুন',
    cancelBtn: 'বাতিল',
  },
  pa: {
    modalTitle: 'ਬੋਲ ਕੇ ਖ਼ਤ ਲਿਖੋ (Speak to Write)',
    modalSubtitle: 'ਤੁਸੀਂ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਦਿਲ ਦੀ ਗੱਲ ਬੋਲੋ, AI ਇਸਨੂੰ ਪਿਆਰੇ ਖ਼ਤ ਵਿੱਚ ਬਦਲ ਦੇਵੇਗਾ।',
    micReady: 'ਮਾਈਕ ਦਬਾਓ ਤੇ ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ',
    micListening: 'ਸੁਣ ਰਹੇ ਹਾਂ... ਦਿਲ ਖੋਲ੍ਹ ਕੇ ਬੋਲੋ!',
    micHint: 'ਜਿਵੇਂ: ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਜਾਂ ਪਿਆਰ ਦਾ ਇਜ਼ਹਾਰ...',
    samplePhrase: 'ਉਦਾਹਰਣ: "ਤੂੰ ਮੇਰੀ ਰੂਹ ਦਾ ਸਕੂਨ ਹੈਂ..."',
    transformBtn: 'ਖ਼ਤ ਵਿੱਚ ਬਦਲੋ',
    transforming: 'ਖ਼ਤ ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ...',
    reviewTitle: 'ਤੁਹਾਡਾ ਪਿਆਰਾ ਖ਼ਤ',
    saveBtn: 'ਖ਼ਤ ਡੱਬੇ ਵਿੱਚ ਰੱਖੋ',
    cancelBtn: 'ਰੱਦ ਕਰੋ',
  },
  ta: {
    modalTitle: 'பேசி கடிதம் எழுதுங்கள் (Speak to Write)',
    modalSubtitle: 'உங்கள் தாய்மொழியில் பேசுங்கள், AI அதை அழகிய காதல் கடிதமாக மாற்றும்.',
    micReady: 'மைக்கை அழுத்தி பேசத் தொடங்குங்கள்',
    micListening: 'கேட்கிறது... மனந்திறந்து பேசுங்கள்!',
    micHint: 'முதல் சந்திப்பு அல்லது காதல் தருணங்கள்...',
    samplePhrase: 'உதாரணம்: "நீயே என் வாழ்க்கையின் வசந்தம்..."',
    transformBtn: 'கடிதமாக மாற்றவும்',
    transforming: 'கடிதம் உருவாகிறது...',
    reviewTitle: 'உங்கள் கைப்பட எழுதிய கடிதம்',
    saveBtn: 'பெட்டியில் வைக்கவும்',
    cancelBtn: 'ரத்து',
  },
  te: {
    modalTitle: 'మాట్లాడి ఉత్తరం రాయండి (Speak to Write)',
    modalSubtitle: 'మీరు మాట్లాడండి, AI దానిని మధురమైన ప్రేమలేఖగా మారుస్తుంది.',
    micReady: 'మైక్ నొక్కి మాట్లాడండి',
    micListening: 'వింటున్నాము... స్వేచ్ఛగా మాట్లాడండి!',
    micHint: 'మొదటి పరిచయం లేదా మధుర జ్ఞాపకాలు...',
    samplePhrase: 'ఉదాహరణ: "నా జీవితంలో నువ్వు అత్యంత విలువైన వ్యక్తివి..."',
    transformBtn: 'లేఖగా మార్చండి',
    transforming: 'లేఖ సిద్ధమవుతోంది...',
    reviewTitle: 'మీ ప్రేమలేఖ',
    saveBtn: 'పెట్టెలో ఉంచండి',
    cancelBtn: 'రద్దు',
  },
  es: {
    modalTitle: 'Habla para Escribir la Carta (Speak to Write)',
    modalSubtitle: 'Habla desde el corazón en tu idioma y Gemini IA redactará una hermosa carta manuscrita.',
    micReady: 'Toca el micrófono y empieza a hablar',
    micListening: 'Escuchando... ¡Habla con el corazón!',
    micHint: 'Ejemplo: el primer encuentro, una anécdota o una confesión sincera...',
    samplePhrase: 'Ejemplo: "Eres lo más bonito que me ha pasado en la vida..."',
    transformBtn: 'Transformar en Carta Poética',
    transforming: 'Componiendo tu carta...',
    reviewTitle: 'Tu Carta Manuscrita',
    saveBtn: 'Guardar Carta en la Caja',
    cancelBtn: 'Cancelar',
  },
  fr: {
    modalTitle: 'Dictez votre Lettre d\'Amour (Speak to Write)',
    modalSubtitle: 'Exprimez vos sentiments à haute voix, l\'IA rédigera une splendide lettre poétique.',
    micReady: 'Touchez le micro pour parler',
    micListening: 'Nous vous écoutons... Parlez avec le cœur !',
    micHint: 'Exemple : un premier regard, un souvenir inoubliable...',
    samplePhrase: 'Exemple : "Tu illumines chacune de mes journées..."',
    transformBtn: 'Rédiger la Lettre Poétique',
    transforming: 'Création de la lettre...',
    reviewTitle: 'Votre Lettre Manuscrite',
    saveBtn: 'Placer dans le Coffret',
    cancelBtn: 'Annuler',
  },
  it: {
    modalTitle: 'Detta la tua Lettera d\'Amore (Speak to Write)',
    modalSubtitle: 'Parla dal cuore e Gemini IA comporrà una splendida lettera manoscritta.',
    micReady: 'Tocca il microfono per iniziare',
    micListening: 'In ascolto... Parla sinceramente!',
    micHint: 'Esempio: il nostro primo incontro, un ricordo speciale...',
    samplePhrase: 'Esempio: "Sei la persona più importante della mia vita..."',
    transformBtn: 'Crea Lettera Poetica',
    transforming: 'Composizione in corso...',
    reviewTitle: 'La tua Lettera Manoscritta',
    saveBtn: 'Conserva nello Scrigno',
    cancelBtn: 'Annulla',
  },
  de: {
    modalTitle: 'Brief per Spracheingabe (Speak to Write)',
    modalSubtitle: 'Sprich aus vollem Herzen und die KI verfasst einen wunderschönen handgeschriebenen Liebesbrief.',
    micReady: 'Mikrofon antippen und sprechen',
    micListening: 'Höre zu... Sprich frei heraus!',
    micHint: 'z.B. Das erste Treffen oder schöne Erinnerungen...',
    samplePhrase: 'Beispiel: "Du bist mein Fels in der Brandung..."',
    transformBtn: 'In Poesiebrief verwandeln',
    transforming: 'Brief wird verfasst...',
    reviewTitle: 'Dein handgeschriebener Brief',
    saveBtn: 'In die Truhe legen',
    cancelBtn: 'Abbrechen',
  },
  ar: {
    modalTitle: 'تحدث لكتابة رسالة حب (Speak to Write)',
    modalSubtitle: 'تحدث بمشاعرك الصادقة، وسيقوم الذكاء الاصطناعي بصياغة رسالة حب شاعرية.',
    micReady: 'اضغط على الميكروفون وابدأ الحديث',
    micListening: 'جاري الاستماع... تحدث من القلب!',
    micHint: 'مثال: ذكرى أول لقاء أو مشاعر الشوق والامتنان...',
    samplePhrase: 'مثال: "أنت أجمل ما حدث في حياتي..."',
    transformBtn: 'صياغة رسالة شاعرية',
    transforming: 'جاري تأليف الرسالة...',
    reviewTitle: 'رسالتك الوجدانية',
    saveBtn: 'وضع الرسالة في الصندوق',
    cancelBtn: 'إلغاء',
  },
  ja: {
    modalTitle: '声で手紙を書く (Speak to Write)',
    modalSubtitle: 'あなたの言葉を話すだけで、Gemini AIが感動的な手書き風の手紙を作成します。',
    micReady: 'マイクを押して話し始めてください',
    micListening: '聞いています... 心のままにお話しください！',
    micHint: '例：初めて出会った日のこと、日頃の感謝や愛の告白...',
    samplePhrase: '例：「いつもそばにいてくれてありがとう。あなたと過ごす時間が私の宝物です...」',
    transformBtn: '美しい手紙に仕上げる',
    transforming: '心を込めて執筆中...',
    reviewTitle: 'あなたの手書き風の手紙',
    saveBtn: '手紙を箱に詰める',
    cancelBtn: 'キャンセル',
  },
  en: {
    modalTitle: 'Speak to Write Your Letter',
    modalSubtitle: 'Speak naturally from your heart in your mother tongue, and Gemini AI will turn it into a poetic handwritten parchment letter.',
    micReady: 'Click microphone & start speaking',
    micListening: 'Listening closely... Speak freely!',
    micHint: 'e.g. How you met, an inside joke, or heartfelt promises for the future...',
    samplePhrase: 'Example: "Hey, I wanted to say thank you for always being there and making every single day feel magical..."',
    transformBtn: 'Transform with AI Muse',
    transforming: 'Crafting your handwritten parchment letter...',
    reviewTitle: 'Your Handwritten Parchment Letter',
    saveBtn: 'Pack Letter in Box',
    cancelBtn: 'Cancel',
  },
};

export const SpeakToWriteModal: React.FC<SpeakToWriteModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  senderName,
  recipientName,
  occasion,
  onSaveLetter,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('rose_petal_pressed');
  const [step, setStep] = useState<'speak' | 'review'>('speak');

  const recognitionRef = useRef<any>(null);
  const strings = SPEAK_PROMPTS_BY_LANG[currentLanguage] || SPEAK_PROMPTS_BY_LANG.en;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = BCP47_LANG_CODE_MAP[currentLanguage] || 'hi-IN';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setSpokenText((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [currentLanguage]);

  const handleToggleRecord = () => {
    if (!recognitionRef.current) {
      // Fallback: let user type or simulate speech
      if (!isRecording) {
        setIsRecording(true);
        setTimeout(() => {
          if (!spokenText) {
            setSpokenText(
              currentLanguage === 'hi'
                ? 'मेरी जान, तुम्हारे साथ बिताया हर लम्हा मेरे लिए अनमोल है। तुम मेरी ज़िंदगी की सबसे खूबसूरत हकीकत हो।'
                : currentLanguage === 'mr'
                ? 'तुझ्यावर माझं मनापासून प्रेम आहे, तू माझ्या आयुष्यातील सर्वात सुंदर भेट आहेस.'
                : currentLanguage === 'gu'
                ? 'તારું સ્મિત મારી દુનિયા છે, તારા વગર મારું જીવન અધૂરું છે.'
                : 'Every single moment spent with you is a memory I cherish with all my heart.'
            );
          }
          setIsRecording(false);
        }, 3000);
      }
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        playPianoNote(440, 0.3, 0.1);
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Recognition start error:', err);
        setIsRecording(false);
      }
    }
  };

  const handleTransformWithAI = async () => {
    if (!spokenText.trim()) return;

    setIsTransforming(true);
    playPianoNote(587.33, 0.6, 0.1);

    try {
      const response = await fetch('/api/gemini/voice-to-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText,
          language: currentLanguage,
          senderName,
          recipientName,
          occasion,
        }),
      });

      const data = await response.json();
      setGeneratedTitle(data.letterTitle || 'To My Soulmate');
      setGeneratedContent(data.letterContent || spokenText);
      if (data.recommendedPaper) {
        setPaperStyle(data.recommendedPaper as PaperStyle);
      }
      setStep('review');
      playPaperCrinkleSound();
    } catch (err) {
      console.error('Transform error:', err);
      setGeneratedTitle('दिल से निकली बात');
      setGeneratedContent(spokenText);
      setStep('review');
    } finally {
      setIsTransforming(false);
    }
  };

  const handleSave = () => {
    playPaperCrinkleSound();
    onSaveLetter({
      letterTitle: generatedTitle || 'To My Beloved',
      letterContent: generatedContent || spokenText,
      paperStyle,
      letterSignature: senderName || 'Yours Forever',
      giftTagNote: `Handcrafted with love for ${recipientName}`,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-[#FFFDF9] border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 bg-gradient-to-r from-[#FAF6EE] to-[#FFFDF9]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2D241E]">
                  {strings.modalTitle}
                </h3>
                <p className="text-xs text-[#7A6856]">
                  {strings.modalSubtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {step === 'speak' ? (
              <div className="flex flex-col items-center text-center space-y-5">
                {/* Glowing Microphone Button */}
                <div className="relative my-2">
                  <motion.button
                    type="button"
                    onClick={handleToggleRecord}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all cursor-pointer relative z-10 ${
                      isRecording
                        ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white ring-8 ring-red-400/30 animate-pulse'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-8 ring-emerald-400/25 hover:shadow-emerald-500/30'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-10 h-10 mb-1" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">रोकें</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-10 h-10 mb-1" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">बोलें</span>
                      </>
                    )}
                  </motion.button>

                  {/* Pulsating Ring Wave Animations */}
                  {isRecording && (
                    <>
                      <motion.div
                        className="absolute -inset-4 rounded-full border-2 border-red-400"
                        animate={{ scale: [1, 1.4, 1.8], opacity: [0.8, 0.4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                      />
                      <motion.div
                        className="absolute -inset-8 rounded-full border border-red-300"
                        animate={{ scale: [1, 1.5, 2], opacity: [0.6, 0.2, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
                      />
                    </>
                  )}
                </div>

                {/* State Text */}
                <div>
                  <p className="text-sm font-bold text-[#2D241E]">
                    {isRecording ? strings.micListening : strings.micReady}
                  </p>
                  <p className="text-xs text-[#8C6D37] mt-1 max-w-md mx-auto">
                    {strings.micHint}
                  </p>
                </div>

                {/* Spoken Text Box */}
                <div className="w-full text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#8C6D37]">
                      आपके बोले गए शब्द (Spoken Thoughts):
                    </label>
                    {spokenText && (
                      <button
                        type="button"
                        onClick={() => setSpokenText('')}
                        className="text-[11px] text-stone-400 hover:text-stone-600"
                      >
                        साफ़ करें
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={spokenText}
                    onChange={(e) => setSpokenText(e.target.value)}
                    placeholder={strings.samplePhrase}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7EE] border border-[#D4AF37]/30 text-sm text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37] resize-none leading-relaxed font-serif"
                  />
                </div>

                {/* Transform Button */}
                <button
                  type="button"
                  disabled={!spokenText.trim() || isTransforming}
                  onClick={handleTransformWithAI}
                  className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    !spokenText.trim() || isTransforming
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B8860B] text-[#2C1D0F] hover:brightness-105 active:scale-98 shadow-[#D4AF37]/20'
                  }`}
                >
                  <Wand2 className={`w-4 h-4 ${isTransforming ? 'animate-spin' : ''}`} />
                  <span>{isTransforming ? strings.transforming : strings.transformBtn}</span>
                </button>
              </div>
            ) : (
              /* Review Screen */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8C6D37] uppercase tracking-wider">
                    {strings.reviewTitle}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('speak')}
                    className="text-xs text-[#8C6D37] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>फिर से बोलें</span>
                  </button>
                </div>

                {/* Parchment Styled Letter Container */}
                <div className="p-6 rounded-2xl bg-[#FAF3E0] border-2 border-[#D4AF37]/40 shadow-inner space-y-3 font-serif">
                  <input
                    type="text"
                    value={generatedTitle}
                    onChange={(e) => setGeneratedTitle(e.target.value)}
                    className="w-full text-center text-lg font-bold text-[#4A2E18] bg-transparent border-b border-[#D4AF37]/40 pb-2 focus:outline-hidden"
                  />
                  <textarea
                    rows={6}
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="w-full text-sm text-[#2D241E] bg-transparent focus:outline-hidden leading-relaxed resize-none italic"
                  />
                  <div className="text-right pt-2 border-t border-[#D4AF37]/30 text-xs font-bold text-[#8C6D37]">
                    ~ {senderName || 'Your Love'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('speak')}
                    className="flex-1 py-3 rounded-2xl bg-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-300 transition-colors"
                  >
                    {strings.cancelBtn}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs hover:brightness-105 shadow-md flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{strings.saveBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
