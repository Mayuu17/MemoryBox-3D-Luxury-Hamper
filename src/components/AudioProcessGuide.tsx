import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, RefreshCw, MessageSquare, Mic, Play, Pause } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { speakNativeSpeech, stopNativeSpeech, playPianoNote } from '../utils/audio';

interface AudioProcessGuideProps {
  currentLanguage: SupportedLanguage;
  currentAction: 'welcome' | 'bedding' | 'item_dropped' | 'speak_letter' | 'scrapbook' | 'voice' | 'capsule' | 'seal';
  recipientName?: string;
  senderName?: string;
  onMicClick?: () => void;
}

interface GuideDialogue {
  title: string;
  spokenText: string;
  tipText: string;
}

export const AUDIO_GUIDE_SCRIPTS: Record<SupportedLanguage, Record<string, GuideDialogue>> = {
  hi: {
    welcome: {
      title: 'नमस्ते! मैं आपकी उपहार मार्गदर्शिका हूँ',
      spokenText: 'नमस्ते! चलिए अपने खास इंसान के लिए एक बहुत ही सुंदर तोहफा बनाते हैं। नीचे से कोई भी चीज, जैसे चॉकलेट या फोटो फ्रेम, खींचकर इस डिब्बे में डालिए।',
      tipText: 'नीचे से चॉकलेट, गुलाब या खत को खींचकर डिब्बे में डालें।',
    },
    bedding: {
      title: 'कागज़ की सुंदर परत',
      spokenText: 'वाह! चलिए डिब्बे के नीचे रंगीन कागज़ की मुलायम परत बिछाते हैं, ताकि तोहफे एकदम महफूज़ रहें।',
      tipText: 'रंगीन कागज़ के टुकड़े बिखेरने के लिए बटन दबाएं।',
    },
    item_dropped: {
      title: 'तोहफा डिब्बे में सज गया!',
      spokenText: 'बहुत बढ़िया! यह तोहफा डिब्बे में सज गया है। अब नीचे से एक और सुंदर चीज चुनकर डिब्बे में डालिए।',
      tipText: 'आप जितने चाहें उतने तोहफे डिब्बे में जोड़ सकते हैं!',
    },
    speak_letter: {
      title: 'बोलकर दिल का खत लिखें',
      spokenText: 'हरे माइक के बटन को दबाइए और अपने दिल की बात बोलिए। AI आपके शब्दों को एक खूबसूरत खत में बदल देगा।',
      tipText: 'माइक दबाएं और अपनी भाषा में बोलें।',
    },
    scrapbook: {
      title: 'यादों का फोटो एल्बम',
      spokenText: 'अपनी पुरानी तस्वीरें जोड़िए और हर तस्वीर के साथ अपनी मीठी यादें लिख दीजिए।',
      tipText: 'तस्वीरें जोड़ें और दिल छू लेने वाली बातें लिखें।',
    },
    voice: {
      title: 'अपनी असली आवाज़ का संदेश',
      spokenText: 'माइक से अपनी असली आवाज़ रिकॉर्ड कीजिए, ताकि जब वो डिब्बा खोलें तो आपकी आवाज़ सुन सकें।',
      tipText: 'रिकॉर्ड बटन दबाएं और अपनी आवाज़ रिकॉर्ड करें।',
    },
    capsule: {
      title: 'समय का ताला (टाइम कैप्सूल)',
      spokenText: 'इस तोहफे पर एक खास तारीख का ताला लगाइए, जो सिर्फ उसी दिन खुलेगा!',
      tipText: 'भविष्य की तारीख चुनें जब यह तोहफा खुलेगा।',
    },
    seal: {
      title: 'डिब्बे पर मोम की सील लगाएं',
      spokenText: 'अद्भुत! आपका तोहफा पूरी तरह तैयार है। अब इस पर शाही मोम की सील लगाते हैं और अपने साथी को भेजते हैं।',
      tipText: 'डिब्बा सील करें और खास लिंक अपने साथी को भेजें।',
    },
  },
  mr: {
    welcome: {
      title: 'नमस्कार! मी तुमची मार्गदर्शक आहे',
      spokenText: 'नमस्कार! चला आपल्या खास व्यक्तीसाठी एक सुंदर आठवणींचा डबा तयार करूया. खालून चॉकलेट किंवा फोटो फ्रेम ओढून या डब्यात टाका.',
      tipText: 'खालून चॉकलेट, गुलाब किंवा पत्र ओढून डब्यात ठेवा.',
    },
    bedding: {
      title: 'मऊ कागदाचा थर',
      spokenText: 'छान! चला डब्याच्या तळाशी मऊ रंगीत कागद पसरवूया, ज्यामुळे भेटवस्तू सुरक्षित राहतील.',
      tipText: 'रंगीत कागद पसरवण्यासाठी बटण दाबा.',
    },
    item_dropped: {
      title: 'भेटवस्तू डब्यात सजली!',
      spokenText: 'खूप छान! ही भेटवस्तू डब्यात सजली आहे. आता आणखी एक छान वस्तू निवडून डब्यात ठेवा.',
      tipText: 'तुम्ही आणखी भेटवस्तू जोडू शकता!',
    },
    speak_letter: {
      title: 'बोलून मनातील पत्र लिहा',
      spokenText: 'हिरव्या माइकवर दाबा आणि मनातलं बोला. AI तुमच्या शब्दांचे सुंदर पत्रात रूपांतर करेल.',
      tipText: 'माइक दाबा आणि आपल्या भाषेत बोला.',
    },
    scrapbook: {
      title: 'गोड आठवणींचा अल्बम',
      spokenText: 'आपले जुने फोटो जोडा आणि त्यासोबत आठवणींचे गोड क्षण लिहा.',
      tipText: 'फोटो जोडा आणि कॅप्शन लिहा.',
    },
    voice: {
      title: 'तुमच्या स्वतःच्या आवाजाचा संदेश',
      spokenText: 'तुमचा खरा आवाज रेकॉर्ड करा, जेणेकरून डबा उघडताच त्यांना तुमचा आवाज ऐकू येईल.',
      tipText: 'रेकॉर्ड बटण दाबून आवाज रेकॉर्ड करा.',
    },
    capsule: {
      title: 'टाइम कॅप्सूलचे कुलूप',
      spokenText: 'या भेटवस्तूला एका खास तारखेचे कुलूप लावा, जे फक्त त्याच दिवशी उघडेल!',
      tipText: 'भविष्यातील तारीख निवडा.',
    },
    seal: {
      title: 'डब्यावर मेणाची मोहोर लावा',
      spokenText: 'उत्कृष्ट! तुमचा डबा तयार आहे. आता यावर मेणाची मोहोर लावून लिंक पाठवूया.',
      tipText: 'डबा सील करा आणि लिंक शेअर करा.',
    },
  },
  gu: {
    welcome: {
      title: 'નમસ્તે! હું તમારી માર્ગદર્શિકા છું',
      spokenText: 'નમસ્તે! ચાલો તમારા ખાસ વ્યક્તિ માટે એક સુંદર ગિફ્ટ બોક્સ બનાવીએ. નીચેથી ચોકલેટ અથવા ફોટો ફ્રેમ ખેંચીને બોક્સમાં મૂકો.',
      tipText: 'નીચેથી વસ્તુ ખેંચીને બોક્સમાં મૂકો.',
    },
    bedding: {
      title: 'મુલાયમ કાગળનું પાથરણું',
      spokenText: 'ખૂબ સરસ! ચાલો બોક્સના તળિયે રંગબેરંગી મુલાયમ કાગળ પાથરીએ જેથી ગિફ્ટ સુરક્ષિત રહે.',
      tipText: 'કાગળ પાથરવા માટે બટન દબાવો.',
    },
    item_dropped: {
      title: 'ગિફ્ટ બોક્સમાં મુકાઈ ગઈ!',
      spokenText: 'શાબાશ! આ ગિફ્ટ બોક્સમાં સજી ગઈ. હવે બીજી કોઈ ખાસ વસ્તુ પસંદ કરીને મૂકો.',
      tipText: 'તમે હજી વધુ ગિફ્ટ્સ ઉમેરી શકો છો.',
    },
    speak_letter: {
      title: 'બોલીને દિલનો પત્ર લખો',
      spokenText: 'લીલા માઈક પર ક્લિક કરો અને દિલ ખોલીને બોલો. AI તમારા શબ્દોનો સુંદર પત્ર બનાવી આપશે.',
      tipText: 'માઈક દબાવો અને ગુજરાતીમાં બોલો.',
    },
    scrapbook: {
      title: 'યાદોનો ફોટો આલ્બમ',
      spokenText: 'તમારા ફોટા ઉમેરો અને સાથે સુંદર યાદો લખો.',
      tipText: 'ફોટા અને કેપ્શન ઉમેરો.',
    },
    voice: {
      title: 'તમારો સાચો અવાજ રેકોર્ડ કરો',
      spokenText: 'તમારો અવાજ રેકોર્ડ કરો જેથી બોક્સ ખૂલતાં જ તમારો અવાજ સંભળાય.',
      tipText: 'અવાજ રેકોર્ડ કરવા માટે બટન દબાવો.',
    },
    capsule: {
      title: 'ટાઈમ કેપ્સૂલનું તાળું',
      spokenText: 'આ ગિફ્ટ પર ખાસ તારીખનું તાળું લગાવો જે તે જ દિવસે ખુલશે.',
      tipText: 'ભવિષ્યની તારીખ પસંદ કરો.',
    },
    seal: {
      title: 'બોક્સ પર લાખની સીલ લગાવો',
      spokenText: 'અદ્ભુત! બોક્સ તૈયાર છે. હવે સીલ લગાવીને તમારા સાથીને મોકલો.',
      tipText: 'બોક્સ સીલ કરો અને શેર કરો.',
    },
  },
  bn: {
    welcome: {
      title: 'নমস্কার! আমি আপনার গাইড',
      spokenText: 'নমস্কার! চলুন আপনার প্রিয়জনের জন্য একটি সুন্দর উপহারের বাক্স তৈরি করি। নিচ থেকে যেকোনো জিনিস টেনে বাক্সে রাখুন।',
      tipText: 'নিচ থেকে টেনে বাক্সে ফেলুন।',
    },
    bedding: {
      title: 'নরম কাগজের বিছানা',
      spokenText: 'চলুন বাক্সের নিচে রঙিন নরম কাগজের টুকরো বিছিয়ে দিই।',
      tipText: 'কাগজ ছড়াতে ক্লিক করুন।',
    },
    item_dropped: {
      title: 'উপহার বাক্সে সাজানো হয়েছে!',
      spokenText: 'দারুণ! এবার নিচ থেকে আরেকটি উপহার বেছে নিন।',
      tipText: 'আরও উপহার যোগ করুন।',
    },
    speak_letter: {
      title: 'মুখে বলে চিঠি লিখুন',
      spokenText: 'সবুজ মাইকে চাপ দিয়ে মনের কথা বলুন, AI সুন্দর চিঠি বানিয়ে দেবে।',
      tipText: 'মাইক চাপুন ও বাংলায় বলুন।',
    },
    scrapbook: {
      title: 'স্মৃতির ফটো অ্যালবাম',
      spokenText: 'পুরনো ছবি যোগ করুন ও মিষ্টি স্মৃতি লিখে দিন।',
      tipText: 'ছবি ও ক্যাপশন লিখুন।',
    },
    voice: {
      title: 'ভয়েস বার্তা রেকর্ড করুন',
      spokenText: 'আপনার আসল কণ্ঠ রেকর্ড করুন যাতে ওনারা শুনতে পান।',
      tipText: 'রেকর্ড বাটনে চাপুন।',
    },
    capsule: {
      title: 'টাইম ক্যাপসুল লক',
      spokenText: 'একটি নির্দিষ্ট তারিখের লক দিন যা সেই দিনেই খুলবে।',
      tipText: 'তারিখ বেছে নিন।',
    },
    seal: {
      title: 'বাক্সে সিলমোহর লাগান',
      spokenText: 'চমৎকার! বাক্স তৈরি, এবার সিলমোহর লাগিয়ে পাঠিয়ে দিন।',
      tipText: 'বাক্স সিল করুন ও লিংক শেয়ার করুন।',
    },
  },
  pa: {
    welcome: {
      title: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਮਾਰਗਦਰਸ਼ਕ ਹਾਂ',
      spokenText: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਆਓ ਆਪਣੇ ਖਾਸ ਇਨਸਾਨ ਲਈ ਇੱਕ ਪਿਆਰਾ ਤੋਹਫ਼ਾ ਤਿਆਰ ਕਰੀਏ। ਹੇਠਾਂ ਤੋਂ ਚੀਜ਼ ਖਿੱਚ ਕੇ ਡੱਬੇ ਵਿੱਚ ਪਾਓ।',
      tipText: 'ਹੇਠਾਂ ਤੋਂ ਤੋਹਫ਼ਾ ਖਿੱਚ ਕੇ ਡੱਬੇ ਵਿੱਚ ਰੱਖੋ।',
    },
    bedding: {
      title: 'ਕਾਗਜ਼ ਦੀ ਮੁਲਾਇਮ ਤਹਿ',
      spokenText: 'ਡੱਬੇ ਦੇ ਹੇਠਾਂ ਰੰਗ-ਬਿਰੰਗੇ ਕਾਗਜ਼ ਵਿਛਾਓ ਤਾਂ ਜੋ ਤੋਹਫ਼ੇ ਸੁਰੱਖਿਅਤ ਰਹਿਣ।',
      tipText: 'ਕਾਗਜ਼ ਵਿਛਾਉਣ ਲਈ ਬਟਨ ਦਬਾਓ।',
    },
    item_dropped: {
      title: 'ਤੋਹਫ਼ਾ ਡੱਬੇ ਵਿੱਚ ਪੈ ਗਿਆ!',
      spokenText: 'ਬਹੁਤ ਵਧੀਆ! ਹੁਣ ਹੇਠਾਂ ਤੋਂ ਇੱਕ ਹੋਰ ਪਿਆਰੀ ਚੀਜ਼ ਚੁਣੋ।',
      tipText: 'ਹੋਰ ਤੋਹਫ਼ੇ ਜੋੜੋ।',
    },
    speak_letter: {
      title: 'ਬੋਲ ਕੇ ਦਿਲ ਦਾ ਖ਼ਤ ਲਿਖੋ',
      spokenText: 'ਹਰੇ ਮਾਈਕ ਤੇ ਦਬਾਓ ਅਤੇ ਦਿਲ ਦੀ ਗੱਲ ਬੋਲੋ, AI ਖ਼ੂਬਸੂਰਤ ਖ਼ਤ ਬਣਾ ਦੇਵੇਗਾ।',
      tipText: 'ਮਾਈਕ ਦਬਾਓ ਤੇ ਬੋਲੋ।',
    },
    scrapbook: {
      title: 'ਯਾਦਾਂ ਦਾ ਫੋਟੋ ਐਲਬਮ',
      spokenText: 'ਆਪਣੀਆਂ ਫੋਟੋਆਂ ਲਗਾਓ ਅਤੇ ਯਾਦਾਂ ਲਿਖੋ।',
      tipText: 'ਫੋਟੋਆਂ ਤੇ ਕੈਪਸ਼ਨ ਲਿਖੋ।',
    },
    voice: {
      title: 'ਆਪਣੀ ਅਸਲੀ ਆਵਾਜ਼ ਰਿਕਾਰਡ ਕਰੋ',
      spokenText: 'ਆਪਣੀ ਆਵਾਜ਼ ਰਿਕਾਰਡ ਕਰੋ ਤਾਂ ਜੋ ਓਹ ਸੁਣ ਸਕਣ।',
      tipText: 'ਰਿਕਾਰਡ ਬਟਨ ਦਬਾਓ।',
    },
    capsule: {
      title: 'ਟਾਈਮ ਕੈਪਸੂਲ ਦਾ ਜਿੰਦਰਾ',
      spokenText: 'ਇਸ ਤੋਹਫ਼ੇ ਤੇ ਖਾਸ ਤਾਰੀਖ ਦਾ ਜਿੰਦਰਾ ਲਗਾਓ।',
      tipText: 'ਤਾਰੀਖ ਚੁਣੋ।',
    },
    seal: {
      title: 'ਡੱਬੇ ਤੇ ਮੋਮ ਦੀ ਮੋਹਰ ਲਗਾਓ',
      spokenText: 'ਡੱਬਾ ਤਿਆਰ ਹੈ, ਹੁਣ ਮੋਹਰ ਲਗਾ ਕੇ ਲਿੰਕ ਭੇਜੋ।',
      tipText: 'ਡੱਬਾ ਸੀਲ ਕਰੋ।',
    },
  },
  ta: {
    welcome: {
      title: 'வணக்கம்! உங்கள் வழிகாட்டி',
      spokenText: 'வணக்கம்! உங்கள் அன்புக்குரியவருக்கு ஒரு அழகான பரிசு பெட்டியை உருவாக்குவோம். கீழே உள்ள பொருளை இழுத்து பெட்டியில் வைக்கவும்.',
      tipText: 'பொருளை இழுத்து பெட்டியில் வைக்கவும்.',
    },
    bedding: {
      title: 'மென்மையான காகிதம்',
      spokenText: 'பெட்டியின் அடியில் வண்ண காகிதங்களை நிரப்புவோம்.',
      tipText: 'காகிதத்தை நிரப்ப கிளிக் செய்யவும்.',
    },
    item_dropped: {
      title: 'பரிசு சேர்க்கப்பட்டது!',
      spokenText: 'அற்புதம்! இப்போது மற்றொரு பரிசை தேர்வு செய்யுங்கள்.',
      tipText: 'மேலும் பரிசுகளை சேர்க்கவும்.',
    },
    speak_letter: {
      title: 'பேசி கடிதம் எழுதுங்கள்',
      spokenText: 'பச்சை மைக்கை அழுத்தி உங்கள் அன்பை பேசுங்கள், AI கடிதமாக மாற்றும்.',
      tipText: 'மைக்கை அழுத்தி தமிழில் பேசவும்.',
    },
    scrapbook: {
      title: 'நினைவு புகைப்பட ஆல்பம்',
      spokenText: 'புகைப்படங்களை சேர்த்து நினைவுகளை எழுதுங்கள்.',
      tipText: 'புகைப்படங்களை சேர்க்கவும்.',
    },
    voice: {
      title: 'குரல் பதிவு',
      spokenText: 'உங்கள் சொந்த குரலில் செய்தியை பதிவு செய்யுங்கள்.',
      tipText: 'பதிவு செய்ய கிளிக் செய்யவும்.',
    },
    capsule: {
      title: 'டைம் கேப்சூல் பூட்டு',
      spokenText: 'குறிப்பிட்ட நாளில் திறக்க பூட்டு போடுங்கள்.',
      tipText: 'தேதியை தேர்வு செய்யவும்.',
    },
    seal: {
      title: 'அரக்கு முத்திரை இடவும்',
      spokenText: 'பெட்டி தயார்! முத்திரையிட்டு அன்பை பகிருங்கள்.',
      tipText: 'சீல் செய்து பகிரவும்.',
    },
  },
  te: {
    welcome: {
      title: 'నమస్కారం! మీ గైడ్',
      spokenText: 'నమస్కారం! మీ ప్రియమైన వారి కోసం అందమైన బహుమతి పెట్టెను తయారు చేద్దాం. కింద ఉన్న వస్తువును లాగి పెట్టెలో వేయండి.',
      tipText: 'వస్తువును లాగి పెట్టెలో వేయండి.',
    },
    bedding: {
      title: 'మృదువైన కాగితం పొర',
      spokenText: 'పెట్టె అడుగున రంగు కాగితాలు పరుద్దాం.',
      tipText: 'కాగితం పరవడానికి క్లిక్ చేయండి.',
    },
    item_dropped: {
      title: 'బహుమతి పెట్టెలో చేరింది!',
      spokenText: 'చాలా బాగుంది! ఇప్పుడు మరొక బహుమతిని ఎంచుకోండి.',
      tipText: 'మరిన్ని బహుమతులు చేర్చండి.',
    },
    speak_letter: {
      title: 'మాట్లాడి ఉత్తరం రాయండి',
      spokenText: 'ఆకుపచ్చ మైక్ నొక్కి మాట్లాడండి, AI అందమైన లేఖగా మారుస్తుంది.',
      tipText: 'మైక్ నొక్కి తెలుగులో మాట్లాడండి.',
    },
    scrapbook: {
      title: 'జ్ఞాపకాల ఫోటో ఆల్బమ్',
      spokenText: 'మీ ఫోటోలను చేర్చి మధుర జ్ఞాపకాలను రాయండి.',
      tipText: 'ఫోటోలు జోడించండి.',
    },
    voice: {
      title: 'మీ స్వరం రికార్డ్ చేయండి',
      spokenText: 'మీ స్వరాన్ని రికార్డ్ చేసి ప్రియమైన వారికి వినిపించండి.',
      tipText: 'రికార్డ్ బటన్ నొక్కండి.',
    },
    capsule: {
      title: 'టైమ్ క్యాప్సూల్ లాక్',
      spokenText: 'ప్రత్యేక తేదీ లాక్ వేయండి.',
      tipText: 'తేదీని ఎంచుకోండి.',
    },
    seal: {
      title: 'సీల్ వేసి పంపండి',
      spokenText: 'పెట్టె సిద్ధమైంది! సీల్ వేసి లింక్ షేర్ చేయండి.',
      tipText: 'సీల్ చేసి పంపండి.',
    },
  },
  es: {
    welcome: {
      title: '¡Hola! Soy tu Guía de Regalos',
      spokenText: '¡Hola! Vamos a crear una caja de recuerdos inolvidable. Arrastra cualquier regalo de abajo y suéltalo dentro de la caja.',
      tipText: 'Arrastra chocolates, rosas o cartas a la caja.',
    },
    bedding: {
      title: 'Virutas de Papel',
      spokenText: '¡Genial! Vamos a esparcir virutas suaves en el fondo para proteger tus regalos.',
      tipText: 'Pulsa para esparcir papel.',
    },
    item_dropped: {
      title: '¡Regalo Añadido a la Caja!',
      spokenText: '¡Excelente! Ahora elige otro detalle especial de la bandeja inferior.',
      tipText: 'Añade todos los regalos que desees.',
    },
    speak_letter: {
      title: 'Habla para Escribir la Carta',
      spokenText: 'Toca el micrófono verde y habla desde el corazón. La IA escribirá una hermosa carta.',
      tipText: 'Habla en tu idioma materno.',
    },
    scrapbook: {
      title: 'Álbum de Fotos Polaroid',
      spokenText: 'Añade fotos especiales y escribe notas con cariño.',
      tipText: 'Sube fotos y añade notas.',
    },
    voice: {
      title: 'Mensaje de Voz Real',
      spokenText: 'Graba tu propia voz para que la escuchen al abrir la caja.',
      tipText: 'Pulsa para grabar.',
    },
    capsule: {
      title: 'Cápsula del Tiempo',
      spokenText: 'Bloquea este regalo con una fecha especial en el futuro.',
      tipText: 'Elige la fecha de apertura.',
    },
    seal: {
      title: 'Sellar con Cera',
      spokenText: '¡Increíble! Tu caja está lista. Vamos a sellarla con cera y compartir el enlace.',
      tipText: 'Sella y comparte.',
    },
  },
  fr: {
    welcome: {
      title: 'Bonjour! Je suis votre Guide',
      spokenText: 'Bonjour! Créons ensemble un coffret cadeau magique. Glissez un objet du bas directement dans le coffret.',
      tipText: 'Glissez un chocolat ou une lettre.',
    },
    bedding: {
      title: 'Papier de Soie',
      spokenText: 'Disposons de jolis copeaux de papier doux au fond du coffret.',
      tipText: 'Cliquez pour garnir le coffret.',
    },
    item_dropped: {
      title: 'Cadeau Déposé!',
      spokenText: 'Magnifique! Choisissez maintenant un autre souvenir précieux.',
      tipText: 'Ajoutez d\'autres trésors.',
    },
    speak_letter: {
      title: 'Dictez votre Lettre d\'Amour',
      spokenText: 'Appuyez sur le micro vert et parlez, l\'IA rédigera une lettre poétique.',
      tipText: 'Parlez avec votre cœur.',
    },
    scrapbook: {
      title: 'Album Photos Polaroid',
      spokenText: 'Ajoutez vos photos souvenirs et de douces légendes.',
      tipText: 'Ajoutez vos clichés.',
    },
    voice: {
      title: 'Message Vocal Authentique',
      spokenText: 'Enregistrez votre vraie voix pour émouvoir votre proche.',
      tipText: 'Enregistrez votre voix.',
    },
    capsule: {
      title: 'Capsule Temporelle',
      spokenText: 'Scellez ce cadeau jusqu\'à une date future précise.',
      tipText: 'Choisissez une date.',
    },
    seal: {
      title: 'Sceller à la Cire',
      spokenText: 'Parfait! Scellons le coffret à la cire et partageons le lien.',
      tipText: 'Scellez et partagez.',
    },
  },
  it: {
    welcome: {
      title: 'Ciao! Sono la tua Guida',
      spokenText: 'Ciao! Creiamo un magico scrigno regalo per la tua persona speciale. Trascina un oggetto dal basso nello scrigno.',
      tipText: 'Trascina un regalo nello scrigno.',
    },
    bedding: {
      title: 'Trucioli di Carta Soffice',
      spokenText: 'Spargiamo trucioli di carta sul fondo per proteggere i tuoi regali.',
      tipText: 'Clicca per spargere la carta.',
    },
    item_dropped: {
      title: 'Regalo Inserito!',
      spokenText: 'Perfetto! Ora scegli un altro regalo speciale dal vassoio in basso.',
      tipText: 'Aggiungi altri ricordi.',
    },
    speak_letter: {
      title: 'Detta la tua Lettera d\'Amore',
      spokenText: 'Tocca il microfono verde e parla con il cuore. L\'IA comporrà una lettera poetica.',
      tipText: 'Parla al microfono.',
    },
    scrapbook: {
      title: 'Album Fotografico',
      spokenText: 'Aggiungi le vostre foto con nastri washi e dediche affettuose.',
      tipText: 'Carica le foto.',
    },
    voice: {
      title: 'Messaggio Vocale',
      spokenText: 'Registra la tua vera voce per far battere il loro cuore.',
      tipText: 'Registra la tua voce.',
    },
    capsule: {
      title: 'Capsula del Tempo',
      spokenText: 'Blocca questo dono fino a una data futura speciale.',
      tipText: 'Scegli la data di sblocco.',
    },
    seal: {
      title: 'Sigilla con Ceralacca',
      spokenText: 'Meraviglioso! Sigilliamo lo scrigno e condividiamo il link speciale.',
      tipText: 'Sigilla e invia.',
    },
  },
  de: {
    welcome: {
      title: 'Hallo! Ich bin dein Geschenk-Guide',
      spokenText: 'Hallo! Lass uns eine zauberhafte Schatztruhe voller Liebe gestalten. Ziehe ein Geschenk von unten direkt in die Truhe.',
      tipText: 'Geschenk in die Truhe ziehen.',
    },
    bedding: {
      title: 'Weiche Papierstreifen',
      spokenText: 'Verteilen wir weiche Papierstreifen am Boden der Schatztruhe.',
      tipText: 'Klicken zum Verteilen.',
    },
    item_dropped: {
      title: 'Geschenk Hinzugefügt!',
      spokenText: 'Wunderbar! Wähle jetzt ein weiteres Geschenk aus.',
      tipText: 'Füge weitere Geschenke hinzu.',
    },
    speak_letter: {
      title: 'Brief per Spracheingabe verfassen',
      spokenText: 'Tippe auf das grüne Mikrofon und sprich frei heraus. Die KI schreibt einen gefühlvollen Brief.',
      tipText: 'Sprich ins Mikrofon.',
    },
    scrapbook: {
      title: 'Polaroid Fotoalbum',
      spokenText: 'Füge Fotos und handgeschriebene Erinnerungen hinzu.',
      tipText: 'Fotos hochladen.',
    },
    voice: {
      title: 'Echte Sprachnachricht',
      spokenText: 'Nimm deine echte Stimme auf, die beim Öffnen erklingt.',
      tipText: 'Stimme aufnehmen.',
    },
    capsule: {
      title: 'Zeitkapsel-Schloss',
      spokenText: 'Verschließe dieses Geschenk bis zu einem bestimmten Datum.',
      tipText: 'Datum auswählen.',
    },
    seal: {
      title: 'Mit Wachs versiegeln',
      spokenText: 'Großartig! Deine Truhe ist fertig zum Versiegeln und Verschicken.',
      tipText: 'Versiegeln und teilen.',
    },
  },
  ar: {
    welcome: {
      title: 'مرحباً! أنا دليلك الصوتي لصنع الهدية',
      spokenText: 'مرحباً بك! دعنا نصنع صندوق هدايا ساحر لمن تحب. اسحب أي هدية من الأسفل وضعها داخل الصندوق.',
      tipText: 'اسحب الشوكولاتة أو الرسائل إلى الصندوق.',
    },
    bedding: {
      title: 'قصاصات الورق الناعمة',
      spokenText: 'دعنا ننثر قصاصات ورقية ملونة في قاع الصندوق لتزيين الهدايا.',
      tipText: 'انقر لنثر الورق.',
    },
    item_dropped: {
      title: 'تمت إضافة الهدية!',
      spokenText: 'رائع جداً! الآن اختر هدية أخرى من الأسفل وضعها في الصندوق.',
      tipText: 'أضف المزيد من الهدايا.',
    },
    speak_letter: {
      title: 'تحدث لكتابة رسالة حب شعرية',
      spokenText: 'اضغط على الميكروفون الأخضر وتحدث بمشاعرك، وسيقوم الذكاء الاصطناعي بصياغة رسالة ساحرة.',
      tipText: 'تحدث بلغتك الأم.',
    },
    scrapbook: {
      title: 'ألبوم صور الذكريات',
      spokenText: 'أضف صوركما مع عبارات لطيفة وتواريخ مميزة.',
      tipText: 'أضف الصور والذكريات.',
    },
    voice: {
      title: 'تسجيل صوتي حقيقي',
      spokenText: 'سجل صوتك الحقيقي ليسمع دقات قلبك عند فتح الصندوق.',
      tipText: 'سجل صوتك الآن.',
    },
    capsule: {
      title: 'كبسولة الزمن المقفلة',
      spokenText: 'اقفل هذه المفاجأة بتاريخ مستقبلي خاص.',
      tipText: 'اختر تاريخ الفتح.',
    },
    seal: {
      title: 'ختم الصندوق بالشمع',
      spokenText: 'ممتاز! الصندوق جاهز للختم بالشمع وإرسال الرابط.',
      tipText: 'اختم وشارك الرابط.',
    },
  },
  ja: {
    welcome: {
      title: 'こんにちは！ギフトガイドです',
      spokenText: 'こんにちは！大切な人のために、素敵な宝石箱を作りましょう。下のトレイからアイテムを箱へドラッグしてください。',
      tipText: 'アイテムを箱にドラッグしてください。',
    },
    bedding: {
      title: 'やわらかい紙パッキン',
      spokenText: '箱の底に柔らかい紙パッキンを敷き詰めて、プレゼントを優しく包みましょう。',
      tipText: 'クリックして紙パッキンを敷く。',
    },
    item_dropped: {
      title: 'ギフトが箱に入りました！',
      spokenText: '素敵です！続いて他のアイテムも箱に詰めていきましょう。',
      tipText: 'もっとアイテムを追加できます。',
    },
    speak_letter: {
      title: '声で手紙を書く',
      spokenText: '緑のマイクを押して想いを話してください。AIが感動的な手紙に仕上げます。',
      tipText: 'マイクを押して日本語で話す。',
    },
    scrapbook: {
      title: 'ポラロイド写真アルバム',
      spokenText: '思い出の写真と温かいメッセージを添えましょう。',
      tipText: '写真を追加する。',
    },
    voice: {
      title: '肉声メッセージ',
      spokenText: 'あなたの声を録音して、箱を開けた瞬間に届けましょう。',
      tipText: '声を録音する。',
    },
    capsule: {
      title: 'タイムカプセル',
      spokenText: '未来の特別な日まで開かない鍵をかけましょう。',
      tipText: '日付を設定する。',
    },
    seal: {
      title: 'シーリングワックスで封印',
      spokenText: '完成です！ワックスで封印して、大切な人へリンクを届けましょう。',
      tipText: '封印して共有する。',
    },
  },
  en: {
    welcome: {
      title: 'Hello! I am your Audio Gift Guide',
      spokenText: 'Hello! Let\'s craft a magical, heartfelt keepsake box for your special someone. Drag any gift from the bottom tray directly into the open box above.',
      tipText: 'Drag gifts, chocolates, or letters into the box.',
    },
    bedding: {
      title: 'Soft Paper Bedding',
      spokenText: 'Let\'s scatter soft shredded kraft paper inside the box base to cradle your gifts with care.',
      tipText: 'Click to scatter paper shavings.',
    },
    item_dropped: {
      title: 'Gift Packed in Box!',
      spokenText: 'Wonderful! The gift is tucked neatly inside. Pick another special treasure from the tray below.',
      tipText: 'Add as many gifts as you like.',
    },
    speak_letter: {
      title: 'Speak to Write Your Letter',
      spokenText: 'Tap the glowing green microphone and speak freely. AI will transform your voice into a poetic parchment letter.',
      tipText: 'Tap mic and speak naturally.',
    },
    scrapbook: {
      title: 'Polaroid Memory Album',
      spokenText: 'Add your favorite photos with tilted washi tapes and sweet handwritten memories.',
      tipText: 'Upload photos & captions.',
    },
    voice: {
      title: 'Real Voice Message',
      spokenText: 'Record your authentic voice so they hear your loving words the moment they open the chest.',
      tipText: 'Record your voice message.',
    },
    capsule: {
      title: 'Time-Capsule Vault Lock',
      spokenText: 'Lock this special surprise with a milestone countdown timer until that special day!',
      tipText: 'Choose future unlock date.',
    },
    seal: {
      title: 'Wax Seal & Share',
      spokenText: 'Magnificent! Your keepsake hamper is packed with love. Let\'s seal it with warm wax and generate your secret link.',
      tipText: 'Seal the box and share link.',
    },
  },
};

export const AudioProcessGuide: React.FC<AudioProcessGuideProps> = ({
  currentLanguage,
  currentAction,
  onMicClick,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const hasAutoPlayedRef = useRef<Record<string, boolean>>({});

  const langScripts = AUDIO_GUIDE_SCRIPTS[currentLanguage] || AUDIO_GUIDE_SCRIPTS.en;
  const script = langScripts[currentAction] || langScripts.welcome;

  // Speak when action changes
  const speakCurrentScript = (force: boolean = false) => {
    if (isMuted && !force) return;

    stopNativeSpeech();
    playPianoNote(523.25, 0.4, 0.04);

    setIsSpeaking(true);
    speakNativeSpeech(
      script.spokenText,
      currentLanguage,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  useEffect(() => {
    const key = `${currentLanguage}-${currentAction}`;
    if (!hasAutoPlayedRef.current[key] && !isMuted) {
      hasAutoPlayedRef.current[key] = true;
      const timer = setTimeout(() => {
        speakCurrentScript();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentAction, currentLanguage, isMuted]);

  const handleToggleMute = () => {
    if (isSpeaking) {
      stopNativeSpeech();
      setIsSpeaking(false);
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
      speakCurrentScript(true);
    } else {
      speakCurrentScript(true);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#FFFDF9] via-[#FBF7EE] to-[#FFF9F0] border-2 border-[#D4AF37]/35 rounded-2xl p-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Animated Avatar Mascot */}
        <div className="flex items-center gap-3">
          <motion.div
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white shadow-md cursor-pointer shrink-0"
            onClick={() => speakCurrentScript(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">👩‍🎨</span>
            {isSpeaking && (
              <motion.div
                className="absolute -inset-1 rounded-full border-2 border-[#D4AF37]"
                animate={{ scale: [1, 1.25, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              />
            )}
          </motion.div>

          {/* Dialogue & Subtitles */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8C6D37] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                {script.title}
              </span>
              {isSpeaking && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[10px] font-bold text-[#8C6D37] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  बोल रहे हैं...
                </span>
              )}
            </div>
            {showSubtitles && (
              <p className="text-xs font-serif text-[#2D241E] leading-relaxed mt-0.5 line-clamp-2">
                "{script.spokenText}"
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onMicClick && (
            <button
              type="button"
              onClick={onMicClick}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer animate-pulse"
              title="बोलकर खत लिखें"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">बोलें</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => speakCurrentScript(true)}
            className="p-2 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-[#8C6D37] transition-all cursor-pointer"
            title="पुन्हा ऐका (Replay Voice)"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isMuted
                ? 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                : 'bg-[#D4AF37]/20 text-[#8C6D37] hover:bg-[#D4AF37]/30'
            }`}
            title={isMuted ? 'Unmute Voice Guide' : 'Mute Voice Guide'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
