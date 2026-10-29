import { signOut } from "@/auth";
import { apiFetch } from "@/utils/apiServer";

export async function GET() {
  await apiFetch("/v2/auth/logout")
  await signOut({ redirectTo: "/login?reason=session" });
}