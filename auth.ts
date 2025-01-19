import NextAuth, { User } from "next-auth";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "./lib/database";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`, 
      options: {
        httpOnly: true, 
        secure: true,
        sameSite: "lax", 
      },
    },
  },
  providers: [
    CredentialsProvider({
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                return null;
            }

            const user = findUserByEmail(credentials.email.toString());

            if (!user) return null;

            const isPasswordValid = await compare(
                credentials.password.toString(),
                user.password
            );

            if (!isPasswordValid) return null;

            return {
                id: user.id.toString(),
                email: user.email,
            } as User;
        },
    }),
  ],
  pages: {
    signIn: "/log-in",
  },
  callbacks: {
    async jwt( {token, user}) {
        if(user) {
            token.id = user.id;
            token.name = user.id;
        }

        return token;
    },
    async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
        }
  
        return session;
    }
  },
});
