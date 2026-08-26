/**
 * Sensory Audio Synthesizer for MemoryBox
 * Uses Web Audio API to create authentic acoustic piano chords,
 * paper crinkle sound effects, ribbon whooshes, and wax seal cracking sounds
 * without relying on external MP3 files that could fail to load.
 */

let audioCtx: AudioContext | null = null;
let bgMusicInterval: any = null;
let isBgMusicPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Play a soothing romantic piano chord note
export function playPianoNote(frequency: number, duration: number = 2.5, gainLevel: number = 0.15) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Warm triangle/sine mix for warm grand piano tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Dynamic envelope: instant strike, gentle decay, long warm resonance
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainLevel, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio contexts might be blocked until user gesture
  }
}

// 2. Realistic "Crinkling Wrapper & Shredded Paper" sound effect
export function playPaperCrinkleSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // White noise with random bursts for paper crinkling
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter for crisp paper rustle
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {}
}

// 3. "Wax Seal Crack & Ribbon Pull" sound effect
export function playWaxSealCrackSound() {
  try {
    const ctx = getAudioContext();
    
    // Snapping sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);

    // Followed by soft golden chime
    setTimeout(() => {
      playPianoNote(523.25, 1.8, 0.1); // C5
      setTimeout(() => playPianoNote(659.25, 2.0, 0.12), 120); // E5
      setTimeout(() => playPianoNote(783.99, 2.5, 0.15), 240); // G5
    }, 100);
  } catch (e) {}
}

// 4. "Box Lid Opening" sound
export function playBoxOpenCreakSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.3);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);

    // Soft celestial sparkle
    setTimeout(() => {
      playPianoNote(587.33, 2.0, 0.08);
      setTimeout(() => playPianoNote(880.00, 2.5, 0.1), 150);
    }, 200);
  } catch (e) {}
}

// 5. "Page Flip" sound for the Scrapbook
export function playPageFlipSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {}
}

// 5b. "Custom Wrapper Tearing & Ribbon Untying" sound
export function playWrapperTearingSound() {
  try {
    const ctx = getAudioContext();
    const duration = 0.55;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Multi-frequency tear texture with micro crackles
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const crackle = Math.random() > 0.85 ? (Math.random() * 2 - 1) * 1.5 : (Math.random() * 2 - 1) * 0.4;
      const envelope = Math.sin(progress * Math.PI) * (1 - progress * 0.3);
      data[i] = crackle * envelope;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Modulated sweep filter simulating fibrous paper tearing
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration * 0.6);
    filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + duration);
    filter.Q.setValueAtTime(2.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();

    // Secondary subtle low frequency whoosh for silk ribbon slide
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.35);

    oscGain.gain.setValueAtTime(0.06, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

// 6. Ambient Romantic Piano Melody Loop
const MOOD_MELODIES: Record<string, { notes: number[]; intervalMs: number; gain: number }> = {
  romantic: {
    notes: [261.63, 329.63, 392.00, 493.88, 220.00, 261.63, 329.63, 440.00, 174.61, 220.00, 261.63, 349.23, 196.00, 246.94, 293.66, 392.00],
    intervalMs: 1100,
    gain: 0.05,
  },
  deep_emotional: {
    notes: [220.00, 261.63, 329.63, 415.30, 261.63, 329.63, 392.00, 523.25, 174.61, 220.00, 261.63, 329.63, 164.81, 196.00, 246.94, 329.63],
    intervalMs: 1350,
    gain: 0.045,
  },
  nostalgic: {
    notes: [261.63, 329.63, 392.00, 523.25, 293.66, 349.23, 440.00, 587.33, 220.00, 261.63, 329.63, 440.00, 196.00, 246.94, 293.66, 392.00],
    intervalMs: 1000,
    gain: 0.055,
  },
  joyful: {
    notes: [261.63, 329.63, 392.00, 523.25, 587.33, 659.25, 783.99, 659.25, 523.25, 392.00, 329.63, 261.63],
    intervalMs: 680,
    gain: 0.06,
  },
  cozy_candlelight: {
    notes: [261.63, 329.63, 392.00, 523.25, 220.00, 261.63, 329.63, 440.00],
    intervalMs: 1050,
    gain: 0.05,
  },
};

let currentMood = 'romantic';
let melodyIndex = 0;

export function setAmbientMoodAudio(mood: string) {
  currentMood = mood in MOOD_MELODIES ? mood : 'romantic';
  if (isBgMusicPlaying) {
    stopAmbientRomanticMusic();
    startAmbientRomanticMusic();
  }
}

export function startAmbientRomanticMusic() {
  if (isBgMusicPlaying) return;
  isBgMusicPlaying = true;
  melodyIndex = 0;

  const moodConfig = MOOD_MELODIES[currentMood] || MOOD_MELODIES.romantic;

  bgMusicInterval = setInterval(() => {
    if (!isBgMusicPlaying) return;
    const currentConfig = MOOD_MELODIES[currentMood] || MOOD_MELODIES.romantic;
    const note = currentConfig.notes[melodyIndex % currentConfig.notes.length];
    playPianoNote(note, 2.8, currentConfig.gain);
    melodyIndex++;
  }, moodConfig.intervalMs);
}

export function stopAmbientRomanticMusic() {
  isBgMusicPlaying = false;
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
}

export function toggleAmbientRomanticMusic(): boolean {
  if (isBgMusicPlaying) {
    stopAmbientRomanticMusic();
    return false;
  } else {
    startAmbientRomanticMusic();
    return true;
  }
}

export function isMusicPlaying(): boolean {
  return isBgMusicPlaying;
}

// 7. Multilingual Speech Synthesis Helper (बोलने वाला मार्गदर्शक)
const BCP47_LANGUAGE_MAP: Record<string, string> = {
  hi: 'hi-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
  pa: 'pa-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  de: 'de-DE',
  ar: 'ar-SA',
  ja: 'ja-JP',
  en: 'en-US',
};

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakNativeSpeech(
  text: string,
  langCode: string = 'hi',
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLocale = BCP47_LANGUAGE_MAP[langCode] || 'hi-IN';
    utterance.lang = targetLocale;
    utterance.rate = 0.95; // Slightly measured, warm speaking pace
    utterance.pitch = 1.05; // Friendly, warm tone

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(langCode) || v.lang === targetLocale);
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      currentUtterance = utterance;
      onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    onEnd?.();
    return false;
  }
}

export function stopNativeSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

// 8. Authentic Mechanical Typewriter Keystroke Sound
export function playTypewriterSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // High mechanical click
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
}

// 9. Breath Blowing / Wind Gust Sound
export function playBlowWhooshSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.25);
    filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {}
}

// 10. Candle Extinguish Puff Sound
export function playCandleExtinguishSound() {
  try {
    const ctx = getAudioContext();
    playPianoNote(659.25, 1.8, 0.1); // E5 chime
    playPianoNote(783.99, 2.2, 0.08); // G5 chime
  } catch (e) {}
}

// 11. Gift Explosion Boom & Party Pop Sound
export function playExplosionBoomSound() {
  try {
    const ctx = getAudioContext();

    // 1. Initial Bass Punch / Boom
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);

    // 2. High Sparkle / Pop Confetti Burst
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'triangle';
    popOsc.frequency.setValueAtTime(880, ctx.currentTime + 0.05);
    popOsc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);

    popGain.gain.setValueAtTime(0.25, ctx.currentTime + 0.05);
    popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(ctx.currentTime + 0.05);
    popOsc.stop(ctx.currentTime + 0.16);

    // 3. Staggered magical sparkle chimes
    setTimeout(() => playPianoNote(523.25, 0.8, 0.08), 80); // C5
    setTimeout(() => playPianoNote(659.25, 0.8, 0.08), 160); // E5
    setTimeout(() => playPianoNote(783.99, 1.2, 0.1), 240); // G5
    setTimeout(() => playPianoNote(1046.5, 1.5, 0.12), 320); // C6
  } catch (e) {}
}

// 12. Party Horn / Celebration Fanfare
export function playPartyFanfareSound() {
  try {
    const ctx = getAudioContext();
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playPianoNote(freq, 0.9, 0.09);
      }, i * 70);
    });
  } catch (e) {}
}



