import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useToast } from "../context/ToastContext";
import { useCustomer } from "../hooks/useCustomer";
import { useProfile } from "../hooks/useProfile";
import { peso } from "../lib/format";
import { useTranslation } from "../hooks/useTranslation";

export default function Reminder() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { storeName } = useProfile();
  const { notify } = useToast();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(
    t("reminder.defaultMessage", { name: customer.name, storeName, balance: peso(customer.balance) })
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      return true;
    } catch {
      notify(t("reminder.copyError"), "error");
      return false;
    }
  };

  const messenger = async () => {
    if (await copy()) notify(t("reminder.messengerCopied"));
  };

  const smsHref = `sms:${(customer.phone || "").replace(/\s/g, "")}?body=${encodeURIComponent(message)}`;

  return (
    <div>
      <Header title={t("reminder.title")} subtitle={t("reminder.subtitle", { name: customer.name })} back={() => navigate(`/customers/${customer.id}`)} />
      <section className="content form-stack">
        <div className="message-preview">
          <span className="eyebrow">{t("reminder.editMessage")}</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={9} />
          <small>{t("reminder.charCount", { count: message.length })}</small>
        </div>
        <div className="reminder-tip">
          <Icon name="bell" />
          <p>{t("reminder.tip")}</p>
        </div>
        <div className="action-grid">
          <Button variant="secondary" icon="copy" onClick={copy}>{copied ? t("reminder.copied") : t("reminder.copy")}</Button>
          <Button icon="phone" onClick={() => { window.location.href = smsHref; }} disabled={!customer.phone}>{t("reminder.sendSMS")}</Button>
        </div>
        <Button variant="ghost" onClick={messenger}>{t("reminder.sendMessenger")}</Button>
      </section>
    </div>
  );
}