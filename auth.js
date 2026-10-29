import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {
                try {
                  if (!credentials?.accessToken) return null;
                  const { payload } = await jwtVerify(
                    credentials.accessToken,
                    secret,
                  );
                  if (payload.purpose) return null;
                  if (String(payload.userid) !== String(credentials.userid))
                    return null;

                  return {
                    id: String(payload.userid),
                    userid: String(payload.userid),
                    accessToken: credentials.accessToken,
                    exp: payload.exp,
                  };
                } catch {
                  return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 1 days
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    useSecureCookies: process.env.NODE_ENV === "production",
    callbacks: {
        async jwt({ token, user }) {
            if (user?.accessToken) {
                token.userid = user.userid;
                token.accessToken = user.accessToken;
                token.accessExp = user.exp;
            }
            if (token.accessExp && Date.now() / 1000 > token.accessExp) return null;
            return token;
        },
        async session({ session, token }) {
            if (token?.userid) session.userid = token.userid;
            return session
        },
    },
})
