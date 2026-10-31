import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import Icon from "./Icon";
import Button from "./Button";
import { shortDate, timeOfDay, peso } from "../../lib/format";
import { useNotifications } from "../../context/NotificationsContext";

export default function NotificationPanel({ isOpen, onClose }) {
  const { t, language } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, archiveNotification, iconForType, colorForType } = useNotifications();
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("active");
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusable?.[0];
    const lastFocusable = focusable?.[focusable.length - 1];
    firstFocusable?.focus();

    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }
    panel?.addEventListener('keydown', handleTab);
    return () => panel?.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const hasUnread = unreadCount > 0;

  const formatNotificationDate = (isoString) => {
    const date = new Date(isoString);
    return `${shortDate(date, language)} • ${timeOfDay(date)}`;
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    await markAsRead([id]);
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    await deleteNotification(id);
  };

  const handleArchive = async (id, e) => {
    e?.stopPropagation();
    await archiveNotification(id);
  };

  const handleMarkAllRead = async (e) => {
    e?.stopPropagation();
    await markAllAsRead();
  };

  const visibleNotifications = notifications.filter((notification) =>
    activeTab === "archived" ? notification.is_archived : !notification.is_archived
  );

  return (
    <div
      ref={panelRef}
      className="notification-panel-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("notifications.title", { default: "Notifications" })}
    >
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notification-panel-header">
          <div className="header-content">
            <h2>{t("notifications.title", { default: "Notifications" })}</h2>
            {hasUnread && (
              <span className="unread-badge" aria-label={t("notifications.unreadCount", { default: "{count} unread", count: unreadCount })}>
                {unreadCount}
              </span>
            )}
          </div>
          <div className="header-actions">
            {hasUnread && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                <Icon name="check" size={16} />
                <span>{t("notifications.markAllRead", { default: "Mark all read" })}</span>
              </Button>
            )}
            <button
              type="button"
              className="icon-button"
              onClick={onClose}
              aria-label={t("common.close", { default: "Close" })}
            >
              <Icon name="x" />
            </button>
          </div>
        </div>

        <div className="notification-tabs" role="tablist" aria-label={t("notifications.tabsLabel", { default: "Notification views" })}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "active"}
            className={activeTab === "active" ? "active" : ""}
            onClick={() => setActiveTab("active")}
          >
            {t("notifications.activeTab", { default: "Active" })}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "archived"}
            className={activeTab === "archived" ? "active" : ""}
            onClick={() => setActiveTab("archived")}
          >
            {t("notifications.archiveTab", { default: "Archive" })}
          </button>
        </div>

        {/* Content */}
        <div className="notification-panel-content">
          {visibleNotifications.length === 0 ? (
            <div className="notification-empty-state">
              <Icon name="bell" size={48} className="empty-icon" />
              <h3>{t(activeTab === "archived" ? "notifications.emptyArchiveTitle" : "notifications.emptyTitle", { default: activeTab === "archived" ? "No archived notifications" : "No notifications yet" })}</h3>
              <p>{t(activeTab === "archived" ? "notifications.emptyArchiveDesc" : "notifications.emptyDesc", { default: activeTab === "archived" ? "Archived notifications will appear here." : "You're all caught up! New activity will appear here." })}</p>
            </div>
          ) : (
            <div className="notification-list" role="list" aria-label={t("notifications.listLabel", { default: "Notification list" })}>
              {visibleNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isUnread={!notification.is_read}
                  isExpanded={expandedIds.has(notification.id)}
                  onToggleExpand={() => toggleExpanded(notification.id)}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  onArchive={handleArchive}
                  formatDate={formatNotificationDate}
                  icon={iconForType[notification.type]}
                  color={colorForType[notification.type]}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  isUnread,
  isExpanded,
  onToggleExpand,
  onMarkAsRead,
  onDelete,
  onArchive,
  formatDate,
  icon,
  color,
  t,
}) {
  return (
    <article
      className={`notification-item ${isUnread ? 'unread' : 'read'} ${isExpanded ? 'expanded' : ''}`}
      role="listitem"
    >
      <div className="notification-main" onClick={onToggleExpand}>
        <div className="notification-icon" style={{ backgroundColor: `${color}20`, color }}>
          <Icon name={icon} size={20} />
        </div>
        <div className="notification-content">
          <div className="notification-header">
            <h4 className="notification-title">{notificationTitle(notification, t)}</h4>
            <time className="notification-time" dateTime={notification.created_at}>
              {formatDate(notification.created_at)}
            </time>
          </div>
          <p className="notification-message">{notificationMessage(notification, t)}</p>
          {notification.metadata && isExpanded && (
            <div className="notification-metadata">
              {notification.metadata.customer_name && (
                <span className="meta-item">
                  <Icon name="user" size={14} />
                  <span>{notification.metadata.customer_name}</span>
                </span>
              )}
              {notification.metadata.amount && (
                <span className="meta-item">
                  <Icon name="peso" size={14} />
                  <span>{peso(notification.metadata.amount)}</span>
                </span>
              )}
              {notification.metadata.remaining_balance !== undefined && (
                <span className="meta-item">
                  <Icon name="wallet" size={14} />
                  <span>{t("notifications.remainingBalance", { default: "Remaining: {balance}", balance: peso(notification.metadata.remaining_balance) })}</span>
                </span>
              )}
              {notification.metadata.due_date && (
                <span className="meta-item">
                  <Icon name="calendar" size={14} />
                  <span>{t("notifications.dueDate", { default: "Due: {date}", date: formatDate(notification.metadata.due_date) })}</span>
                </span>
              )}
            </div>
          )}
        </div>
        {isUnread && <span className="unread-indicator" aria-label={t("notifications.unread", { default: "Unread" })} />}
        <Icon name={isExpanded ? "chevronUp" : "chevronDown"} size={20} className="expand-icon" />
      </div>

      <div className="notification-actions">
        {isUnread && (
          <button
            type="button"
            className="action-button mark-read"
            onClick={(e) => onMarkAsRead(notification.id, e)}
            aria-label={t("notifications.markRead", { default: "Mark as read" })}
          >
            <Icon name="check" size={16} />
            <span>{t("notifications.markRead", { default: "Mark read" })}</span>
          </button>
        )}
        <button
          type="button"
          className="action-button delete"
          onClick={(e) => onDelete(notification.id, e)}
          aria-label={t("notifications.delete", { default: "Delete" })}
        >
          <Icon name="trash" size={16} />
          <span>{t("notifications.delete", { default: "Delete" })}</span>
        </button>
        {!notification.is_archived && (
          <button
            type="button"
            className="action-button archive"
            onClick={(e) => onArchive(notification.id, e)}
            aria-label={t("notifications.archive", { default: "Archive" })}
          >
            <Icon name="archive" size={16} />
            <span>{t("notifications.archive", { default: "Archive" })}</span>
          </button>
        )}
      </div>
    </article>
  );
}

function notificationTitle(notification, t) {
  if (notification.type === "transaction_created") {
    return t(notification.metadata?.transaction_type === "payment" ? "notifications.paymentRecorded" : "notifications.debtRecorded", {
      default: notification.metadata?.transaction_type === "payment" ? "Payment recorded" : "New debt recorded",
    });
  }
  if (notification.type === "payment_received") {
    return t("notifications.paymentReceived", { default: "Payment received" });
  }
  if (notification.type === "expected_payment_today") {
    return t("notifications.paymentExpected", { default: "Payment expected today" });
  }
  return notification.title;
}

function notificationMessage(notification, t) {
  const customerName = notification.metadata?.customer_name;
  const amount = notification.metadata?.amount;
  if (customerName && amount !== undefined && ["transaction_created", "payment_received", "expected_payment_today"].includes(notification.type)) {
    return t("notifications.activityMessage", {
      default: "{name} — {amount}",
      name: customerName,
      amount: peso(amount),
    });
  }
  return notification.message;
}