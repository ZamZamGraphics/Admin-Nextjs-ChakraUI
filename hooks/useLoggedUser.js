import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"

function useLoggedUser() {
    const { data: session } = useSession()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const userId = session?.userid;

    const fetchUser = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/users/${userId}`, {
                cache: "no-store",
            })
            if (!res.ok) throw new Error("Failed to fetch logged user")

            const data = await res.json()
            setUser(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [userId]);

    useEffect(() => {
        if (userId) fetchUser()
    }, [userId, fetchUser])

    return { user, loading, error, refresh: fetchUser }
}

export default useLoggedUser
