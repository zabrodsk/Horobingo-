import React from 'react';
import type { ZodiacSign, Theme } from '../types';
import { ZODIAC_SIGNS, THEMES } from '../constants';
import { useTranslation } from '../hooks/useI18n';

interface HeaderProps {
  selectedSign: ZodiacSign;
  onSignChange: (sign: ZodiacSign) => void;
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onReroll: () => void;
  onShare: () => void;
  onDayReset: () => void;
  rerollCost: number | 'Free';
  canReroll: boolean;
}

const Header: React.FC<HeaderProps> = ({
  selectedSign,
  onSignChange,
  selectedTheme,
  onThemeChange,
  onReroll,
  onShare,
  onDayReset,
  rerollCost,
  canReroll
}) => {
  const { t, language, setLanguage } = useTranslation();

  const rerollCostText = rerollCost === 'Free'
    ? t('header.rerollCostFree')
    : t('header.rerollCost', { cost: rerollCost });

  return (
    <header className="w-full p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/50 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <label htmlFor="zodiac-select" className="sr-only">{t('header.selectSign')}</label>
        <select
          id="zodiac-select"
          value={selectedSign}
          onChange={(e) => onSignChange(e.target.value as ZodiacSign)}
          className="bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {ZODIAC_SIGNS.map((sign) => (
            <option key={sign.id} value={sign.id}>
              {sign.emoji} {t(sign.nameKey)}
            </option>
          ))}
        </select>
        
        <label htmlFor="theme-select" className="sr-only">{t('header.selectTheme')}</label>
        <select
          id="theme-select"
          value={selectedTheme}
          onChange={(e) => onThemeChange(e.target.value as Theme)}
          className="bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {THEMES.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.emoji} {t(theme.nameKey)}
            </option>
          ))}
        </select>
        
        <label htmlFor="language-select" className="sr-only">{t('header.language')}</label>
         <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'cs' | 'en')}
          className="bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="cs">🇨🇿 CS</option>
          <option value="en">🇬🇧 EN</option>
        </select>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          onClick={onReroll}
          disabled={!canReroll}
          className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center gap-2"
          aria-label={`${t('header.reroll')}. ${rerollCostText}`}
        >
          🎲 {t('header.reroll')} <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${rerollCost === 'Free' ? 'bg-green-600' : 'bg-amber-600'}`}>{rerollCost}</span>
        </button>
        <button
          onClick={onShare}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-2"
          aria-label={t('header.shareLabel')}
        >
          📤 {t('header.share')}
        </button>
        <button
          onClick={onDayReset}
          className="px-2 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors"
          aria-label={t('header.resetLabel')}
        >
          {t('header.reset')}
        </button>
      </div>
    </header>
  );
};

export default Header;
