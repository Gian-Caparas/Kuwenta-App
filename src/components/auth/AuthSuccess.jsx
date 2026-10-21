import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

export default function AuthSuccess({ kind, email, onBack }) {
  const [resent, setResent] = useState(false);

  const resend = async () => {
    if (kind === "signup") await supabase.auth.resend({ type: "signup", email });
    else await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    setResent(true);
  };

  return (
    <div className="auth-success">
      <div className="success-check"><Icon name="check" size={38} /></div>
      <span className="eyebrow">Ayos na!</span>
      <h2>
        {kind === "signup"
          ? "Tingnan ang email mo para i-confirm ang account"
          : "Nasa email mo na ang reset link"}
      </h2>
      <p>
        Nagpadala kami ng link sa <strong>{email}</strong>.{" "}
        {kind === "signup" ? "I-tap lang iyon para makapagsimula." : "Buksan ito para gumawa ng bagong password."}
      </p>
      <Button onClick={onBack}>{kind === "signup" ? "Pumunta sa Login" : "Bumalik sa Login"}</Button>
      <button type="button" className="resend-link" onClick={resend} disabled={resent}>
        {resent ? "Naipadala ulit!" : "Hindi dumating? Ipadala ulit"}
      </button>
    </div>
  );
}
