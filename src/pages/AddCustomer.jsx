import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "../hooks/useTranslation";

export default function AddCustomer() {
  const navigate = useNavigate();
  const { addCustomer } = useCustomers();
  const { notify } = useToast();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const customer = await addCustomer({ name: name.trim(), phone: phone.trim(), notes: notes.trim() });
      notify(`${t("common.save")}d: ${customer.name}`);
      navigate("/customers");
    } catch (err) {
      if (import.meta.env.DEV) console.error("[data]", err);
      notify(t("common.error") + ": " + t("customerForm.nameRequired"), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header title={t("customerForm.title")} subtitle={t("customerForm.subtitle")} back={() => navigate("/customers")} />
      <section className="content form-stack">
        <label className="field">
          <span>{t("customerForm.name")} <b>*</b></span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("customerForm.nameExample")} autoFocus />
        </label>
        <label className="field">
          <span>{t("customerForm.phone")}</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder={t("customerForm.phonePlaceholder")} />
        </label>
        <label className="field">
          <span>{t("customerForm.notes")} <small>({t("common.cancel")})</small></span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("customerForm.notesPlaceholder")} rows={4} />
        </label>
        <div className="privacy-note">
          <Icon name="cloud" />
          <p>{t("customerForm.privacyNote")}</p>
        </div>
        <Button onClick={save} disabled={!name.trim() || saving}>
          {saving ? <><span className="spinner" />{t("customerForm.saving")}</> : t("customerForm.save")}
        </Button>
      </section>
    </div>
  );
}