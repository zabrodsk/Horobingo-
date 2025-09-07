import { GameState, DayState, Tile, ZodiacSign, Theme } from '../types';
import { FALLBACK_POOLS, FALLBACK_SIGN_HOROSCOPE } from '../constants';
import { seededShuffle } from '../utils/seededRng';
import { GoogleGenAI, Type } from "@google/genai";

const STATE_KEY = 'horobingo_v1_state';
const SIGN_KEY = 'horobingo_v1_sign';
const THEME_KEY = 'horobingo_v1_theme';
const DAY_KEY_PREFIX = 'horobingo_v1_day';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Date utility
export const getTodayISO = (): string => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const adjustedDate = new Date(today.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split('T')[0];
};

// State Management
export const loadGameState = (): GameState => {
  try {
    const storedState = localStorage.getItem(STATE_KEY);
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    console.error("Failed to load game state:", error);
  }
  return {
    xp: 0,
    coins: 10, // Start with some coins
    level: 1,
    lastBingoDate: null,
    streak: 0,
    achievements: [],
  };
};

export const saveGameState = (state: GameState) => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
};

export const loadDayState = (date: string, sign: ZodiacSign, language: string, theme: Theme): DayState | null => {
  try {
    const key = `${DAY_KEY_PREFIX}_${date}_${sign}_${language}_${theme}`;
    const storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    console.error("Failed to load day state:", error);
  }
  return null;
};

export const saveDayState = (date: string, sign: ZodiacSign, language: string, theme: Theme, state: DayState) => {
  try {
    const key = `${DAY_KEY_PREFIX}_${date}_${sign}_${language}_${theme}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save day state:", error);
  }
};

export const loadZodiacSign = (): ZodiacSign => {
  try {
    const storedSign = localStorage.getItem(SIGN_KEY);
    if (storedSign) {
      return JSON.parse(storedSign).sign as ZodiacSign;
    }
  } catch (error) {
    console.error("Failed to load zodiac sign:", error);
  }
  return ZodiacSign.Universal;
};

export const saveZodiacSign = (sign: ZodiacSign) => {
  try {
    localStorage.setItem(SIGN_KEY, JSON.stringify({ sign }));
  } catch (error) {
    console.error("Failed to save zodiac sign:", error);
  }
};

export const loadTheme = (): Theme => {
  try {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme) {
      return JSON.parse(storedTheme).theme as Theme;
    }
  } catch (error) {
    console.error("Failed to load theme:", error);
  }
  return Theme.Universal;
};

export const saveTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify({ theme }));
  } catch (error) {
    console.error("Failed to save theme:", error);
  }
};


// Board Generation
export const generateFallbackBoard = (date: string, sign: ZodiacSign, theme: Theme, regenerationCount: number = 0): DayState => {
  const seed = `${date}:${sign}:${theme}:${regenerationCount}`;
  const mainPool = FALLBACK_POOLS[theme] || FALLBACK_POOLS[Theme.Universal];
  const signPool = FALLBACK_SIGN_HOROSCOPE[sign] || [];
  const fullPool = [...mainPool, ...signPool];
  
  const shuffledPool = seededShuffle(fullPool, seed);
  
  const selectedItems = shuffledPool.slice(0, 9);
  
  const tiles: Tile[] = selectedItems.map((text, index) => ({
    id: index,
    text,
    done: false,
  }));

  return {
    tiles,
    bingoAwarded: false,
    fullAwarded: false,
    regenerated: regenerationCount,
  };
};

const languageNames: Record<string, string> = {
  cs: 'Czech',
  en: 'English',
};

export const generateNewBoard = async (date: string, sign: ZodiacSign, language: string, theme: Theme, localizedSignName: string, localizedThemeName: string, regenerationCount: number = 0): Promise<DayState> => {
  try {
    const langName = languageNames[language] || 'English';

    const systemInstruction = `You are a professional and creative astrologer. Your task is to generate 9 unique, insightful, and predictive horoscope statements for a bingo game. These predictions should cover various areas of life such as love, career, finance, health, and social interactions to create a diverse and interesting board.
**Crucial Rules:**
1.  **PREDICT, DON'T COMMAND:** Phrase statements as potential events, feelings, or encounters. Do NOT give commands, tasks, or direct advice.
    -   BAD (Command): 'Be creative today.'
    -   GOOD (Prediction): 'A wave of creative energy will inspire a new idea.'
    -   BAD (Task): 'Talk to an old friend.'
    -   GOOD (Prediction): 'An unexpected message from a friend may brighten your day.'
    -   BAD (Advice): 'You should focus on your finances.'
    -   GOOD (Prediction): 'A careful review of your finances could reveal a surprising opportunity.'
2.  **BE SPECIFIC & EVOCATIVE:** Avoid generic statements. Make them interesting and open to interpretation.
    -   BAD (Generic): 'Today will be a good day.'
    -   GOOD (Specific): 'A conversation in the afternoon will bring unexpected clarity to a complex situation.'
3.  **DIVERSIFY TOPICS:** Ensure the 9 predictions touch on different life areas (e.g., 2 for career, 2 for relationships, 1 for finance, 1 for personal growth, etc.). Do not focus on just one theme.
4.  **JSON ONLY:** Respond ONLY with a JSON array of 9 unique strings in the specified language (${langName}). Do not include any other text, explanation, or markdown formatting.`;
    
    const prompt = `Generate 9 unique, insightful horoscope predictions for a person with the zodiac sign ${localizedSignName}. The overarching theme for today is "${localizedThemeName}". The predictions are for today, ${date}. Ensure the predictions are in ${langName} and cover a diverse range of life topics (career, love, finance, personal growth). The predictions must be subtly inspired by the zodiac sign's characteristics but strongly relate to the chosen theme.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "An insightful, predictive horoscope statement about a potential event or feeling. Must not be a command or direct advice."
          },
          minItems: 9,
          maxItems: 9,
        },
        temperature: 0.9,
      },
    });

    const tasks = JSON.parse(response.text);

    if (!Array.isArray(tasks) || tasks.length !== 9 || !tasks.every(t => typeof t === 'string')) {
      throw new Error("AI response was not in the expected format.");
    }

    const tiles: Tile[] = tasks.map((text, index) => ({
      id: index,
      text,
      done: false,
    }));

    return {
      tiles,
      bingoAwarded: false,
      fullAwarded: false,
      regenerated: regenerationCount,
    };

  } catch (error) {
    console.error("AI board generation failed:", error);
    // Throw error up to UI to show a toast and trigger fallback
    throw error;
  }
};