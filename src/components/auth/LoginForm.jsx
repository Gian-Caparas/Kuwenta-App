import { useState } from "react";
import { authErrorMessage } from "../../lib/authErrors";
import { supabase } from "../../lib/supabase";
import { isValidEmail } from "../../lib/validation";
import Button from "../ui/Button";
import PasswordField from "./PasswordField";

export default function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

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
      if (error) setAuthError(authErrorMessage(error, "Mali ang email o password. Subukan ulit."));
      // On success, AuthContext picks up the session and <Auth/> redirects to "/".
    } catch (err) {
      setAuthError(authErrorMessage(err, "May problema sa koneksyon. Subukan ulit."));
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
    if (error) setAuthError("Hindi pa available ang Google login.");
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <div className="auth-heading">
        <h2>Welcome back!</h2>
        <p>Ilagay ang detalye mo para makabalik sa tindahan.</p>
      </div>

      <label className={`field ${submitted && !validEmail ? "field-error" : ""}`}>
        <span>Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="maria@email.com"
          autoComplete="email"
        />
        {submitted && !validEmail && <small>Pakilagay ang tamang email.</small>}
      </label>

      <PasswordField
        value={password}
        onChange={setPassword}
        placeholder="Ilagay ang password"
        autoComplete="current-password"
        invalid={submitted && passwordTooShort}
      >
        {submitted && passwordTooShort && <small>Mali ang email o password. Subukan ulit.</small>}
      </PasswordField>

      <button type="button" className="forgot-link" onClick={() => onSwitch("forgot")}>
        Nakalimutan ang password?
      </button>

      {authError && <p className="auth-error" role="alert">{authError}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? <><span className="spinner" />Sandali lang...</> : "Mag-login"}
      </Button>

      <div className="auth-divider"><span>o</span></div>
      <Button variant="ghost" onClick={google}>
        <span className="google-mark">G</span>Magpatuloy gamit ang Google
      </Button>

      <p className="auth-switch">
        Wala pang account? <button type="button" onClick={() => onSwitch("signup")}>Mag-sign up</button>
      </p>
    </form>
  );
}
