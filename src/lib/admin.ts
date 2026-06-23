import { cookies } from "next/headers";

export async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin")?.value === "true";
}
