import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox, SharedTimelineEntry, SupportedLanguage } from '../types';
import {
  HeartHandshake,
  Camera,
  Mic,
  Mail,
  Sparkles,
  Plus,
  Heart,
  Send,
  X,
  Play,
  Pause,
  Clock,
  User,
  CheckCircle2,
  Image as ImageIcon,
  Flame,
  Award,
} from 'lucide-react';
import { playPaperCrinkleSound, playPianoNote } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TogetherMemoryTimelineProps {
  box: HamperBox;
  currentLanguage?: SupportedLanguage;
  onUpdateBox?: (updatedBox: HamperBox) => void;
}

export const TogetherMemoryTimeline: React.FC<TogetherMemoryTimelineProps> = ({
  box,
  currentLanguage = 'en',
  onUpdateBox,
}) => {
  const [timeline, setTimeline] = useState<SharedTimelineEntry[]>(box.sharedTimeline || []);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<'photo' | 'voice' | 'letter' | 'souvenir'>('photo');
  const [authorRole, setAuthorRole] = useState<'receiver' | 'sender'>('receiver');
  const [authorName, setAuthorName] = useState<string>(box.recipientName);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Sync timeline from server
  const fetchTimeline = async () => {
    try {
      const res = await fetch(`/api/boxes/${box.id}/timeline`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.timeline)) {
          setTimeline(data.timeline);
        }
      }
    } catch (e) {
      console.error('Failed to fetch timeline', e);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [box.id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setIsSubmitting(true);
    playPaperCrinkleSound();

    try {
      const res = await fetch(`/api/boxes/${box.id}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: authorName || (authorRole === 'receiver' ? box.recipientName : box.senderName),
          authorRole,
          type: composerType,
          title: title || (composerType === 'photo' ? 'Cherished Snapshot' : composerType === 'voice' ? 'Voice Reply' : 'Heartfelt Reply'),
          content,
          mediaUrl: mediaUrl || undefined,
          audioDuration: composerType === 'voice' ? 35 : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.timeline) {
          setTimeline(data.timeline);
          if (onUpdateBox) {
            onUpdateBox({
              ...box,
              sharedTimeline: data.timeline,
            });
          }
        }

        playPianoNote(659.25, 1.5, 0.12);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#D4AF37', '#8B0000', '#FAF7F2'],
          });
        } catch (e) {}

        // Reset form
        setTitle('');
        setContent('');
        setMediaUrl('');
        setIsComposerOpen(false);
      }
    } catch (err) {
      console.error('Error adding timeline memory:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleReaction = (entryId: string, emoji: string) => {
    playPianoNote(523.25, 0.8, 0.08);
    setTimeline((prev) =>
      prev.map((entry) => {
        if (entry.id === entryId) {
          const reactions = entry.reactions || [];
          return {
            ...entry,
            reactions: [...reactions, emoji],
          };
        }
        return entry;
      })
    );
  };

  return (
    <div id="together-memory-timeline-section" className="w-full max-w-4xl mx-auto my-12 px-4 select-none">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EEDC] border-2 border-[#D4AF37]/50 shadow-xl overflow-hidden mb-8 paper-texture">
        <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#D4AF37]/15 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#8B0000]/10 border border-[#8B0000]/30 flex items-center justify-center text-[#8B0000] shadow-sm flex-shrink-0">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8B0000]/10 text-[#8B0000] text-[10px] font-bold tracking-wider uppercase mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Together Mode • मिलकर यादें जोड़ें</span>
              </div>
              <h3 className="font-serif-title text-2xl font-bold text-[#2D241E]">
                Shared Memory Timeline
              </h3>
              <p className="text-xs text-[#7A6856] mt-0.5">
                This hamper is a lifelong shared digital keepsake. Both {box.senderName} and {box.recipientName} can weave photos, voice notes, and messages forever.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playPaperCrinkleSound();
              setIsComposerOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-xs sm:text-sm shadow-md hover:brightness-105 transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory to this Box</span>
          </button>
        </div>
      </div>

      {/* COMPOSER MODAL / FORM */}
      <AnimatePresence>
        {isComposerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComposerOpen(false)}
              className="fixed inset-0 bg-[#1A1410]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/60 my-auto paper-texture max-h-[90vh] overflow-y-auto z-10"
            >
              <button
                onClick={() => setIsComposerOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#8C6239]">
                  Co-Create Your Hamper
                </span>
                <h3 className="font-serif-title text-2xl font-bold text-[#2D241E] mt-1">
                  Add Your Memory & Reply
                </h3>
              </div>

              {/* Author Selector */}
              <div className="flex gap-2 p-1 bg-stone-200/60 rounded-xl mb-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthorRole('receiver');
                    setAuthorName(box.recipientName);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    authorRole === 'receiver'
                      ? 'bg-white text-[#8B0000] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  From: {box.recipientName} (Receiver Reply)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthorRole('sender');
                    setAuthorName(box.senderName);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    authorRole === 'sender'
                      ? 'bg-white text-[#8B0000] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  From: {box.senderName} (Sender)
                </button>
              </div>

              {/* Memory Type Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setComposerType('photo')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                    composerType === 'photo'
                      ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-xs'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setComposerType('voice')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                    composerType === 'voice'
                      ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-xs'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>Voice Note</span>
                </button>
                <button
                  type="button"
                  onClick={() => setComposerType('letter')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                    composerType === 'letter'
                      ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-xs'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Note</span>
                </button>
                <button
                  type="button"
                  onClick={() => setComposerType('souvenir')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                    composerType === 'souvenir'
                      ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-xs'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Milestone</span>
                </button>
              </div>

              <form onSubmit={handleAddMemory} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A4634] mb-1">
                    Memory Title / Caption
                  </label>
                  <input
                    type="text"
                    placeholder={
                      composerType === 'photo'
                        ? 'e.g., Unboxing your surprise with tears in my eyes!'
                        : composerType === 'voice'
                        ? 'e.g., My Voice Reply for you ❤️'
                        : 'e.g., Thank you from the bottom of my heart'
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4C3A3] text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                {/* Photo Upload if photo */}
                {composerType === 'photo' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A4634] mb-1">
                      Upload Photograph
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#8B0000]/10 file:text-[#8B0000] hover:file:bg-[#8B0000]/20 cursor-pointer"
                      />
                    </div>
                    {mediaUrl && (
                      <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-[#D4AF37] shadow-sm">
                        <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {/* Content Area */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A4634] mb-1">
                    Your Words & Thoughts
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your genuine feelings, reply, or the story behind this memory..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4C3A3] text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-xs sm:text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Weaving into Timeline...' : 'Save to Shared Keepsake Box'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TIMELINE FEED */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D4AF37]/40 space-y-6">
        {timeline.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-[#D4AF37]/30 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h4 className="font-serif-title text-base font-bold text-[#2D241E]">
              No Joint Memories Added Yet
            </h4>
            <p className="text-xs text-[#7A6856] max-w-sm mx-auto">
              Tap "Add Memory to this Box" above to contribute the first response polaroid or love note!
            </p>
          </div>
        ) : (
          timeline.map((entry, index) => {
            const isReceiver = entry.authorRole === 'receiver';

            return (
              <motion.div
                key={entry.id || index}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                {/* Node Dot on Timeline Line */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-4 w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[9px] ${
                    isReceiver ? 'bg-[#8B0000] text-white' : 'bg-[#D4AF37] text-[#2C1D0F]'
                  }`}
                >
                  {isReceiver ? '❤️' : '✨'}
                </div>

                {/* Card */}
                <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/35 shadow-sm hover:shadow-md transition-all space-y-3 paper-texture">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                          isReceiver
                            ? 'bg-[#8B0000]/10 text-[#8B0000] border border-[#8B0000]/20'
                            : 'bg-[#D4AF37]/20 text-[#8C6239] border border-[#D4AF37]/40'
                        }`}
                      >
                        {entry.authorName} ({isReceiver ? 'Receiver' : 'Sender'})
                      </span>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="text-xs font-serif-title font-bold text-[#8C6239]">
                      {entry.type === 'photo' ? '📸 Photograph' : entry.type === 'voice' ? '🎙️ Voice Note' : '💌 Keepsake Note'}
                    </span>
                  </div>

                  {entry.title && (
                    <h4 className="font-serif-title text-base font-bold text-[#2D241E]">
                      {entry.title}
                    </h4>
                  )}

                  {/* Photo Media if Present */}
                  {entry.mediaUrl && (
                    <div className="my-2 rounded-xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-sm max-w-sm">
                      <img src={entry.mediaUrl} alt={entry.title} className="w-full max-h-64 object-cover" />
                    </div>
                  )}

                  {/* Audio Player if Voice Note */}
                  {entry.type === 'voice' && (
                    <div className="p-3 rounded-xl bg-[#FAF3E0] border border-[#E8D7A6] flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          playPianoNote(587.33, 1.5, 0.1);
                          setPlayingAudioId(playingAudioId === entry.id ? null : entry.id);
                        }}
                        className="w-9 h-9 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                      >
                        {playingAudioId === entry.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#2D241E]">Voice Reply Audio</p>
                        <p className="text-[10px] text-stone-500">
                          {playingAudioId === entry.id ? 'Playing audio whisper...' : '0:35 Audio Message'}
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-[#4A3B32] leading-relaxed whitespace-pre-line">
                    {entry.content}
                  </p>

                  {/* Reaction Badges */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200/60">
                    <div className="flex items-center gap-1">
                      {['❤️', '🥹', '✨', '🥂'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleToggleReaction(entry.id, emoji)}
                          className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs transition-all cursor-pointer active:scale-90"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {entry.reactions && entry.reactions.length > 0 && (
                      <div className="flex items-center gap-0.5 text-xs text-stone-500 ml-2">
                        <span>{entry.reactions.join('')}</span>
                        <span className="text-[10px] text-stone-400">({entry.reactions.length})</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
