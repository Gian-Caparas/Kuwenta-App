import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { buildLedger } from "../lib/ledger";
import { supabase } from "../lib/supabase";

const CustomersContext = createContext(null);
const PAGE_SIZE = 1000; // Supabase returns at most 1000 rows per request

async function fetchAll(table) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
  }
  return rows;
}

export function CustomersProvider({ children }) {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [rawCustomers, setRawCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [customerRows, transactionRows] = await Promise.all([
        fetchAll("customers"),
        fetchAll("transactions"),
      ]);
      setRawCustomers(customerRows);
      setTransactions(transactionRows);
    } catch (err) {
      if (import.meta.env.DEV) console.error("[data]", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) reload();
  }, [userId, reload]);

  const customers = useMemo(() => buildLedger(rawCustomers, transactions), [rawCustomers, transactions]);

  const getCustomer = useCallback((id) => customers.find((c) => c.id === id), [customers]);

  const addCustomer = useCallback(async ({ name, phone, notes }) => {
    const { data, error: insertError } = await supabase
      .from("customers")
      .insert({ name, phone: phone || null, notes: notes || null })
      .select()
      .single();
    if (insertError) throw insertError;
    setRawCustomers((list) => [...list, data]);
    return data;
  }, []);

  const updateCustomer = useCallback(async (id, { name, phone, notes }) => {
    const { data, error: updateError } = await supabase
      .from("customers")
      .update({ name, phone: phone || null, notes: notes || null })
      .eq("id", id)
      .select()
      .single();
    if (updateError) throw updateError;
    setRawCustomers((list) => list.map((customer) => (customer.id === id ? data : customer)));
    return data;
  }, []);

  const addTransaction = useCallback(async (customerId, type, amount, note) => {
    const { data, error: insertError } = await supabase
      .from("transactions")
      .insert({ customer_id: customerId, type, amount, note: note || null })
      .select()
      .single();
    if (insertError) throw insertError;
    setTransactions((list) => [...list, data]);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      customers,
      transactions,
      loading,
      error,
      reload,
      getCustomer,
      addCustomer,
      updateCustomer,
      addTransaction,
    }),
    [customers, transactions, loading, error, reload, getCustomer, addCustomer, updateCustomer, addTransaction]
  );

  return <CustomersContext.Provider value={value}>{children}</CustomersContext.Provider>;
}

export function useCustomers() {
  const ctx = useContext(CustomersContext);
  if (!ctx) throw new Error("useCustomers must be used inside <CustomersProvider>");
  return ctx;
}
