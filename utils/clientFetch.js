"use client";
let expired = false;

const API_PREFIX = "/v2";

export async function api(path, options = {}) {
  const { json, ...rest } = options;
  const isForm = rest.body instanceof FormData;

  const res = await fetch(`/api${path}`, {
    ...rest,
    credentials: "same-origin",
    headers: {
      ...(json !== undefined || (rest.body && !isForm)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(rest.headers || {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (
    res.status === 401 &&
    res.headers.get("x-session-expired") === "1" &&
    !expired &&
    typeof window !== "undefined" &&
    !window.location.pathname.startsWith("/login")
  ) {
    expired = true;
    window.location.replace("/login?reason=session");
  }
  return res;
}

export async function clientFetch(apiPath, queryString = {}, options = {}) {
  const { limit = 10, page = 1, search, from, to, ...rest } = queryString;

  const params = new URLSearchParams();
  if (limit) params.set("limit", limit);
  if (page != null) params.set("page", page);
  if (search) params.set("search", search);
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined && v !== null && v !== "") params.set(k, v);
  }

  const clean = String(apiPath).replace(/^\/+/, "");
  const path = clean.startsWith("v2/") ? `/${clean}` : `${API_PREFIX}/${clean}`;
  const qs = params.toString();

  const res = await api(`${path}${qs ? `?${qs}` : ""}`, {
    method: "GET",
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Fetch failed with status ${res.status}`);
  }
  return res.json();
}
