"use server"

export async function ceredntialLogin(formData) {
    try {
        const username = formData.get("username")
        const password = formData.get("password")

        const response = await fetch(`${process.env.API_URL}/v2/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Internal Server Error");
    }
}
