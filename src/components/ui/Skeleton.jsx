/**
 * Generic skeleton block with configurable dimensions
 */
export function SkeletonBlock({ width = "100%", height = "16px", className = "", borderRadius = "12px" }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for circular elements (avatars, icons)
 */
export function SkeletonCircle({ size = 44, className = "" }) {
  return (
    <div
      className={`skeleton skeleton-round ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for pill-shaped elements (chips, badges)
 */
export function SkeletonPill({ width = "80px", height = "32px", className = "" }) {
  return (
    <div
      className={`skeleton skeleton-pill ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for text lines
 */
export function SkeletonText({ lines = 1, className = "", width = "100%" }) {
  return (
    <div className={className} style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: "16px",
            marginBottom: i < lines - 1 ? "8px" : 0,
            borderRadius: "8px",
            width: i === lines - 1 ? "70%" : "100%",
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for the Home page
 */
export function HomeSkeleton() {
  return (
    <div className="home-skeleton">
      {/* Header skeleton */}
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <div className="header-copy">
            <SkeletonText lines={2} width="60%" />
          </div>
          <SkeletonCircle size={44} />
        </div>
      </div>

      <section className="content">
        {/* Balance card skeleton */}
        <div className="balance-card skeleton" style={{ minHeight: "120px" }} />

        {/* Mini grid skeleton */}
        <div className="mini-grid">
          <SkeletonBlock className="mini-card" height="80px" />
          <SkeletonBlock className="mini-card" height="80px" />
        </div>

        {/* Section heading skeleton */}
        <div className="section-heading">
          <SkeletonText lines={2} width="50%" />
          <SkeletonBlock width="80px" height="24px" borderRadius="99px" />
        </div>

        {/* Customer list skeleton */}
        <div className="list-card stagger-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <CustomerRowSkeleton key={i} />
          ))}
        </div>

        {/* Friendly note skeleton */}
        <SkeletonBlock className="friendly-note" height="80px" />
      </section>
    </div>
  );
}

/**
 * Skeleton for a single customer row
 */
export function CustomerRowSkeleton() {
  return (
    <div className="customer-row">
      <SkeletonCircle size={44} />
      <div className="row-copy">
        <SkeletonText lines={2} width="70%" />
      </div>
      <div className="row-balance">
        <SkeletonText lines={2} width="80px" />
      </div>
    </div>
  );
}

/**
 * Skeleton for Customers page
 */
export function CustomersSkeleton() {
  return (
    <div className="customers-skeleton">
      {/* Header */}
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <div className="header-copy">
            <SkeletonText lines={2} width="60%" />
          </div>
          <SkeletonCircle size={44} />
        </div>
      </div>

      <section className="content">
        {/* Search */}
        <SkeletonBlock className="search" height="52px" borderRadius="18px" />

        {/* Filter chips */}
        <div className="chips" style={{ marginTop: "16px" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonPill key={i} width="auto" />
          ))}
        </div>

        {/* Customer list */}
        <div className="list-card stagger-list" style={{ marginTop: "16px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <CustomerRowSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Skeleton for Customer Detail page
 */
export function CustomerDetailSkeleton() {
  return (
    <div className="customer-detail-skeleton">
      {/* Header */}
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <button className="icon-button" style={{ visibility: "hidden" }} aria-hidden="true">
            <SkeletonCircle size={24} />
          </button>
          <div className="header-copy" style={{ flex: 1 }}>
            <SkeletonText lines={1} width="40%" />
          </div>
        </div>
      </div>

      <section className="content">
        {/* Customer hero */}
        <div className="customer-hero skeleton" style={{ minHeight: "160px" }} />

        {/* Action grid */}
        <div className="action-grid" style={{ marginTop: "16px" }}>
          <SkeletonBlock className="button button-primary" height="54px" borderRadius="18px" />
          <SkeletonBlock className="button button-secondary" height="54px" borderRadius="18px" />
        </div>

        {/* Section heading */}
        <div className="section-heading" style={{ marginTop: "24px" }}>
          <SkeletonText lines={2} width="50%" />
        </div>

        {/* Transaction timeline */}
        <div className="timeline stagger-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <TransactionRowSkeleton key={i} />
          ))}
        </div>

        {/* Reminder button */}
        <SkeletonBlock className="button button-ghost" height="54px" borderRadius="18px" width="100%" style={{ marginTop: "16px" }} />
      </section>
    </div>
  );
}

/**
 * Skeleton for a transaction row
 */
export function TransactionRowSkeleton() {
  return (
    <div className="transaction">
      <SkeletonCircle size={12} className="timeline-dot" />
      <div>
        <SkeletonText lines={2} width="60%" />
        <SkeletonText lines={1} width="40%" />
      </div>
      <SkeletonBlock width="80px" height="24px" borderRadius="99px" />
    </div>
  );
}

/**
 * Skeleton for Reports page
 */
export function ReportsSkeleton() {
  return (
    <div className="reports-skeleton">
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <div className="header-copy">
            <SkeletonText lines={1} width="40%" />
          </div>
        </div>
      </div>

      <section className="content">
        {/* Summary cards */}
        <div className="report-summary">
          <SkeletonBlock height="100px" borderRadius="20px" />
          <SkeletonBlock height="100px" borderRadius="20px" />
        </div>

        {/* Chart card */}
        <div className="chart-card skeleton" style={{ minHeight: "280px", marginTop: "16px" }} />

        {/* Oldest debts */}
        <div className="section-heading" style={{ marginTop: "24px" }}>
          <SkeletonText lines={2} width="50%" />
        </div>
        <div className="oldest-list stagger-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="customer-row">
              <SkeletonCircle size={44} />
              <div className="row-copy">
                <SkeletonText lines={2} width="70%" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Skeleton for Settings page
 */
export function SettingsSkeleton() {
  return (
    <div className="settings-skeleton">
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <div className="header-copy">
            <SkeletonText lines={1} width="40%" />
          </div>
        </div>
      </div>

      <section className="content settings-list">
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <div key={groupIndex} className="settings-group skeleton" style={{ minHeight: "120px" }} />
        ))}
      </section>
    </div>
  );
}

/**
 * Skeleton for Select Customer page
 */
export function SelectCustomerSkeleton() {
  return (
    <div className="select-customer-skeleton">
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <div className="header-copy">
            <SkeletonText lines={1} width="40%" />
          </div>
        </div>
      </div>

      <section className="content">
        <SkeletonBlock className="search" height="52px" borderRadius="18px" />
        <div className="list-card stagger-list" style={{ marginTop: "16px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <CustomerRowSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Skeleton for Add/Edit Customer page
 */
export function CustomerFormSkeleton() {
  return (
    <div className="customer-form-skeleton">
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <button className="icon-button" style={{ visibility: "hidden" }} aria-hidden="true">
            <SkeletonCircle size={24} />
          </button>
          <div className="header-copy" style={{ flex: 1 }}>
            <SkeletonText lines={1} width="50%" />
          </div>
        </div>
      </div>

      <section className="content form-stack">
        {/* Name field */}
        <div className="field">
          <SkeletonText lines={1} width="30%" />
          <SkeletonBlock height="56px" borderRadius="18px" />
        </div>

        {/* Phone field */}
        <div className="field">
          <SkeletonText lines={1} width="30%" />
          <SkeletonBlock height="56px" borderRadius="18px" />
        </div>

        {/* Notes field */}
        <div className="field">
          <SkeletonText lines={1} width="30%" />
          <SkeletonBlock height="100px" borderRadius="18px" />
        </div>

        {/* Save button */}
        <SkeletonBlock className="button button-primary button-full" height="54px" borderRadius="18px" style={{ marginTop: "16px" }} />
      </section>
    </div>
  );
}

/**
 * Skeleton for Add Debt page
 */
export function AddDebtSkeleton() {
  return (
    <div className="add-debt-skeleton">
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <button className="icon-button" style={{ visibility: "hidden" }} aria-hidden="true">
            <SkeletonCircle size={24} />
          </button>
          <div className="header-copy" style={{ flex: 1 }}>
            <SkeletonText lines={1} width="50%" />
          </div>
        </div>
      </div>

      <section className="content form-stack">
        {/* Amount entry */}
        <div className="amount-entry skeleton" style={{ minHeight: "80px", padding: "20px", background: "var(--paper)", borderRadius: "24px", border: "1px solid var(--line)" }} />

        {/* Note field */}
        <div className="field">
          <SkeletonText lines={1} width="30%" />
          <SkeletonBlock height="56px" borderRadius="18px" />
        </div>

        {/* Due date */}
        <div className="field">
          <SkeletonText lines={1} width="30%" />
          <SkeletonBlock height="56px" borderRadius="18px" />
        </div>

        {/* Save button */}
        <SkeletonBlock className="button button-primary button-full" height="54px" borderRadius="18px" style={{ marginTop: "16px" }} />
      </section>
    </div>
  );
}

/**
 * Skeleton for Record Payment page
 */
export function RecordPaymentSkeleton() {
  return (
    <div className="record-payment-skeleton">
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <button className="icon-button" style={{ visibility: "hidden" }} aria-hidden="true">
            <SkeletonCircle size={24} />
          </button>
          <div className="header-copy" style={{ flex: 1 }}>
            <SkeletonText lines={1} width="50%" />
          </div>
        </div>
      </div>

      <section className="content form-stack">
        {/* Amount entry */}
        <div className="amount-entry skeleton" style={{ minHeight: "80px", padding: "20px", background: "var(--paper)", borderRadius: "24px", border: "1px solid var(--line)" }} />

        {/* Note field */}
        <div className="field">
          <SkeletonText lines={1} width="30%" />
          <SkeletonBlock height="56px" borderRadius="18px" />
        </div>

        {/* Save button */}
        <SkeletonBlock className="button button-primary button-full" height="54px" borderRadius="18px" style={{ marginTop: "16px" }} />
      </section>
    </div>
  );
}

/**
 * Skeleton for Reminder page
 */
export function ReminderSkeleton() {
  return (
    <div className="reminder-skeleton">
      <div className="page-header" style={{ paddingTop: "28px" }}>
        <div className="header-line">
          <button className="icon-button" style={{ visibility: "hidden" }} aria-hidden="true">
            <SkeletonCircle size={24} />
          </button>
          <div className="header-copy" style={{ flex: 1 }}>
            <SkeletonText lines={1} width="50%" />
          </div>
        </div>
      </div>

      <section className="content form-stack">
        {/* Message preview */}
        <SkeletonBlock className="message-preview" height="160px" borderRadius="22px" />

        {/* Send button */}
        <SkeletonBlock className="button button-primary button-full" height="54px" borderRadius="18px" style={{ marginTop: "16px" }} />
      </section>
    </div>
  );
}

/**
 * Skeleton for Payment Success page
 */
export function PaymentSuccessSkeleton() {
  return (
    <div className="payment-success-skeleton" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "40px 20px" }}>
      <SkeletonCircle size={88} className="success-check" />
      <SkeletonText lines={2} width="80%" style={{ textAlign: "center" }} />
      <SkeletonBlock className="receipt" height="140px" borderRadius="22px" width="100%" style={{ maxWidth: "400px" }} />
      <SkeletonBlock className="button button-primary" height="54px" borderRadius="18px" width="200px" />
    </div>
  );
}

/**
 * Higher-order component to wrap a page with skeleton loading
 */
export function withSkeletonLoading(PageComponent, SkeletonComponent) {
  return function WithSkeletonLoading({ loading, ...props }) {
    if (loading) {
      return <SkeletonComponent />;
    }
    return <PageComponent {...props} />;
  };
}

/**
 * Hook to delay showing skeleton for better UX (avoids flickering on fast loads)
 */
import { useState, useEffect } from "react";

export function useDelayedLoading(loading, delay = 300) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (loading) {
      timeoutId = setTimeout(() => setShowLoading(true), delay);
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(timeoutId);
  }, [loading, delay]);

  return showLoading;
}