import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";
import { useToast } from "../context/ToastContext";
import { useCustomer } from "../hooks/useCustomer";

export default function EditCustomer() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { updateCustomer } = useCustomers();
  const { notify } = useToast();
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone || "");
  const [notes, setNotes] = useState(customer.notes || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const updatedCustomer = await updateCustomer(customer.id, {
        name: name.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
      });
      notify(`Na-update ang detalye ni ${updatedCustomer.name}.`);
      navigate(`/customers/${customer.id}`);
    } catch (err) {
      if (import.meta.env.DEV) console.error("[data]", err);
      notify("Hindi na-update ang detalye. Subukan ulit.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header
        title="I-edit ang Suki"
        subtitle="Ayusin ang pangunahing detalye"
        back={() => navigate(`/customers/${customer.id}`)}
      />
      <section className="content form-stack">
        <label className="field">
          <span>Pangalan <b>*</b></span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </label>
        <label className="field">
          <span>Numero ng telepono</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="09XX XXX XXXX" />
        </label>
        <label className="field">
          <span>Notes <small>(optional)</small></span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </label>
        <div className="privacy-note">
          <Icon name="cloud" />
          <p>Ligtas ang impormasyon. Naka-save ito sa iyong account.</p>
        </div>
        <Button onClick={save} disabled={!name.trim() || saving}>
          {saving ? <><span className="spinner" />Sandali lang...</> : "I-save ang pagbabago"}
        </Button>
      </section>
    </div>
  );
}
