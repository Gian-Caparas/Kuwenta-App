import { useNavigate } from "react-router-dom";
import AmountEntry from "../components/customers/AmountEntry";
import { useCustomers } from "../context/CustomersContext";
import { useToast } from "../context/ToastContext";
import { useCustomer } from "../hooks/useCustomer";
import { useTranslation } from "../hooks/useTranslation";
import { RecordPaymentSkeleton, useDelayedLoading } from "../components/ui/Skeleton";

export default function RecordPayment() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { addTransaction } = useCustomers();
  const { notify } = useToast();
  const { t } = useTranslation();

  // Show skeleton while customer data is loading
  const showSkeleton = useDelayedLoading(!customer?.id, 300);

  if (showSkeleton) {
    return <RecordPaymentSkeleton />;
  }

  const save = async (amount) => {
    try {
      await addTransaction(customer.id, "payment", amount, t("payment.note"));
      navigate(`/customers/${customer.id}/payment/success?amount=${amount}`, { replace: true });
    } catch (err) {
      if (import.meta.env.DEV) console.error("[data]", err);
      notify(t("common.error") + ": " + t("payment.save"), "error");
    }
  };

  return (
    <AmountEntry
      title={t("payment.title")}
      mode="payment"
      customer={customer}
      back={() => navigate(`/customers/${customer.id}`)}
      onSave={save}
    />
  );
}