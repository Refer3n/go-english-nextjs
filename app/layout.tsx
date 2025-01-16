import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google"; 
import "./globals.css";
import { ReactNode } from "react";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your app description",
};

const RootLayout = ({children}: { children: ReactNode }) =>  {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable}`}>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
