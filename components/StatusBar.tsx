
import React from 'react';
import { xpForLevel } from '../constants';
import { useTranslation } from '../hooks/useI18n';

interface StatusBarProps {
  streak: number;
  level: number;
  xp: number;
  coins: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ streak, level, xp, coins }) => {
  const { t } = useTranslation();
  const currentLevelXp = xpForLevel(level - 1);
  const nextLevelXp = xpForLevel(level);
  const xpInLevel = xp - currentLevelXp;
  const xpForNext = nextLevelXp - currentLevelXp;
  const progress = Math.max(0, Math.min(100, (xpInLevel / xpForNext) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <StatusCard emoji="🔥" label={t('statusbar.streak')} value={streak} />
      <StatusCard emoji="🪙" label={t('statusbar.coins')} value={coins} />
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg col-span-1 sm:col-span-3">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-lg">⭐ {t('statusbar.level', { level })}</div>
          <div className="text-sm text-slate-400">
            {xp} / {nextLevelXp} XP
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const StatusCard: React.FC<{ emoji: string; label: string; value: number | string }> = ({ emoji, label, value }) => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="text-4xl">{emoji}</div>
    <div>
      <div className="text-slate-400 text-sm">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

export default StatusBar;
