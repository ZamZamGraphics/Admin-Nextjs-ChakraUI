import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signOut } from "@/auth";
import { apiFetch } from "@/utils/apiServer";
import { getAccessToken } from "@/lib/serverToken";

const ALLOWED = /^\/v2\/(?!auth\/(login|2fa))[a-zA-Z0-9\-_/]*$/;
const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

async function expire() {
  try { await signOut({ redirect: false }); } catch {}
  (await cookies()).delete("__Host-dbind");
  return new NextResponse(JSON.stringify({ message: "Session expired" }), {
    status: 401,
    headers: { "Content-Type": "application/json", "x-session-expired": "1" },
  });
}

async function handler(req, { params }) {
  const { path } = await params;
  const target = "/" + path.join("/");

  if (!ALLOWED.test(target) || target.includes("..")) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (MUTATING.has(req.method)) {
    const origin = req.headers.get("origin");
    if (origin !== new URL(req.url).origin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  }

  if (!(await getAccessToken())) return expire();
  
  const search = new URL(req.url).search;
  const hasBody = !["GET", "HEAD"].includes(req.method);
  const contentType = req.headers.get("content-type");

  const res = await apiFetch(`${target}${search}`, {
    method: req.method,
    headers: contentType ? { "Content-Type": contentType } : {},
    body: hasBody ? req.body : undefined,
    ...(hasBody ? { duplex: "half" } : {}),
  });

  if (res.status === 401) return expire();

  const out = new NextResponse(res.body, { status: res.status });
  for (const k of ["content-type", "content-disposition", "cache-control"]) {
    const v = res.headers.get(k);
    if (v) out.headers.set(k, v);
  }
  return out;
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
