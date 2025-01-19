import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  console.log(session);

  if (session) redirect("/log-in");

  return <div>{children}</div>;
};

export default Layout;
