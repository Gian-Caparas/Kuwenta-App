import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import { useTranslation } from "../../hooks/useTranslation";

export default function AuthSuccess({ kind, email, onBack }) {
  const [resent, setResent] = useState(false);
  const { t } = useTranslation();

  const resend = async () => {
    if (kind === "signup") await supabase.auth.resend({ type: "signup", email });
    else await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    setResent(true);
  };

  return (
    <div className="auth-success">
      <div className="success-check"><Icon name="check" size={38} /></div>
      <span className="eyebrow">{t("success.check")}</span>
      <h2>
        {kind === "signup"
          ? t("success.signupTitle")
          : t("success.resetTitle")}
      </h2>
      <p>
        {t("success.sentTo", { email })}
        {kind === "signup" ? t("success.tapToStart") : t("success.openToReset")}
      </p>
      <Button onClick={onBack}>{kind === "signup" ? t("success.goToLogin") : t("success.backToLogin")}</Button>
      <button type="button" className="resend-link" onClick={resend} disabled={resent}>
        {resent ? t("success.resent") : t("success.resend")}
      </button>
    </div>
  );
}