import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);
const LANGUAGE_KEY = "kuewenta-language";

const LANGUAGES = {
  filipino: { code: "filipino", name: "Filipino", nativeName: "Filipino", htmlLang: "tl" },
  english: { code: "english", name: "English", nativeName: "English", htmlLang: "en" },
};

function getInitialLanguage() {
  const stored = window.localStorage.getItem(LANGUAGE_KEY);
  if (stored && LANGUAGES[stored]) return stored;
  return "filipino";
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = LANGUAGES[language].htmlLang;
  }, [language]);

  // Set initial lang on mount
  useEffect(() => {
    const initialLang = getInitialLanguage();
    document.documentElement.lang = LANGUAGES[initialLang].htmlLang;
  }, []);

  const setLanguage = (langCode) => {
    if (LANGUAGES[langCode]) {
      setLanguageState(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return context;
}