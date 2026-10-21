/**
 * Turns a Supabase auth error into a friendly Filipino message.
 * In development, the full error is also logged to the browser console.
 */
export function authErrorMessage(err, fallback) {
  if (import.meta.env.DEV) console.error("[auth]", err);

  const message = err instanceof Error ? err.message : "";
  const status = err?.status;

  if (status === 429 || /rate limit/i.test(message)) {
    return "Masyadong maraming subok. Maghintay ng ilang minuto bago subukan ulit.";
  }
  if (/already registered/i.test(message)) return "May account na gamit ang email na ito.";
  if (/not confirmed/i.test(message)) return "I-confirm muna ang email mo bago mag-login.";
  if (/password/i.test(message) && /(least|weak|short|characters)/i.test(message)) {
    return "Masyadong mahina ang password. Gumamit ng mas mahaba o mas komplikado.";
  }
  if (/signups? (are |is )?(not allowed|disabled)/i.test(message)) {
    return "Sarado muna ang pag-sign up sa ngayon.";
  }
  if (/failed to fetch|network/i.test(message)) {
    return "Walang koneksyon. Tingnan ang internet at subukan ulit.";
  }
  if (/api key|apikey|invalid.*key/i.test(message)) {
    return "May mali sa Supabase key. Tingnan ang .env file.";
  }
  return fallback;
}
