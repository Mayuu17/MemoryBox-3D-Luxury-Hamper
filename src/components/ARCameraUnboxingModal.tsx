import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox } from '../types';
import { BOX_THEMES } from '../utils/themes';
import {
  Camera,
  X,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Maximize2,
  RefreshCw,
  Gift,
  Lock,
  ArrowRight,
  Flame,
  Check,
} from 'lucide-react';
import {
  playWaxSealCrackSound,
  playBoxOpenCreakSound,
  playPaperCrinkleSound,
  playPianoNote,
} from '../utils/audio';
import confetti from 'canvas-confetti';

interface ARCameraUnboxingModalProps {
  box: HamperBox;
  isOpen: boolean;
  onClose: () => void;
  onEnterFullExperience: () => void;
}

export const ARCameraUnboxingModal: React.FC<ARCameraUnboxingModalProps> = ({
  box,
  isOpen,
  onClose,
  onEnterFullExperience,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasPermissionError, setHasPermissionError] = useState<boolean>(false);
  const [boxState, setBoxState] = useState<'sealed' | 'cracking' | 'open'>('sealed');
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const theme = BOX_THEMES[box.theme] || BOX_THEMES.royal_velvet_burgundy;

  // Initialize Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen) {
      setBoxState('sealed');
      setCapturedSnapshot(null);
      setHasPermissionError(false);

      navigator.mediaDevices
        ?.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
            setCameraActive(true);
          }
        })
        .catch((err) => {
          console.warn('Camera access not granted or unavailable:', err);
          setHasPermissionError(true);
          setCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCrackSealInAR = () => {
    if (boxState === 'open') return;

    playWaxSealCrackSound();
    setBoxState('cracking');

    setTimeout(() => {
      playBoxOpenCreakSound();
      setBoxState('open');

      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FF4D6D', '#FAF7F2', '#E2C799'],
        });
      } catch (e) {}
    }, 600);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    playPaperCrinkleSound();
    playPianoNote(659.25, 1.0, 0.1);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/png');
      setCapturedSnapshot(data);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none">
        {/* Hidden Canvas for Snapshots */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Camera Video Feed */}
        {cameraActive && !hasPermissionError ? (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          /* Fallback Atmospheric Virtual Studio Environment */
          <div className="absolute inset-0 bg-radial from-[#3A2228] via-[#1F1215] to-[#0D080A] flex flex-col items-center justify-center text-center p-6 z-0">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-[#D4AF37]/40 flex items-center justify-center mb-3">
              <Camera className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h4 className="text-white font-serif-title text-xl font-bold">
              Augmented Reality Virtual Room
            </h4>
            <p className="text-stone-300 text-xs max-w-sm mt-1">
              {hasPermissionError
                ? 'Camera stream simulation mode enabled. Point your gaze at the floating keepsake chest.'
                : 'Connecting to device camera optics...'}
            </p>
          </div>
        )}

        {/* AR HUD Camera Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Subtle Reticle Target Frame */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 border border-white/20 rounded-3xl">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />
          </div>

          {/* AR Floating Particle Sparks */}
          <div className="absolute top-12 left-8 text-[#D4AF37]/60 text-xs animate-pulse">✦ AR Tracking Active</div>
          <div className="absolute top-12 right-8 text-[#FF4D6D]/60 text-xs animate-bounce">💖 Spatial Hamper Lock</div>
        </div>

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-white text-xs font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
            <span>AR Mode: {box.recipientName}'s Hamper</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFacingMode}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white hover:bg-black/80 transition-all cursor-pointer"
              title="Switch Camera (Front/Back)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white hover:bg-black/80 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D FLOATING KEEPSAKE BOX IN AR SPACE */}
        <div className="relative z-20 flex flex-col items-center justify-center p-4 max-w-md w-full">
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotateZ: isHovered ? [0, -1, 1, 0] : [0, 0.5, -0.5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.5,
              ease: 'easeInOut',
            }}
            onClick={handleCrackSealInAR}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="cursor-pointer group relative w-full"
          >
            {/* Glowing Golden Aura under Box */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-12 bg-radial from-[#D4AF37]/80 to-transparent blur-xl pointer-events-none" />

            {/* 3D Chest Container */}
            <div className={`relative rounded-3xl p-6 sm:p-7 ${theme.boxBorder} border-2 luxury-box-shadow overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-700 shadow-2xl`}>
              {/* Velvet Lid Background */}
              <div className={`absolute inset-0 ${theme.lidGradient} opacity-90`} />

              {/* Gold Filigree Inset */}
              <div className="absolute inset-2.5 rounded-2xl border border-[#D4AF37]/60 pointer-events-none" />

              {/* Ribbon Cross: Vertical & Horizontal */}
              <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 sm:w-12 ${theme.ribbonGradient} shadow-md z-10 flex items-center justify-center opacity-95`} />
              <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-10 sm:h-12 ${theme.ribbonGradient} shadow-md z-10 flex items-center justify-center opacity-95`} />

              {/* Box Content / Inside Reveal when Open */}
              {boxState === 'open' ? (
                <div className="relative z-20 py-6 text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-14 h-14 mx-auto rounded-2xl bg-white/90 border-2 border-[#D4AF37] flex items-center justify-center shadow-xl text-[#8B0000]"
                  >
                    <Gift className="w-8 h-8" />
                  </motion.div>
                  <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                    Keepsake Box Unsealed!
                  </h3>
                  <p className="text-xs text-[#FAF7EE] max-w-xs mx-auto drop-shadow-sm">
                    {box.items.length} precious keepsakes, letters, voice notes, and surprises await inside.
                  </p>
                </div>
              ) : (
                <div className="relative z-20 py-8 text-center space-y-4">
                  {/* Wax Seal in Center */}
                  <motion.div
                    animate={
                      boxState === 'cracking'
                        ? { scale: [1, 1.2, 0], rotate: [0, 15, -15, 30] }
                        : { scale: 1 }
                    }
                    className="w-16 h-16 mx-auto rounded-full bg-[#8B0000] border-2 border-[#D4AF37] shadow-2xl flex items-center justify-center text-[#F5E6C8] font-cinzel font-bold text-sm"
                  >
                    {box.waxSealInitials || 'MB'}
                  </motion.div>

                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-bold text-[#F5E6C8] block">
                      Tap to Break Wax Seal in AR
                    </span>
                    <h4 className="font-serif-title text-lg font-bold text-white mt-0.5">
                      To: {box.recipientName}
                    </h4>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom AR Action Bar */}
        <div className="absolute bottom-6 left-4 right-4 z-30 flex items-center justify-center gap-3 pointer-events-auto">
          {/* Shutter Button to Snap AR Moment */}
          <button
            onClick={handleCaptureSnapshot}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
            title="Take Photo of AR MemoryBox"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#8B0000]">
              <Camera className="w-5 h-5" />
            </div>
          </button>

          {/* Enter Detailed Keepsake Vault Button */}
          <button
            onClick={() => {
              onClose();
              onEnterFullExperience();
            }}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-xs sm:text-sm shadow-xl hover:brightness-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore All 7 Keepsakes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Snapshot Preview Toast if Taken */}
        <AnimatePresence>
          {capturedSnapshot && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute bottom-24 right-6 z-40 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border border-[#D4AF37] flex items-center gap-3"
            >
              <img
                src={capturedSnapshot}
                alt="AR Snapshot"
                className="w-16 h-12 object-cover rounded-lg border border-stone-200"
              />
              <div className="pr-2">
                <p className="text-[11px] font-bold text-[#2D241E]">AR Photo Captured! 📸</p>
                <a
                  href={capturedSnapshot}
                  download={`MemoryBox-AR-${box.recipientName}.png`}
                  className="text-[10px] text-[#8B0000] font-bold underline block mt-0.5"
                >
                  Download Photo
                </a>
              </div>
              <button
                onClick={() => setCapturedSnapshot(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
