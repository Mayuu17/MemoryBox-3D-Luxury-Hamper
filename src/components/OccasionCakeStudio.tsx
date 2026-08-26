import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HamperItem, HamperBox } from '../types';
import { Sparkles, Cake, Flame, Heart, RefreshCw, Wind, PartyPopper, Check } from 'lucide-react';
import { playPianoNote } from '../utils/audio';

interface OccasionCakeStudioProps {
  cakeItem: HamperItem;
  recipientName: string;
  senderName: string;
  boxOccasion: string;
  currentLanguage?: string;
  onUpdate: (updatedItem: HamperItem) => void;
}

export const OccasionCakeStudio: React.FC<OccasionCakeStudioProps> = ({
  cakeItem,
  recipientName,
  senderName,
  boxOccasion,
  currentLanguage = 'en',
  onUpdate,
}) => {
  const flavor = cakeItem.payload.cakeFlavor || 'red_velvet';
  const occasion = cakeItem.payload.cakeOccasion || (boxOccasion === 'birthday' ? 'birthday' : 'anniversary');
  const message = cakeItem.payload.cakeMessage || `Happy ${occasion === 'birthday' ? 'Birthday' : 'Anniversary'} ${recipientName || 'My Love'} ✨`;
  const candleCount = cakeItem.payload.candleCount || 4;
  const wishBannerText = cakeItem.payload.wishBannerText || 'Make a Wish! ✨';
  const wishSecretNote =
    cakeItem.payload.wishSecretNote ||
    `May our days be filled with endless laughter, quiet hugs, and dreams that come true together.`;

  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  const FLAVORS: { id: any; name: string; desc: string; color: string }[] = [
    {
      id: 'red_velvet',
      name: 'Royal Red Velvet',
      desc: 'Crimson velvet sponge with cream cheese swirls & gold dust',
      color: 'bg-rose-900 border-rose-400 text-rose-100',
    },
    {
      id: 'belgian_chocolate',
      name: 'Belgian Dark Chocolate',
      desc: 'Rich dark cocoa ganache with golden glaze ribbons',
      color: 'bg-stone-900 border-amber-500 text-amber-100',
    },
    {
      id: 'vanilla_rose',
      name: 'French Vanilla Rose',
      desc: 'Pastel blush frosting with champagne shimmer',
      color: 'bg-pink-100 border-pink-400 text-pink-900',
    },
    {
      id: 'vintage_berry',
      name: 'Vintage Berry Mascarpone',
      desc: 'Wild berries with lavender glaze and white blossoms',
      color: 'bg-purple-950 border-purple-400 text-purple-100',
    },
    {
      id: 'royal_truffle',
      name: 'Ivory Gold Truffle',
      desc: 'Handmade almond cream with baroque filigree piping',
      color: 'bg-amber-100 border-amber-400 text-amber-950',
    },
  ];

  const OCCASIONS: { id: any; name: string; emoji: string }[] = [
    { id: 'birthday', name: 'Birthday Bash', emoji: '🎂' },
    { id: 'anniversary', name: 'Anniversary Milestone', emoji: '💍' },
    { id: 'love', name: 'Just Love & Romance', emoji: '❤️' },
    { id: 'celebration', name: 'Special Victory', emoji: '🥂' },
  ];

  const updatePayload = (partial: Partial<typeof cakeItem.payload>) => {
    onUpdate({
      ...cakeItem,
      payload: {
        ...cakeItem.payload,
        ...partial,
      },
    });
  };

  const handleGenerateAISlogan = async () => {
    setIsGeneratingMessage(true);
    try {
      const prompt = `Write a short, ultra-sweet handwritten cake inscription for ${recipientName || 'a loved one'} for a ${occasion} in ${currentLanguage === 'mr' ? 'Marathi (मराठी)' : currentLanguage === 'hi' ? 'Hindi (हिंदी)' : currentLanguage} language. Maximum 5-7 words. Examples in Marathi: "लग्नाच्या वाढदिवसाच्या शुभेच्छा ✨", "तुझ्यावर अथांग प्रेम ❤️". Return just the plain string without quotes.`;
      const res = await fetch('/api/gemini/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: recipientName || 'My Love',
          senderName: senderName || 'Me',
          occasion,
          mood: 'romantic',
          relationship: 'partner',
          language: currentLanguage,
          additionalNotes: prompt,
        }),
      });
      const data = await res.json();
      if (data.letter) {
        const shortMsg = data.letter.split('\n')[0].slice(0, 45);
        updatePayload({ cakeMessage: shortMsg });
        playPianoNote(587.33, 1.2, 0.1);
      }
    } catch (e) {
      updatePayload({ cakeMessage: `To My Favorite Person, ${recipientName || 'Always'} ✨` });
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Occasion Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6239] mb-2">
          1. Select Cake Occasion
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.id}
              type="button"
              onClick={() => updatePayload({ cakeOccasion: occ.id })}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                occasion === occ.id
                  ? 'bg-[#8B0000] text-[#F5E6C8] border-[#D4AF37] shadow-md'
                  : 'bg-white border-[#D4C3A3] text-[#2D241E] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className="text-xl">{occ.emoji}</span>
              <span className="text-xs font-bold leading-tight">{occ.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Flavor Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6239] mb-2">
          2. Artisanal Cake Flavor & Aesthetic
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FLAVORS.map((flv) => (
            <button
              key={flv.id}
              type="button"
              onClick={() => updatePayload({ cakeFlavor: flv.id })}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                flavor === flv.id
                  ? 'ring-2 ring-[#B8860B] border-[#B8860B] bg-[#FFF8E7] shadow-md'
                  : 'bg-white border-[#D4C3A3] hover:bg-[#FAF7F2]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#2D241E]">{flv.name}</span>
                {flavor === flv.id && <Check className="w-4 h-4 text-[#B8860B]" />}
              </div>
              <p className="text-[11px] text-[#7A6856] leading-tight font-serif italic">
                {flv.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Candle Count */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8C6239]">
            3. Candle Count ({candleCount} Lit Candles)
          </label>
          <span className="text-xs text-[#8C6239] font-serif italic">
            Recipient will blow these out on microphone!
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => updatePayload({ candleCount: num })}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                candleCount === num
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-md'
                  : 'bg-white border border-[#D4C3A3] text-[#5A4634] hover:bg-[#FAF7F2]'
              }`}
            >
              🕯️ {num}
            </button>
          ))}
        </div>
      </div>

      {/* Hand-piped Frosting Inscription */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8C6239]">
            4. Hand-piped Cake Inscription
          </label>
          <button
            type="button"
            onClick={handleGenerateAISlogan}
            disabled={isGeneratingMessage}
            className="text-[11px] font-bold text-[#8B0000] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#B8860B]" />
            <span>{isGeneratingMessage ? 'Writing Slogan...' : 'AI Inscription Suggestion'}</span>
          </button>
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => updatePayload({ cakeMessage: e.target.value })}
          placeholder="e.g. Happy Birthday Ananya ✨"
          className="w-full px-4 py-2.5 rounded-xl border border-[#D4C3A3] bg-white font-script text-xl text-[#2D241E] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
        />
      </div>

      {/* Secret Wish Blessing Note */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
          5. Secret Blessing Revealed Upon Candle Blow
        </label>
        <textarea
          rows={2}
          value={wishSecretNote}
          onChange={(e) => updatePayload({ wishSecretNote: e.target.value })}
          placeholder="May every star in the sky watch over you..."
          className="w-full px-4 py-2 rounded-xl border border-[#D4C3A3] bg-white text-xs text-[#2D241E] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
        />
      </div>
    </div>
  );
};
