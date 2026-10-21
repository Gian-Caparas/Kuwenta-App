import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useToast } from "../context/ToastContext";
import { useCustomer } from "../hooks/useCustomer";
import { useProfile } from "../hooks/useProfile";
import { peso } from "../lib/format";

export default function Reminder() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { storeName } = useProfile();
  const { notify } = useToast();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(
    `Magandang araw po, ${customer.name}! Magalang na paalala lang po mula sa ${storeName} tungkol sa inyong balanse na ${peso(customer.balance)}. Maaari po kayong magbayad kapag convenient na. Maraming salamat po!`
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      return true;
    } catch {
      notify("Hindi nakopya. Piliin at kopyahin ang mensahe.", "error");
      return false;
    }
  };

  const messenger = async () => {
    if (await copy()) notify("Nakopya ang mensahe. I-paste ito sa Messenger.");
  };

  const smsHref = `sms:${(customer.phone || "").replace(/\s/g, "")}?body=${encodeURIComponent(message)}`;

  return (
    <div>
      <Header title="Magalang na paalala" subtitle={`Para kay ${customer.name}`} back={() => navigate(`/customers/${customer.id}`)} />
      <section className="content form-stack">
        <div className="message-preview">
          <span className="eyebrow">I-edit ang mensahe</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={9} />
          <small>{message.length} characters</small>
        </div>
        <div className="reminder-tip">
          <Icon name="bell" />
          <p>Tip: Panatilihing magiliw at bigyan ang suki ng oras na makabayad.</p>
        </div>
        <div className="action-grid">
          <Button variant="secondary" icon="copy" onClick={copy}>{copied ? "Nakopya!" : "Copy"}</Button>
          <Button icon="phone" onClick={() => { window.location.href = smsHref; }} disabled={!customer.phone}>Send via SMS</Button>
        </div>
        <Button variant="ghost" onClick={messenger}>Send via Messenger</Button>
      </section>
    </div>
  );
}
