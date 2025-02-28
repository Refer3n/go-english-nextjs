"use client";

import React from "react";
import Logo from "./Logo";
import Image from "next/image";
import { Input } from "./ui/input";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { NavMenu } from "./NavMenu";

const Header = () => {
  return (
    <header>
      <div className="flex flex-col px-[5vw] mb-6">
        <div className="flex items-center justify-between py-1 mb-6">
          <div className="flex items-center gap-6">
            <div className="bg-primary p-2 w-[180px]">
              <Logo size="sm"></Logo>
            </div>
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
            <Link className="button" href={"/sign-up"}>
              Sign up
            </Link>
            <Link
              className="button !border !border-primary !bg-light-400"
              href={"/log-in"}
            >
              Log in
            </Link>
          </div>
        </div>
        <NavMenu></NavMenu>
      </div>
    </header>
  );
};

export default Header;
