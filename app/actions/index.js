"use server";
import { cookies } from "next/headers";
import { forwardHeaders } from "@/utils/forward";
import { apiFetch } from "@/utils/apiServer";

const API = process.env.API_URL;
const BIND = "__Host-dbind";

async function setBindCookie(res) {
  const raw = res.headers
    .getSetCookie?.()
    .find((c) => c.startsWith(`${BIND}=`));
  const value = raw?.split(";")[0].slice(BIND.length + 1);
  if (!value) return;
  (await cookies()).set(BIND, value, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
}

export async function credentialLogin({ username, password }) {
  try {
    const res = await fetch(`${API}/v2/auth/login`, {
      method: "POST",
      headers: await forwardHeaders(),
      cache: "no-store",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message,
        errors: data.errors || {},
      };
    }

    if (data.success) await setBindCookie(res);
    return data;
  } catch (err) {
    return {
      success: false,
      message: err.message || "Internal server error",
    };
  }
}

export async function verifyOTP({ preAuthToken, token }) {
  if (!preAuthToken || !token) {
    return { success: false, message: "Missing required OTP parameters" };
  }

  try {
    const res = await fetch(`${API}/v2/auth/2fa/login`, {
      method: "POST",
      headers: await forwardHeaders(),
      cache: "no-store",
      body: JSON.stringify({ preAuthToken, token }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message,
        errors: data.errors || {},
      };
    }
    if (data.success) await setBindCookie(res);
    return data;
  } catch (err) {
    return {
      success: false,
      message: err.message || "Internal server error",
    };
  }
}

export async function removeTrustedDevice(id) {
  try {
      const res = await apiFetch(`/v2/auth/trusted-device/${id}`, {
          method: "DELETE",
      });
      
      if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { success: false, message: data.message || "Device Remove failed" };

      return data;
  } catch (error) {
      throw new Error('Internal Server Error');
  }
}
