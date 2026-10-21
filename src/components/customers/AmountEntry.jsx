import { useState } from "react";
import { peso, shortDate } from "../../lib/format";
import Button from "../ui/Button";
import Header from "../ui/Header";
import Keypad from "../ui/Keypad";

/**
 * Shared amount screen used by "Bagong Utang" (mode="debt") and "Tanggap Bayad" (mode="payment").
 * onSave(amount, note) may be async; the button is disabled while saving.
 */
export default function AmountEntry({ title, customer, mode, back, onSave }) {
  const [amount, setAmount] = useState("");
  const [full, setFull] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const numeric = Number(amount);
  const tooMuch = mode === "payment" && numeric > customer.balance;

  const toggleFull = () => {
    const next = !full;
    setFull(next);
    setAmount(next ? String(customer.balance) : "");
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(numeric, note.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header title={title} subtitle={customer.name} back={back} />
      <section className="content amount-content">
        <div className="amount-entry">
          <small>{mode === "debt" ? "Halaga ng utang" : "Halagang matatanggap"}</small>
          <div><span>₱</span><strong>{amount || "0"}</strong></div>
          {mode === "payment" && <p>Natitirang balanse: {peso(Math.max(0, customer.balance - numeric))}</p>}
        </div>

        {mode === "payment" && (
          <div className="toggle-row">
            <div>
              <strong>Buong bayad</strong>
              <span>Itala ang buong {peso(customer.balance)}</span>
            </div>
            <button type="button" className={`toggle ${full ? "on" : ""}`} onClick={toggleFull} aria-label="Buong bayad">
              <i />
            </button>
          </div>
        )}

        <Keypad value={amount} onChange={(value) => { setAmount(value); setFull(false); }} />

        {mode === "debt" && (
          <>
            <label className="field compact">
              <span>Mga item o note</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Hal. Bigas, kape, asukal" />
            </label>
            <div className="date-row"><span>Petsa</span><strong>Ngayon, {shortDate()}</strong></div>
          </>
        )}

        <Button onClick={save} disabled={!numeric || tooMuch || saving}>
          {saving ? <><span className="spinner" />Sandali lang...</> : `I-save ${mode === "debt" ? "ang Utang" : "ang Bayad"}`}
        </Button>
      </section>
    </div>
  );
}
