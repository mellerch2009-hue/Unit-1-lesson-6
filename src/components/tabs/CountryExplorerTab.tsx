import React, { useState } from 'react';
import { CountryKey } from '../../types';
import { countryProfiles } from '../../data/lessonData';
import { AudioButton } from '../common/AudioButton';
import { ArabicBadge } from '../common/ArabicBadge';
import { LandmarkViewer, LandmarkModelKey } from '../3d/LandmarkViewer';
import { Volume2, Sparkles, MapPin, Building, Languages, Award, Layers, Compass } from 'lucide-react';
import { playSound, speakEnglish } from '../../utils/audio';

interface CountryExplorerTabProps {
  speechRate: number;
  showArabicHints: boolean;
  onEarnStar: () => void;
}

export const CountryExplorerTab: React.FC<CountryExplorerTabProps> = ({
  speechRate,
  showArabicHints,
  onEarnStar,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>('england');
  const [selectedModelKey, setSelectedModelKey] = useState<LandmarkModelKey>('london-eye');
  const [show3DViewer, setShow3DViewer] = useState(true);

  const profile = countryProfiles[selectedCountry];

  const handleCountrySwitch = (country: CountryKey) => {
    setSelectedCountry(country);
    playSound.click();
    if (country === 'england') {
      setSelectedModelKey('london-eye');
      speakEnglish("England. Hello, my name is Jake and I'm English.");
    } else {
      setSelectedModelKey('taj-mahal');
      speakEnglish("India. Namaste, my name is Tanvi and I'm Indian.");
    }
  };

  const handleReadFullStory = () => {
    const fullText = profile.storyParagraphs.map((p) => p.english).join(' ');
    speakEnglish(fullText, `${selectedCountry}-full-story`, speechRate);
    onEarnStar();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Arabic Encouragement Scaffolding Banner */}
      {showArabicHints && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200/80 rounded-3xl p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗺️</span>
            <div>
              <p className="font-arabic font-bold text-slate-800 text-sm md:text-base">
                اقرأ واستمع إلى معلومات إنجلترا والهند واستكشف الأماكن الشهيرة والمعالم المعمارية ثلاثية الأبعاد!
              </p>
              <p className="text-xs text-slate-600 font-medium">
                Tap on any sentence or "🔊 Listen" button to hear authentic English pronunciation.
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-full shrink-0">
            Unit 1 • Lesson 6
          </span>
        </div>
      )}

      {/* Country Switcher Toggle Bar */}
      <div className="flex items-center justify-center">
        <div className="bg-white p-1.5 rounded-2xl border-2 border-slate-200 shadow-md inline-flex items-center gap-2">
          <button
            onClick={() => handleCountrySwitch('england')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm md:text-base transition-all ${
              selectedCountry === 'england'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
            <span>England (Jake)</span>
            {showArabicHints && <span className="font-arabic text-xs font-normal opacity-90">إنجلترا</span>}
          </button>

          <button
            onClick={() => handleCountrySwitch('india')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm md:text-base transition-all ${
              selectedCountry === 'india'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-xl">🇮🇳</span>
            <span>India (Tanvi)</span>
            {showArabicHints && <span className="font-arabic text-xs font-normal opacity-90">الهند</span>}
          </button>
        </div>
      </div>

      {/* Hero Character & Story Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Character Card & Fast Facts */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            {/* Top decorative gradient badge */}
            <div
              className={`absolute top-0 left-0 right-0 h-3 ${
                selectedCountry === 'england' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-4xl mb-2 block">{profile.flagEmoji}</span>
                <h2 className="font-heading font-black text-2xl text-slate-900">
                  {profile.name}
                </h2>
                {showArabicHints && (
                  <p className="font-arabic text-slate-500 text-sm font-semibold">
                    {profile.nameArabic}
                  </p>
                )}
              </div>

              {/* Character Avatar Badge */}
              <div className="text-right">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md ${
                    selectedCountry === 'england' ? 'bg-rose-100' : 'bg-emerald-100'
                  }`}
                >
                  {selectedCountry === 'england' ? '👦🏼' : '👧🏽'}
                </div>
                <div className="mt-1 font-heading font-bold text-sm text-slate-800">
                  {profile.characterName}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {profile.characterNationality}
                </div>
              </div>
            </div>

            {/* Character Greeting & Audio */}
            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Character Greeting
                </span>
                <AudioButton
                  text={profile.characterGreeting}
                  speechRate={speechRate}
                  size="sm"
                  variant="amber"
                  label="Listen"
                />
              </div>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                "{profile.characterGreeting}"
              </p>
              {showArabicHints && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="font-arabic text-xs text-slate-600 text-right">
                    {profile.characterGreetingArabic}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Fact Badges */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">Continent:</span>
                  <span className="text-xs font-extrabold text-blue-800">{profile.continent}</span>
                </div>
                <AudioButton text={profile.continent} speechRate={speechRate} size="sm" variant="ghost" />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-700">Capital City:</span>
                  <span className="text-xs font-extrabold text-indigo-800">{profile.capitalCity}</span>
                </div>
                <AudioButton text={profile.capitalCity} speechRate={speechRate} size="sm" variant="ghost" />
              </div>

              {profile.biggestCity && (
                <div className="flex items-center justify-between p-2.5 bg-amber-50/80 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏙️</span>
                    <div>
                      <span className="text-xs font-bold text-slate-700">Biggest City: </span>
                      <span className="text-xs font-extrabold text-amber-900">{profile.biggestCity}</span>
                      {showArabicHints && (
                        <span className="block text-[10px] font-arabic text-amber-800">
                          (مومباي هي أكبر مدينة بينما نيودلهي هي العاصمة)
                        </span>
                      )}
                    </div>
                  </div>
                  <AudioButton text={profile.biggestCity} speechRate={speechRate} size="sm" variant="ghost" />
                </div>
              )}

              {profile.nationalSymbol && (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🐅</span>
                    <span className="text-xs font-bold text-slate-700">National Symbol:</span>
                    <span className="text-xs font-extrabold text-emerald-800">{profile.nationalSymbol}</span>
                  </div>
                  <AudioButton text={profile.nationalSymbol} speechRate={speechRate} size="sm" variant="ghost" />
                </div>
              )}

              {/* Languages */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-700">Languages:</span>
                  </div>
                  <AudioButton
                    text={profile.languages.join(', ')}
                    speechRate={speechRate}
                    size="sm"
                    variant="ghost"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-0.5 rounded-md text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
                {showArabicHints && (
                  <p className="mt-1 font-arabic text-[11px] text-slate-500 text-right">
                    {profile.languagesArabic}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Pupil's Book Story Paragraphs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
                  <span>📖</span>
                  <span>Pupil's Book Reading: {profile.name}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedCountry === 'england' ? "Page 18 • Jake's Album" : "Page 19 • Tanvi's Album"}
                </p>
              </div>

              <button
                onClick={handleReadFullStory}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs md:text-sm font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>Read Entire Story 🔊</span>
              </button>
            </div>

            {/* Paragraph by paragraph interactive reading */}
            <div className="mt-4 space-y-3">
              {profile.storyParagraphs.map((paragraph, idx) => (
                <div
                  key={idx}
                  onClick={() => speakEnglish(paragraph.english, `p-${idx}`, speechRate)}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-200 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 group-hover:bg-indigo-200 text-slate-700 group-hover:text-indigo-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm md:text-base font-medium text-slate-800 group-hover:text-indigo-950 leading-relaxed">
                        {paragraph.english}
                      </p>
                    </div>
                    <AudioButton
                      text={paragraph.english}
                      speechRate={speechRate}
                      size="sm"
                      variant="ghost"
                      label=""
                    />
                  </div>

                  {showArabicHints && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 pr-8">
                      <p className="font-arabic text-xs md:text-sm text-slate-600 text-right">
                        {paragraph.arabic}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Famous For section */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="font-heading font-bold text-sm text-amber-900">
                    Famous for in {profile.name}:
                  </h4>
                </div>
                <AudioButton
                  text={`Famous for in ${profile.name}: ${profile.famousFor.join(', ')}`}
                  speechRate={speechRate}
                  size="sm"
                  variant="ghost"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.famousFor.map((item) => (
                  <button
                    key={item}
                    onClick={() => speakEnglish(item, item, speechRate)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-950 font-bold text-xs hover:bg-amber-100 transition-colors shadow-2xs"
                  >
                    <span>{item}</span>
                    <Volume2 className="w-3 h-3 text-amber-600" />
                  </button>
                ))}
              </div>

              {showArabicHints && (
                <p className="mt-2 font-arabic text-xs text-amber-800 text-right">
                  {profile.famousForArabic}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Interactive Landmarks Explorer (Procedural Three.js) */}
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-heading font-black text-xl text-slate-900">
                  3D Landmark Explorer (Three.js)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Inspect the London Eye, Tower Bridge, Taj Mahal, and Queen's Palace in real 3D!
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShow3DViewer(!show3DViewer)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all"
            >
              {show3DViewer ? 'Hide 3D Scene' : 'Show 3D Scene'}
            </button>
          </div>
        </div>

        {show3DViewer && (
          <LandmarkViewer
            modelKey={selectedModelKey}
            onModelChange={(key) => setSelectedModelKey(key)}
          />
        )}
      </div>
    </div>
  );
};
