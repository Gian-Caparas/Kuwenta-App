import { OVERDUE_DAYS } from "../config";
import { daysSince, monthShort } from "./format";

/**
 * Combines customers + transactions into ledger entries:
 * { ...customer, balance, status, lastActivity, owedSince, transactions (newest first) }
 */
export function buildLedger(customers, transactions) {
  const map = new Map(
    customers.map((customer) => [
      customer.id,
      { ...customer, balance: 0, lastActivity: null, owedSince: null, transactions: [] },
    ])
  );

  const ordered = [...transactions].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  for (const t of ordered) {
    const entry = map.get(t.customer_id);
    if (!entry) continue;

    const amount = Number(t.amount);
    const before = entry.balance;
    const after = Math.max(0, Math.round((before + (t.type === "debt" ? amount : -amount)) * 100) / 100);

    if (before <= 0 && after > 0) entry.owedSince = t.created_at;
    if (after <= 0) entry.owedSince = null;

    entry.balance = after;
    entry.lastActivity = t.created_at;
    entry.transactions.push(t);
  }

  return [...map.values()]
    .map((entry) => {
      let status = "active";
      if (entry.balance <= 0) status = "paid";
      else if (daysSince(entry.owedSince) >= OVERDUE_DAYS) status = "overdue";
      return { ...entry, status, transactions: entry.transactions.slice().reverse() };
    })
    .sort(
      (a, b) =>
        new Date(b.lastActivity ?? b.created_at) - new Date(a.lastActivity ?? a.created_at)
    );
}

const sumBy = (rows, type) =>
  rows.filter((t) => t.type === type).reduce((sum, t) => sum + Number(t.amount), 0);

const inMonth = (date, reference) => {
  const d = new Date(date);
  return d.getFullYear() === reference.getFullYear() && d.getMonth() === reference.getMonth();
};

/** Numbers for the Home screen. */
export function summarize(customers, transactions) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const thisMonth = transactions.filter((t) => inMonth(t.created_at, now));
  const overdue = customers.filter((c) => c.status === "overdue");

  return {
    total: customers.reduce((sum, c) => sum + c.balance, 0),
    overdueCount: overdue.length,
    overdueTotal: overdue.reduce((sum, c) => sum + c.balance, 0),
    paidThisWeek: sumBy(
      transactions.filter((t) => new Date(t.created_at) >= weekAgo),
      "payment"
    ),
    netThisMonth: sumBy(thisMonth, "debt") - sumBy(thisMonth, "payment"),
  };
}

/** Totals for the current month (Ulat screen). */
export function monthTotals(transactions, reference = new Date()) {
  const rows = transactions.filter((t) => inMonth(t.created_at, reference));
  return { debt: sumBy(rows, "debt"), paid: sumBy(rows, "payment") };
}

/** Last `months` months of utang vs bayad, with bar heights as percentages. */
export function monthlySeries(transactions, months = 6, language = "filipino") {
  const now = new Date();
  const series = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const rows = transactions.filter((t) => inMonth(t.created_at, ref));
    series.push({ key: `${ref.getFullYear()}-${ref.getMonth()}`, label: monthShort(ref.getMonth(), language), debt: sumBy(rows, "debt"), paid: sumBy(rows, "payment") });
  }

  const max = Math.max(1, ...series.map((s) => Math.max(s.debt, s.paid)));
  return series.map((s) => ({ ...s, debtPct: Math.round((s.debt / max) * 100), paidPct: Math.round((s.paid / max) * 100) }));
}

/** Customers who have owed the longest. */
export function oldestBalances(customers, count = 3) {
  return customers
    .filter((c) => c.balance > 0 && c.owedSince)
    .sort((a, b) => new Date(a.owedSince) - new Date(b.owedSince))
    .slice(0, count)
    .map((c) => ({ ...c, days: daysSince(c.owedSince) }));
}