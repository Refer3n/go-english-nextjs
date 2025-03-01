import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { auth } from "@/auth";
import { LoadingProvider } from "@/context/LoadingContext";
import AuthProvider from "@/components/AuthProvider"; // Import the AuthProvider
import Loader from "@/components/Loader";

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
      <body className={`${nunitoSans.variable}`}>
        <AuthProvider session={session}>
          <LoadingProvider>
            <Loader />
            {children}
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
