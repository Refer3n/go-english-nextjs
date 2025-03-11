"use client";

import ProfileCard from "@/components/profile/ProfileCard";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Profile() {
  const userData = useSession().data?.user;

  return (
    <div className="flex flex-col min-h-[100%] bg-light-400 p-8">
      <div className="flex items-center gap-4 mb-8 mt-2">
        <div className="relative rounded-full overflow-hidden">
          <Image
            src={userData?.avatarUrl || "/images/default3.jpg"}
            alt="User avatar"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold">
          {userData?.name} {userData?.lastname}
        </h1>
      </div>
      <div className="flex flex-row bg-light-400 gap-x-3 mt-2">
        <ProfileCard type="PROFILE" userData={userData} />
        <ProfileCard type="PASSWORD" userData={userData} />
      </div>
    </div>
  );
}
