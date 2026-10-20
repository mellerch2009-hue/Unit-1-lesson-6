import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { infoFileTemplates } from '../../data/lessonData';
import { CountryKey, InfoFileTemplate } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { ArabicBadge } from '../common/ArabicBadge';
import { Check, X, Sparkles, RefreshCw, Award, BookOpen, Volume2 } from 'lucide-react';
import { playSound, speakEnglish } from '../../utils/audio';

interface InfoFileBuilderTabProps {
  speechRate: number;
  showArabicHints: boolean;
  onEarnStar: () => void;
}

export const InfoFileBuilderTab: React.FC<InfoFileBuilderTabProps> = ({
  speechRate,
  showArabicHints,
  onEarnStar,
}) => {
  const [selectedFileKey, setSelectedFileKey] = useState<CountryKey>('india');
  // Store user answers: { fieldKey: selectedOption }
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [completedBadges, setCompletedBadges] = useState<Record<CountryKey, boolean>>({
    india: false,
    england: false,
  });

  const template: InfoFileTemplate = infoFileTemplates[selectedFileKey];

  const handleSelectOption = (fieldKey: string, option: string) => {
    playSound.click();
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: option,
    }));
    setChecked(false);
  };

  const handleCheckAnswers = () => {
    setChecked(true);
    let allCorrect = true;

    template.fields.forEach((field) => {
      if (answers[field.fieldKey] !== field.correctAnswer) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      playSound.fanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setCompletedBadges((prev) => ({ ...prev, [selectedFileKey]: true }));
      onEarnStar();
      onEarnStar();
      speakEnglish(`Brilliant job! You completed the ${template.title} perfectly!`);
    } else {
      playSound.fake();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setChecked(false);
    playSound.click();
  };

  const handleSwitchFile = (key: CountryKey) => {
    setSelectedFileKey(key);
    setAnswers({});
    setChecked(false);
    playSound.click();
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Arabic Scaffolding Note */}
      {showArabicHints && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-3xl p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-arabic font-bold text-slate-800 text-sm md:text-base">
                كتاب النشاط ص 14–15: أكمل ملف المعلومات باختيار الكلمات الصحيحة لكل حقل، ثم اضغط على زر التحقق!
              </p>
              <p className="text-xs text-slate-600 font-medium">
                Activity Book pages 14–15: Complete the Country Information File for India and England.
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full shrink-0">
            Activity Book 5th Grade
          </span>
        </div>
      )}

      {/* Switch between India and England file */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => handleSwitchFile('india')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-heading font-bold text-sm md:text-base transition-all ${
            selectedFileKey === 'india'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>🇮🇳</span>
          <span>India Info File</span>
          {completedBadges.india && <span className="text-amber-300">⭐</span>}
        </button>

        <button
          onClick={() => handleSwitchFile('england')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-heading font-bold text-sm md:text-base transition-all ${
            selectedFileKey === 'england'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
          <span>England Info File</span>
          {completedBadges.england && <span className="text-amber-300">⭐</span>}
        </button>
      </div>

      {/* Notebook Paper Activity Card */}
      <div className="bg-amber-50/40 border-2 border-amber-200/80 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Notebook header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-dashed border-amber-300/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {selectedFileKey === 'india' ? '🇮🇳' : '🏴󠁧󠁢󠁥󠁮󠁧󠁿'}
              </span>
              <h3 className="font-heading font-black text-2xl text-slate-900">
                {template.title}
              </h3>
            </div>
            {showArabicHints && (
              <p className="font-arabic text-xs font-semibold text-slate-600 mt-1">
                {template.titleArabic}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <AudioButton
              text={`${template.title}. Presented by ${template.character}.`}
              speechRate={speechRate}
              size="sm"
              variant="amber"
              label="Listen Title"
            />
            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-amber-100 transition-colors"
              title="Reset fields"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fields list */}
        <div className="mt-6 space-y-6">
          {template.fields.map((field, idx) => {
            const userAnswer = answers[field.fieldKey];
            const isCorrect = userAnswer === field.correctAnswer;
            const showError = checked && !isCorrect;
            const showSuccess = checked && isCorrect;

            return (
              <div
                key={field.fieldKey}
                className={`p-4 rounded-2xl bg-white border-2 transition-all ${
                  showSuccess
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : showError
                    ? 'border-rose-400 bg-rose-50/40'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-heading font-bold text-base text-slate-900">
                      {field.label}:
                    </span>
                    {showArabicHints && (
                      <span className="font-arabic text-xs text-slate-500 font-medium">
                        ({field.labelArabic})
                      </span>
                    )}
                  </div>

                  <AudioButton
                    text={`${field.label}: ${userAnswer || field.correctAnswer}`}
                    speechRate={speechRate}
                    size="sm"
                    variant="ghost"
                  />
                </div>

                {/* Option selector pills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {field.options.map((option) => {
                    const isSelected = userAnswer === option;
                    return (
                      <button
                        key={option}
                        onClick={() => handleSelectOption(field.fieldKey, option)}
                        className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs font-bold scale-[1.02]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Validation status feedback */}
                {checked && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    {showSuccess ? (
                      <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Excellent! Correct answer.</span>
                      </span>
                    ) : (
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-rose-700 font-bold">
                          <X className="w-4 h-4 text-rose-600" />
                          <span>Not quite. Correct answer: "{field.correctAnswer}"</span>
                        </span>
                        {showArabicHints && (
                          <p className="font-arabic text-[11px] text-slate-500">
                            💡 تلميح: {field.arabicHint}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-dashed border-amber-300/80">
          <div className="text-xs text-slate-500">
            <span>Make sure every field is filled before checking!</span>
          </div>

          <button
            onClick={handleCheckAnswers}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-heading font-extrabold text-base shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Check My Answers & Get Stars! ⭐</span>
          </button>
        </div>
      </div>
    </div>
  );
};
