import { useState } from "react";
import { authErrorMessage } from "../../lib/authErrors";
import { supabase } from "../../lib/supabase";
import { isValidEmail } from "../../lib/validation";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguage } from "../../context/LanguageContext";

export default function ForgotForm({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { t } = useTranslation();
  const { language } = useLanguage();

  const validEmail = isValidEmail(email);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError("");
    if (!validEmail) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      onSuccess(email.trim());
    } catch (err) {
      setAuthError(authErrorMessage(err, t("forgot.sendError"), language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <button type="button" className="auth-back" onClick={() => onSwitch("login")}>
        <Icon name="arrowLeft" size={19} /> {t("forgot.backToLogin")}
      </button>

      <div className="auth-heading">
        <span className="auth-heading-icon"><Icon name="bell" /></span>
        <h2>{t("forgot.title")}</h2>
        <p>{t("forgot.subtitle")}</p>
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
        {submitted && !validEmail && <small>{t("forgot.invalidEmail")}</small>}
      </label>

      {authError && <p className="auth-error" role="alert">{authError}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? <><span className="spinner" />{t("forgot.sending")}</> : t("forgot.sendLink")}
      </Button>
    </form>
  );
}