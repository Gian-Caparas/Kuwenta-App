import { useMemo } from "react";
import Avatar from "../components/ui/Avatar";
import Header from "../components/ui/Header";
import { useCustomers } from "../context/CustomersContext";
import { monthLong, peso } from "../lib/format";
import { monthlySeries, monthTotals, oldestBalances } from "../lib/ledger";
import { useTranslation } from "../hooks/useTranslation";

export default function Reports() {
  const { customers, transactions } = useCustomers();
  const { t, language } = useTranslation();
  const now = new Date();

  const totals = useMemo(() => monthTotals(transactions), [transactions]);
  const bars = useMemo(() => monthlySeries(transactions, 6, language), [transactions, language]);
  const oldest = useMemo(() => oldestBalances(customers, 3), [customers]);

  return (
    <div>
      <Header title={t("reports.title")} subtitle={t("reports.subtitle", { month: t(`common.months.long.${["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][now.getMonth()]}`, { default: monthLong(now.getMonth(), language) }), year: now.getFullYear() })} />
      <section className="content">
        <div className="report-summary">
          <div><small>{t("reports.totalDebt")}</small><strong className="debt-text">{peso(totals.debt)}</strong><span>{t("reports.thisMonth")}</span></div>
          <div><small>{t("reports.totalPaid")}</small><strong className="paid-text">{peso(totals.paid)}</strong><span>{t("reports.thisMonth")}</span></div>
        </div>

        <div className="chart-card">
          <div className="section-heading">
            <div><h2>{t("reports.chartTitle")}</h2><p>{t("reports.chartDesc")}</p></div>
            <div className="legend">
              <span><i className="debt-bar" />{t("reports.legend.debt")}</span>
              <span><i className="paid-bar" />{t("reports.legend.paid")}</span>
            </div>
          </div>
          <div className="bar-chart">
            {bars.map((bar) => (
              <div className="bar-group" key={bar.key}>
                <div className="bars">
                  <i className="debt-bar" style={{ height: `${bar.debtPct}%` }} title={peso(bar.debt)} />
                  <i className="paid-bar" style={{ height: `${bar.paidPct}%` }} title={peso(bar.paid)} />
                </div>
                <span>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-heading">
          <div><span className="eyebrow">{t("reports.oldestTitle")}</span><h2>{t("reports.oldestSubtitle")}</h2></div>
        </div>
        {oldest.length > 0 ? (
          <div className="oldest-list">
            {oldest.map((c) => (
              <div key={c.id}>
                <Avatar name={c.name} />
                <span>
                  <strong>{c.name}</strong>
                  <small>{c.days === 0 ? t("reports.startedToday") : t("reports.daysAgo", { days: c.days })}</small>
                </span>
                <b>{peso(c.balance)}</b>
              </div>
            ))}
          </div>
        ) : (
          <div className="friendly-note">
            <div className="note-icon"><Avatar name="OK" /></div>
            <div><strong>{t("reports.noOldest")}</strong><p>{t("reports.noOldestDesc")}</p></div>
          </div>
        )}
      </section>
    </div>
  );
}