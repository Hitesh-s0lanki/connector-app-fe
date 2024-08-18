import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { GetUserById, login } from "./actions/auth.actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {

                const {
                    email,
                    password
                } = credentials

                const user = await login({ email, password } as any);

                return user
            }
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub; // Set user ID in the session
            }
            if (session.user) {
                session.user.name = token.name; // Set user name in the session
                if (token.email) {
                    session.user.email = token.email; // Set user email in the session
                }

                if (token.access_token) {
                    session.access_token = token.access_token as string; // Set user email in the session
                }
            }
            return session; // Return the session
        },
        // Callback function for JWT handling
        async jwt({ token }) {
            if (!token.sub) return token; // Return token if no subject

            const user = await GetUserById(token.sub); // Check if the user exists with credentials login
            if (!user) return token; // Return token if user does not exist

            token.name = user.name; // Set user name in the token
            token.email = user.email; // Set user email in the token
            token.access_token = user.token

            return token; // Return the token
        }
    },
    session: { strategy: "jwt" },
})

declare module "next-auth" {
    interface Session {
        access_token: string;
    }
}