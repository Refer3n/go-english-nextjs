import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "./lib/api";
import { parseJwt } from "./lib/utils";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      lastname: string;
      accessToken: string;
    };
  }

  interface User {
    lastname: string;
    accessToken: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        googleToken: { label: "Google Token", type: "text" },
        registrationToken: { label: "Registration Token", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.googleToken) {
          try {
            const decoded = parseJwt(credentials.googleToken as string);
            if (!decoded?.email) throw new Error("Invalid Google token");

            const { data: loginData } = await api.post("/auth/signin-google", {
              googleToken: credentials.googleToken,
            });

            const token = loginData?.token;
            if (!token) throw new Error("Google auth failed");

            const { data: userData } = await api.get(
              `/user/getuserbyemail?email=${decoded.email}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );

            return {
              id: userData.id.toString(),
              email: userData.email,
              name: userData.firstName,
              lastname: userData.lastName,
              accessToken: token,
            };
          } catch (error) {
            console.error("Google auth error:", error);
            return null;
          }
        }

        if (credentials?.registrationToken) {
          try {
            const decoded = parseJwt(credentials.registrationToken as string);

            const email =
              decoded?.[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
              ];

            if (!email) {
              throw new Error("Invalid registration token");
            }

            const { data: userData } = await api.get(
              `/user/getuserbyemail?email=${email}`,
              {
                headers: {
                  Authorization: `Bearer ${credentials.registrationToken}`,
                },
              },
            );

            return {
              id: userData.id.toString(),
              email: userData.email,
              name: userData.firstName,
              lastname: userData.lastName,
              accessToken: credentials.registrationToken,
            };
          } catch (error) {
            console.error("Registration token error:", error);
            return null;
          }
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const { data: loginData } = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const token = loginData?.token;
          if (!token) throw new Error("Invalid credentials");

          const { data: userData } = await api.get(
            `/user/getuserbyemail?email=${credentials.email}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          return {
            id: userData.id.toString(),
            email: userData.email,
            name: userData.firstName,
            lastname: userData.lastName,
            accessToken: token,
          };
        } catch (error: any) {
          console.error("Auth error:", error.response?.data || error.message);
          throw new Error(error.response?.data || error.message);
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
        token.lastname = user.lastname;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.lastname = token.lastname as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/log-in",
  },
});
