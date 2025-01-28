import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "./lib/api";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      accessToken: string;
    };
  }

  interface User {
    accessToken: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const { data: loginData } = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const token = loginData?.token;

          if (!token) {
            throw new Error("Failed to retrieve token");
          }

          const { data: userData } = await api.get(
            `/user/getuserbyemail?email=${credentials.email}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          return {
            id: userData.id.toString(),
            email: userData.email,
            name: `${userData.firstName} ${userData.lastName}`,
            accessToken: token,
          };
        } catch (error: any) {
          console.error(
            "Authorization error:",
            error.response?.data || error.message,
          );
          throw new Error("Login failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/log-in",
  },
});
