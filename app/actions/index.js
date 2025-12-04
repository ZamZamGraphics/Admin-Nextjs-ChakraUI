"use server"

export async function ceredntialLogin(formData) {
    try {
        const username = formData.get("username")
        const password = formData.get("password")
        const userAgent = formData.get("userAgent")

        const response = await fetch(`${process.env.API_URL}/v2/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': userAgent
            },
            body: JSON.stringify({ username, password }),
        })
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Internal Server Error");
    }
}

export async function verifyOTP({ userid, token, deviceId, userAgent }) {
    try {
        const response = await fetch(`${process.env.API_URL}/v2/auth/2fa/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': userAgent
            },
            body: JSON.stringify({ userid, token, deviceId }),
        })
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Internal Server Error");
    }
}
