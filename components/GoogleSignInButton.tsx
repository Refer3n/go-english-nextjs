"use client";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { signIn } from "next-auth/react";

export const GoogleSignInButton = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <GoogleLogin
        onSuccess={(response) => {
          signIn("credentials", {
            googleToken: response.credential,
            redirect: true,
            callbackUrl: "/dashboard",
          });
        }}
        onError={() => {
          console.error("Google login failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};
