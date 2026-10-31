import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";

const NotificationsContext = createContext(null);

const NOTIFICATION_TYPES = {
  TRANSACTION_CREATED: 'transaction_created',
  PAYMENT_RECEIVED: 'payment_received',
  EXPECTED_PAYMENT_TODAY: 'expected_payment_today',
  SOFTWARE_UPDATE: 'software_update',
};

const NOTIFICATION_ICONS = {
  transaction_created: 'wallet',
  payment_received: 'wallet',
  expected_payment_today: 'bell',
  software_update: 'info',
};

const NOTIFICATION_COLORS = {
  transaction_created: 'var(--green-700)',
  payment_received: 'var(--green-700)',
  expected_payment_today: 'var(--amber)',
  software_update: 'var(--green-700)',
};

export function NotificationsProvider({ children }) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);
  const expectedPaymentsRef = useRef(new Set()); // Track which customers already have expected payment notifications today

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    if (!userId || !supabase) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const normalized = (data || []).map((notification) => ({
        ...notification,
        is_archived: notification.is_archived ?? Boolean(notification.metadata?.archived),
      }));
      setNotifications(normalized);
      setUnreadCount(normalized.filter(n => !n.is_read && !n.is_archived).length);
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Notifications] Fetch error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!userId || !supabase) return;

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = {
            ...payload.new,
            is_archived: payload.new.is_archived ?? Boolean(payload.new.metadata?.archived),
          };
          setNotifications((prev) => [newNotification, ...prev]);
          if (!newNotification.is_archived) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = {
            ...payload.new,
            is_archived: payload.new.is_archived ?? Boolean(payload.new.metadata?.archived),
          };
          setNotifications((prev) => {
            const next = prev.map((n) => (n.id === updated.id ? updated : n));
            setUnreadCount(next.filter((n) => !n.is_read && !n.is_archived).length);
            return next;
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, fetchNotifications]);

  // Check for expected payments today (customers with due_date = today)
  useEffect(() => {
    if (!userId || !supabase) return;

    const checkExpectedPayments = async () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Get customers with due_date = today who have balance > 0
      const { data: customers, error } = await supabase
        .from('customers')
        .select('id, name, balance')
        .eq('user_id', userId);

      if (error) {
        if (import.meta.env.DEV) console.error('[Notifications] Expected payments check error:', error);
        return;
      }

      // Get transactions with due_date = today
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('id, customer_id, amount, due_date')
        .eq('user_id', userId)
        .eq('type', 'debt');

      if (txError) {
        if (import.meta.env.DEV) console.error('[Notifications] Transactions check error:', txError);
        return;
      }

      // Find debts due today
      const debtsDueToday = (transactions || []).filter(t => {
        if (!t.due_date) return false;
        const dueDate = new Date(t.due_date).toISOString().split('T')[0];
        return dueDate === todayStr;
      });

      for (const debt of debtsDueToday) {
        const customer = (customers || []).find(c => c.id === debt.customer_id);
        if (!customer || customer.balance <= 0) continue;

        const key = `${debt.customer_id}-${debt.id}-${todayStr}`;
        if (expectedPaymentsRef.current.has(key)) continue;

        expectedPaymentsRef.current.add(key);

        // Create expected payment notification
        await supabase.from('notifications').insert({
          user_id: userId,
          type: NOTIFICATION_TYPES.EXPECTED_PAYMENT_TODAY,
          title: 'Inaasahang bayad ngayon',
          message: `${customer.name} — ${debt.amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 })}`,
          reference_id: debt.customer_id,
          reference_type: 'customer',
          metadata: {
            customer_name: customer.name,
            amount: debt.amount,
            due_date: debt.due_date,
            transaction_id: debt.id,
          },
        });
      }
    };

    checkExpectedPayments();
    // Check every hour
    const interval = setInterval(checkExpectedPayments, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userId]);

  // Create notification helper
  const createNotification = useCallback(async ({
    type,
    title,
    message,
    referenceId,
    referenceType,
    metadata = {},
  }) => {
    if (!userId || !supabase) return null;

    try {
      // Check for recent duplicate (within 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('type', type)
        .eq('reference_id', referenceId)
        .eq('reference_type', referenceType)
        .gt('created_at', oneHourAgo)
        .limit(1);

      if (existing && existing.length > 0) {
        return existing[0].id; // Already exists
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          reference_id: referenceId,
          reference_type: referenceType,
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data?.id;
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Notifications] Create error:', err);
      return null;
    }
  }, [userId]);

  // Mark specific notifications as read
  const markAsRead = useCallback(async (ids) => {
    if (!userId || !supabase || !ids?.length) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', ids)
        .eq('user_id', userId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (ids.includes(n.id) ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - ids.filter((id) => {
        const n = notifications.find((x) => x.id === id);
        return n && !n.is_read;
      }).length));
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Notifications] Mark read error:', err);
    }
  }, [userId, notifications]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!userId || !supabase) return;

    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      if (!unreadIds.length) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', unreadIds)
        .eq('user_id', userId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Notifications] Mark all read error:', err);
    }
  }, [userId, notifications]);

  // Delete notification
  const deleteNotification = useCallback(async (id) => {
    if (!userId || !supabase) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setNotifications((prev) => {
        const notification = prev.find(n => n.id === id);
        const newPrev = prev.filter(n => n.id !== id);
        if (notification && !notification.is_read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return newPrev;
      });
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Notifications] Delete error:', err);
    }
  }, [userId]);

  const archiveNotification = useCallback(async (id) => {
    if (!userId || !supabase) return;

    try {
      let { error } = await supabase
        .from('notifications')
        .update({ is_archived: true })
        .eq('id', id)
        .eq('user_id', userId);

      if (error && ['42703', 'PGRST204'].includes(error.code)) {
        const notification = notifications.find((item) => item.id === id);
        const metadata = { ...(notification?.metadata || {}), archived: true };
        ({ error } = await supabase
          .from('notifications')
          .update({ metadata })
          .eq('id', id)
          .eq('user_id', userId));
      }

      if (error) throw error;

      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === id);
        if (notification && !notification.is_read && !notification.is_archived) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return prev.map((n) => (n.id === id ? { ...n, is_archived: true } : n));
      });
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Notifications] Archive error:', err);
    }
  }, [userId, notifications]);

  // Notification creators for specific events
  const notifyTransactionCreated = useCallback(async (transaction, customer) => {
    const isDebt = transaction.type === 'debt';
    return createNotification({
      type: NOTIFICATION_TYPES.TRANSACTION_CREATED,
      title: isDebt ? 'Bagong utang naitala' : 'Bagong bayad naitala',
      message: `${customer.name} — ${Number(transaction.amount).toLocaleString('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 })}`,
      referenceId: transaction.id,
      referenceType: 'transaction',
      metadata: {
        customer_name: customer.name,
        amount: transaction.amount,
        transaction_type: transaction.type,
        due_date: transaction.due_date,
      },
    });
  }, [createNotification]);

  const notifyPaymentReceived = useCallback(async (transaction, customer) => {
    return createNotification({
      type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
      title: 'Bayad natanggap',
      message: `${customer.name} — ${Number(transaction.amount).toLocaleString('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 })} (Balanse: ${Number(customer.balance || 0).toLocaleString('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 })})`,
      referenceId: transaction.id,
      referenceType: 'transaction',
      metadata: {
        customer_name: customer.name,
        amount: transaction.amount,
        remaining_balance: customer.balance || 0,
      },
    });
  }, [createNotification]);

  const notifySoftwareUpdate = useCallback(async (title, message, metadata = {}) => {
    return createNotification({
      type: NOTIFICATION_TYPES.SOFTWARE_UPDATE,
      title,
      message,
      referenceId: crypto.randomUUID(),
      referenceType: 'system',
      metadata,
    });
  }, [createNotification]);

  // Memoized helpers for components
  const iconForType = useMemo(() => NOTIFICATION_ICONS, []);
  const colorForType = useMemo(() => NOTIFICATION_COLORS, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      createNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      archiveNotification,
      notifyTransactionCreated,
      notifyPaymentReceived,
      notifySoftwareUpdate,
      iconForType,
      colorForType,
      NOTIFICATION_TYPES,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      createNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      archiveNotification,
      notifyTransactionCreated,
      notifyPaymentReceived,
      notifySoftwareUpdate,
      iconForType,
      colorForType,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return ctx;
}