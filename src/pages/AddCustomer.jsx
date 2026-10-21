import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";
import { useToast } from "../context/ToastContext";

export default function AddCustomer() {
  const navigate = useNavigate();
  const { addCustomer } = useCustomers();
  const { notify } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const customer = await addCustomer({ name: name.trim(), phone: phone.trim(), notes: notes.trim() });
      notify(`Naidagdag si ${customer.name} sa mga suki.`);
      navigate("/customers");
    } catch (err) {
      if (import.meta.env.DEV) console.error("[data]", err);
      notify("Hindi na-save ang suki. Subukan ulit.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header title="Bagong Suki" subtitle="Ilagay ang pangunahing detalye" back={() => navigate("/customers")} />
      <section className="content form-stack">
        <label className="field">
          <span>Pangalan <b>*</b></span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hal. Aling Rosa" autoFocus />
        </label>
        <label className="field">
          <span>Numero ng telepono</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="09XX XXX XXXX" />
        </label>
        <label className="field">
          <span>Notes <small>(optional)</small></span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Hal. Nakatira sa tapat ng barangay hall" rows={4} />
        </label>
        <div className="privacy-note">
          <Icon name="cloud" />
          <p>Ligtas ang impormasyon. Naka-save ito sa iyong account.</p>
        </div>
        <Button onClick={save} disabled={!name.trim() || saving}>
          {saving ? <><span className="spinner" />Sandali lang...</> : "I-save ang Suki"}
        </Button>
      </section>
    </div>
  );
}
