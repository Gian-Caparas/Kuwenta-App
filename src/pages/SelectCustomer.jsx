import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerRow from "../components/customers/CustomerRow";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";
import { useTranslation } from "../hooks/useTranslation";
import { SelectCustomerSkeleton, useDelayedLoading } from "../components/ui/Skeleton";

export default function SelectCustomer() {
  const navigate = useNavigate();
  const { customers, loading } = useCustomers();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  // Delay showing skeleton to avoid flickering on fast loads
  const showSkeleton = useDelayedLoading(loading, 300);

  if (showSkeleton) {
    return <SelectCustomerSkeleton />;
  }

  const visible = customers.filter((customer) => customer.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <Header title={t("selectCustomer.title")} subtitle={t("selectCustomer.subtitle")} back={() => navigate("/")} />
      <section className="content">
        <label className="search">
          <Icon name="search" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("selectCustomer.search")} />
        </label>
        <div className="list-card stagger-list">
          {visible.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} onClick={() => navigate(`/customers/${customer.id}/debt`)} />
          ))}
        </div>
      </section>
    </div>
  );
}