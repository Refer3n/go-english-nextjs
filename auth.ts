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
      refreshToken: string;
      avatarUrl: string | undefined;
      accessTokenExpires: number;
    };
  }

  interface User {
    lastname: string;
    accessToken: string;
    refreshToken: string;
    avatarUrl: string | undefined;
    accessTokenExpires: number;
  }

  interface JWT {
    refreshToken?: string;
    lastname?: string;
    avatarUrl?: string;
    accessTokenExpires?: number;
  }
}

const ACCESS_TOKEN_LIFETIME = 8 * 60 * 60 * 1000;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
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
            const refreshToken = loginData?.refreshToken;
            if (!token || !refreshToken) throw new Error("Google auth failed");

            const { data: userData } = await api.get(
              `/user/getuserbyemail?email=${decoded.email}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            return {
              id: userData.id.toString(),
              email: userData.email,
              name: userData.firstName,
              lastname: userData.lastName,
              accessToken: token,
              refreshToken: refreshToken,
              avatarUrl: userData.avatarUrl ?? undefined,
              accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME,
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
              }
            );

            return {
              id: userData.id.toString(),
              email: userData.email,
              name: userData.firstName,
              lastname: userData.lastName,
              accessToken: credentials.registrationToken,
              refreshToken: userData.refreshToken,
              avatarUrl: userData.avatarUrl ?? undefined,
              accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME,
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
          const refreshToken = loginData?.refreshToken;
          if (!token) throw new Error("Invalid credentials");

          const { data: userData } = await api.get(
            `/user/getuserbyemail?email=${credentials.email}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          return {
            id: userData.id.toString(),
            email: userData.email,
            name: userData.firstName,
            lastname: userData.lastName,
            accessToken: token,
            refreshToken: refreshToken,
            avatarUrl: userData.avatarUrl ?? undefined,
            accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME,
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
        token.refreshToken = user.refreshToken;
        token.avatarUrl = user.avatarUrl;
        token.accessTokenExpires = user.accessTokenExpires;
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        return {
          ...session,
          user: {
            id: "",
            email: "",
            name: "",
            lastname: "",
            accessToken: "",
            refreshToken: "",
            avatarUrl: "",
            accessTokenExpires: 0,
          },
          expires: "0",
        };
      }

      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.lastname = token.lastname as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.avatarUrl = token.avatarUrl as string | undefined;
        session.user.accessTokenExpires = token.accessTokenExpires as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/log-in",
  },
});

async function refreshAccessToken(token: any) {
  try {
    const { data } = await api.post("/auth/refresh", {
      refreshToken: token.refreshToken,
    });

    if (!data?.token) {
      throw new Error("Failed to refresh token");
    }

    return {
      ...token,
      accessToken: data.token,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME,
    };
  } catch (error) {
    console.error("Refresh token error:", error);

    return { ...token, error: "RefreshAccessTokenError" };
  }
}
