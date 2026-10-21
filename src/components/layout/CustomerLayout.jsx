import { Navigate, Outlet, useParams } from "react-router-dom";
import { useCustomers } from "../../context/CustomersContext";

/** Loads the customer from the URL and shares it with child routes via useCustomer(). */
export default function CustomerLayout() {
  const { id } = useParams();
  const { getCustomer } = useCustomers();
  const customer = getCustomer(id);

  if (!customer) return <Navigate to="/customers" replace />;
  return <Outlet context={customer} />;
}
