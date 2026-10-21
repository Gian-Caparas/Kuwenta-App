import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerRow from "../components/customers/CustomerRow";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";

export default function SelectCustomer() {
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const [query, setQuery] = useState("");

  const visible = customers.filter((customer) => customer.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <Header title="Pumili ng suki" subtitle="Para kanino ang bagong utang?" back={() => navigate("/")} />
      <section className="content">
        <label className="search">
          <Icon name="search" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hanapin ang pangalan..." />
        </label>
        <div className="list-card">
          {visible.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} onClick={() => navigate(`/customers/${customer.id}/debt`)} />
          ))}
        </div>
      </section>
    </div>
  );
}
