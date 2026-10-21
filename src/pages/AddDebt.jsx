import { useNavigate } from "react-router-dom";
import AmountEntry from "../components/customers/AmountEntry";
import { useCustomers } from "../context/CustomersContext";
import { useToast } from "../context/ToastContext";
import { useCustomer } from "../hooks/useCustomer";
import { useGoBack } from "../hooks/useGoBack";
import { peso } from "../lib/format";

export default function AddDebt() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { addTransaction } = useCustomers();
  const { notify } = useToast();
  const goBack = useGoBack(`/customers/${customer.id}`);

  const save = async (amount, note) => {
    try {
      await addTransaction(customer.id, "debt", amount, note);
      navigate("/");
      notify(`Naitala ang ${peso(amount)} na utang ni ${customer.name}.`);
    } catch (err) {
      if (import.meta.env.DEV) console.error("[data]", err);
      notify("Hindi na-save ang utang. Subukan ulit.", "error");
    }
  };

  return <AmountEntry title="Bagong Utang" mode="debt" customer={customer} back={goBack} onSave={save} />;
}
