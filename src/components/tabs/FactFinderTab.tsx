import React, { useState } from 'react';
import { factQuestions } from '../../data/lessonData';
import { FactQuestion, CountryKey } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { ArabicBadge } from '../common/ArabicBadge';
import { HelpCircle, CheckCircle2, RotateCcw, Sparkles, Filter, ChevronRight, Eye } from 'lucide-react';
import { playSound, speakEnglish } from '../../utils/audio';

interface FactFinderTabProps {
  speechRate: number;
  showArabicHints: boolean;
  onEarnStar: () => void;
}

export const FactFinderTab: React.FC<FactFinderTabProps> = ({
  speechRate,
  showArabicHints,
  onEarnStar,
}) => {
  const [filterCountry, setFilterCountry] = useState<'all' | CountryKey>('all');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'flashcards' | 'grid'>('flashcards');

  const filteredQuestions = factQuestions.filter((q) => {
    if (filterCountry === 'all') return true;
    return q.country === filterCountry;
  });

  const currentQ = filteredQuestions[activeCardIndex] || filteredQuestions[0];
  const isCurrentRevealed = revealedIds.has(currentQ?.id);
  const isCurrentMastered = masteredIds.has(currentQ?.id);

  const handleReveal = (id: string, answerText: string) => {
    setRevealedIds((prev) => new Set(prev).add(id));
    playSound.click();
    speakEnglish(answerText, `ans-${id}`, speechRate);
  };

  const handleMarkMastered = (id: string) => {
    if (!masteredIds.has(id)) {
      setMasteredIds((prev) => new Set(prev).add(id));
      playSound.star();
      onEarnStar();
    }
  };

  const handleNext = () => {
    if (activeCardIndex < filteredQuestions.length - 1) {
      setActiveCardIndex((prev) => prev + 1);
      playSound.click();
    } else {
      setActiveCardIndex(0);
    }
  };

  const handlePrev = () => {
    if (activeCardIndex > 0) {
      setActiveCardIndex((prev) => prev - 1);
      playSound.click();
    } else {
      setActiveCardIndex(filteredQuestions.length - 1);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Arabic Guidance Banner */}
      {showArabicHints && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 rounded-3xl p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-arabic font-bold text-slate-800 text-sm md:text-base">
                بطاقات الحقائق التفاعلية: اضغط للاستماع للسؤال، ثم اكشف الإجابة للتحقق من حفظك للدرس!
              </p>
              <p className="text-xs text-slate-600 font-medium">
                Distinguish between capitals, landmarks, and biggest cities (London vs New Delhi vs Mumbai).
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-indigo-100 text-indigo-800 font-bold rounded-full shrink-0">
            {masteredIds.size} / {factQuestions.length} Mastered ⭐
          </span>
        </div>
      )}

      {/* Filter and View Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Country filter tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => {
              setFilterCountry('all');
              setActiveCardIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCountry === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Questions ({factQuestions.length})
          </button>
          <button
            onClick={() => {
              setFilterCountry('england');
              setActiveCardIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterCountry === 'england'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> England
          </button>
          <button
            onClick={() => {
              setFilterCountry('india');
              setActiveCardIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterCountry === 'india'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>🇮🇳</span> India
          </button>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('flashcards')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'flashcards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Interactive Flashcard
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Cards Grid
          </button>
        </div>
      </div>

      {/* FLASHCARD MODE */}
      {viewMode === 'flashcards' && currentQ && (
        <div className="space-y-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
            {/* Top country indicator pill */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {currentQ.country === 'england' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : '🇮🇳'}
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {currentQ.country === 'england' ? 'England Profile' : 'India Profile'} • {currentQ.category}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Card {activeCardIndex + 1} of {filteredQuestions.length}
              </span>
            </div>

            {/* Question section */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-heading font-black text-2xl md:text-3xl text-slate-900 leading-tight">
                  {currentQ.question}
                </h3>
                <AudioButton
                  text={currentQ.question}
                  speechRate={speechRate}
                  size="md"
                  variant="primary"
                  label="Listen"
                />
              </div>

              {showArabicHints && (
                <div className="pt-1">
                  <ArabicBadge text={currentQ.questionArabic} showIcon />
                </div>
              )}
            </div>

            {/* Answer section (Revealable) */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              {!isCurrentRevealed ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                  <p className="text-sm font-semibold text-slate-600 mb-3">
                    Think you know the answer? Tap below to check!
                  </p>
                  {showArabicHints && (
                    <p className="font-arabic text-xs text-slate-500 mb-4">
                      خمّن الإجابة ثم اضغط على الزر لكشفها وسماع نطقها باللغة الإنجليزية
                    </p>
                  )}
                  <button
                    onClick={() => handleReveal(currentQ.id, currentQ.answer)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-heading font-extrabold text-base shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Reveal Answer & Listen 🔊</span>
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
                        Official Lesson Answer:
                      </span>
                      <h4 className="font-heading font-black text-2xl md:text-3xl text-emerald-950 mt-1">
                        {currentQ.answer}
                      </h4>
                    </div>
                    <AudioButton
                      text={currentQ.answer}
                      speechRate={speechRate}
                      size="md"
                      variant="amber"
                      label="Listen"
                    />
                  </div>

                  {showArabicHints && (
                    <div className="pt-2 border-t border-emerald-200/80">
                      <p className="font-arabic font-bold text-sm text-emerald-800 text-right">
                        الإجابة: {currentQ.answerArabic}
                      </p>
                    </div>
                  )}

                  {/* Fact Explanation */}
                  <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-200 text-sm text-slate-700 font-medium">
                    <p>{currentQ.explanation}</p>
                    {showArabicHints && (
                      <p className="font-arabic text-xs text-slate-500 mt-1 text-right">
                        {currentQ.explanationArabic}
                      </p>
                    )}
                  </div>

                  {/* Self-check Mastery Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleMarkMastered(currentQ.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                        isCurrentMastered
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCurrentMastered ? 'Mastered! ⭐' : 'I Know This! (+1 Star ⭐)'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const newRevealed = new Set(revealedIds);
                        newRevealed.delete(currentQ.id);
                        setRevealedIds(newRevealed);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline"
                    >
                      Hide answer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs md:text-sm font-bold text-slate-700 transition-all"
              >
                ← Previous Card
              </button>

              <div className="flex gap-1.5">
                {filteredQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeCardIndex === idx
                        ? 'w-6 bg-indigo-600'
                        : masteredIds.has(q.id)
                        ? 'bg-emerald-400'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                    title={`Card ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold shadow-xs transition-all"
              >
                <span>Next Card</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRID VIEW MODE */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuestions.map((q, idx) => {
            const isRev = revealedIds.has(q.id);
            const isMast = masteredIds.has(q.id);
            return (
              <div
                key={q.id}
                className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <span>{q.country === 'england' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : '🇮🇳'}</span>
                      <span>#{idx + 1} • {q.category}</span>
                    </span>
                    {isMast && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ⭐ Mastered
                      </span>
                    )}
                  </div>

                  <h4 className="font-heading font-bold text-base md:text-lg text-slate-900 mb-2">
                    {q.question}
                  </h4>

                  {showArabicHints && (
                    <p className="font-arabic text-xs text-slate-500 mb-3 text-right">
                      {q.questionArabic}
                    </p>
                  )}

                  {isRev ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-black text-emerald-950 text-base">
                          {q.answer}
                        </span>
                        <AudioButton text={q.answer} speechRate={speechRate} size="sm" variant="amber" />
                      </div>
                      {showArabicHints && (
                        <p className="font-arabic text-xs text-emerald-800 mt-1 text-right">
                          {q.answerArabic}
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleReveal(q.id, q.answer)}
                      className="w-full py-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-950 rounded-xl text-xs font-bold transition-all text-center"
                    >
                      Tap to reveal answer 🔍
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <AudioButton
                    text={q.question}
                    speechRate={speechRate}
                    size="sm"
                    variant="secondary"
                    label="Listen Question"
                  />
                  <button
                    onClick={() => handleMarkMastered(q.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                      isMast
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isMast ? '✓ Done' : '+ Mark Known'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
