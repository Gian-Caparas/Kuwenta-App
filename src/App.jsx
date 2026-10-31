import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import CustomerLayout from "./components/layout/CustomerLayout";
import { LoadingState } from "./components/ui/StateScreen";
import AddCustomer from "./pages/AddCustomer";
import AddDebt from "./pages/AddDebt";
import Auth from "./pages/Auth";
import CustomerDetail from "./pages/CustomerDetail";
import Customers from "./pages/Customers";
import EditCustomer from "./pages/EditCustomer";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import PaymentSuccess from "./pages/PaymentSuccess";
import RecordPayment from "./pages/RecordPayment";
import Reminder from "./pages/Reminder";
import Reports from "./pages/Reports";
import ResetPassword from "./pages/ResetPassword";
import SelectCustomer from "./pages/SelectCustomer";
import Settings from "./pages/Settings";

export default function App() {
  const { loading, recovery, authLinkError, finishRecovery } = useAuth();

  if (loading) return <LoadingState text="Sandali lang..." />;
  if (recovery) return <ResetPassword done={finishRecovery} />;
  if (authLinkError) return <Auth authLinkError={authLinkError} />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword done={finishRecovery} />} />

      {/* Logged-in only */}
      <Route element={<ProtectedRoute />}>
        <Route path="/welcome" element={<Onboarding />} />

        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="debt/select" element={<SelectCustomer />} />

          <Route path="customers">
            <Route index element={<Customers />} />
            <Route path="new" element={<AddCustomer />} />
            <Route path=":id" element={<CustomerLayout />}>
              <Route index element={<CustomerDetail />} />
              <Route path="edit" element={<EditCustomer />} />
              <Route path="debt" element={<AddDebt />} />
              <Route path="payment" element={<RecordPayment />} />
              <Route path="payment/success" element={<PaymentSuccess />} />
              <Route path="reminder" element={<Reminder />} />
            </Route>
          </Route>

          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
