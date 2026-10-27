import { peso, relativeDay } from "../../lib/format";
import Avatar from "../ui/Avatar";
import Icon from "../ui/Icon";
import { useTranslation } from "../../hooks/useTranslation";

export default function CustomerRow({ customer, onClick, selected }) {
  const { t, language } = useTranslation();
  const statusLabel = {
    overdue: t("customerRow.status.overdue"),
    paid: t("customerRow.status.paid"),
    active: t("customerRow.status.active"),
  };

  return (
    <button type="button" className={`customer-row ${selected ? "selected" : ""}`} onClick={onClick}>
      <Avatar name={customer.name} />
      <div className="row-copy">
        <strong>{customer.name}</strong>
        <span>{relativeDay(customer.lastActivity, language)}</span>
      </div>
      <div className="row-balance">
        <strong className={customer.balance ? "debt-text" : "paid-text"}>{peso(customer.balance)}</strong>
        <span><i className={`status-dot ${customer.status}`} />{statusLabel[customer.status]}</span>
      </div>
      <Icon name="chevron" size={18} />
    </button>
  );
}