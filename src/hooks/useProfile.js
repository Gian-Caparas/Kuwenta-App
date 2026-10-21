import { useAuth } from "../auth/AuthContext";

export function useProfile() {
  const { session } = useAuth();
  const meta = session?.user.user_metadata ?? {};
  return {
    storeName: meta.store_name || "Aking Tindahan",
    fullName: meta.full_name || "",
    email: session?.user.email ?? "",
  };
}
