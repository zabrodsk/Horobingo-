
import React from 'react';
import type { AchievementId } from '../types';
import { ACHIEVEMENT_EMOJIS } from '../constants';
import { useTranslation } from '../hooks/useI18n';

interface AchievementsProps {
  earnedAchievements: AchievementId[];
}

const Achievements: React.FC<AchievementsProps> = ({ earnedAchievements }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-slate-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-3 text-slate-300">{t('achievements.title')}</h3>
      {earnedAchievements.length === 0 ? (
        <p className="text-slate-500 text-sm">{t('achievements.empty')}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {earnedAchievements.map((id) => {
            const name = t(`achievements.${id}.name`);
            const description = t(`achievements.${id}.description`);
            const emoji = ACHIEVEMENT_EMOJIS[id];
            return (
              <div
                key={id}
                className="group relative"
              >
                <span className="text-3xl cursor-default">{emoji}</span>
                <div className="absolute bottom-full mb-2 w-48 bg-slate-900 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <p className="font-bold">{name}</p>
                  <p className="text-slate-400">{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Achievements;
