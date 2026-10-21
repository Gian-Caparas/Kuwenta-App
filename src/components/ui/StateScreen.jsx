import Button from "./Button";

export function LoadingState({ text = "Kinukuha ang listahan..." }) {
  return (
    <div className="state-screen">
      <span className="spinner spinner-dark" />
      <p>{text}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const missingTable = error?.code === "42P01" || error?.code === "PGRST205";
  return (
    <div className="state-screen">
      <h2>Hindi makuha ang data</h2>
      <p>
        {missingTable
          ? "Hindi pa naka-setup ang database. Patakbuhin ang supabase/schema.sql sa Supabase SQL Editor."
          : "Tingnan ang internet mo at subukan ulit."}
      </p>
      <Button onClick={onRetry} full={false}>Subukan ulit</Button>
    </div>
  );
}
