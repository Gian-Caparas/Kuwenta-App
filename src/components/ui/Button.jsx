import Icon from "./Icon";

/** variant: "primary" | "secondary" | "danger" | "ghost" */
export default function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  disabled,
  full = true,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`button button-${variant} ${full ? "button-full" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={20} />}
      <span>{children}</span>
    </button>
  );
}
