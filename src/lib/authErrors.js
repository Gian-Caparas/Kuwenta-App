import { getTranslation } from "./translations";

/**
 * Turns a Supabase auth error into a friendly message based on the current language.
 * In development, the full error is also logged to the browser console.
 */
export function authErrorMessage(err, fallback, language = "filipino") {
  if (import.meta.env.DEV) console.error("[auth]", err);

  const message = err instanceof Error ? err.message : "";
  const status = err?.status;

  if (status === 429 || /rate limit/i.test(message)) {
    return getTranslation(language, "auth.rateLimited", "Too many attempts. Please wait a few minutes before trying again.");
  }
  if (/already registered/i.test(message)) return getTranslation(language, "auth.emailExists", "An account with this email already exists.");
  if (/not confirmed/i.test(message)) return getTranslation(language, "auth.emailNotConfirmed", "Please confirm your email before logging in.");
  if (/password/i.test(message) && /(least|weak|short|characters)/i.test(message)) {
    return getTranslation(language, "auth.weakPassword", "Password is too weak. Use a longer or more complex password.");
  }
  if (/signups? (are |is )?(not allowed|disabled)/i.test(message)) {
    return getTranslation(language, "auth.signupDisabled", "Sign up is currently disabled.");
  }
  if (/failed to fetch|network/i.test(message)) {
    return getTranslation(language, "auth.connectionError", "No connection. Check your internet and try again.");
  }
  if (/api key|apikey|invalid.*key/i.test(message)) {
    return getTranslation(language, "auth.invalidKey", "Invalid Supabase key. Check your .env file.");
  }
  return fallback;
}