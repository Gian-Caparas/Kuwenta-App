import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";

const tabs = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/customers", label: "Mga Suki", icon: "users" },
  { to: "/reports", label: "Ulat", icon: "chart" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = (to) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <nav className="nav-shell" aria-label="Pangunahing navigation">
      <div className="brand"><span className="brand-mark">K</span><span>Kuewenta</span></div>
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
