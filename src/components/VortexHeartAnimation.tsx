import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BoxOccasion, EmotionalReasonCategory } from '../types';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { playWaxSealCrackSound, playPianoNote } from '../utils/audio';

interface VortexHeartAnimationProps {
  reasonCategory?: EmotionalReasonCategory | BoxOccasion;
  customMessage?: string;
  recipientName?: string;
  senderName?: string;
  onComplete: () => void;
  durationMs?: number; // default 5200ms
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Parametric target coordinates (normalized -16 to +16 range)
  targetU: number;
  innerFactor: number; // 0.2 to 1.0 for volumetric heart fill
  baseRadius: number;
  color: string;
  alpha: number;
  glowSize: number;
  jitterPhase: number;
}

export const VortexHeartAnimation: React.FC<VortexHeartAnimationProps> = ({
  reasonCategory = 'love',
  customMessage,
  recipientName,
  senderName,
  onComplete,
  durationMs = 5200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showText, setShowText] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [ribbonUntied, setRibbonUntied] = useState(false);
  const animFrameId = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Determine dynamic emotional message
  const getEmotionalText = () => {
    if (customMessage && customMessage.trim().length > 0) {
      return customMessage;
    }
    const target = recipientName ? ` ${recipientName}` : '';
    switch (reasonCategory) {
      case 'apology':
        return `I Am Sorry${target}`;
      case 'birthday':
        return `Happy Birthday${target}`;
      case 'anniversary':
        return `Happy Anniversary${target}`;
      case 'gratitude':
        return `Thank You${target}`;
      case 'friendship':
        return `Forever Friends${target}`;
      case 'love':
      default:
        return `I Love You${target}`;
    }
  };

  const emotionalText = getEmotionalText();

  useEffect(() => {
    // Play initial acoustic shimmer
    try {
      playWaxSealCrackSound();
      setTimeout(() => playPianoNote(523.25, 0.6, 0.12), 200);
      setTimeout(() => playPianoNote(659.25, 0.5, 0.12), 600);
      setTimeout(() => playPianoNote(783.99, 0.7, 0.15), 1100);
    } catch (e) {}

    // Trigger ribbon untying animation
    const ribbonTimer = setTimeout(() => {
      setRibbonUntied(true);
    }, 400);

    // Show cursive emotional text after particles converge into heart
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1400);

    // Trigger fade-out sequence towards the end
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, Math.max(durationMs - 700, 2000));

    // Complete transition
    const endTimer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearTimeout(ribbonTimer);
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [durationMs, onComplete]);

  // Particle Physics Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle Palette
    const NEON_PALETTE = [
      '#ff2a6d', // Electric neon pink
      '#ff4382',
      '#ff6584',
      '#ff758c',
      '#ff2a8d',
      '#ffd166', // Golden ember accents
      '#ffffff', // Core sparkle white
    ];

    const PARTICLE_COUNT = 480;
    const particles: Particle[] = [];

    // Parametric Heart Equation:
    // x(u) = 16 * sin^3(u)
    // y(u) = -(13 * cos(u) - 5 * cos(2u) - 2 * cos(3u) - cos(4u))
    // u ranges from 0 to 2*PI
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const u = Math.random() * Math.PI * 2;
      const isContour = Math.random() > 0.35;
      const innerFactor = isContour ? 1.0 : 0.2 + Math.random() * 0.75;

      // Start scattered in an outer swirling vortex
      const startAngle = Math.random() * Math.PI * 2;
      const startDist = Math.min(width, height) * (0.6 + Math.random() * 0.8);
      const startX = width / 2 + Math.cos(startAngle) * startDist;
      const startY = height / 2 + Math.sin(startAngle) * startDist;

      // Tangential vortex velocity
      const vortexSpeed = (Math.random() * 6 + 4) * (Math.random() > 0.5 ? 1 : -1);
      const vx = -Math.sin(startAngle) * vortexSpeed;
      const vy = Math.cos(startAngle) * vortexSpeed;

      const color = NEON_PALETTE[Math.floor(Math.random() * NEON_PALETTE.length)];
      const baseRadius = Math.random() < 0.15 ? Math.random() * 2.5 + 2.0 : Math.random() * 1.5 + 1.0;

      particles.push({
        x: startX,
        y: startY,
        vx,
        vy,
        targetU: u,
        innerFactor,
        baseRadius,
        color,
        alpha: Math.random() * 0.4 + 0.6,
        glowSize: Math.random() * 12 + 6,
        jitterPhase: Math.random() * Math.PI * 2,
      });
    }

    startTimeRef.current = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000; // in seconds
      const t = now * 0.06;

      // Deep dark fade for silky neon motion trails
      ctx.fillStyle = 'rgba(2, 2, 2, 0.22)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 - 20;

      // Calculate scale based on screen size with realistic beating pulse
      const baseHeartScale = Math.min(width, height) * 0.024;

      // Beating pulse math:
      // Uses Math.sin(t * 0.03) modulated with a dual systolic heartbeat bounce
      const rawPulse = Math.sin(t * 0.03);
      const heartbeatSnap = Math.pow(Math.max(0, Math.sin(elapsed * 4.5)), 3) * 0.14;
      const currentScale = baseHeartScale * (1 + 0.08 * rawPulse + heartbeatSnap);

      // Convergence attraction factor increases as elapsed time grows
      const attractionProgress = Math.min(1.0, Math.max(0, (elapsed - 0.4) / 1.2));
      const attractionForce = 0.045 * Math.pow(attractionProgress, 2);
      const damping = 0.88;

      ctx.save();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const u = p.targetU;

        // Parametric Heart Formula
        const sinU = Math.sin(u);
        const cosU = Math.cos(u);
        const cos2U = Math.cos(2 * u);
        const cos3U = Math.cos(3 * u);
        const cos4U = Math.cos(4 * u);

        const targetHeartX = 16 * Math.pow(sinU, 3);
        const targetHeartY = -(13 * cosU - 5 * cos2U - 2 * cos3U - cos4U);

        // Scaled and scaled-inward coordinate
        const finalTargetX = centerX + targetHeartX * currentScale * p.innerFactor;
        const finalTargetY = centerY + targetHeartY * currentScale * p.innerFactor;

        if (attractionProgress > 0) {
          // Vector attraction towards the parametric heart
          const dx = finalTargetX - p.x;
          const dy = finalTargetY - p.y;

          p.vx += dx * attractionForce;
          p.vy += dy * attractionForce;

          // Organic jitter / Brownian fluctuation
          const jitter = Math.sin(t * 0.05 + p.jitterPhase) * 0.6;
          p.vx += (Math.random() - 0.5) * jitter;
          p.vy += (Math.random() - 0.5) * jitter;
        }

        // Apply damping & velocity
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;

        // Render Particle with Neon Pink Glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);

        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.glowSize;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      }

      // Add ambient floating micro-stardust in the background
      ctx.save();
      const stardustCount = 20;
      for (let s = 0; s < stardustCount; s++) {
        const stX = (centerX + Math.cos(s * 1.7 + elapsed * 0.4) * (baseHeartScale * 22)) % width;
        const stY = (centerY + Math.sin(s * 2.3 + elapsed * 0.3) * (baseHeartScale * 18)) % height;
        const stAlpha = 0.2 + 0.3 * Math.sin(elapsed * 3 + s);

        ctx.beginPath();
        ctx.arc(stX, stY, 1, 0, Math.PI * 2);
        ctx.fillStyle = '#ff2a6d';
        ctx.globalAlpha = stAlpha;
        ctx.shadowColor = '#ff6584';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.restore();

      ctx.restore();

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <motion.div
      id="vortex-heart-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#020202] flex items-center justify-center pointer-events-auto select-none"
    >
      {/* HTML5 Particle Physics Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Ribbon Untying Intro Aura */}
      <AnimatePresence>
        {!ribbonUntied && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute z-10 flex flex-col items-center pointer-events-none"
          >
            {/* Golden Wax Seal & Silk Ribbon Graphic */}
            <div className="relative">
              {/* Horizontal Satin Ribbon */}
              <motion.div
                initial={{ width: 280 }}
                animate={{ width: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-6 bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-600 rounded-full shadow-lg mx-auto"
              />
              <div className="w-16 h-16 -mt-11 mx-auto rounded-full bg-[#8B0000] border-2 border-[#D4AF37] flex items-center justify-center text-amber-200 font-cinzel font-bold text-lg shadow-2xl">
                <Sparkles className="w-8 h-8 text-[#F5E6C8] animate-spin" />
              </div>
            </div>
            <p className="mt-3 text-xs tracking-widest uppercase font-semibold text-amber-300 font-cinzel">
              Unfastening Keepsake Seal...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE EMOTIONAL TEXT OVERLAY (Centered in Beating Heart) */}
      <AnimatePresence>
        {showText && (
          <motion.div
            id="vortex-emotional-text"
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{
              opacity: 1,
              scale: [1, 1.05, 1],
              y: 0,
            }}
            transition={{
              opacity: { duration: 0.9, ease: 'easeOut' },
              scale: {
                repeat: Infinity,
                duration: 1.4,
                ease: 'easeInOut',
              },
            }}
            className="absolute z-20 pointer-events-none flex flex-col items-center text-center px-4 max-w-xl -mt-6"
          >
            {/* Cursive Handwriting Heading */}
            <h1
              className="font-script text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide leading-tight text-white drop-shadow-[0_0_25px_rgba(255,42,109,0.95)]"
              style={{
                textShadow:
                  '0 0 20px #ff2a6d, 0 0 40px #ff2a6d, 0 0 60px rgba(255, 42, 109, 0.7), 0 0 80px rgba(212, 175, 55, 0.4)',
              }}
            >
              {emotionalText}
            </h1>

            {/* Sender / Subtitle Note */}
            {senderName && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-2 text-xs sm:text-sm font-cormorant italic tracking-widest text-[#FFD166] drop-shadow-[0_0_10px_rgba(255,209,102,0.8)]"
              >
                Forever from {senderName}
              </motion.p>
            )}

            {/* Subtle Pulse Rings */}
            <div className="mt-4 flex items-center justify-center gap-1.5 opacity-75">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a6d] animate-ping" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-pink-300">
                Opening Memory Vault
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a6d] animate-ping" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Skip to Box Button */}
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="absolute bottom-6 right-6 z-30 px-4 py-2 rounded-full bg-black/60 hover:bg-black/90 text-amber-200 border border-[#D4AF37]/50 text-xs font-semibold backdrop-blur-md shadow-lg flex items-center gap-1.5 cursor-pointer transition-all"
      >
        <span>Open Keepsake Box</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
      </motion.button>
    </motion.div>
  );
};
