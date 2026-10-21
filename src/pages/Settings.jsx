import { useState } from "react";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useToast } from "../context/ToastContext";
import { useProfile } from "../hooks/useProfile";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const [language, setLanguage] = useState("Filipino");
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
      <Header title="Settings" subtitle="Ayusin ang iyong Kuewenta" />
      <section className="content settings-list">
        <div className="settings-group">
          <span className="eyebrow">Tindahan</span>
          <label className="field compact">
            <span>Pangalan ng tindahan</span>
            <input value={name} onChange={(e) => setName(e.target.value)} onBlur={saveStoreName} />
          </label>
          <div className="setting-row">
            <span><strong>Account</strong><small>{email}</small></span>
          </div>
          <div className="setting-row">
            <span><strong>Currency</strong><small>Para sa lahat ng halaga</small></span>
            <b>Peso (₱)</b>
          </div>
          <div className="setting-row">
            <span><strong>Wika</strong><small>Piliin ang ginagamit sa app</small></span>
            <div className="segment">
              <button type="button" onClick={() => setLanguage("Filipino")} className={language === "Filipino" ? "active" : ""}>Filipino</button>
              <button type="button" onClick={() => setLanguage("English")} className={language === "English" ? "active" : ""}>English</button>
            </div>
          </div>
          <div className="setting-row">
            <span className="setting-icon"><Icon name={darkMode ? "moon" : "sun"} /></span>
            <span><strong>Dark mode</strong><small>{darkMode ? "Mas madilim na tema" : "Tema maliwanag"}</small></span>
            <button
              type="button"
              className={`theme-toggle ${darkMode ? "on" : ""}`}
              onClick={() => setDarkMode((enabled) => !enabled)}
              aria-pressed={darkMode}
              aria-label={`${darkMode ? "I-off" : "I-on"} ang dark mode`}
            >
              <span />
            </button>
          </div>
        </div>

        <div className="settings-group">
          <span className="eyebrow">Data at koneksyon</span>
          <div className="setting-row">
            <span className="setting-icon"><Icon name="cloud" /></span>
            <span><strong>Backup at sync</strong><small>Awtomatikong naka-save sa account mo</small></span>
            <i className="good-badge"><Icon name="check" size={14} /> Updated</i>
          </div>
          <div className="offline-card">
            <i />
            <div><strong>Ligtas ang data mo</strong><p>Naka-save ito sa cloud at para sa iyo lang ang access.</p></div>
          </div>
        </div>

        <Button variant="danger" onClick={() => supabase.auth.signOut()}>Mag-logout</Button>

        <small className="version">Kuewenta v1.0 • Gawa para sa tindahang Pilipino</small>
      </section>
    </div>
  );
}
