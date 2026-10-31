import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({
  session: null,
  loading: true,
  recovery: false,
  authLinkError: null,
  finishRecovery: () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);
  const [authLinkError, setAuthLinkError] = useState(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const linkError = hashParams.get("error_code") || hashParams.get("error");
    if (linkError) {
      setAuthLinkError(linkError);
      window.history.replaceState(
        window.history.state,
        document.title,
        `${window.location.pathname}${window.location.search}`
      );
    }

    const recoveryLink =
      hashParams.get("type") === "recovery" && hashParams.has("access_token");
    if (recoveryLink) setRecovery(true);

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        recovery,
        authLinkError,
        finishRecovery: () => setRecovery(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
