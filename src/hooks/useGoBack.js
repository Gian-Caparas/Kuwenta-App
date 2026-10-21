import { useNavigate } from "react-router-dom";

/** Go back in history when possible, otherwise go to a fallback path. */
export function useGoBack(fallback) {
  const navigate = useNavigate();
  return () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
}
