import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, PublicBoxMeta } from '../types';
import { playWaxSealCrackSound, playPaperCrinkleSound, playPianoNote } from '../utils/audio';
import {
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  Gift,
  KeyRound,
  ArrowRight,
  Cake,
  Heart,
  BookOpen,
  Mic,
  Camera,
  CheckCircle2,
  HelpCircle,
  QrCode,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthGatewayWallProps {
  onAuthSuccess: (user: User, token: string) => void;
  onLaunchDemo: () => void;
  onEnterBoxCode: (boxId: string) => void;
  demoBoxMeta?: PublicBoxMeta | null;
}

export const AuthGatewayWall: React.FC<AuthGatewayWallProps> = ({
  onAuthSuccess,
  onLaunchDemo,
  onEnterBoxCode,
  demoBoxMeta,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [boxCodeInput, setBoxCodeInput] = useState('');
  const [isBoxCodeOpen, setIsBoxCodeOpen] = useState(false);

  const initials = (name || 'MB')
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = authMode === 'register' ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      playWaxSealCrackSound();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#8B0000', '#FAF7F2'],
        });
      } catch (err) {}

      if (data.token) {
        localStorage.setItem('mb_auth_token', data.token);
      }

      onAuthSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      playPianoNote(300, 0.4, 0.1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'aryan@memorybox.art',
          password: 'romance2024',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        playWaxSealCrackSound();
        if (data.token) {
          localStorage.setItem('mb_auth_token', data.token);
        }
        onAuthSuccess(data.user, data.token);
      } else {
        throw new Error(data.error || 'Demo login failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoxCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boxCodeInput.trim()) return;
    playPaperCrinkleSound();
    onEnterBoxCode(boxCodeInput.trim());
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-8 max-w-6xl mx-auto">
      {/* Background Soft Candlelight & Gold Halo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[600px] h-[340px] md:h-[600px] rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none -z-10" />

      {/* Hero Welcome Monogram & Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-2xl mx-auto mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/60 shadow-xs mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#8C6239]">
            Haute Keepsake Digital Craftsmanship
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
        </div>

        <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D241E] leading-tight">
          MemoryBox Creator Portal
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#7A6856] max-w-lg mx-auto leading-relaxed">
          Sign in to your artisan account to design, seal with 3D wax, and deliver breathtaking digital emotion hampers to the people you love.
        </p>
      </motion.div>

      {/* Main Dual Grid: Auth Gateway Card + Live Birthday Example Demo Card */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT / CENTER: AUTHENTICATION FORM CARD (SIGN IN / REGISTER) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl p-6 sm:p-9 shadow-2xl border-2 border-[#D4AF37]/50 paper-texture relative overflow-hidden"
        >
          {/* Top Wax Seal Stamp Badge */}
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#8B0000] border-2 border-[#D4AF37] shadow-md flex items-center justify-center text-[#F5E6C8] font-cinzel font-bold text-sm tracking-wider">
                {authMode === 'register' && name ? initials : 'MB'}
              </div>
              <div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#8C6239] block">
                  Sender Authentication Wall
                </span>
                <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#2D241E]">
                  {authMode === 'register' ? 'Create Creator Account' : 'Welcome Back, Artisan'}
                </h2>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted</span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-white/80 p-1 border border-[#D4C3A3] mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setAuthMode('register');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] shadow-sm'
                  : 'text-[#6B5532] hover:text-[#2D241E]'
              }`}
            >
              Sign Up (New Sender)
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setAuthMode('login');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] shadow-sm'
                  : 'text-[#6B5532] hover:text-[#2D241E]'
              }`}
            >
              Sign In (Existing Creator)
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2"
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A4634] mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8C6239] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D4C3A3] text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none shadow-inner"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A4634] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C6239] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artisan@memorybox.art"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D4C3A3] text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A4634] mb-1.5">
                Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C6239] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D4C3A3] text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>
                    {authMode === 'register' ? 'Register & Enter Creator Studio' : 'Sign In & Open Studio'}
                  </span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Pre-Configured Test Login */}
          <div className="mt-6 pt-4 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span className="text-xs text-[#7A6856]">Need quick testing access?</span>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="text-xs font-bold text-[#8B0000] hover:text-[#5c0000] underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>One-Click Test Account Login</span>
            </button>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* RIGHT: EXAMPLE LIVE DEMO CARD (RANDOM BIRTHDAY CELEBRATION BOX) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Featured Live Example Demo Card */}
          <div className="bg-gradient-to-br from-[#1F140F] via-[#2A1D15] to-[#170E0A] rounded-3xl p-6 sm:p-7 border-2 border-[#D4AF37] shadow-2xl text-white relative overflow-hidden group">
            {/* Candlelight Ambient Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-full bg-[#D4AF37]/25 text-[#F5E6C8] border border-[#D4AF37]/50 flex items-center gap-1.5">
                  <Cake className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>Live Interactive Example Demo</span>
                </span>
                <span className="text-[11px] font-mono text-[#D4AF37] font-bold">
                  PW: birthdaywishes
                </span>
              </div>

              {/* Title & Preview */}
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#F5E6C8] mb-2 leading-tight">
                Playful Birthday Celebration Hamper 🎂
              </h3>
              <p className="text-xs text-[#E0D7C6]/85 mb-4 leading-relaxed">
                Test the recipient unboxing journey! Experience the hanging calligraphy gift tag, 3D wax seal cracking, particle vortex eruption, interactive cake, and surprise boom box.
              </p>

              {/* Hanging Tag Preview Snippet */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-[#D4AF37]/40 mb-5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#E0C68E] font-medium">Virtual Gift Tag:</span>
                  <span className="font-bold text-[#FFD700]">Occasion: Birthday</span>
                </div>
                <div className="font-script text-xl sm:text-2xl text-[#FFF8DC]">
                  To: Bestie &nbsp;|&nbsp; From: Your Friend
                </div>
                <p className="text-[11px] italic text-[#E0D7C6]/80 mt-1 line-clamp-2">
                  "A handmade treasure chest packed with laughter, sweet treats, and memories for the best person ever! 🎂🎈"
                </p>
              </div>

              {/* Nested Features List */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#E0D7C6] mb-6">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>3D Velvet Box & Wax Seal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Interactive Birthday Cake</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Polaroid Photo Scrapbook</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>3D Gift Explosion Boom Box</span>
                </div>
              </div>

              {/* Launch Live Demo Button */}
              <button
                type="button"
                onClick={onLaunchDemo}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E2C799] to-[#C5A059] text-[#2C1D0F] font-bold text-xs sm:text-sm shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-[#8B0000] group-hover:rotate-12 transition-transform" />
                <span>View Live Birthday Demo Box (No Login Required)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Direct Gift Box Code Look-up Bar for Recipients */}
          <div className="bg-white rounded-2xl p-5 border border-[#D4C3A3] shadow-md paper-texture">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#8B0000]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D241E]">
                  Have a Gift Box Code?
                </h4>
              </div>
              <span className="text-[10px] text-[#7A6856]">Recipient Direct Entry</span>
            </div>

            <form onSubmit={handleBoxCodeSubmit} className="flex gap-2 mt-2">
              <input
                type="text"
                value={boxCodeInput}
                onChange={(e) => setBoxCodeInput(e.target.value)}
                placeholder="e.g. demo-birthday-celebration"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D4C3A3] text-xs font-medium text-[#2D241E] focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#8B0000] text-[#F5E6C8] font-bold text-xs hover:bg-[#6e0000] transition-colors cursor-pointer"
              >
                Open Gift
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
