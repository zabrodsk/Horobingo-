import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const I18N_STORAGE_KEY = 'horobingo_v1_language';

type Language = 'cs' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const loadTranslations = async (lang: Language) => {
  const response = await fetch(`/locales/${lang}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load translations for ${lang}`);
  }
  return response.json();
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const storedLang = localStorage.getItem(I18N_STORAGE_KEY);
      if (storedLang === 'cs' || storedLang === 'en') {
        return storedLang;
      }
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'cs' ? 'cs' : 'en';
    } catch {
      return 'en';
    }
  });

  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadTranslations(language)
      .then(data => {
        setTranslations(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        // Fallback to 'en' if loading fails
        if (language !== 'en') {
          setLanguage('en');
        } else {
          setLoading(false);
        }
      });
  }, [language]);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(I18N_STORAGE_KEY, lang);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
    setLanguageState(lang);
  };
  
  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = key.split('.').reduce((obj, k) => obj && obj[k], translations);

    if (typeof translation !== 'string') {
      return key; // Return key if translation not found
    }
    
    if (replacements) {
        Object.entries(replacements).forEach(([placeholder, value]) => {
            translation = translation.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(value));
        });
    }

    return translation;
  }, [translations]);

  if (loading) {
    // FIX: Replaced JSX with React.createElement to be compatible with .ts files and fix compilation errors.
    return React.createElement('div', { className: "min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center" }, 'Loading...');
  }

  // FIX: Replaced JSX with React.createElement to be compatible with .ts files and fix compilation errors.
  return React.createElement(
    I18nContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
