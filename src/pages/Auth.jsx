import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AuthIntro from "../components/auth/AuthIntro";
import AuthSuccess from "../components/auth/AuthSuccess";
import ForgotForm from "../components/auth/ForgotForm";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import Icon from "../components/ui/Icon";
import { useTranslation } from "../hooks/useTranslation";

export default function Auth({ authLinkError = null }) {
  const { session } = useAuth();
  const { t } = useTranslation();
  const [view, setView] = useState("login"); // "login" | "signup" | "forgot" | "success"
  const [successKind, setSuccessKind] = useState("signup");
  const [email, setEmail] = useState("");

  // Already logged in (including right after a successful login): go to the app.
  if (session) return <Navigate to="/" replace />;

  const showSuccess = (kind, address) => {
    setSuccessKind(kind);
    setEmail(address);
    setView("success");
  };

  return (
    <main className="auth-page">
      <AuthIntro />

      <section className="auth-panel">
        <div className="auth-card">
          {(view === "login" || view === "signup") && (
            <div className="auth-tabs" role="tablist" aria-label={t("auth.or")}>
              <button type="button" role="tab" aria-selected={view === "login"} className={view === "login" ? "active" : ""} onClick={() => setView("login")}>
                {t("auth.login")}
              </button>
              <button type="button" role="tab" aria-selected={view === "signup"} className={view === "signup" ? "active" : ""} onClick={() => setView("signup")}>
                {t("auth.signup")}
              </button>
            </div>
          )}

          {authLinkError && (
            <p className="auth-error" role="alert">
              {authLinkError === "otp_expired"
                ? t("auth.resetLinkExpired")
                : t("auth.authLinkInvalid")}
            </p>
          )}

          {view === "login" && <LoginForm onSwitch={setView} />}
          {view === "signup" && <SignupForm onSwitch={setView} onSuccess={(address) => showSuccess("signup", address)} />}
          {view === "forgot" && <ForgotForm onSwitch={setView} onSuccess={(address) => showSuccess("forgot", address)} />}
          {view === "success" && <AuthSuccess kind={successKind} email={email} onBack={() => setView("login")} />}
        </div>

        <div className="signal-note">
          <Icon name="cloud" size={18} />
          <span>{t("auth.signalNote")}</span>
        </div>
      </section>
    </main>
  );
}