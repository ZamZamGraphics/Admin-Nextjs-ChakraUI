"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clientFetch } from "@/utils/client-fetch";

export function useFetchData(apiPath, limit) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchParams = useSearchParams()
    const queryString = useMemo(() => {
        return {
            page: Number(searchParams.get("page")) || 1,
            limit: Number(searchParams.get("limit")) || limit,
            search: searchParams.get("search") || "",
            from: searchParams.get("from") || "",
            to: searchParams.get("to") || ""
        };
    }, [searchParams, limit]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await clientFetch(apiPath, queryString)
            setData(response)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false);
        }
    }, [apiPath, queryString])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData, setData };
}
