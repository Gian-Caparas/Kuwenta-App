import { useState } from "react";
import { authErrorMessage } from "../../lib/authErrors";
import { supabase } from "../../lib/supabase";
import { isValidEmail } from "../../lib/validation";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

export default function ForgotForm({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const validEmail = isValidEmail(email);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError("");
    if (!validEmail) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      onSuccess(email.trim());
    } catch (err) {
      setAuthError(authErrorMessage(err, "Hindi naipadala ang reset link. Subukan ulit."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <button type="button" className="auth-back" onClick={() => onSwitch("login")}>
        <Icon name="arrowLeft" size={19} /> Bumalik sa login
      </button>

      <div className="auth-heading">
        <span className="auth-heading-icon"><Icon name="bell" /></span>
        <h2>I-reset ang password</h2>
        <p>Ilagay ang email mo. Padadalhan ka namin ng simpleng reset link.</p>
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

      {authError && <p className="auth-error" role="alert">{authError}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? <><span className="spinner" />Ipinapadala...</> : "Magpadala ng Reset Link"}
      </Button>
    </form>
  );
}
