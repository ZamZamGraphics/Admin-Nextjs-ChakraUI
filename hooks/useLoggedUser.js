import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

function useLoggedUser() {
    const { data: session } = useSession()

    const [userId, setUserId] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (session?.userid) {
            setUserId(session.userid)
        }
    }, [session])

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchUser = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/users/${userId}`)
                if (!res.ok) throw new Error("Failed to fetch logged user")

                const data = await res.json()
                setUser(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [userId])

    return { session, userId, user, loading, error }
}

export default useLoggedUser
