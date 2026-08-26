import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, Square, Play, Pause, Disc, Volume2, RotateCcw, SkipForward, AlertCircle } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { CREATOR_STUDIO_TRANSLATIONS } from '../utils/languages';
import { playPianoNote } from '../utils/audio';

interface CassetteRecorderStudioProps {
  currentLanguage: SupportedLanguage;
  voiceTitle: string;
  onChangeTitle: (title: string) => void;
  voiceTranscript: string;
  onChangeTranscript: (text: string) => void;
  audioData?: string;
  onChangeAudioData: (audioUrl?: string) => void;
  durationSeconds: number;
  onChangeDuration: (seconds: number) => void;
  onSkipModule?: () => void;
}

const MAX_RECORD_SECONDS = 60; // Strict 60-second limit

export const CassetteRecorderStudio: React.FC<CassetteRecorderStudioProps> = ({
  currentLanguage,
  voiceTitle,
  onChangeTitle,
  voiceTranscript,
  onChangeTranscript,
  audioData,
  onChangeAudioData,
  durationSeconds,
  onChangeDuration,
  onSkipModule,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentSeconds, setCurrentSeconds] = useState<number>(durationSeconds || 0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const t = CREATOR_STUDIO_TRANSLATIONS[currentLanguage] || CREATOR_STUDIO_TRANSLATIONS.en;
  const vt = t?.voice;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Strict 60s auto-stop handler
  useEffect(() => {
    if (isRecording && currentSeconds >= MAX_RECORD_SECONDS) {
      stopRecording();
    }
  }, [currentSeconds, isRecording]);

  const startRecording = async () => {
    try {
      playPianoNote(440, 1.0, 0.08);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        onChangeAudioData(url);
        onChangeDuration(currentSeconds);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setCurrentSeconds(0);
      timerRef.current = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev + 1 >= MAX_RECORD_SECONDS) {
            setTimeout(() => stopRecording(), 50);
            return MAX_RECORD_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission not granted or unsupported, simulating voice note:', err);
      setIsRecording(true);
      setCurrentSeconds(0);
      timerRef.current = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev + 1 >= MAX_RECORD_SECONDS) {
            setTimeout(() => stopRecording(), 50);
            return MAX_RECORD_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      onChangeAudioData('simulated_audio');
      onChangeDuration(currentSeconds > 0 ? currentSeconds : 30);
    }
    playPianoNote(659.25, 1.5, 0.1);
  };

  const togglePlayback = () => {
    if (!audioData) return;
    if (isPlaying) {
      if (audioElementRef.current) audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      playPianoNote(523.25, 0.8, 0.05);
      if (audioData.startsWith('blob:') && audioElementRef.current) {
        audioElementRef.current.play();
        setIsPlaying(true);
      } else {
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), 3000);
      }
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentSeconds / MAX_RECORD_SECONDS) * 100);

  return (
    <div id="cassette-recorder-module" className="space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs relative overflow-hidden flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B1E2D]/10 border border-[#8B1E2D]/20 flex items-center justify-center text-[#8B1E2D]">
            <Disc className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif font-bold text-[#2D241E]">
                {vt?.title || 'Vintage Cassette Voice Note'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                Max 60s Lightweight
              </span>
            </div>
            <p className="text-xs text-[#7A6856]">
              {vt?.subtitle || 'Record your real voice directly from your browser so they can hear your heartbeat'}
            </p>
          </div>
        </div>

        {onSkipModule && (
          <button
            type="button"
            onClick={onSkipModule}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip Voice Note</span>
          </button>
        )}
      </div>

      {/* Cassette Tape Deck UI */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2B231D] to-[#1C1714] border-2 border-[#D4AF37]/50 shadow-xl text-stone-200 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-700/60 pb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
              Artisan Hi-Fi Cassette Tape Deck
            </span>
          </div>
          
          {/* Live Visual Counting Timer (00:00 / 01:00) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded bg-black/80 text-amber-400 border border-amber-500/40 font-bold shadow-inner">
              {isRecording
                ? `REC [ ${formatTimer(currentSeconds)} / 01:00 ]`
                : audioData
                ? `READY [ ${formatTimer(durationSeconds || currentSeconds)} / 01:00 ]`
                : 'IDLE [ 00:00 / 01:00 ]'}
            </span>
          </div>
        </div>

        {/* Live Audio Waveform & 60s Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden border border-stone-700">
            <motion.div
              className={`h-full transition-all duration-300 ${
                currentSeconds >= 50
                  ? 'bg-rose-500'
                  : currentSeconds >= 35
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
            <span>00:00</span>
            <span className="text-[#D4AF37] font-bold">Strict 60s Limit</span>
            <span>01:00 MAX</span>
          </div>
        </div>

        {/* Vintage Tape Window with Reels */}
        <div className="p-4 rounded-2xl bg-[#3B3028] border border-[#5A483C] flex items-center justify-around relative overflow-hidden">
          {/* Left Reel */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: isRecording || isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-4 border-dashed border-[#D4AF37]/70 bg-black/40 flex items-center justify-center shadow-inner"
            >
              <div className="w-5 h-5 rounded-full bg-[#1C1714] border border-[#D4AF37]" />
            </motion.div>
            <span className="text-[9px] text-[#D4AF37]/80 mt-1 font-mono">SIDE A</span>
          </div>

          {/* Central Magnetic Tape Window with Live Audio Wave Visualizer */}
          <div className="w-36 h-12 rounded-lg bg-black/80 border border-[#D4AF37]/30 flex items-center justify-center px-3">
            {isRecording ? (
              <div className="flex items-center gap-1.5 w-full justify-center">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [
                        `${Math.floor(Math.sin(i + currentSeconds) * 12 + 16)}px`,
                        `${Math.floor(Math.cos(i + currentSeconds) * 14 + 20)}px`,
                        '6px',
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 0.45, delay: i * 0.05 }}
                    className="w-1 bg-rose-500 rounded-full shadow-xs"
                  />
                ))}
              </div>
            ) : isPlaying ? (
              <div className="flex items-center gap-1.5 w-full justify-center">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['8px', '26px', '10px'] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.06 }}
                    className="w-1 bg-[#D4AF37] rounded-full"
                  />
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-stone-500 font-mono tracking-widest text-center">
                ● 60S HI-FI TAPE
              </div>
            )}
          </div>

          {/* Right Reel */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: isRecording || isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-4 border-dashed border-[#D4AF37]/70 bg-black/40 flex items-center justify-center shadow-inner"
            >
              <div className="w-5 h-5 rounded-full bg-[#1C1714] border border-[#D4AF37]" />
            </motion.div>
            <span className="text-[9px] text-[#D4AF37]/80 mt-1 font-mono">TAPE 60</span>
          </div>
        </div>

        {/* Audio Element Hidden Container */}
        {audioData && audioData.startsWith('blob:') && (
          <audio
            ref={audioElementRef}
            src={audioData}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#A30000] text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Mic className="w-4 h-4" />
              <span>{audioData ? 'Re-record Voice Note (Max 60s)' : (vt?.recordBtn || 'Start Recording Real Voice')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-900 text-xs font-bold shadow-md hover:bg-white flex items-center gap-2 cursor-pointer active:scale-98 animate-pulse"
            >
              <Square className="w-4 h-4 text-rose-600 fill-current" />
              <span>{vt?.stopBtn || 'Stop & Save Voice Note'}</span>
            </button>
          )}

          {audioData && !isRecording && (
            <button
              type="button"
              onClick={togglePlayback}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2C1D0F] text-xs font-bold shadow-md hover:brightness-105 flex items-center gap-2 cursor-pointer active:scale-98"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Playback</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Test Audio Playback</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Voice Title & Transcription */}
      <div className="bg-white/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1.5">
            Voice Note Label
          </label>
          <input
            type="text"
            value={voiceTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="e.g. A Whisper for When You Miss Me"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4AF37]/30 text-sm font-semibold text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37]/40 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4524] mb-1.5">
            Spoken Transcription / Accompanying Message (Optional)
          </label>
          <textarea
            rows={3}
            value={voiceTranscript}
            onChange={(e) => onChangeTranscript(e.target.value)}
            placeholder="Write a brief transcription or sweet note to read while listening..."
            className="w-full p-3.5 rounded-xl bg-[#FAF7EE] border border-stone-200 text-xs font-serif leading-relaxed text-[#2D241E] focus:outline-hidden focus:border-[#D4AF37]"
          />
        </div>
      </div>
    </div>
  );
};
