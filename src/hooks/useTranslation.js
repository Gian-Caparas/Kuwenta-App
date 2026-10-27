import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../lib/translations";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key, params = {}) => {
    let translation = getTranslation(language, key);
    // Simple interpolation: replace {key} with params[key]
    Object.keys(params).forEach((paramKey) => {
      translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, "g"), params[paramKey]);
    });
    return translation;
  };

  return { t, language };
}