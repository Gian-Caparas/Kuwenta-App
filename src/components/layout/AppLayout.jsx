import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CustomersProvider, useCustomers } from "../../context/CustomersContext";
import { ToastProvider } from "../../context/ToastContext";
import { NotificationsProvider } from "../../context/NotificationsContext";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { ErrorState, LoadingState } from "../ui/StateScreen";
import BottomNav from "./BottomNav";
import { useTranslation } from "../../hooks/useTranslation";

function Shell() {
  const { pathname } = useLocation();
  const online = useOnlineStatus();
  const { loading, error, reload } = useCustomers();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  let content = <Outlet />;
  if (loading) content = <LoadingState />;
  else if (error) content = <ErrorState error={error} onRetry={reload} />;

  return (
    <div className="app-shell">
      <ToastProvider>
        <NotificationsProvider>
          <BottomNav />
          <main className="app-main">
            {!online && <div className="offline-banner">{t("common.offline")}</div>}
            {content}
          </main>
        </NotificationsProvider>
      </ToastProvider>
    </div>
  );
}

export default function AppLayout() {
  return (
    <CustomersProvider>
      <Shell />
    </CustomersProvider>
  );
}