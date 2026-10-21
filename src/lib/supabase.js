import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

// Placeholder values keep the app from crashing when .env is missing;
// main.jsx shows a setup notice instead of the app in that case.
export const supabase = createClient(url || "http://localhost:54321", key || "missing-key");
