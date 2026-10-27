import Icon from "./Icon";
import { useTranslation } from "../../hooks/useTranslation";

export default function Header({ title, subtitle, back, right }) {
  const { t } = useTranslation();
  return (
    <header className="page-header">
      <div className="header-line">
        {back && (
          <button className="icon-button" onClick={back} aria-label={t("common.close")}>
            <Icon name="arrowLeft" />
          </button>
        )}
        <div className="header-copy">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="weave" aria-hidden="true" />
    </header>
  );
}