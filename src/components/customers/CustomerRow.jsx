import { peso, relativeDay } from "../../lib/format";
import Avatar from "../ui/Avatar";
import Icon from "../ui/Icon";

const statusLabel = { overdue: "Lampas na", paid: "Bayad na", active: "May utang" };

export default function CustomerRow({ customer, onClick, selected }) {
  return (
    <button type="button" className={`customer-row ${selected ? "selected" : ""}`} onClick={onClick}>
      <Avatar name={customer.name} />
      <div className="row-copy">
        <strong>{customer.name}</strong>
        <span>{relativeDay(customer.lastActivity)}</span>
      </div>
      <div className="row-balance">
        <strong className={customer.balance ? "debt-text" : "paid-text"}>{peso(customer.balance)}</strong>
        <span><i className={`status-dot ${customer.status}`} />{statusLabel[customer.status]}</span>
      </div>
      <Icon name="chevron" size={18} />
    </button>
  );
}
