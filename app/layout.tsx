import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your app description",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={`${nunitoSans.variable}`}>{children}</body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
