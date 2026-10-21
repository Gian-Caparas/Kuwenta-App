import { useNavigate } from "react-router-dom";
import AmountEntry from "../components/customers/AmountEntry";
import { useCustomers } from "../context/CustomersContext";
import { useToast } from "../context/ToastContext";
import { useCustomer } from "../hooks/useCustomer";

export default function RecordPayment() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { addTransaction } = useCustomers();
  const { notify } = useToast();

  const save = async (amount) => {
    try {
      await addTransaction(customer.id, "payment", amount, "Cash payment");
      navigate(`/customers/${customer.id}/payment/success?amount=${amount}`, { replace: true });
    } catch (err) {
      if (import.meta.env.DEV) console.error("[data]", err);
      notify("Hindi na-save ang bayad. Subukan ulit.", "error");
    }
  };

  return (
    <AmountEntry
      title="Tanggap Bayad"
      mode="payment"
      customer={customer}
      back={() => navigate(`/customers/${customer.id}`)}
      onSave={save}
    />
  );
}
