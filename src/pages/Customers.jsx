import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerRow from "../components/customers/CustomerRow";
import EmptyState from "../components/ui/EmptyState";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";

const filters = ["Lahat", "May utang", "Lampas na", "Bayad na"];

export default function Customers() {
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const [filter, setFilter] = useState("Lahat");
  const [query, setQuery] = useState("");

  const visible = customers.filter((customer) => {
    const matches = customer.name.toLowerCase().includes(query.toLowerCase());
    if (filter === "May utang") return matches && customer.balance > 0;
    if (filter === "Lampas na") return matches && customer.status === "overdue";
    if (filter === "Bayad na") return matches && customer.status === "paid";
    return matches;
  });

  const addCustomer = () => navigate("/customers/new");

  return (
    <div>
      <Header
        title="Mga Suki"
        subtitle={`${customers.length} customer`}
        right={
          <button type="button" className="icon-button add" onClick={addCustomer} aria-label="Magdagdag ng suki">
            <Icon name="plus" />
          </button>
        }
      />
      <section className="content">
        <label className="search">
          <Icon name="search" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hanapin ang pangalan..." />
        </label>
        <div className="chips">
          {filters.map((item) => (
            <button type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>
              {item}
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
