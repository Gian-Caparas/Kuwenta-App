const configuredAppUrl = import.meta.env.VITE_APP_URL?.trim();

export function getAuthRedirectUrl(path = "/reset-password") {
  const appUrl = configuredAppUrl || window.location.origin;
  return new URL(path, `${appUrl.replace(/\/+$/, "")}/`).toString();
}
