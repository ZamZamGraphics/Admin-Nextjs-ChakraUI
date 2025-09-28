import { cookies } from "next/headers";

export const serverFetch = async (apiPath, queryString = {}) => {
    const { limit = 10, page = 1, search, from, to } = queryString;

    const query = [
        limit && `limit=${limit}`,
        page != null && `page=${page}`,
        search && `search=${search}`,
        from && `from=${from}`,
        to && `to=${to}`,
    ].filter(Boolean).join("&");

    const cookieString = (await cookies())
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/${apiPath}${query ? "?" + query : ""}`,
        { headers: { Cookie: cookieString } }
    );

    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
    return res.json();
};

export const serverFetchById = async (apiPath, id) => {
    const cookieString = (await cookies())
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/${apiPath}/${id}`,
        { headers: { Cookie: cookieString } }
    );

    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
    return res.json();
};
