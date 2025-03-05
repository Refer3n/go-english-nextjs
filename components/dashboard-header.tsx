"use client";

import React from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import LanguageSwitcher from "./LanguageSwitcher";
import { signOut } from "@/auth";

const DashbordHeader = () => {
  return (
      <div className="flex flex-col px-[5vw] mb-6 mt-5 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="auth-input-container text-2xl ml-8">
              <div className="icon-right">
                <Image
                  src={`/icons/search-icon.svg`}
                  width={30}
                  height={30}
                  alt={`search icon`}
                />
              </div>
              <Input
                type="text"
                placeholder="Search"
                className="search-input"
              />
            </div>
            <LanguageSwitcher></LanguageSwitcher>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={signOut}>
              <Image
                src="/icons/sign-out.svg"
                width={30}
                height={30}
                alt="Sign out"
              ></Image>
            </button>
          </div>
        </div>
      </div>
  );
};

export default DashbordHeader;
