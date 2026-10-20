import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar, TabKey } from './components/Navbar';
import { CountryExplorerTab } from './components/tabs/CountryExplorerTab';
import { FactFinderTab } from './components/tabs/FactFinderTab';
import { InfoFileBuilderTab } from './components/tabs/InfoFileBuilderTab';
import { GamesArcadeTab } from './components/tabs/GamesArcadeTab';
import { BilingualReferenceTab } from './components/tabs/BilingualReferenceTab';
import { playSound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('explorer');
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('efl5_stars');
      return saved ? parseInt(saved, 10) : 10;
    } catch {
      return 10;
    }
  });

  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [showArabicHints, setShowArabicHints] = useState<boolean>(true);

  // Save stars to local storage
  useEffect(() => {
    try {
      localStorage.setItem('efl5_stars', stars.toString());
    } catch {
      // Ignore
    }
  }, [stars]);

  const handleEarnStar = () => {
    setStars((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Top Header */}
      <Header
        stars={stars}
        speechRate={speechRate}
        onSpeechRateChange={setSpeechRate}
        showArabicHints={showArabicHints}
        onToggleArabicHints={() => setShowArabicHints((prev) => !prev)}
      />

      {/* Tab Navigation */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'explorer' && (
          <CountryExplorerTab
            speechRate={speechRate}
            showArabicHints={showArabicHints}
            onEarnStar={handleEarnStar}
          />
        )}

        {activeTab === 'facts' && (
          <FactFinderTab
            speechRate={speechRate}
            showArabicHints={showArabicHints}
            onEarnStar={handleEarnStar}
          />
        )}

        {activeTab === 'builder' && (
          <InfoFileBuilderTab
            speechRate={speechRate}
            showArabicHints={showArabicHints}
            onEarnStar={handleEarnStar}
          />
        )}

        {activeTab === 'games' && (
          <GamesArcadeTab
            speechRate={speechRate}
            showArabicHints={showArabicHints}
            onEarnStar={handleEarnStar}
          />
        )}

        {activeTab === 'reference' && (
          <BilingualReferenceTab
            speechRate={speechRate}
            showArabicHints={showArabicHints}
            onEarnStar={handleEarnStar}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-700">
              English for Libya • Primary 5 (Grade 5)
            </span>
            <span>—</span>
            <span>Unit 1, Lesson 6: Country Information File</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-arabic text-slate-600">
              مخصص لتلاميذ الصف الخامس الابتدائي - إنجلترا والهند
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-indigo-600">
              Pupil's Book pp. 18–19 • Activity Book pp. 14–15
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
