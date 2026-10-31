import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { useCustomer } from "../hooks/useCustomer";
import { fullDate, peso } from "../lib/format";
import { useTranslation } from "../hooks/useTranslation";
import { PaymentSuccessSkeleton, useDelayedLoading } from "../components/ui/Skeleton";

export default function PaymentSuccess() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const amount = Number(params.get("amount") ?? 0);
  const { t, language } = useTranslation();

  // Show skeleton while customer data is loading
  const showSkeleton = useDelayedLoading(!customer?.id, 300);

  if (showSkeleton) {
    return <PaymentSuccessSkeleton />;
  }

  return (
    <div className="success-screen">
      <div className="success-check"><Icon name="check" size={42} /></div>
      <span className="eyebrow">{t("paymentSuccess.subtitle")}</span>
      <h1>{t("paymentSuccess.title")}</h1>
      <p>{t("paymentSuccess.savedMessage", { name: customer.name })}</p>
      <div className="receipt">
        <div><span>{t("paymentSuccess.received")}</span><strong className="paid-text">{peso(amount)}</strong></div>
        <div><span>{t("paymentSuccess.newBalance")}</span><strong>{peso(customer.balance)}</strong></div>
        <div><span>{t("paymentSuccess.date")}</span><strong>{fullDate(new Date(), language)}</strong></div>
      </div>
      <Button onClick={() => navigate(`/customers/${customer.id}`, { replace: true })}>{t("paymentSuccess.backToDetails")}</Button>
    </div>
  );
}