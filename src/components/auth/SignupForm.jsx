import { useState } from "react";
import { authErrorMessage } from "../../lib/authErrors";
import { supabase } from "../../lib/supabase";
import { isValidEmail } from "../../lib/validation";
import Button from "../ui/Button";
import PasswordField from "./PasswordField";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguage } from "../../context/LanguageContext";

export default function SignupForm({ onSwitch, onSuccess }) {
  const [storeName, setStoreName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { t } = useTranslation();
  const { language } = useLanguage();

  const validEmail = isValidEmail(email);
  const passwordMismatch = submitted && password !== confirmPassword;
  const incomplete = !storeName.trim() || !fullName.trim() || !validEmail || password.length < 8 || !agreed;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError("");
    if (incomplete || password !== confirmPassword) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim(), store_name: storeName.trim() },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;

      // With email confirmation on, Supabase hides duplicate emails: the user comes back with no identities.
      if (data.user?.identities?.length === 0) throw new Error("User already registered");

      // If email confirmation is off, a session exists and AuthContext logs the user in.
      if (!data.session) onSuccess(email.trim());
    } catch (err) {
      setAuthError(authErrorMessage(err, t("auth.createAccountError"), language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <div className="auth-heading">
        <h2>{t("onboarding.welcome")}</h2>
        <p>{t("onboarding.desc")}</p>
      </div>

      <label className={`field ${submitted && !storeName.trim() ? "field-error" : ""}`}>
        <span>{t("auth.storeName")}</span>
        <input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder={t("auth.storeNamePlaceholder")} />
        {submitted && !storeName.trim() && <small>{t("auth.storeNameRequired")}</small>}
      </label>

      <label className={`field ${submitted && !fullName.trim() ? "field-error" : ""}`}>
        <span>{t("auth.fullName")}</span>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("auth.fullNamePlaceholder")} autoComplete="name" />
      </label>

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
        placeholder={t("auth.passwordPlaceholder")}
        autoComplete="new-password"
        invalid={submitted && password.length < 8}
      >
        <small className={password.length >= 8 ? "strength-good" : "strength-hint"}>
          {password.length >= 8 ? t("auth.passwordStrong") : t("auth.passwordHint")}
        </small>
      </PasswordField>

      <label className={`field ${passwordMismatch ? "field-error" : ""}`}>
        <span>{t("auth.confirmPassword")}</span>
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder={t("auth.confirmPasswordPlaceholder")}
          autoComplete="new-password"
        />
        {passwordMismatch && <small>{t("auth.passwordMismatch")}</small>}
      </label>

      <label className={`check-row ${submitted && !agreed ? "check-error" : ""}`}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>
          {t("auth.terms")}
        </span>
      </label>

      {authError && <p className="auth-error" role="alert">{authError}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? <><span className="spinner" />{t("auth.creatingAccount")}</> : t("auth.signupButton")}
      </Button>

      <p className="auth-switch">
        {t("auth.switchToLogin")} <button type="button" onClick={() => onSwitch("login")}>{t("auth.login")}</button>
      </p>
    </form>
  );
}