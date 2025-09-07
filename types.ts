export enum ZodiacSign {
  Universal = 'universal',
  Aries = 'beran',
  Taurus = 'byk',
  Gemini = 'blizenci',
  Cancer = 'rak',
  Leo = 'lev',
  Virgo = 'panna',
  Libra = 'vahy',
  Scorpio = 'stir',
  Sagittarius = 'strelec',
  Capricorn = 'kozoroh',
  Aquarius = 'vodnar',
  Pisces = 'ryby',
}

export enum Theme {
  Universal = 'universal',
  F1 = 'f1',
  School = 'school',
}

export enum AchievementId {
  FirstBingo = 'first_bingo',
  Streak3 = 'streak3',
  Streak7 = 'streak7',
  Streak30 = 'streak30',
  FullBoard = 'full_board',
  Regen = 'regen',
}

export interface Tile {
  id: number;
  text: string;
  done: boolean;
}

export interface DayState {
  tiles: Tile[];
  bingoAwarded: boolean;
  fullAwarded: boolean;
  regenerated: number;
}

export interface GameState {
  xp: number;
  coins: number;
  level: number;
  lastBingoDate: string | null;
  streak: number;
  achievements: AchievementId[];
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}
