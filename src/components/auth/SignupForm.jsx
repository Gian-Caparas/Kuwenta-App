import { useState } from "react";
import { authErrorMessage } from "../../lib/authErrors";
import { supabase } from "../../lib/supabase";
import { isValidEmail } from "../../lib/validation";
import Button from "../ui/Button";
import PasswordField from "./PasswordField";

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
      setAuthError(authErrorMessage(err, "May problema sa paggawa ng account. Subukan ulit."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <div className="auth-heading">
        <h2>Simulan ang Kuewenta</h2>
        <p>Kaunting detalye lang at handa ka nang magtala.</p>
      </div>

      <label className={`field ${submitted && !storeName.trim() ? "field-error" : ""}`}>
        <span>Pangalan ng tindahan</span>
        <input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Hal. Tindahan ni Maria" />
        {submitted && !storeName.trim() && <small>Ano ang pangalan ng tindahan mo?</small>}
      </label>

      <label className={`field ${submitted && !fullName.trim() ? "field-error" : ""}`}>
        <span>Buong pangalan</span>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Maria Santos" autoComplete="name" />
      </label>

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
        placeholder="Gumawa ng password"
        autoComplete="new-password"
        invalid={submitted && password.length < 8}
      >
        <small className={password.length >= 8 ? "strength-good" : "strength-hint"}>
          {password.length >= 8 ? "Ayos—matibay ang password mo." : "Gumamit ng 8 characters o higit pa."}
        </small>
      </PasswordField>

      <label className={`field ${passwordMismatch ? "field-error" : ""}`}>
        <span>Ulitin ang password</span>
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Ilagay ulit ang password"
          autoComplete="new-password"
        />
        {passwordMismatch && <small>Hindi magkatugma ang password.</small>}
      </label>

      <label className={`check-row ${submitted && !agreed ? "check-error" : ""}`}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>
          Sumasang-ayon ako sa <button type="button">Terms</button> at <button type="button">Privacy Policy</button>.
        </span>
      </label>

      {authError && <p className="auth-error" role="alert">{authError}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? <><span className="spinner" />Ginagawa ang account...</> : "Gumawa ng Account"}
      </Button>

      <p className="auth-switch">
        May account na? <button type="button" onClick={() => onSwitch("login")}>Mag-login</button>
      </p>
    </form>
  );
}
