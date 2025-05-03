import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import "./safari-normalize.css";
import { ReactNode } from "react";
import { LoadingProvider } from "@/context/LoadingContext";
import AuthProvider from "@/components/AuthProvider";
import Loader from "@/components/Loader";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/auth";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Go English",
  description: "English learning application",
};

const RootLayout = async ({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const session = await auth();

  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={nunitoSans.variable}>
          <AuthProvider session={session}>
            <LoadingProvider>
              <Loader />
              {children}
              <Toaster />
            </LoadingProvider>
          </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
