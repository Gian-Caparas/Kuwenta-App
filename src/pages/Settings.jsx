import { useState } from "react";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useToast } from "../context/ToastContext";
import { useProfile } from "../hooks/useProfile";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { storeName, email } = useProfile();
  const { notify } = useToast();
  const { darkMode, setDarkMode } = useTheme();
  const [name, setName] = useState(storeName);

  const saveStoreName = async () => {
    const next = name.trim();
    if (!next || next === storeName) return;
    const { error } = await supabase.auth.updateUser({ data: { store_name: next } });
    if (error) notify("Hindi na-save ang pangalan ng tindahan.", "error");
    else notify("Na-update ang pangalan ng tindahan.");
  };

  return (
    <div>
      <Header title={t("settings.title")} subtitle={t("settings.subtitle")} />
      <section className="content settings-list">
        <div className="settings-group">
          <span className="eyebrow">{t("settings.store")}</span>
          <label className="field compact">
            <span>{t("settings.storeName")}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} onBlur={saveStoreName} />
          </label>
          <div className="setting-row">
            <span><strong>{t("settings.account")}</strong><small>{email}</small></span>
          </div>
          <div className="setting-row">
            <span><strong>{t("settings.currency")}</strong><small>{t("settings.currencyDesc")}</small></span>
            <b>{t("settings.currencyValue")}</b>
          </div>
          <div className="setting-row">
            <span><strong>{t("settings.language")}</strong><small>{t("settings.languageDesc")}</small></span>
            <div className="segment">
              <button
                type="button"
                onClick={() => setLanguage("filipino")}
                className={language === "filipino" ? "active" : ""}
              >
                {t("settings.language.filipino")}
              </button>
              <button
                type="button"
                onClick={() => setLanguage("english")}
                className={language === "english" ? "active" : ""}
              >
                {t("settings.language.english")}
              </button>
            </div>
          </div>
          <div className="setting-row">
            <span className="setting-icon"><Icon name={darkMode ? "moon" : "sun"} /></span>
            <span><strong>{t("settings.darkMode")}</strong><small>{darkMode ? t("settings.darkModeOn") : t("settings.darkModeOff")}</small></span>
            <button
              type="button"
              className={`theme-toggle ${darkMode ? "on" : ""}`}
              onClick={() => setDarkMode((enabled) => !enabled)}
              aria-pressed={darkMode}
              aria-label={darkMode ? "Turn off dark mode" : "Turn on dark mode"}
            >
              <span />
            </button>
          </div>
        </div>

        <div className="settings-group">
          <span className="eyebrow">{t("settings.dataConnection")}</span>
          <div className="setting-row">
            <span className="setting-icon"><Icon name="cloud" /></span>
            <span><strong>{t("settings.backupSync")}</strong><small>{t("settings.backupSyncDesc")}</small></span>
            <i className="good-badge"><Icon name="check" size={14} /> {t("settings.updated")}</i>
          </div>
          <div className="offline-card">
            <i />
            <div><strong>{t("settings.dataSafe")}</strong><p>{t("settings.dataSafeDesc")}</p></div>
          </div>
        </div>

        <Button variant="danger" onClick={() => supabase.auth.signOut()}>{t("settings.logout")}</Button>

        <small className="version">{t("version")}</small>
      </section>
    </div>
  );
}
