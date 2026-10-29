"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { clientFetch } from "@/utils/clientFetch";

export default function useApi(
  apiPath,
  query = {},
  { 
    initialData = null, 
    enabled = true, 
    syncUrl = true, 
    limit = 10,
    forward = [], 
  } = {},
) {
  const searchParams = useSearchParams();
  const queryKey = JSON.stringify(query);
  const forwardKey = forward.join(",");

  const paramsKey = useMemo(() => {
    if (!syncUrl) return "";
    return [...searchParams.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
  }, [searchParams, syncUrl]);

  const finalKey = useMemo(() => {
    const base = JSON.parse(queryKey);
    if (!syncUrl) return JSON.stringify(base);

    const sp = new URLSearchParams(paramsKey);
    const extra = {};
    for (const k of forwardKey ? forwardKey.split(",") : []) {
      if (sp.get(k)) extra[k] = sp.get(k);
    }

    return JSON.stringify({
      ...base,
      ...extra,
      page: Number(sp.get("page")) || base.page || 1,
      limit: Number(sp.get("limit")) || base.limit || limit,
      search: sp.get("search") || base.search || "",
      from: sp.get("from") || base.from || "",
      to: sp.get("to") || base.to || "",
    });
  }, [queryKey, paramsKey, syncUrl, limit, forwardKey]);

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const json = await clientFetch(apiPath, JSON.parse(finalKey), {
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setData(json);
      return json;
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Something went wrong");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [apiPath, finalKey]);

  useEffect(() => {
    if (!enabled) return;
    fetchData();
    return () => controllerRef.current?.abort();
  }, [fetchData, enabled, paramsKey]);

  return { data, loading, error, refetch: fetchData, setData };
}
