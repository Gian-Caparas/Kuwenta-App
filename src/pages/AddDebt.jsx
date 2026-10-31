import { useNavigate } from "react-router-dom";
import AmountEntry from "../components/customers/AmountEntry";
import { useCustomers } from "../context/CustomersContext";
import { useToast } from "../context/ToastContext";
import { useCustomer } from "../hooks/useCustomer";
import { useGoBack } from "../hooks/useGoBack";
import { peso } from "../lib/format";
import { useTranslation } from "../hooks/useTranslation";
import { AddDebtSkeleton, useDelayedLoading } from "../components/ui/Skeleton";
import { useNotifications } from "../context/NotificationsContext";

export default function AddDebt() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { addTransaction } = useCustomers();
  const { notify } = useToast();
  const { notifyTransactionCreated } = useNotifications();
  const goBack = useGoBack(`/customers/${customer.id}`);
  const { t } = useTranslation();

  // Show skeleton while customer data is loading
  const showSkeleton = useDelayedLoading(!customer?.id, 300);

  if (showSkeleton) {
    return <AddDebtSkeleton />;
  }

  const save = async (amount, note, due_date) => {
    try {
      const transaction = await addTransaction(customer.id, "debt", amount, note, due_date);
      // Create notification for new debt
      await notifyTransactionCreated(transaction, customer);
      navigate("/");
      notify(`${t("debt.save")}: ${peso(amount)} ${t("common.for")} ${customer.name}.`);
    } catch (err) {
      if (import.meta.env.DEV) console.error("[data]", err);
      notify(t("common.error") + ": " + t("debt.save"), "error");
    }
  };

  return <AmountEntry title={t("debt.title")} mode="debt" customer={customer} back={goBack} onSave={save} />;
}