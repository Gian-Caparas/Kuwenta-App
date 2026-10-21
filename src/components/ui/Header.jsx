import Icon from "./Icon";

export default function Header({ title, subtitle, back, right }) {
  return (
    <header className="page-header">
      <div className="header-line">
        {back && (
          <button className="icon-button" onClick={back} aria-label="Bumalik">
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
