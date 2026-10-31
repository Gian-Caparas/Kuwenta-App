import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { supabase } from "../lib/supabase";
import { useTranslation } from "../hooks/useTranslation";

/** Shown when the user opens the reset link from their email (PASSWORD_RECOVERY event). */
export default function ResetPassword({ done }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!success) return undefined;

    const timer = setTimeout(async () => {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setSuccess(false);
        setError(signOutError.message);
        return;
      }
      done();
      navigate("/auth", { replace: true });
    }, 1400);

    return () => clearTimeout(timer);
  }, [done, navigate, success]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) setError(t("auth.createAccountError"));
    else setSuccess(true);
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-card">
          {success ? (
            <div className="auth-success" role="status" aria-live="polite">
              <div className="success-check"><Icon name="check" size={38} /></div>
              <span className="eyebrow">{t("success.check")}</span>
              <h2>{t("success.passwordChanged")}</h2>
              <p>{t("success.returningToLogin")}</p>
            </div>
          ) : (
          <form className="auth-form" onSubmit={save}>
            <div className="auth-heading">
              <h2>{t("success.resetTitle")}</h2>
              <p>{t("auth.passwordHint")}</p>
            </div>
            <label className="field">
              <span>{t("auth.passwordPlaceholder")}</span>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={20} />
                </button>
              </div>
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <Button type="submit" disabled={loading || password.length < 8}>
              {loading ? t("auth.loading") : t("auth.signupButton")}
            </Button>
          </form>
          )}
        </div>
      </section>
    </main>
  );
}