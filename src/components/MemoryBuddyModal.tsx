import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox, HamperItem, AmbientMood } from '../types';
import { X, Send, HeartHandshake, Sparkles, MessageCircleHeart, Bot, User, CheckCircle, BellRing, Phone, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPianoNote, setAmbientMoodAudio } from '../utils/audio';

interface MemoryBuddyModalProps {
  item: HamperItem;
  box: HamperBox;
  isOpen: boolean;
  onClose: () => void;
  onMoodDetected?: (mood: AmbientMood, explanation?: string) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const MemoryBuddyModal: React.FC<MemoryBuddyModalProps> = ({
  item,
  box,
  isOpen,
  onClose,
  onMoodDetected,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello ${box.recipientName}! ❤️ I am your Memory Companion for this keepsake hamper. ${box.senderName} has entrusted me with all your sweetest memories, inside jokes, and promises. What would you like to reminisce about today?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAlertToast, setActiveAlertToast] = useState<{ message: string; phone?: string } | null>(null);

  const suggestions = item.payload.promptSuggestions || [
    `Tell me about the day ${box.senderName} and I first met.`,
    `What is ${box.senderName}'s favorite memory with me?`,
    `Why is this hamper box so special?`,
    `What are our future dreams together?`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: query };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/memory-buddy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boxId: box.id,
          message: query,
          chatHistory: newMessages,
        }),
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.reply || `Every moment with you is etched forever in ${box.senderName}'s heart.`,
        },
      ]);

      if (data.detectedMood) {
        setAmbientMoodAudio(data.detectedMood);
        if (onMoodDetected) {
          onMoodDetected(data.detectedMood, data.moodExplanation);
        }
      }

      if (data.alertDispatched) {
        playPianoNote(659.25, 1.2, 0.15);
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#25D366', '#D4AF37', '#FAF7EE'],
          });
        } catch (e) {}

        setActiveAlertToast({
          message: data.alertMessage || `${box.recipientName} has accepted your emotional memory box!`,
          phone: data.senderPhone || box.senderPhone,
        });

        setTimeout(() => {
          setActiveAlertToast(null);
        }, 7500);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `I'm holding all your sweet memories right here! Ask me again in just a moment.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A1410]/85 backdrop-blur-md"
        />

        {/* Chatbot Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          className="relative w-full max-w-xl h-[85vh] max-h-[640px] flex flex-col bg-[#FAF7F2] rounded-3xl shadow-2xl border-2 border-[#D4AF37]/50 my-auto paper-texture overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#D4AF37]/30 bg-white/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8B0000]/10 border border-[#8B0000]/30 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-[#8B0000]" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#2D241E]">
                  Memory Companion
                </h3>
                <p className="text-[11px] text-[#7A6856]">
                  Trained exclusively on memories between {box.senderName} & {box.recipientName}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Real-Time WhatsApp Alert Banner Trigger Notification */}
          <AnimatePresence>
            {activeAlertToast && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="bg-emerald-900 text-emerald-100 border-b border-emerald-500 px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-md z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 border border-emerald-400 flex items-center justify-center text-white shrink-0 shadow-inner">
                    <BellRing className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-200 flex items-center gap-1.5">
                      <span>WhatsApp & SMS Alert Sent!</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </p>
                    <p className="text-[11px] text-emerald-100/90 leading-tight">
                      "{activeAlertToast.message}" → Alerted {box.senderName} {activeAlertToast.phone ? `(${activeAlertToast.phone})` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveAlertToast(null)}
                  className="text-emerald-300 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/40 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2C1D0F] font-medium rounded-tr-none'
                      : 'bg-white border border-[#E0D7C6] text-[#2D241E] rounded-tl-none font-serif text-[15px]'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#2D241E] text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-[#7A6856] italic">
                <div className="w-6 h-6 rounded-full bg-[#B8860B]/20 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3 h-3 text-[#B8860B]" />
                </div>
                <span>Memory Companion is recalling our fondest moments...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Prompts */}
          <div className="px-4 py-2 bg-white/50 border-t border-[#D4AF37]/20 flex gap-2 overflow-x-auto no-scrollbar">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="whitespace-nowrap text-[11px] font-medium px-3 py-1.5 rounded-full bg-white border border-[#D4C3A3] text-[#6B5532] hover:bg-[#FAF3E0] hover:border-[#B8860B] transition-all shadow-2xl"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#D4AF37]/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about our memories, inside jokes, or milestones..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D4C3A3] text-sm text-[#2D241E] placeholder:text-[#A89885] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#2C1D0F] disabled:opacity-40 hover:brightness-105 transition-all shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
