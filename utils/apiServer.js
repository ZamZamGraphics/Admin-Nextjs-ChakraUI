import "server-only";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { forwardHeaders } from "./forward";
import { getAccessToken } from "@/lib/serverToken";

const API_URL = process.env.API_URL;

export async function apiFetch(path, options = {}) {
  
  if (!API_URL) {
    return NextResponse.json(
      { message: "Backend API URL is not configured" },
      { status: 500 }
    );
  }

  const accessToken = await getAccessToken();
  const h = await headers();
  const { headers: extra = {}, body, ...rest } = options;

  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const isStream = typeof ReadableStream !== "undefined" && body instanceof ReadableStream;

  const custom = Object.fromEntries(
    Object.entries(extra).filter(([k]) => !(isForm && k.toLowerCase() === "content-type"))
  );
  const hasCustomType = Object.keys(custom).some((k) => k.toLowerCase() === "content-type");
  const useJsonDefault = typeof body === "string" && !hasCustomType;

  return fetch(`${API_URL}${path}`, {
    ...rest,
    body,
    ...(isStream ? { duplex: "half" } : {}),
    cache: "no-store",
    headers: {
      ...(useJsonDefault ? { "Content-Type": "application/json" } : {}),
      ...custom,
      ...(await forwardHeaders({ json: false })),
      Authorization: `Bearer ${accessToken}`,
      Cookie: h.get("cookie") || "",
    },
  });
}
