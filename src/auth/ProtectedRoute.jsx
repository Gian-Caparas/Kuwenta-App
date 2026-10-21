import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { isOnboarded } from "./onboarding";

export default function ProtectedRoute() {
  const { session } = useAuth();
  const { pathname } = useLocation();

  if (!session) return <Navigate to="/auth" replace />;
  if (!isOnboarded(session.user.id) && pathname !== "/welcome") {
    return <Navigate to="/welcome" replace />;
  }
  return <Outlet />;
}
