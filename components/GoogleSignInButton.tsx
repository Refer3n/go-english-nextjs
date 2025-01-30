"use client";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Предположим, что у вас есть кастомный Button

export const GoogleSignInButton = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <GoogleLogin
        onSuccess={(response) => {
          // Вызываем signIn с Google Token
          signIn("credentials", {
            googleToken: response.credential,
            redirect: true,
            callbackUrl: "/profile",
          });
        }}
        onError={() => {
          console.error("Google login failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};
