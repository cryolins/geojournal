import NextAuth, { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: []
}

export const { auth } = NextAuth(authOptions);