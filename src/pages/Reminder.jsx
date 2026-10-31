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
import { supabase } from "../lib/supabase";
import { ReminderSkeleton, useDelayedLoading } from "../components/ui/Skeleton";

export default function Reminder() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { storeName } = useProfile();
  const { notify } = useToast();
  const { t } = useTranslation();

  // Show skeleton while customer data is loading
  const showSkeleton = useDelayedLoading(!customer?.id, 300);

  // These hooks must be called on every render (React Hooks rules)
  const [copied, setCopied] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);
  const [message, setMessage] = useState(
    t("reminder.defaultMessage", { name: customer?.name, storeName, balance: peso(customer?.balance || 0) })
  );

  if (showSkeleton) {
    return <ReminderSkeleton />;
  }

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

  const sendSMSViaAPI = async () => {
    if (!customer.phone) {
      notify(t("reminder.noPhone"), "error");
      return;
    }

    setSendingSMS(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          recipient: customer.phone.replace(/\s/g, ""),
          message: message
        },
      });

      if (error) {
        let errorMessage = error.message || "Failed to send SMS";
        const response = error.context;

        if (response instanceof Response) {
          try {
            const details = await response.clone().json();
            errorMessage = details.error || errorMessage;
          } catch {
            // Keep the Supabase error when the response is not JSON.
          }
        }

        throw new Error(errorMessage);
      }

      // Check if the response data contains an error from PhilSMS
      if (data?.error) {
        throw new Error(data.error);
      }

      notify(t("reminder.smsSent"), "success");
    } catch (err) {
      console.error('SMS Error:', err);
      notify(t("reminder.smsError", { error: err.message || 'Unknown error' }), "error");
    } finally {
      setSendingSMS(false);
    }
  };

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
          <Button
          variant="primary"
          icon="send"
          onClick={sendSMSViaAPI}
          disabled={sendingSMS || !customer.phone || !supabase}
        >
          {sendingSMS ? t("reminder.sendingSMS") : t("reminder.sendSMSAPI")}
        </Button>
        </div>
        <Button variant="ghost" onClick={messenger}>{t("reminder.sendMessenger")}</Button>
      </section>
    </div>
  );
}