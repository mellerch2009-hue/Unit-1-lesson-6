import React, { useState } from 'react';
import { vocabularyList, countryProfiles } from '../../data/lessonData';
import { VocabularyWord } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { ArabicBadge } from '../common/ArabicBadge';
import { Search, BookMarked, Sparkles, Volume2, Globe, Printer } from 'lucide-react';
import { speakEnglish } from '../../utils/audio';

interface BilingualReferenceTabProps {
  speechRate: number;
  showArabicHints: boolean;
  onEarnStar: () => void;
}

export const BilingualReferenceTab: React.FC<BilingualReferenceTabProps> = ({
  speechRate,
  showArabicHints,
  onEarnStar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterContext, setFilterContext] = useState<'All' | 'England' | 'India'>('All');

  const filteredVocab = vocabularyList.filter((item) => {
    const matchesQuery =
      item.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arabic.includes(searchQuery);
    const matchesContext =
      filterContext === 'All' || item.countryContext === filterContext || item.countryContext === 'Both';
    return matchesQuery && matchesContext;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Arabic Scaffolding Banner */}
      {showArabicHints && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200/80 rounded-3xl p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-arabic font-bold text-slate-800 text-sm md:text-base">
                المرجع الثنائي: جدول مقارنة شامل بين إنجلترا والهند مع قاموس المفردات الأساسية للدرس ونطقها الصوتي.
              </p>
              <p className="text-xs text-slate-600 font-medium">
                Bilingual summary table and vocabulary bank for Unit 1, Lesson 6.
              </p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 text-amber-900 font-bold text-xs rounded-xl hover:bg-amber-100 transition-colors shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      )}

      {/* SECTION 1: MASTER COMPARISON TABLE */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" />
            <h3 className="font-heading font-black text-xl md:text-2xl text-slate-900">
              Country Comparison Summary: England vs. India
            </h3>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
            Quick Study Guide
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3.5 px-4 font-heading font-extrabold text-slate-600 text-xs uppercase tracking-wider">
                  Feature / الخاصية
                </th>
                <th className="py-3.5 px-4 font-heading font-extrabold text-rose-900 text-sm bg-rose-50/60 border-l border-rose-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> England (إنجلترا)
                    </span>
                    <AudioButton text="England" speechRate={speechRate} size="sm" variant="ghost" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-heading font-extrabold text-emerald-900 text-sm bg-emerald-50/60 border-l border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>🇮🇳</span> India (الهند)
                    </span>
                    <AudioButton text="India" speechRate={speechRate} size="sm" variant="ghost" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Character */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-700 text-xs">
                  Character & Boy/Girl
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-slate-800">
                  <span className="font-bold">Jake</span> (English boy)
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-slate-800">
                  <span className="font-bold">Tanvi</span> (Indian girl)
                </td>
              </tr>

              {/* Continent */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-700 text-xs">
                  Location / Continent
                </td>
                <td className="py-3 px-4 border-l border-slate-100">
                  <span className="font-extrabold text-rose-700">Europe</span> (أوروبا)
                </td>
                <td className="py-3 px-4 border-l border-slate-100">
                  <span className="font-extrabold text-emerald-700">Asia</span> (آسيا)
                </td>
              </tr>

              {/* Capital City */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-700 text-xs">
                  Capital City
                </td>
                <td className="py-3 px-4 border-l border-slate-100 font-extrabold text-slate-900">
                  London
                </td>
                <td className="py-3 px-4 border-l border-slate-100 font-extrabold text-slate-900">
                  New Delhi
                </td>
              </tr>

              {/* Biggest City */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-700 text-xs">
                  Biggest City
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-slate-700">
                  London
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-amber-900 font-bold">
                  Mumbai (not New Delhi!)
                </td>
              </tr>

              {/* Languages */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-700 text-xs">
                  Languages Spoken
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-slate-700">
                  English
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-slate-700">
                  Hindi, Tamil, Urdu, English
                </td>
              </tr>

              {/* National Symbol */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-700 text-xs">
                  National Symbol
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-slate-500">
                  —
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-emerald-800 font-bold flex items-center gap-1.5">
                  <span>🐅</span>
                  <span>The Tiger</span>
                </td>
              </tr>

              {/* Famous Landmarks & Items */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-700 text-xs">
                  Famous For / Landmarks
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-slate-700">
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>London Eye (very big wheel)</li>
                    <li>Tower Bridge (very old bridge)</li>
                    <li>The Queen's Palace</li>
                  </ul>
                </td>
                <td className="py-3 px-4 border-l border-slate-100 text-slate-700">
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Taj Mahal (famous palace)</li>
                    <li>Elephants, fine tea & curry</li>
                    <li>Saris (Indian dresses)</li>
                    <li>Himalaya mountains</li>
                    <li>Monsoon rainy season (July–Sept)</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: VOCABULARY BANK */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-amber-600" />
            <h3 className="font-heading font-black text-xl md:text-2xl text-slate-900">
              Key Lesson Vocabulary (المفردات الأساسية)
            </h3>
          </div>

          {/* Context filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['All', 'England', 'India'] as const).map((ctx) => (
              <button
                key={ctx}
                onClick={() => setFilterContext(ctx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterContext === ctx
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {ctx}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vocabulary (e.g. capital, palace, bridge, sari, monsoon)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Vocab Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocab.map((word) => (
            <div
              key={word.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-300 hover:shadow-xs transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-heading font-black text-lg text-slate-900">
                      {word.english}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {word.phonetic} • {word.partOfSpeech}
                    </span>
                  </div>
                  <AudioButton
                    text={word.english}
                    speechRate={speechRate}
                    size="sm"
                    variant="amber"
                  />
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  <p className="font-arabic font-bold text-sm text-emerald-800 text-right">
                    {word.arabic}
                  </p>
                </div>

                <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700">
                  <p className="italic">"{word.example}"</p>
                  {showArabicHints && (
                    <p className="font-arabic text-[11px] text-slate-500 mt-1 text-right">
                      {word.exampleArabic}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  {word.countryContext}
                </span>
                <button
                  onClick={() => speakEnglish(`${word.english}. ${word.example}`, word.id, speechRate)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Example</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
