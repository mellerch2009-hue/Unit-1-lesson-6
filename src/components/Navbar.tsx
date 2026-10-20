import React from 'react';
import { Compass, HelpCircle, FileText, Gamepad2, BookMarked } from 'lucide-react';
import { playSound } from '../utils/audio';

export type TabKey = 'explorer' | 'facts' | 'builder' | 'games' | 'reference';

interface NavbarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

interface TabItem {
  key: TabKey;
  label: string;
  labelArabic: string;
  icon: React.ElementType;
  badge?: string;
  color: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabItem[] = [
    {
      key: 'explorer',
      label: 'Country Explorer',
      labelArabic: 'مستكشف الدول',
      icon: Compass,
      color: 'blue',
      badge: 'Jake & Tanvi',
    },
    {
      key: 'facts',
      label: 'Fact Finder',
      labelArabic: 'باحث الحقائق',
      icon: HelpCircle,
      color: 'indigo',
      badge: 'Quiz Cards',
    },
    {
      key: 'builder',
      label: 'Info File Builder',
      labelArabic: 'ملفات المعلومات',
      icon: FileText,
      color: 'emerald',
      badge: 'AB pp. 14–15',
    },
    {
      key: 'games',
      label: 'Games Arcade',
      labelArabic: 'صالة الألعاب',
      icon: Gamepad2,
      color: 'purple',
      badge: '2 Games!',
    },
    {
      key: 'reference',
      label: 'Bilingual Reference',
      labelArabic: 'المرجع الثنائي',
      icon: BookMarked,
      color: 'amber',
      badge: 'Vocab & Table',
    },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-[73px] z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  onTabChange(tab.key);
                  playSound.click();
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                          isActive
                            ? 'bg-indigo-700 text-indigo-100'
                            : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] font-arabic leading-tight ${
                      isActive ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {tab.labelArabic}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
