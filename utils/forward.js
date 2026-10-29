import "server-only";
import { headers } from "next/headers";

export async function forwardHeaders({ json = true } = {}) {
  const h = await headers();
  const ua = h.get("user-agent") || "";
  const ip = h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0].trim() || "";

  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    "Accept-Language": h.get("accept-language") || "",
    "X-Internal-Secret": process.env.INTERNAL_SECRET,
    "X-Real-Client-IP": ip,
    "X-Real-Client-UA": ua,
  };
}
