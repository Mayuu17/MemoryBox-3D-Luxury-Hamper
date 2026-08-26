import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { playWaxSealCrackSound, playPianoNote } from '../utils/audio';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  Heart,
  KeyRound,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthGatewayModal: React.FC<AuthGatewayModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'register',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const initials = (name || 'MB')
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = mode === 'register' ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      playWaxSealCrackSound();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#8B0000', '#FAF7F2'],
        });
      } catch (err) {}

      // Save token in localStorage
      if (data.token) {
        localStorage.setItem('mb_auth_token', data.token);
      }

      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
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
        onSuccess(data.user, data.token);
        onClose();
      } else {
        throw new Error(data.error || 'Demo login failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 25 }}
          className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 sm:p-9 shadow-2xl border-2 border-[#D4AF37]/50 my-auto paper-texture overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Monogram */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#8B0000] border-2 border-[#D4AF37] shadow-xl flex items-center justify-center text-[#F5E6C8] font-cinzel font-bold text-xl mb-3 tracking-widest">
              {mode === 'register' && name ? initials : 'MB'}
            </div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8C6239] block mb-1">
              Sender Security Gateway
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2D241E]">
              {mode === 'register' ? 'Create Creator Account' : 'Welcome Back, Artisan'}
            </h3>
            <p className="text-xs text-[#7A6856] mt-1 max-w-sm mx-auto">
              {mode === 'register'
                ? 'Register securely to handcraft, edit, and store your emotion memory hampers.'
                : 'Sign in to access and manage your created hampers.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-2xl bg-white/80 p-1 border border-[#D4C3A3] mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('register');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
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
                setMode('login');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] shadow-sm'
                  : 'text-[#6B5532] hover:text-[#2D241E]'
              }`}
            >
              Sign In (Existing Creator)
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
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
                    placeholder="e.g. Aryan Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D4C3A3] text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
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
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D4C3A3] text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D4C3A3] text-sm text-[#2D241E] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-sm shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {mode === 'register' ? 'Register & Enter Studio' : 'Sign In & Open Studio'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-[#D4AF37]/30 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="text-xs font-semibold text-[#8C6239] hover:text-[#2D241E] underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Or click here to Test with Pre-configured Artisan Account</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
