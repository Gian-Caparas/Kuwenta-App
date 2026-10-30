import { peso, relativeDay, shortDate } from "../../lib/format";
import Avatar from "../ui/Avatar";
import Icon from "../ui/Icon";
import { useTranslation } from "../../hooks/useTranslation";

export default function CustomerRow({ customer, onClick, selected, showOverdueDetails = false }) {
  const { t, language } = useTranslation();
  const displayAmount = showOverdueDetails ? customer.overdueAmount : customer.balance;
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
        {showOverdueDetails && customer.overdueTransactions?.length > 0 ? (
          customer.overdueTransactions.map((transaction) => (
            <span className="overdue-detail" key={transaction.id}>
              {transaction.note || t("customerRow.unpaidTransaction")} · {peso(transaction.remaining_amount)} / {peso(transaction.amount)} · {t("customerRow.dueDate", { date: shortDate(transaction.due_date, language) })}
            </span>
          ))
        ) : (
          <span>{relativeDay(customer.lastActivity, language)}</span>
        )}
      </div>
      <div className="row-balance">
        <strong className={displayAmount ? "debt-text" : "paid-text"}>{peso(displayAmount)}</strong>
        <span><i className={`status-dot ${customer.status}`} />{statusLabel[customer.status]}</span>
      </div>
      <Icon name="chevron" size={18} />
    </button>
  );
}