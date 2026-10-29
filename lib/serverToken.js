import "server-only";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";

const isProd = process.env.NODE_ENV === "production";
const COOKIE_NAME = `${isProd ? "__Secure-" : ""}authjs.session-token`;

export async function getAccessToken() {
  const h = await headers();
  const cookie = h.get("cookie") || "";
  if (!cookie) return null;

  const token = await getToken({
    req: { headers: new Headers({ cookie }) },
    secret: process.env.AUTH_SECRET,
    secureCookie: isProd,
    cookieName: COOKIE_NAME,
    salt: COOKIE_NAME,
  });

  return token?.accessToken || null;
}
