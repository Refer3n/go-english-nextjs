"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const page = () => {
  const session = useSession();

  return (
    <div>
      page
      <br />
      <Button type="submit" onClick={signOut}>
        {" "}
        Sign out
      </Button>
      <pre>{session.data?.user.id}</pre>
      <pre>{session.data?.user.name}</pre>
      <pre>{session.data?.user.lastname}</pre>
      <pre>{session.data?.user.email}</pre>
    </div>
  );
};

export default page;
