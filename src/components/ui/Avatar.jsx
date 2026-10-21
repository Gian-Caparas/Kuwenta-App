export default function Avatar({ name, large = false }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return <div className={`avatar ${large ? "avatar-large" : ""}`}>{initials}</div>;
}
