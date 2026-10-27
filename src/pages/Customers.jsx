import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerRow from "../components/customers/CustomerRow";
import EmptyState from "../components/ui/EmptyState";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";
import { useTranslation } from "../hooks/useTranslation";

const filters = [
  { key: "all", label: "customers.filter.all" },
  { key: "withDebt", label: "customers.filter.withDebt" },
  { key: "overdue", label: "customers.filter.overdue" },
  { key: "paid", label: "customers.filter.paid" },
];

export default function Customers() {
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const visible = customers.filter((customer) => {
    const matches = customer.name.toLowerCase().includes(query.toLowerCase());
    if (filter === "withDebt") return matches && customer.balance > 0;
    if (filter === "overdue") return matches && customer.status === "overdue";
    if (filter === "paid") return matches && customer.status === "paid";
    return matches;
  });

  const addCustomer = () => navigate("/customers/new");

  return (
    <div>
      <Header
        title={t("customers.title")}
        subtitle={t("customers.customerCount", { count: customers.length })}
        right={
          <button type="button" className="icon-button add" onClick={addCustomer} aria-label={t("customers.add")}>
            <Icon name="plus" />
          </button>
        }
      />
      <section className="content">
        <label className="search">
          <Icon name="search" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("customers.search")} />
        </label>
        <div className="chips">
          {filters.map((item) => (
            <button type="button" className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)} key={item.key}>
              {t(item.label)}
            </button>
          ))}
        </div>
        {visible.length ? (
          <div className="list-card">
            {visible.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} onClick={() => navigate(`/customers/${customer.id}`)} />
            ))}
          </div>
        ) : (
          <EmptyState onAdd={addCustomer} />
        )}
      </section>
    </div>
  );
}