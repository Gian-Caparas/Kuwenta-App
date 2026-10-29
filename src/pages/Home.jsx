import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CustomerRow from "../components/customers/CustomerRow";
import Header from "../components/ui/Header";
import Icon from "../components/ui/Icon";
import { useCustomers } from "../context/CustomersContext";
import { useProfile } from "../hooks/useProfile";
import { greeting, peso } from "../lib/format";
import { summarize } from "../lib/ledger";
import { useTranslation } from "../hooks/useTranslation";

export default function Home() {
  const navigate = useNavigate();
  const { customers, transactions } = useCustomers();
  const { storeName } = useProfile();
  const { t, language } = useTranslation();

  const stats = useMemo(() => summarize(customers, transactions), [customers, transactions]);
  const biggest = useMemo(
    () => customers.filter((c) => c.balance > 0).sort((a, b) => b.balance - a.balance).slice(0, 3),
    [customers]
  );

  const net = stats.netThisMonth;

  return (
    <div>
      <Header
        title={greeting(language)}
        subtitle={storeName}
        right={
          <button type="button" className="icon-button notification" aria-label={t("home.note")}>
            <Icon name="bell" /><i />
          </button>
        }
      />
      <section className="content">
        <div className="balance-card">
          <div>
            <span>{t("home.totalDebt")}</span>
            <strong>{peso(stats.total)}</strong>
            <small>
              {net === 0 ? (
                t("home.noteDesc")
              ) : (
                <>
                  <span className="trend">{net > 0 ? "↑" : "↓"} {peso(Math.abs(net))}</span> {t("common.month")}
                </>
              )}
            </small>
          </div>
          <div className="coin-stack" aria-hidden="true"><i /><i /><i /></div>
        </div>

        <div className="mini-grid">
          <div className="mini-card paid">
            <span className="mini-icon"><Icon name="check" size={18} /></span>
            <div><small>{t("home.paidThisWeek")}</small><strong>{peso(stats.paidThisWeek)}</strong></div>
          </div>
          <div className="mini-card overdue">
            <span className="mini-icon"><Icon name="bell" size={18} /></span>
            <div><small>{t("home.overdueTitle")}</small><strong>{peso(stats.overdueTotal)}</strong></div>
          </div>
        </div>

        <div className="section-heading">
          <div><span className="eyebrow">{t("home.watchTitle")}</span><h2>{t("home.biggestBalances")}</h2></div>
          <button type="button" onClick={() => navigate("/customers")}>{t("home.viewAll")}</button>
        </div>

        {biggest.length > 0 ? (
          <div className="list-card">
            {biggest.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} onClick={() => navigate(`/customers/${customer.id}`)} />
            ))}
          </div>
        ) : (
          <div className="friendly-note">
            <div className="note-icon"><Icon name="users" /></div>
            <div>
              <strong>{customers.length ? t("home.noDebtNow") : t("home.startNow")}</strong>
              <p>
                {customers.length
                  ? t("home.allPaid")
                  : t("home.addFirstCustomer")}
              </p>
            </div>
          </div>
        )}

        {stats.overdueCount > 0 && (
          <div className="friendly-note">
            <div className="note-icon"><Icon name="bell" /></div>
            <div>
              <strong>{t("home.overdueReminder")}</strong>
              <p>{t("home.overdueCount", { count: stats.overdueCount })}</p>
            </div>
          </div>
        )}
      </section>

      <button
        type="button"
        className="fab"
        onClick={() => navigate("customers")}
      >
        <Icon name="plus" /><span>{t("home.newDebt")}</span>
      </button>
    </div>
  );
}