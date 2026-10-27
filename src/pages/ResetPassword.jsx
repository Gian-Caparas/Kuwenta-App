import { useState } from "react";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import { useTranslation } from "../hooks/useTranslation";

/** Shown when the user opens the reset link from their email (PASSWORD_RECOVERY event). */
export default function ResetPassword({ done }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) setError(t("auth.createAccountError"));
    else done();
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-card">
          <form className="auth-form" onSubmit={save}>
            <div className="auth-heading">
              <h2>{t("success.resetTitle")}</h2>
              <p>{t("auth.passwordHint")}</p>
            </div>
            <label className="field">
              <span>{t("auth.passwordPlaceholder")}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <Button type="submit" disabled={loading || password.length < 8}>
              {loading ? t("auth.loading") : t("auth.signupButton")}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}