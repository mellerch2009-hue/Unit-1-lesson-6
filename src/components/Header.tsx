import React from 'react';
import { Star, Volume2, Globe2, BookOpen, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

interface HeaderProps {
  stars: number;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  showArabicHints: boolean;
  onToggleArabicHints: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stars,
  speechRate,
  onSpeechRateChange,
  showArabicHints,
  onToggleArabicHints,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
      {/* Top micro ribbon */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-600 to-emerald-600 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-between">
        <div className="flex items-center gap-1.5 mx-auto">
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span>English for Libya — Primary 5 • Unit 1, Lesson 6</span>
          <span className="hidden sm:inline text-blue-200">|</span>
          <span className="hidden sm:inline font-arabic text-emerald-100">
            كتاب التلميذ ص 18-19 • كتاب النشاط ص 14-15
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Flag Icons */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-heading text-xl font-black">
            🌍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-slate-900 text-lg md:text-xl tracking-tight">
                Country Information File
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> England & <span>🇮🇳</span> India
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Explore with Jake & Tanvi • 3D Landmarks • Audio Pronunciation
            </p>
          </div>
        </div>

        {/* Action Controls & Star Score */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Star Counter */}
          <div
            onClick={() => playSound.star()}
            className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 text-amber-900 px-3 py-1.5 rounded-2xl shadow-xs cursor-pointer hover:scale-105 transition-transform"
            title="Total stars earned!"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-bounce" />
            <span className="font-heading font-black text-base">{stars}</span>
            <span className="text-xs font-bold text-amber-700 hidden sm:inline">Stars</span>
          </div>

          {/* Speech Rate Switcher (Normal 0.9x vs Slow 0.7x for EFL) */}
          <button
            onClick={() => {
              const newRate = speechRate === 0.9 ? 0.7 : 0.9;
              onSpeechRateChange(newRate);
              playSound.click();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            title="Toggle speech speed (Slow helps Primary 5 English learners!)"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Voice:</span>
            <span className="font-bold text-indigo-600">
              {speechRate === 0.7 ? 'Slow (0.7x) 🐢' : 'Normal 🐰'}
            </span>
          </button>

          {/* Arabic Scaffolding Toggle */}
          <button
            onClick={() => {
              onToggleArabicHints();
              playSound.click();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition-all ${
              showArabicHints
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
            title="Toggle Arabic explanations and translations"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-arabic font-bold">
              {showArabicHints ? 'العربية: مفعّلة ✓' : 'العربية: معطلة'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
