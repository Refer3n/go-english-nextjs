import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const page = () => {
  return (
    <div>
      page
      <br />
      <Button type="submit" onClick={signOut}>
        {" "}
        Sign out
      </Button>
    </div>
  );
};

export default page;
