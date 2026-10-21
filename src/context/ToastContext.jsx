import { createContext, useCallback, useContext, useRef, useState } from "react";
import Icon from "../components/ui/Icon";

const ToastContext = createContext({ notify: () => {} });

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(undefined);

  const notify = useCallback((message, tone = "success") => {
    setToast({ message, tone });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {toast && (
        <div className={`toast ${toast.tone === "error" ? "toast-error" : ""}`} role="status">
          <span><Icon name={toast.tone === "error" ? "bell" : "check"} size={18} /></span>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
