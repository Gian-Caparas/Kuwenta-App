import { useState } from "react";
import { authErrorMessage } from "../../lib/authErrors";
import { supabase } from "../../lib/supabase";
import { isValidEmail } from "../../lib/validation";
import Button from "../ui/Button";
import PasswordField from "./PasswordField";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguage } from "../../context/LanguageContext";

export default function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { t } = useTranslation();
  const { language } = useLanguage();

  const validEmail = isValidEmail(email);
  const passwordTooShort = password.length < 6;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError("");
    if (!validEmail || passwordTooShort) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setAuthError(authErrorMessage(error, t("auth.invalidCredentials"), language));
      // On success, AuthContext picks up the session and <Auth/> redirects to "/".
    } catch (err) {
      setAuthError(authErrorMessage(err, t("auth.connectionError"), language));
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setAuthError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setAuthError(t("auth.connectionError"));
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <div className="auth-heading">
        <h2>{t("auth.welcomeBack")}</h2>
        <p>{t("auth.enterDetails")}</p>
      </div>

      <label className={`field ${submitted && !validEmail ? "field-error" : ""}`}>
        <span>{t("auth.email")}</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="maria@email.com"
          autoComplete="email"
        />
        {submitted && !validEmail && <small>{t("auth.invalidEmail")}</small>}
      </label>

      <PasswordField
        value={password}
        onChange={setPassword}
        placeholder={t("auth.password")}
        autoComplete="current-password"
        invalid={submitted && passwordTooShort}
      >
        {submitted && passwordTooShort && <small>{t("auth.invalidCredentials")}</small>}
      </PasswordField>

      <button type="button" className="forgot-link" onClick={() => onSwitch("forgot")}>
        {t("auth.forgotPassword")}
      </button>

      {authError && <p className="auth-error" role="alert">{authError}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? <><span className="spinner" />{t("auth.loading")}</> : t("auth.loginButton")}
      </Button>

      <div className="auth-divider"><span>{t("auth.or")}</span></div>
      <Button variant="ghost" onClick={google}>
        <span className="google-mark">G</span>{t("auth.googleShort")}
      </Button>

      <p className="auth-switch">
        {t("auth.switchToSignup")} <button type="button" onClick={() => onSwitch("signup")}>{t("auth.signup")}</button>
      </p>
    </form>
  );
}