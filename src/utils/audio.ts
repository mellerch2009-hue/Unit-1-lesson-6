/**
 * Audio synthesis and Sound Effects engine
 * Uses Web Speech API for English pronunciation and Web Audio API for zero-dependency sound effects.
 */

// Web Audio Context (lazy singleton)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Sound effects generator using Web Audio oscillators
export const playSound = {
  click: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio error
    }
  },

  correct: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Dual tone cheerful chime
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {
      // Ignore
    }
  },

  fake: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.22);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  },

  star: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.18, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.35);
      });
    } catch {
      // Ignore
    }
  },

  fanfare: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0, d: 0.15 },
        { f: 523.25, t: 0.15, d: 0.15 },
        { f: 523.25, t: 0.30, d: 0.15 },
        { f: 659.25, t: 0.45, d: 0.35 },
        { f: 587.33, t: 0.85, d: 0.15 },
        { f: 659.25, t: 1.00, d: 0.15 },
        { f: 783.99, t: 1.15, d: 0.55 },
      ];
      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.25, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch {
      // Ignore
    }
  },
};

// Web Speech API wrapper
type SpeechListener = (speakingId: string | null) => void;
const listeners: Set<SpeechListener> = new Set();
let currentSpeakingId: string | null = null;

export function registerSpeechListener(cb: SpeechListener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function notifySpeechChange(id: string | null) {
  currentSpeakingId = id;
  listeners.forEach((cb) => cb(id));
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    notifySpeechChange(null);
  }
}

export function speakEnglish(
  text: string,
  elementId?: string,
  speechRate = 0.9,
  accent: 'GB' | 'US' = 'GB'
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    // Stop ongoing speech
    window.speechSynthesis.cancel();

    // Clean text of emojis and special symbols for clearer pronunciation
    const cleanText = text
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/🔊|🇬🇧|🇮🇳|🏴|🐅|🐘|☕|🍛|👗|🕌|🏔️|🌧️|🎡|🌉|👑/g, '')
      .trim();

    if (!cleanText) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.65, Math.min(speechRate, 1.2));
    utterance.pitch = 1.05;

    // Pick best English voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (accent === 'GB') {
      selectedVoice =
        voices.find((v) => v.lang.startsWith('en-GB') || v.name.includes('UK') || v.name.includes('British')) ||
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en'));
    } else {
      selectedVoice =
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = accent === 'GB' ? 'en-GB' : 'en-US';

    const id = elementId || text;
    notifySpeechChange(id);

    utterance.onend = () => {
      notifySpeechChange(null);
      resolve();
    };

    utterance.onerror = () => {
      notifySpeechChange(null);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}
