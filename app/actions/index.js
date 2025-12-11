"use server"

export async function credentialLogin({ username, password, userAgent }) {
    try {
        const response = await fetch(`${process.env.API_URL}/v2/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": userAgent || "Unknown",
            },
            body: JSON.stringify({ username, password }),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            // API returned error
            return {
                success: false,
                message: data.message,
                errors: data.errors || {},
            }
        }

        return data
    } catch (err) {
        return { success: false, message: err.message || "Internal server error" }
    }
}

export async function verifyOTP({ userid, token, deviceId, userAgent }) {
    if (!userid || !token || !deviceId) {
        return { success: false, message: "Missing required OTP parameters" }
    }

    try {
        const response = await fetch(`${process.env.API_URL}/v2/auth/2fa/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": userAgent || "unknown",
            },
            body: JSON.stringify({ userid, token, deviceId }),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            return {
                success: false,
                message: data.message,
                errors: data.errors || {},
            }
        }

        return data
    } catch (err) {
        return { success: false, message: err.message || "Internal server error" }
    }
}
