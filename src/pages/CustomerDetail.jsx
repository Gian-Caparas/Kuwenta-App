import { useNavigate } from "react-router-dom";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomer } from "../hooks/useCustomer";
import { peso, shortDate, timeOfDay } from "../lib/format";
import { useTranslation } from "../hooks/useTranslation";

const HISTORY_LIMIT = 30;

export default function CustomerDetail() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const base = `/customers/${customer.id}`;
  const history = customer.transactions.slice(0, HISTORY_LIMIT);
  const { t, language } = useTranslation();

  return (
    <div>
      <Header title={t("customer.detail", { default: "Customer Detail" })} back={() => navigate("/customers")} />
      <section className="content">
        <div className="customer-hero">
          <Avatar name={customer.name} large />
          <div><h2>{customer.name}</h2><span>{customer.phone || t("common.noPhone")} | {customer.notes || t("common.noNote")}</span></div>
          <button
            type="button"
            className="hero-edit"
            onClick={() => navigate(`${base}/edit`)}
            aria-label={t("customer.editDetails", { name: customer.name })}
          >
            <Icon name="edit" size={20} />
          </button>
          <div className="hero-balance">
            <small>{t("customer.currentBalance")}</small>
            <strong>{peso(customer.balance)}</strong>
          </div>
        </div>

        <div className="action-grid">
          <Button onClick={() => navigate(`${base}/debt`)} icon="plus">{t("customer.addDebt")}</Button>
          <Button
            onClick={() => navigate(`${base}/payment`)}
            icon="wallet"
            variant="secondary"
            disabled={customer.balance <= 0}
          >
            {t("customer.recordPayment")}
          </Button>
        </div>

        <div className="section-heading">
          <div><span className="eyebrow">{t("customer.activity")}</span><h2>{t("customer.history")}</h2></div>
        </div>

        {history.length > 0 ? (
          <div className="timeline">
            {history.map((txn) => (
              <div className={`transaction ${txn.type}`} key={txn.id}>
                <span className="timeline-dot" />
                <div>
                  <strong>{txn.type === "debt" ? t("common.debt") : t("common.payment")}</strong>
                  <p>{txn.note || (txn.type === "debt" ? t("common.noNote") : t("payment.note"))}</p>
                  <small>{shortDate(txn.created_at, language)} • {timeOfDay(txn.created_at)}</small>
                </div>
                <b>{txn.type === "debt" ? "+" : "−"} {peso(Number(txn.amount))}</b>
              </div>
            ))}
          </div>
        ) : (
          <div className="friendly-note">
            <div className="note-icon"><Avatar name={customer.name} /></div>
            <div>
              <strong>{t("customer.noHistory")}</strong>
              <p>{t("customer.firstDebtPrompt", { name: customer.name })}</p>
            </div>
          </div>
        )}

        {customer.balance > 0 && (
          <Button variant="ghost" icon="bell" onClick={() => navigate(`${base}/reminder`)}>
            {t("customer.sendReminder")}
          </Button>
        )}
      </section>
    </div>
  );
}