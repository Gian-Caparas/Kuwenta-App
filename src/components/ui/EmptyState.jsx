import Button from "./Button";
import Icon from "./Icon";
import { useTranslation } from "../../hooks/useTranslation";

export default function EmptyState({ onAdd }) {
  const { t } = useTranslation();
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        <span /><span /><span />
        <div><Icon name="users" size={34} /></div>
      </div>
      <h2>{t("customers.empty")}</h2>
      <p>{t("customers.emptyDesc")}</p>
      <Button onClick={onAdd} icon="plus" full={false}>{t("customers.addFirst")}</Button>
    </div>
  );
}