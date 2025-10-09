import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {
                if (!credentials?.accessToken) return null;
                const userInfo = JSON.parse(credentials.userInfo)
                return {
                    userInfo,
                    accessToken: credentials.accessToken
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 1 days
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    callbacks: {
        async jwt({ token, user }) {
            if (user?.accessToken) {
                token.user = user.userInfo;
                token.accessToken = user.accessToken;
            }
            return token
        },
        async session({ session, token }) {
            if (token?.accessToken) {
                session.accessToken = token.accessToken;
                session.user = token.user;
            }
            return session
        },
    },
})
