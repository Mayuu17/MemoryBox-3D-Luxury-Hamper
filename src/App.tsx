import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox, PublicBoxMeta, SupportedLanguage, User } from './types';
import { KeepsakeBoxView } from './components/KeepsakeBoxView';
import { KeepsakeChestCanvas } from './components/KeepsakeChestCanvas';
import { PasswordGateModal } from './components/PasswordGateModal';
import { VortexHeartAnimation } from './components/VortexHeartAnimation';
import { UnboxingExperience } from './components/UnboxingExperience';
import { StorySlideExperience } from './components/StorySlideExperience';
import { HamperCreator } from './components/HamperCreator';
import { ShareBoxModal } from './components/ShareBoxModal';
import { AuthGatewayModal } from './components/AuthGatewayModal';
import { AuthGatewayWall } from './components/AuthGatewayWall';
import { RosePetals } from './components/RosePetals';
import { BOX_THEMES } from './utils/themes';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from './utils/languages';
import {
  toggleAmbientRomanticMusic,
  playPaperCrinkleSound,
  playWaxSealCrackSound,
  playPianoNote,
} from './utils/audio';
import {
  Sparkles,
  Gift,
  Plus,
  Heart,
  Volume2,
  VolumeX,
  Languages,
  Layers,
  KeyRound,
  Share2,
  Lock,
  ArrowRight,
  Eye,
  Feather,
  User as UserIcon,
  LogOut,
  Sliders,
  Play,
  Trash2,
  RefreshCw,
  Cake,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { TranslationProvider, useContentTranslation } from './context/TranslationContext';

function MainAppContent() {
  const { currentLanguage, setLanguage, getTranslatedBox, isTranslating, culturalIdiomNote } = useContentTranslation();
  const [boxes, setBoxes] = useState<PublicBoxMeta[]>([]);
  const [selectedBoxMeta, setSelectedBoxMeta] = useState<PublicBoxMeta | null>(null);
  const [unlockedBox, setUnlockedBox] = useState<HamperBox | null>(null);
  const [vortexUnlockingBox, setVortexUnlockingBox] = useState<HamperBox | null>(null);
  const [isPasswordGateOpen, setIsPasswordGateOpen] = useState(false);
  const [isStorySlideOpen, setIsStorySlideOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [boxToShare, setBoxToShare] = useState<HamperBox | null>(null);
  const [isMusicActive, setIsMusicActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unboxedViewMode, setUnboxedViewMode] = useState<'scattered' | 'layered'>('scattered');
  
  // Routing flags
  const [isDirectSharedLink, setIsDirectSharedLink] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  // Deep Translated Unlocked Box
  const activeUnlockedBox = unlockedBox ? (getTranslatedBox(unlockedBox, currentLanguage) || unlockedBox) : null;

  // Restore user session from localStorage on startup
  useEffect(() => {
    const token = localStorage.getItem('mb_auth_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsAuthChecking(false);
        });
    } else {
      setIsAuthChecking(false);
    }
  }, []);

  // Fetch public boxes & check URL parameters for deep-linked gift boxes
  const loadBoxes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/boxes');
      const data = await res.json();
      const list = data.boxes || data;
      if (Array.isArray(list)) {
        setBoxes(list);

        // Check URL params for deep-linked box (e.g. ?box=xyz or ?code=xyz)
        const params = new URLSearchParams(window.location.search);
        const boxId = params.get('box') || params.get('code');
        const hashMatch = window.location.hash.match(/box=([^&]+)/);
        const targetBoxId = boxId || (hashMatch ? hashMatch[1] : null);

        if (targetBoxId) {
          setIsDirectSharedLink(true);
          const match = list.find((b: any) => b.id === targetBoxId);
          if (match) {
            setSelectedBoxMeta(match);
          } else {
            const singleRes = await fetch(`/api/boxes/${targetBoxId}`);
            if (singleRes.ok) {
              const singleData = await singleRes.json();
              setSelectedBoxMeta(singleData.box || singleData);
            }
          }
        } else if (params.get('demo') === 'true') {
          setIsDemoMode(true);
          const demoBox = list.find((b: any) => b.id === 'demo-birthday-celebration') || list[0];
          if (demoBox) setSelectedBoxMeta(demoBox);
        } else {
          // If no deep link, assign demo box if available, but let Auth Wall govern visibility
          const birthdayDemo = list.find((b: any) => b.id === 'demo-birthday-celebration') || list[0];
          if (birthdayDemo && !selectedBoxMeta) {
            setSelectedBoxMeta(birthdayDemo);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load boxes', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBoxes();
  }, []);

  const handleMusicToggle = () => {
    const playing = toggleAmbientRomanticMusic();
    setIsMusicActive(playing);
  };

  const handleBoxSelect = (boxMeta: PublicBoxMeta) => {
    playPaperCrinkleSound();
    setSelectedBoxMeta(boxMeta);
    setUnlockedBox(null);
  };

  const handleBoxCreated = (newBox: HamperBox) => {
    setIsCreatorOpen(false);
    setBoxToShare(newBox);
    setIsShareModalOpen(true);
    loadBoxes();
    setSelectedBoxMeta(newBox);
  };

  const handleSignOut = () => {
    localStorage.removeItem('mb_auth_token');
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    setIsDemoMode(false);
    setIsCreatorOpen(false);
    playPaperCrinkleSound();
  };

  const handleCreateClick = () => {
    if (!currentUser) {
      setAuthMode('register');
      setIsAuthModalOpen(true);
    } else {
      setIsCreatorOpen(true);
    }
  };

  // Launch Birthday Demo Mode
  const handleLaunchBirthdayDemo = () => {
    playWaxSealCrackSound();
    setIsDemoMode(true);
    const demoBox = boxes.find((b) => b.id === 'demo-birthday-celebration') || boxes[0];
    if (demoBox) {
      setSelectedBoxMeta(demoBox);
      setUnlockedBox(null);
    }
  };

  // Direct recipient code lookup
  const handleEnterBoxCode = async (code: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/boxes/${code}`);
      if (res.ok) {
        const data = await res.json();
        const box = data.box || data;
        setSelectedBoxMeta(box);
        setIsDirectSharedLink(true);
        setUnlockedBox(null);
      } else {
        alert(`Gift box with ID "${code}" not found. Please verify with the sender.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Launch Story Slides Experience
  const handleLaunchStorySlides = async () => {
    if (!selectedBoxMeta) return;

    if (unlockedBox && unlockedBox.id === selectedBoxMeta.id) {
      setIsStorySlideOpen(true);
    } else {
      try {
        const res = await fetch(`/api/boxes/${selectedBoxMeta.id}/unlock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: '' }),
        });
        const data = await res.json();
        if (data.box) {
          setUnlockedBox(data.box);
          setIsStorySlideOpen(true);
        } else {
          setIsPasswordGateOpen(true);
        }
      } catch (e) {
        setIsPasswordGateOpen(true);
      }
    }
  };

  // Determine whether to display the Authentication Wall
  // Wall is displayed when:
  // 1. Session is not authenticated (!currentUser)
  // 2. Not visiting via a direct shared link (!isDirectSharedLink)
  // 3. User hasn't explicitly launched the live demo (!isDemoMode)
  const shouldShowAuthWall = !isAuthChecking && !currentUser && !isDirectSharedLink && !isDemoMode;

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] text-[#2D241E] selection:bg-[#E2C799] overflow-x-hidden">
      {/* Floating Rose Petals Sensor Experience */}
      <RosePetals count={24} />

      {/* LUXURY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/85 backdrop-blur-lg border-b border-[#D4AF37]/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Brand Monogram & Title */}
          <div
            onClick={() => {
              if (currentUser) {
                setIsCreatorOpen(false);
                setUnlockedBox(null);
              } else {
                setIsDemoMode(false);
                setIsDirectSharedLink(false);
                setUnlockedBox(null);
              }
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Wax Seal Emblem */}
            <div className="w-11 h-11 rounded-full bg-[#8B0000] border-2 border-[#D4AF37]/80 shadow-md flex items-center justify-center text-[#F5E6C8] font-cinzel font-bold text-sm tracking-wider transform group-hover:scale-105 transition-transform">
              MB
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-title font-bold text-xl sm:text-2xl tracking-wide text-[#2D241E]">
                  MemoryBox
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#8C6239] border border-[#D4AF37]/40">
                  Haute Keepsake
                </span>
              </div>
              <p className="text-[11px] text-[#7A6856] font-medium hidden sm:block">
                Digital Emotion & Handmade Hamper Platform
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multilingual Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-[#D4C3A3] text-xs text-[#5A4634] shadow-xs">
              <Languages className="w-3.5 h-3.5 text-[#B8860B]" />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent font-medium text-[#2D241E] focus:outline-none cursor-pointer text-xs"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Acoustic Melody Toggle */}
            <button
              onClick={handleMusicToggle}
              className={`p-2.5 rounded-full border shadow-xs transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                isMusicActive
                  ? 'bg-[#B8860B] text-white border-[#B8860B]'
                  : 'bg-white/90 border-[#D4C3A3] text-[#6B5532] hover:bg-white'
              }`}
              title="Acoustic Ambient Music"
            >
              {isMusicActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* User Account Button or Sender Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D4AF37] shadow-xs hover:bg-[#FAF7F2] transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#8B0000] text-[#F5E6C8] font-cinzel font-bold text-[10px] flex items-center justify-center">
                    {currentUser.initials || 'AS'}
                  </div>
                  <span className="text-xs font-bold text-[#2D241E] hidden md:inline">
                    {currentUser.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#D4AF37]/40 py-2 z-50 paper-texture">
                    <div className="px-4 py-2 border-b border-[#E8D7A6]">
                      <p className="text-xs font-bold text-[#2D241E]">{currentUser.name}</p>
                      <p className="text-[10px] text-[#7A6856] truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsCreatorOpen(true);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-[#5A4634] hover:bg-[#FAF7F2] flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Create New Hamper</span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-[#E8D7A6]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : isDemoMode || isDirectSharedLink ? (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-full bg-white border border-[#D4C3A3] text-xs font-bold text-[#5A4634] hover:bg-[#FAF7F2] shadow-xs transition-all cursor-pointer hidden sm:flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#8C6239]" />
                <span>Sender Sign In</span>
              </button>
            ) : null}

            {/* Handcraft a Hamper / Creator Button */}
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Handcraft a Hamper</span>
            </button>
          </div>
        </div>
      </header>

      {/* TOP BANNER FOR LIVE DEMO / SHARED RECIPIENT MODE */}
      <AnimatePresence>
        {isDemoMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#2A1D15] text-[#F5E6C8] border-b border-[#D4AF37]/40 px-4 py-2.5 text-xs text-center flex items-center justify-between max-w-7xl mx-auto rounded-b-2xl shadow-md z-30 relative"
          >
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <Cake className="w-4 h-4 text-[#FFD700] animate-bounce" />
              <span className="font-semibold">
                Viewing Live Birthday Demo Box (Occasion: Birthday &nbsp;•&nbsp; Sample Secret Password:{' '}
                <strong className="text-[#FFD700] underline">birthdaywishes</strong>)
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => {
                  setIsDemoMode(false);
                  setUnlockedBox(null);
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-bold text-[#FAF7F2] border border-[#D4AF37]/50 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Sign-In Portal</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEW CONTROLLER */}
      <main className="relative z-10 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {/* 1. INITIAL AUTHENTICATION CHECKING LOADER */}
          {isAuthChecking ? (
            <motion.div
              key="auth-checking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
            >
              <Sparkles className="w-10 h-10 text-[#B8860B] animate-spin mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-[#2D241E]">
                Verifying Artisan Credentials...
              </p>
            </motion.div>
          ) : shouldShowAuthWall ? (
            /* 2. THE AUTHENTICATION WALL (सबसे पहले साइन-इन) */
            <motion.div
              key="auth-wall"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              <AuthGatewayWall
                onAuthSuccess={(user, token) => {
                  setCurrentUser(user);
                  setIsCreatorOpen(true);
                }}
                onLaunchDemo={handleLaunchBirthdayDemo}
                onEnterBoxCode={handleEnterBoxCode}
                demoBoxMeta={boxes.find((b) => b.id === 'demo-birthday-celebration') || boxes[0]}
              />
            </motion.div>
          ) : isCreatorOpen ? (
            /* 3. HAMPER CREATOR STUDIO (PROTECTED) */
            <motion.div
              key="creator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HamperCreator
                onBoxCreated={handleBoxCreated}
                onCancel={() => setIsCreatorOpen(false)}
                currentUser={currentUser}
                onRequireAuth={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
              />
            </motion.div>
          ) : activeUnlockedBox ? (
            /* 4. UNBOXED HAMPER KEEPSAKE EXPERIENCE */
            <motion.div
              key="unboxing"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="space-y-6"
            >
              {/* View Mode Switcher */}
              <div className="max-w-xs mx-auto flex items-center justify-center p-1 rounded-full bg-white/80 backdrop-blur-md border border-[#D4AF37]/40 shadow-xs">
                <button
                  onClick={() => setUnboxedViewMode('scattered')}
                  className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    unboxedViewMode === 'scattered'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#2C1D0F] shadow-xs'
                      : 'text-[#7A6856] hover:text-[#2D241E]'
                  }`}
                >
                  ✨ Scattered Keepsakes
                </button>
                <button
                  onClick={() => setUnboxedViewMode('layered')}
                  className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    unboxedViewMode === 'layered'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#2C1D0F] shadow-xs'
                      : 'text-[#7A6856] hover:text-[#2D241E]'
                  }`}
                >
                  📦 3-Layer Vault
                </button>
              </div>

              {unboxedViewMode === 'scattered' ? (
                <KeepsakeChestCanvas
                  box={activeUnlockedBox}
                  currentLanguage={currentLanguage}
                  onLanguageChange={setLanguage}
                  onResetToGate={() => setUnlockedBox(null)}
                />
              ) : (
                <UnboxingExperience
                  box={activeUnlockedBox}
                  currentLanguage={currentLanguage}
                  onLanguageChange={setLanguage}
                  onResetToGate={() => setUnlockedBox(null)}
                />
              )}
            </motion.div>
          ) : selectedBoxMeta ? (
            /* 5. CLOSED KEEPSAKE BOX WITH 3D WAX SEAL & PERSPECTIVE UNBOXING */
            <motion.div
              key="box-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Central 3D Keepsake Box View */}
              <KeepsakeBoxView
                box={selectedBoxMeta}
                hasPassword={selectedBoxMeta.hasPassword}
                currentLanguage={currentLanguage}
                unlockedBoxData={activeUnlockedBox}
                onBoxUnlocked={(fullBox) => {
                  setUnlockedBox(fullBox);
                }}
                onOpenGate={() => setIsPasswordGateOpen(true)}
              />

              {/* Story Slides Launcher Button Banner */}
              <div className="max-w-md mx-auto text-center px-4">
                <button
                  onClick={handleLaunchStorySlides}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white border-2 border-[#D4AF37] text-[#2D241E] font-bold text-xs sm:text-sm shadow-md hover:bg-[#FAF7F2] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Play className="w-4 h-4 fill-current text-[#8B0000] group-hover:scale-110 transition-transform" />
                  <span>Experience as Interactive Story Slides 💖</span>
                </button>
              </div>

              {/* Sample Hampers Gallery Bar (Only for authenticated users or demo mode with multiple boxes) */}
              {currentUser && boxes.length > 1 && (
                <div className="max-w-4xl mx-auto px-4 pt-8 border-t border-[#D4AF37]/30">
                  <div className="text-center mb-4">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-[#8C6239]">
                      Curated Keepsake Collection
                    </span>
                    <h3 className="font-serif-title text-xl font-bold text-[#2D241E]">
                      Explore Other Handcrafted Hampers
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {boxes.map((b) => {
                      const isCur = selectedBoxMeta.id === b.id;
                      const th = BOX_THEMES[b.theme] || BOX_THEMES.royal_velvet_burgundy;

                      return (
                        <div
                          key={b.id}
                          onClick={() => handleBoxSelect(b)}
                          className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex items-center gap-3.5 bg-white/70 backdrop-blur-sm ${
                            isCur
                              ? 'border-[#D4AF37] shadow-lg ring-2 ring-[#D4AF37]/20 bg-white'
                              : 'border-[#E0D7C6] hover:border-[#D4AF37]/60 hover:bg-white'
                          }`}
                        >
                          {/* Mini Wax Seal Icon */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-cinzel font-bold text-[#F5E6C8] shadow-sm flex-shrink-0"
                            style={{ backgroundColor: th.waxSealColor }}
                          >
                            {b.waxSealInitials || 'MB'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-serif-title font-bold text-[#2D241E] truncate">
                              {b.title}
                            </h4>
                            <p className="text-[11px] text-[#7A6856] truncate">
                              To {b.recipientName} from {b.senderName}
                            </p>
                          </div>

                          {b.hasPassword && (
                            <Lock className="w-3.5 h-3.5 text-[#B8860B] flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="py-24 text-center">
              <Sparkles className="w-10 h-10 text-[#B8860B] animate-pulse mx-auto mb-3" />
              <p className="font-serif text-xl font-bold text-[#2D241E]">
                Loading Keepsake Hampers...
              </p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* PASSWORD GATE MODAL */}
      {selectedBoxMeta && (
        <PasswordGateModal
          box={selectedBoxMeta}
          isOpen={isPasswordGateOpen}
          onClose={() => setIsPasswordGateOpen(false)}
          onUnlocked={(fullBox) => {
            setIsPasswordGateOpen(false);
            setVortexUnlockingBox(fullBox);
          }}
        />
      )}

      {/* FULL-SCREEN VORTEX HEART PARTICLE UNBOXING OVERLAY */}
      <AnimatePresence>
        {vortexUnlockingBox && (
          <VortexHeartAnimation
            reasonCategory={vortexUnlockingBox.reasonCategory || vortexUnlockingBox.occasion}
            customMessage={vortexUnlockingBox.customWishMessage}
            recipientName={vortexUnlockingBox.recipientName}
            senderName={vortexUnlockingBox.senderName}
            onComplete={() => {
              setUnlockedBox(vortexUnlockingBox);
              setVortexUnlockingBox(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* STORY SLIDE EXPERIENCE MODAL */}
      {selectedBoxMeta && (
        <StorySlideExperience
          box={activeUnlockedBox || (selectedBoxMeta as any)}
          isOpen={isStorySlideOpen}
          onClose={() => setIsStorySlideOpen(false)}
          currentLanguage={currentLanguage}
          onLanguageChange={setLanguage}
        />
      )}

      {/* AUTH GATEWAY MODAL */}
      <AuthGatewayModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user, token) => {
          setCurrentUser(user);
          setIsCreatorOpen(true);
        }}
      />

      {/* SHARE MODAL */}
      {boxToShare && (
        <ShareBoxModal
          box={boxToShare}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onOpenAsReceiver={() => {
            setIsShareModalOpen(false);
            setSelectedBoxMeta(boxToShare);
            setIsPasswordGateOpen(true);
          }}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <TranslationProvider>
      <MainAppContent />
    </TranslationProvider>
  );
}

export default App;
