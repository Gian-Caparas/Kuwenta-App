const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"];

export default function Keypad({ value, onChange }) {
  const press = (key) => {
    if (key === "back") {
      onChange(value.slice(0, -1));
    } else if (key === "." && (value.includes(".") || value === "")) {
      if (value === "") onChange("0.");
    } else {
      const next = (value + key).replace(/^0+(?=\d)/, "");
      const [, decimals = ""] = next.split(".");
      if (decimals.length <= 2) onChange(next.slice(0, 9));
    }
  };

  return (
    <div className="keypad">
      {keys.map((key) => (
        <button key={key} type="button" onClick={() => press(key)} aria-label={key === "back" ? "Burahin" : key}>
          {key === "back" ? "⌫" : key}
        </button>
      ))}
    </div>
  );
}
