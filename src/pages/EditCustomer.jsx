import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";
import { useToast } from "../context/ToastContext";
import { useCustomer } from "../hooks/useCustomer";
import { useTranslation } from "../hooks/useTranslation";
import { CustomerFormSkeleton, useDelayedLoading } from "../components/ui/Skeleton";

export default function EditCustomer() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { updateCustomer } = useCustomers();
  const { notify } = useToast();
  const { t } = useTranslation();

  // Show skeleton while customer data is loading
  const showSkeleton = useDelayedLoading(!customer?.id, 300);

  // These hooks must be called on every render (React Hooks rules)
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [notes, setNotes] = useState(customer?.notes || "");
  const [saving, setSaving] = useState(false);

  if (showSkeleton) {
    return <CustomerFormSkeleton />;
  }

  const save = async () => {
    setSaving(true);
    try {
      const updatedCustomer = await updateCustomer(customer.id, {
        name: name.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
      });
      notify(`${t("common.save")}d: ${updatedCustomer.name}`);
      navigate(`/customers/${customer.id}`);
    } catch (err) {
      if (import.meta.env.DEV) console.error("[data]", err);
      notify(t("common.error") + ": " + t("customerForm.save"), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header
        title={t("customerForm.editTitle")}
        subtitle={t("customerForm.editSubtitle")}
        back={() => navigate(`/customers/${customer.id}`)}
      />
      <section className="content form-stack">
        <label className="field">
          <span>{t("customerForm.name")} <b>*</b></span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </label>
        <label className="field">
          <span>{t("customerForm.phone")}</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder={t("customerForm.phonePlaceholder")} />
        </label>
        <label className="field">
          <span>{t("customerForm.notes")} <small>({t("common.optional")})</small></span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </label>
        <div className="privacy-note">
          <Icon name="cloud" />
          <p>{t("customerForm.privacyNote")}</p>
        </div>
        <Button onClick={save} disabled={!name.trim() || saving}>
          {saving ? <><span className="spinner" />{t("customerForm.saving")}</> : t("customerForm.saveChanges")}
        </Button>
      </section>
    </div>
  );
}