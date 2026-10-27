import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import { useTranslation } from "../../hooks/useTranslation";

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isActive = (to) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  const tabs = [
    { to: "/", label: t("customers.title"), icon: "home" },
    { to: "/customers", label: t("customers.title"), icon: "users" },
    { to: "/reports", label: t("reports.title"), icon: "chart" },
    { to: "/settings", label: t("settings.title"), icon: "settings" },
  ];

  return (
    <nav className="nav-shell" aria-label={t("common.navigation")}>
      <div className="brand"><span className="brand-mark">K</span><span>Kuwenta</span></div>
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.to}
          className={isActive(tab.to) ? "nav-item active" : "nav-item"}
          onClick={() => navigate(tab.to)}
        >
          <Icon name={tab.icon} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}