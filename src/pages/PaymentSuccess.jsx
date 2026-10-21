import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { useCustomer } from "../hooks/useCustomer";
import { fullDate, peso } from "../lib/format";

export default function PaymentSuccess() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const amount = Number(params.get("amount") ?? 0);

  return (
    <div className="success-screen">
      <div className="success-check"><Icon name="check" size={42} /></div>
      <span className="eyebrow">Naitala na</span>
      <h1>Salamat! Bayad naitala.</h1>
      <p>Ang bayad ni {customer.name} ay ligtas nang naka-save.</p>
      <div className="receipt">
        <div><span>Natanggap</span><strong className="paid-text">{peso(amount)}</strong></div>
        <div><span>Bagong balanse</span><strong>{peso(customer.balance)}</strong></div>
        <div><span>Petsa</span><strong>{fullDate()}</strong></div>
      </div>
      <Button onClick={() => navigate(`/customers/${customer.id}`, { replace: true })}>Bumalik sa Detalye</Button>
    </div>
  );
}
