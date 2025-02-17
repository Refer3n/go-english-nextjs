import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoSection from "@/components/Logo"; // Import the new component

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) redirect("/profile");

  return (
    <main className="auth-container">
      <section className="flex flex-col justify-center items-center w-2/3 h-full">
        <LogoSection size="md" />
      </section>

      <div className="h-full w-[2px] mx-4 bg-gradientLine" />

      <section className="auth-form">
        <div>{children}</div>
      </section>
    </main>
  );
};

export default Layout;
