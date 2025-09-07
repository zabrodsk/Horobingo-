import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, DayState, ZodiacSign, ToastMessage, AchievementId, Theme } from './types';
import {
  loadGameState,
  saveGameState,
  loadDayState,
  saveDayState,
  loadZodiacSign,
  saveZodiacSign,
  loadTheme,
  saveTheme,
  generateNewBoard,
  generateFallbackBoard,
  getTodayISO,
} from './services/gameService';
import { BINGO_LINES, REWARDS, xpForLevel, ACHIEVEMENT_EMOJIS } from './constants';
import { useTranslation } from './hooks/useI18n';

import Header from './components/Header';
import Grid from './components/Grid';
import StatusBar from './components/StatusBar';
import Achievements from './components/Achievements';
import ToastContainer from './components/ToastContainer';
import Modal from './components/Modal';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { t, language } = useTranslation();
  const [currentDate, setCurrentDate] = useState(getTodayISO());
  const [gameState, setGameState] = useState<GameState>(loadGameState);
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign>(loadZodiacSign);
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [dayState, setDayState] = useState<DayState | null>(null);
  const [loadingBoard, setLoadingBoard] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [bingoLine, setBingoLine] = useState<number[] | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newToast: ToastMessage = { id: Date.now(), message, type };
    setToasts(currentToasts => [newToast, ...currentToasts]);
  }, []);
  
  const dismissToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
  }, []);
  
  const checkAchievements = useCallback((newState: GameState, newAchievementId?: AchievementId) => {
    const earned: AchievementId[] = [];
    if (newAchievementId && !newState.achievements.includes(newAchievementId)) {
        earned.push(newAchievementId);
    }
    if (newState.streak >= 3 && !newState.achievements.includes(AchievementId.Streak3)) earned.push(AchievementId.Streak3);
    if (newState.streak >= 7 && !newState.achievements.includes(AchievementId.Streak7)) earned.push(AchievementId.Streak7);
    if (newState.streak >= 30 && !newState.achievements.includes(AchievementId.Streak30)) earned.push(AchievementId.Streak30);

    if (earned.length > 0) {
      earned.forEach(id => {
        const name = t(`achievements.${id}.name`);
        const emoji = ACHIEVEMENT_EMOJIS[id];
        addToast(t('toast.achievement', { emoji, name }), 'success');
      });
      return { ...newState, achievements: [...newState.achievements, ...earned] };
    }
    return newState;
  }, [t, addToast]);

  const addXp = useCallback((amount: number) => {
    setGameState(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let xpNeeded = xpForLevel(newLevel);
      while (newXp >= xpNeeded) {
        newLevel++;
        addToast(t('toast.levelUp', { level: newLevel }), 'success');
        xpNeeded = xpForLevel(newLevel);
      }
      return { ...prev, xp: newXp, level: newLevel };
    });
  }, [addToast, t]);

  const checkForBingo = useCallback((currentTiles: DayState['tiles']) => {
    if (!dayState || dayState.bingoAwarded) return;
    
    const doneTiles = new Set(currentTiles.filter(t => t.done).map(t => t.id));
    for (const line of BINGO_LINES) {
      if (line.every(id => doneTiles.has(id))) {
        setBingoLine(line);
        addToast(t('toast.bingo', { xp: REWARDS.BINGO.XP, coins: REWARDS.BINGO.COINS }), 'success');
        
        setDayState(d => d ? { ...d, bingoAwarded: true } : null);

        setGameState(prev => {
          let newStreak = prev.streak;
          let newLastBingoDate = prev.lastBingoDate;
          
          if (prev.lastBingoDate) {
            const lastDate = new Date(prev.lastBingoDate);
            const todayDate = new Date(currentDate);
            const diffTime = todayDate.getTime() - lastDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              newStreak++;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
          } else {
            newStreak = 1;
          }
          newLastBingoDate = currentDate;

          const updatedState = {
            ...prev,
            coins: prev.coins + REWARDS.BINGO.COINS,
            streak: newStreak,
            lastBingoDate: newLastBingoDate,
          };
          
          addXp(REWARDS.BINGO.XP);
          return checkAchievements(updatedState, AchievementId.FirstBingo);
        });
        return; // Award only first bingo
      }
    }
  }, [dayState, addXp, currentDate, checkAchievements, addToast, t]);

  const checkForFullBoard = useCallback((currentTiles: DayState['tiles']) => {
    if (!dayState || dayState.fullAwarded) return;
    if (currentTiles.every(t => t.done)) {
      addToast(t('toast.fullBoard', { xp: REWARDS.FULL_BOARD.XP, coins: REWARDS.FULL_BOARD.COINS }), 'success');
      setDayState(d => d ? { ...d, fullAwarded: true } : null);
      setGameState(prev => {
        const newState = {
          ...prev,
          coins: prev.coins + REWARDS.FULL_BOARD.COINS,
        };
        addXp(REWARDS.FULL_BOARD.XP);
        return checkAchievements(newState, AchievementId.FullBoard);
      });
    }
  }, [dayState, addXp, checkAchievements, addToast, t]);

  useEffect(() => {
    const loadBoard = async () => {
      setLoadingBoard(true);
      setBingoLine(null);
      const dayData = loadDayState(currentDate, zodiacSign, language, theme);

      if (dayData) {
        setDayState(dayData);
        const doneTiles = new Set(dayData.tiles.filter(t => t.done).map(t => t.id));
        for (const line of BINGO_LINES) {
          if (line.every(id => doneTiles.has(id))) {
            setBingoLine(line);
            break;
          }
        }
      } else {
        try {
          const localizedSignName = t(`zodiac.${zodiacSign}`);
          const localizedThemeName = t(`theme.${theme}`);
          const newBoard = await generateNewBoard(currentDate, zodiacSign, language, theme, localizedSignName, localizedThemeName, 0);
          setDayState(newBoard);
        } catch (error) {
          addToast(t('toast.boardGenerationError'), 'error');
          const fallbackBoard = generateFallbackBoard(currentDate, zodiacSign, theme, 0);
          setDayState(fallbackBoard);
        }
      }
      setLoadingBoard(false);
    };

    loadBoard();
  }, [currentDate, zodiacSign, language, theme, t, addToast]);


  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    if (dayState) {
      saveDayState(currentDate, zodiacSign, language, theme, dayState);
    }
  }, [dayState, currentDate, zodiacSign, language, theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = getTodayISO();
      if (today !== currentDate) {
        setCurrentDate(today);
      }
    }, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [currentDate]);

  const handleSignChange = (sign: ZodiacSign) => {
    saveZodiacSign(sign);
    setZodiacSign(sign);
  };

  const handleThemeChange = (newTheme: Theme) => {
    saveTheme(newTheme);
    setTheme(newTheme);
  };

  const handleToggleTile = (id: number) => {
    if (!dayState) return;
    const newTiles = dayState.tiles.map(tile =>
      tile.id === id ? { ...tile, done: !tile.done } : tile
    );
    setDayState({ ...dayState, tiles: newTiles });
    
    setTimeout(() => {
      checkForBingo(newTiles);
      checkForFullBoard(newTiles);
    }, 100);
  };

  const rerollCost = useMemo(() => (dayState?.regenerated === 0 ? 'Free' : REWARDS.REROLL_COST), [dayState]);
  const canReroll = useMemo(() => rerollCost === 'Free' || gameState.coins >= REWARDS.REROLL_COST, [rerollCost, gameState.coins]);

  const handleReroll = async () => {
    if (!dayState || !canReroll) return;

    setLoadingBoard(true);

    if (rerollCost !== 'Free') {
      setGameState(prev => ({ ...prev, coins: prev.coins - REWARDS.REROLL_COST }));
    }
    
    const newRegenCount = dayState.regenerated + 1;
    try {
        const localizedSignName = t(`zodiac.${zodiacSign}`);
        const localizedThemeName = t(`theme.${theme}`);
        const newBoard = await generateNewBoard(currentDate, zodiacSign, language, theme, localizedSignName, localizedThemeName, newRegenCount);
        setDayState(newBoard);
    } catch (error) {
        addToast(t('toast.boardGenerationError'), 'error');
        const fallbackBoard = generateFallbackBoard(currentDate, zodiacSign, theme, newRegenCount);
        setDayState(fallbackBoard);
    } finally {
        setLoadingBoard(false);
        setBingoLine(null);
        addToast(rerollCost === 'Free' ? t('toast.newMixFree') : t('toast.newMixCost', { cost: REWARDS.REROLL_COST }));
        setGameState(prev => checkAchievements(prev, AchievementId.Regen));
    }
  };
  
  const confirmDayReset = () => {
    const resetBoard = generateFallbackBoard(currentDate, zodiacSign, theme, dayState?.regenerated || 0)
    setDayState(d => d ? { ...d, tiles: resetBoard.tiles, bingoAwarded: d.bingoAwarded, fullAwarded: d.fullAwarded } : resetBoard);
    setBingoLine(null);
    addToast(t('toast.reset'), 'info');
    setIsResetModalOpen(false);
  };

  const handleShare = async () => {
    if (!dayState) return;
    const doneCount = dayState.tiles.filter(t => t.done).length;
    const status = dayState.bingoAwarded ? t('share.statusBingo') : `${doneCount}/9`;
    const localizedSignName = t(`zodiac.${zodiacSign}`);
    const localizedThemeName = t(`theme.${theme}`);

    const shareText = t('share.text', {
      zodiac: localizedSignName,
      theme: localizedThemeName,
      date: currentDate,
      status: status,
      streak: gameState.streak,
      level: gameState.level,
      xp: gameState.xp
    });
    
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
      } else {
        throw new Error('Share API not supported');
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(shareText);
        addToast(t('toast.copied'), 'success');
      } catch (clipError) {
        addToast(t('toast.shareFailed'), 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <div className="text-center my-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            {t('appName')}
          </h1>
          <p className="text-slate-400">{t('appDescription')}</p>
        </div>
        
        <Header 
          selectedSign={zodiacSign}
          onSignChange={handleSignChange}
          selectedTheme={theme}
          onThemeChange={handleThemeChange}
          onReroll={handleReroll}
          onShare={handleShare}
          onDayReset={() => setIsResetModalOpen(true)}
          rerollCost={rerollCost}
          canReroll={canReroll}
        />

        <StatusBar
          streak={gameState.streak}
          level={gameState.level}
          xp={gameState.xp}
          coins={gameState.coins}
        />

        {loadingBoard || !dayState ? (
          <div className="text-center p-8 h-96 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <Grid tiles={dayState.tiles} onToggleTile={handleToggleTile} bingoLine={bingoLine} />
        )}
        
        <Achievements earnedAchievements={gameState.achievements} />
        
        <footer className="text-center text-xs text-slate-600 py-4">
          <p>{t('footer.today', { date: currentDate })}</p>
          <p>{t('footer.key', { key: `${currentDate}:${zodiacSign}:${language}:${theme}:${dayState?.regenerated || 0}` })}</p>
        </footer>
      </div>
      
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      
      <Modal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmDayReset}
        title={t('modal.reset.title')}
      >
        <p>{t('modal.reset.body')}</p>
      </Modal>
    </div>
  );
};

export default App;
