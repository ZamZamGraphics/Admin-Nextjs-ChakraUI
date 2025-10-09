
export const clientFetch = async (apiPath, queryString = {}) => {
    const { limit = 10, page = 1, search, from, to } = queryString;

    const query = [
        limit && `limit=${limit}`,
        page != null && `page=${page}`,
        search && `search=${search}`,
        from && `from=${from}`,
        to && `to=${to}`,
    ].filter(Boolean).join("&");

    const res = await fetch(
        `/api/${apiPath}${query ? "?" + query : ""}`,
        { credentials: "include" }
    );

    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
    return res.json();
};
