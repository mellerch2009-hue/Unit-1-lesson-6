import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { detectiveQuestions, sortingItems } from '../../data/lessonData';
import { DetectiveQuestion, SortingItem, CountryKey } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { ArabicBadge } from '../common/ArabicBadge';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Flame,
  Award,
  RefreshCw,
  Sparkles,
  Gamepad2,
  Train,
  Check,
  Volume2,
} from 'lucide-react';
import { playSound, speakEnglish } from '../../utils/audio';

interface GamesArcadeTabProps {
  speechRate: number;
  showArabicHints: boolean;
  onEarnStar: () => void;
}

export const GamesArcadeTab: React.FC<GamesArcadeTabProps> = ({
  speechRate,
  showArabicHints,
  onEarnStar,
}) => {
  const [activeGame, setActiveGame] = useState<'detective' | 'sorting'>('detective');

  // --- GAME 1: FACT OR FAKE DETECTIVE STATE ---
  const [detIndex, setDetIndex] = useState(0);
  const [detScore, setDetScore] = useState(0);
  const [detStreak, setDetStreak] = useState(0);
  const [detFeedback, setDetFeedback] = useState<{
    answered: boolean;
    isCorrect: boolean;
    text: string;
    textArabic?: string;
  } | null>(null);

  const currentDetQ: DetectiveQuestion = detectiveQuestions[detIndex];

  const handleDetectiveAnswer = (userChoice: boolean) => {
    if (detFeedback?.answered) return;

    const isCorrect = userChoice === currentDetQ.isFact;
    if (isCorrect) {
      playSound.correct();
      const newStreak = detStreak + 1;
      const points = 10 * Math.max(1, newStreak);
      setDetScore((prev) => prev + points);
      setDetStreak(newStreak);
      onEarnStar();

      setDetFeedback({
        answered: true,
        isCorrect: true,
        text: currentDetQ.isFact
          ? 'Brilliant! It is a true Fact!'
          : `Well spotted Detective! ${currentDetQ.correctionIfFake || 'It was Fake!'}`,
        textArabic: currentDetQ.correctionArabic || 'إجابة عبقرية وصحيحة!',
      });
      speakEnglish(
        currentDetQ.isFact
          ? 'Brilliant! That is a fact!'
          : currentDetQ.correctionIfFake || 'Correct! That statement was fake!'
      );
    } else {
      playSound.fake();
      setDetStreak(0);
      setDetFeedback({
        answered: true,
        isCorrect: false,
        text: currentDetQ.isFact
          ? 'Oops! That statement is actually a true Fact from the lesson!'
          : `Oops! ${currentDetQ.correctionIfFake || 'That statement was Fake!'}`,
        textArabic: currentDetQ.correctionArabic || 'للأسف إجابة غير صحيحة، ركز في تفاصيل الدرس!',
      });
    }
  };

  const handleNextDetective = () => {
    setDetFeedback(null);
    if (detIndex < detectiveQuestions.length - 1) {
      setDetIndex((prev) => prev + 1);
    } else {
      // Game completed
      playSound.fanfare();
      confetti({ particleCount: 100, spread: 80 });
      setDetIndex(0);
    }
  };

  // --- GAME 2: SORTING TRAIN STATE ---
  const [availableItems, setAvailableItems] = useState<SortingItem[]>(sortingItems);
  const [englandWagon, setEnglandWagon] = useState<SortingItem[]>([]);
  const [indiaWagon, setIndiaWagon] = useState<SortingItem[]>([]);
  const [sortingError, setSortingError] = useState<string | null>(null);
  const [sortingStars, setSortingStars] = useState(0);

  const handleSortItem = (item: SortingItem, targetCountry: CountryKey) => {
    if (item.country === targetCountry) {
      // Correct sort
      playSound.correct();
      setSortingError(null);
      setAvailableItems((prev) => prev.filter((i) => i.id !== item.id));

      if (targetCountry === 'england') {
        setEnglandWagon((prev) => [...prev, item]);
      } else {
        setIndiaWagon((prev) => [...prev, item]);
      }

      setSortingStars((prev) => prev + 1);
      onEarnStar();
      speakEnglish(`Correct! ${item.name} belongs to ${targetCountry === 'england' ? 'England' : 'India'}!`);

      // If all sorted
      if (availableItems.length <= 1) {
        playSound.fanfare();
        confetti({ particleCount: 120, spread: 90 });
      }
    } else {
      // Wrong sort
      playSound.fake();
      setSortingError(`Oops! "${item.name}" does NOT belong to ${targetCountry === 'england' ? 'England' : 'India'}. Check again!`);
    }
  };

  const handleResetSorting = () => {
    setAvailableItems(sortingItems);
    setEnglandWagon([]);
    setIndiaWagon([]);
    setSortingError(null);
    playSound.click();
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Arabic Game Arcade Banner */}
      {showArabicHints && (
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-purple-200/80 rounded-3xl p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <div>
              <p className="font-arabic font-bold text-slate-800 text-sm md:text-base">
                صالة الألعاب التفاعلية: اختر اللعبة المناسبة لاختبار مهاراتك وجمع النجوم!
              </p>
              <p className="text-xs text-slate-600 font-medium">
                Game 1: Fact or Fake Detective 🕵️‍♂️ | Game 2: Landmark & Symbol Sorting 🚂
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-800 font-bold rounded-full shrink-0">
            Games Arcade
          </span>
        </div>
      )}

      {/* Game Selector Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            setActiveGame('detective');
            playSound.click();
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-heading font-extrabold text-sm md:text-base transition-all ${
            activeGame === 'detective'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-[1.02]'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>🕵️‍♂️</span>
          <span>Game 1: Fact or Fake Detective</span>
        </button>

        <button
          onClick={() => {
            setActiveGame('sorting');
            playSound.click();
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-heading font-extrabold text-sm md:text-base transition-all ${
            activeGame === 'sorting'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>🚂</span>
          <span>Game 2: Landmark & Symbol Sorting</span>
        </button>
      </div>

      {/* GAME 1: FACT OR FAKE DETECTIVE */}
      {activeGame === 'detective' && (
        <div className="bg-white border-2 border-purple-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          {/* Header Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🕵️‍♂️</span>
              <div>
                <h3 className="font-heading font-black text-xl md:text-2xl text-slate-900">
                  Fact or Fake Detective
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Is the statement true to the lesson, or is it a trick?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Streak badge */}
              {detStreak > 1 && (
                <div className="flex items-center gap-1 bg-orange-100 border border-orange-300 text-orange-800 px-3 py-1 rounded-xl text-xs font-bold animate-pulse">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>{detStreak}x Streak!</span>
                </div>
              )}

              {/* Score badge */}
              <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-900 px-3.5 py-1.5 rounded-xl font-heading font-bold text-sm">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Score: {detScore} pts</span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-gradient-to-br from-slate-50 to-purple-50/40 border-2 border-purple-100 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
                Clue #{detIndex + 1} of {detectiveQuestions.length}
              </span>
              <AudioButton
                text={currentDetQ.statement}
                speechRate={speechRate}
                size="md"
                variant="primary"
                label="Listen Clue"
              />
            </div>

            <h4 className="font-heading font-black text-2xl md:text-3xl text-slate-900 leading-snug">
              "{currentDetQ.statement}"
            </h4>

            {showArabicHints && (
              <div className="pt-1">
                <ArabicBadge text={currentDetQ.statementArabic} showIcon />
              </div>
            )}

            {/* Fact or Fake Action Buttons */}
            {!detFeedback?.answered ? (
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleDetectiveAnswer(true)}
                  className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-extrabold text-lg shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-6 h-6 text-emerald-200" />
                  <span>FACT! (True ✓)</span>
                </button>

                <button
                  onClick={() => handleDetectiveAnswer(false)}
                  className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-extrabold text-lg shadow-md shadow-rose-600/25 active:scale-95 transition-all cursor-pointer"
                >
                  <XCircle className="w-6 h-6 text-rose-200" />
                  <span>FAKE! (False ❌)</span>
                </button>
              </div>
            ) : (
              /* Feedback display */
              <div
                className={`mt-6 p-5 rounded-2xl border-2 space-y-3 animate-in fade-in duration-200 ${
                  detFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {detFeedback.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    )}
                    <h5 className="font-heading font-black text-xl">
                      {detFeedback.isCorrect ? 'Correct Deduction! ⭐' : 'Detective Alert! ⚠️'}
                    </h5>
                  </div>
                  <AudioButton
                    text={detFeedback.text}
                    speechRate={speechRate}
                    size="sm"
                    variant="amber"
                  />
                </div>

                <p className="text-sm md:text-base font-semibold leading-relaxed">
                  {detFeedback.text}
                </p>

                {showArabicHints && detFeedback.textArabic && (
                  <p className="font-arabic text-xs md:text-sm text-slate-700 text-right">
                    {detFeedback.textArabic}
                  </p>
                )}

                <div className="pt-3 border-t border-slate-200/60 flex justify-end">
                  <button
                    onClick={handleNextDetective}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold text-sm shadow-md active:scale-95 transition-all"
                  >
                    <span>Next Case ➔</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 2: LANDMARK & SYMBOL SORTING TRAIN */}
      {activeGame === 'sorting' && (
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Train className="w-7 h-7 text-blue-600" />
              <div>
                <h3 className="font-heading font-black text-xl md:text-2xl text-slate-900">
                  Landmark & Symbol Sorting Station
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Sort every card into either England 🏴 or India 🇮🇳 wagons!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
                {availableItems.length} items remaining
              </span>
              <button
                onClick={handleResetSorting}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Reset game"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {sortingError && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl text-xs md:text-sm text-rose-800 font-bold flex items-center justify-between animate-shake">
              <span>{sortingError}</span>
              <button onClick={() => setSortingError(null)} className="text-rose-500 hover:text-rose-900">
                ✕
              </button>
            </div>
          )}

          {/* Station Platform with Items to Sort */}
          {availableItems.length > 0 ? (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Items Ready for Sorting (Tap a button below each card):
                </span>
                <span className="text-xs text-slate-400">Total: {availableItems.length}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availableItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-2xs hover:border-blue-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-2xl">{item.emoji}</span>
                        <AudioButton text={item.name} speechRate={speechRate} size="sm" variant="ghost" />
                      </div>
                      <h5 className="font-heading font-bold text-sm text-slate-900">
                        {item.name}
                      </h5>
                      {showArabicHints && (
                        <p className="font-arabic text-[11px] text-slate-500 mt-0.5 text-right">
                          {item.nameArabic}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleSortItem(item, 'england')}
                        className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
                      >
                        To England 🏴
                      </button>
                      <button
                        onClick={() => handleSortItem(item, 'india')}
                        className="py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer"
                      >
                        To India 🇮🇳
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-emerald-50 rounded-3xl border-2 border-emerald-300 space-y-3">
              <span className="text-5xl block">🎉</span>
              <h4 className="font-heading font-black text-2xl text-emerald-950">
                Spectacular Job! All items sorted correctly!
              </h4>
              <p className="text-sm font-semibold text-emerald-800">
                You know all the landmarks, characters, and symbols of England and India!
              </p>
              <button
                onClick={handleResetSorting}
                className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-bold text-sm shadow-md"
              >
                Play Again 🔄
              </button>
            </div>
          )}

          {/* The Two Wagons (Destination Bins) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* England Wagon */}
            <div className="p-5 rounded-3xl border-2 border-rose-200 bg-rose-50/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                  <div>
                    <h4 className="font-heading font-black text-lg text-rose-950">
                      England Wagon (Jake)
                    </h4>
                    <p className="text-xs text-rose-700 font-medium">
                      Capital: London • Europe
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full">
                  {englandWagon.length} items
                </span>
              </div>

              {englandWagon.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-semibold border-2 border-dashed border-rose-200 rounded-2xl">
                  Empty wagon. Sort England items here!
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {englandWagon.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-bold text-rose-950 shadow-2xs"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* India Wagon */}
            <div className="p-5 rounded-3xl border-2 border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇮🇳</span>
                  <div>
                    <h4 className="font-heading font-black text-lg text-emerald-950">
                      India Wagon (Tanvi)
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium">
                      Capital: New Delhi • Asia
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  {indiaWagon.length} items
                </span>
              </div>

              {indiaWagon.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-semibold border-2 border-dashed border-emerald-200 rounded-2xl">
                  Empty wagon. Sort India items here!
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {indiaWagon.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-950 shadow-2xs"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
