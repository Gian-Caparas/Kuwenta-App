import { useMemo } from "react";
import Avatar from "../components/ui/Avatar";
import Header from "../components/ui/Header";
import { useCustomers } from "../context/CustomersContext";
import { monthLong, peso } from "../lib/format";
import { monthlySeries, monthTotals, oldestBalances } from "../lib/ledger";

export default function Reports() {
  const { customers, transactions } = useCustomers();
  const now = new Date();

  const totals = useMemo(() => monthTotals(transactions), [transactions]);
  const bars = useMemo(() => monthlySeries(transactions, 6), [transactions]);
  const oldest = useMemo(() => oldestBalances(customers, 3), [customers]);

  return (
    <div>
      <Header title="Ulat" subtitle={`${monthLong(now.getMonth())} ${now.getFullYear()}`} />
      <section className="content">
        <div className="report-summary">
          <div><small>Kabuuang utang</small><strong className="debt-text">{peso(totals.debt)}</strong><span>Ngayong buwan</span></div>
          <div><small>Mga bayad</small><strong className="paid-text">{peso(totals.paid)}</strong><span>Ngayong buwan</span></div>
        </div>

        <div className="chart-card">
          <div className="section-heading">
            <div><h2>Utang at bayad</h2><p>Buwanang galaw</p></div>
            <div className="legend">
              <span><i className="debt-bar" />Utang</span>
              <span><i className="paid-bar" />Bayad</span>
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
          <div><span className="eyebrow">Dapat kamustahin</span><h2>Pinakamatagal na balanse</h2></div>
        </div>
        {oldest.length > 0 ? (
          <div className="oldest-list">
            {oldest.map((c) => (
              <div key={c.id}>
                <Avatar name={c.name} />
                <span>
                  <strong>{c.name}</strong>
                  <small>{c.days === 0 ? "Ngayon nagsimula" : `${c.days} araw na`}</small>
                </span>
                <b>{peso(c.balance)}</b>
              </div>
            ))}
          </div>
        ) : (
          <div className="friendly-note">
            <div className="note-icon"><Avatar name="OK" /></div>
            <div><strong>Walang matagal na balanse</strong><p>Wala pang suki na may nakabinbing utang.</p></div>
          </div>
        )}
      </section>
    </div>
  );
}
