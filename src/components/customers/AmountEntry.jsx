import { useState } from "react";
import { peso, shortDate } from "../../lib/format";
import Button from "../ui/Button";
import Header from "../ui/Header";
import Keypad from "../ui/Keypad";
import { useTranslation } from "../../hooks/useTranslation";
import { OVERDUE_DAYS } from "../../config";

/**
 * Shared amount screen used by "Bagong Utang" (mode="debt") and "Tanggap Bayad" (mode="payment").
 * onSave(amount, note) may be async; the button is disabled while saving.
 */
export default function AmountEntry({ title, customer, mode, back, onSave }) {
  const [amount, setAmount] = useState("");
  const [full, setFull] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const { t, language } = useTranslation();

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
      await onSave(numeric, note.trim(), dueDate);
    } finally {
      setSaving(false);
    }
  };

  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + OVERDUE_DAYS);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  return (
    <div>
      <Header title={title} subtitle={customer.name} back={back} />
      <section className="content amount-content">
        <div className="amount-entry">
          <small>{mode === "debt" ? t("debt.amountLabel") : t("payment.amountLabel")}</small>
          <div><span>₱</span><strong>{amount || "0"}</strong></div>
          {mode === "payment" && <p>{t("payment.remainingBalance", { balance: peso(Math.max(0, customer.balance - numeric)) })}</p>}
        </div>

        {mode === "payment" && (
          <div className="toggle-row">
            <div>
              <strong>{t("debt.fullPayment")}</strong>
              <span>{t("debt.fullPaymentDesc", { amount: peso(customer.balance) })}</span>
            </div>
            <button type="button" className={`toggle ${full ? "on" : ""}`} onClick={toggleFull} aria-label={t("debt.fullPayment")}>
              <i />
            </button>
          </div>
        )}

        <Keypad value={amount} onChange={(value) => { setAmount(value); setFull(false); }} />

        {mode === "debt" && (
          <>
            <label className="field compact">
              <span>{t("debt.description")}</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("debt.itemsPlaceholder")} />

              <span>{t("debt.payDate")}</span>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </label>
            <div className="date-row"><span>{t("debt.date")}</span><strong>{t("debt.today", { date: shortDate(new Date(), language) })}</strong></div>
          </>
        )}

        <Button onClick={save} disabled={!numeric || tooMuch || saving}>
          {saving ? <><span className="spinner" />{t("debt.saving")}</> : t(mode === "debt" ? "debt.save" : "payment.save")}
        </Button>
      </section>
    </div>
  );
}