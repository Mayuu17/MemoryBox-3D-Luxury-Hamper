import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HamperItem, HamperBox } from '../types';
import { Feather, Sparkles, Heart, RefreshCw, Scroll, CheckCircle2 } from 'lucide-react';
import { playPianoNote } from '../utils/audio';

interface LastWhisperNoteStudioProps {
  noteItem: HamperItem;
  recipientName: string;
  senderName: string;
  boxOccasion: string;
  currentLanguage?: string;
  onUpdate: (updatedItem: HamperItem) => void;
}

export const LastWhisperNoteStudio: React.FC<LastWhisperNoteStudioProps> = ({
  noteItem,
  recipientName,
  senderName,
  boxOccasion,
  currentLanguage = 'en',
  onUpdate,
}) => {
  const title =
    noteItem.payload.lastNoteTitle || 'The Last Whispering Note (आखिरी संदेश / शेवटचा निरोप)';
  const parchmentText =
    noteItem.payload.lastNoteParchment ||
    `And so, as you reach the bottom of this little universe I built for you, know that everything packed inside here is just a humble shadow of how endlessly you are cherished.\n\nThank you for choosing to walk by my side. Whenever the world gets too noisy or the days grow long, come back to this box, play my voice, read these pages, and remember that you will always be my greatest miracle.\n\nSleep with a smile tonight.`;
  const signature =
    noteItem.payload.lastNoteSignature || `~ With Endless Devotion, ${senderName || 'Me'}`;

  const [isGenerating, setIsGenerating] = useState(false);

  const updatePayload = (partial: Partial<typeof noteItem.payload>) => {
    onUpdate({
      ...noteItem,
      payload: {
        ...noteItem.payload,
        ...partial,
      },
    });
  };

  const handleGeneratePartingProse = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Write a deep, intimate, emotional "Last Whispering Note" (शेवटचा निरोप / शेवटचे खत / अंतिम संदेश) from ${senderName || 'Sender'} to ${recipientName || 'Recipient'} placed at the bottom of a handmade gift hamper box in ${currentLanguage === 'mr' ? 'Marathi (मराठी)' : currentLanguage === 'hi' ? 'Hindi (हिंदी)' : currentLanguage} language. It should express deep gratitude, poetic tenderness, safety, and a warm final parting blessing. Keep it around 2-3 short, deeply moving paragraphs.`;
      const res = await fetch('/api/gemini/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: recipientName || 'My Dearest',
          senderName: senderName || 'Me',
          occasion: boxOccasion || 'celebration',
          mood: 'deep_emotional',
          relationship: 'partner',
          language: currentLanguage,
          additionalNotes: prompt,
        }),
      });
      const data = await res.json();
      if (data.letter) {
        updatePayload({
          lastNoteParchment: data.letter,
          lastNoteSignature: `~ With Every Breath, ${senderName || 'Me'} ❤️`,
        });
        playPianoNote(523.25, 1.5, 0.1);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/80 text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs">
        <Feather className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-amber-950">
            Mandatory Chest Keepsake: The Last Whispering Note (आखिरी संदेश)
          </p>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            This card sits permanently at the chest floor. It opens with an authentic typewriter
            keystroke animation for the recipient's final tearjerker moment.
          </p>
        </div>
      </div>

      {/* Note Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
          Note Header Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => updatePayload({ lastNoteTitle: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-[#D4C3A3] bg-white text-xs font-bold text-[#2D241E] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
        />
      </div>

      {/* Parchment Text Body */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8C6239]">
            Final Parting Words & Blessings
          </label>
          <button
            type="button"
            onClick={handleGeneratePartingProse}
            disabled={isGenerating}
            className="text-[11px] font-bold text-[#8B0000] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#B8860B]" />
            <span>{isGenerating ? 'Composing Deep Prose...' : 'AI Compose Parting Thoughts'}</span>
          </button>
        </div>
        <textarea
          rows={6}
          value={parchmentText}
          onChange={(e) => updatePayload({ lastNoteParchment: e.target.value })}
          className="w-full p-4 rounded-2xl border border-[#D4AF37]/50 bg-[#FFFDF7] font-script text-xl text-[#2D241E] leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37] shadow-inner"
        />
      </div>

      {/* Soulful Signature Line */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6239] mb-1.5">
          Soul Signature Line
        </label>
        <input
          type="text"
          value={signature}
          onChange={(e) => updatePayload({ lastNoteSignature: e.target.value })}
          placeholder="~ Aryan — Forever Your Safe Harbor ❤️"
          className="w-full px-4 py-2.5 rounded-xl border border-[#D4C3A3] bg-white font-script text-lg text-[#8B0000] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
        />
      </div>
    </div>
  );
};
