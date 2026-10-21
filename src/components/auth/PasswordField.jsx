import { useState } from "react";

export default function PasswordField({ value, onChange, placeholder, autoComplete, invalid, children }) {
  const [show, setShow] = useState(false);
  return (
    <label className={`field ${invalid ? "field-error" : ""}`}>
      <span>Password</span>
      <div className="password-field">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button type="button" onClick={() => setShow(!show)}>{show ? "Itago" : "Ipakita"}</button>
      </div>
      {children}
    </label>
  );
}
