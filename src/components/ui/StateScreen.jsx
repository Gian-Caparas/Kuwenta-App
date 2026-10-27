import Button from "./Button";
import { useTranslation } from "../../hooks/useTranslation";

export function LoadingState({ text }) {
  const { t } = useTranslation();
  return (
    <div className="state-screen">
      <span className="spinner spinner-dark" />
      <p>{text || t("common.loading")}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const { t } = useTranslation();
  const missingTable = error?.code === "42P01" || error?.code === "PGRST205";
  return (
    <div className="state-screen">
      <h2>{t("common.error")}</h2>
      <p>
        {missingTable
          ? "Database not set up yet. Run supabase/schema.sql in Supabase SQL Editor."
          : t("auth.connectionError")}
      </p>
      <Button onClick={onRetry} full={false}>{t("common.confirm")}</Button>
    </div>
  );
}