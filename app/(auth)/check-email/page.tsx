"use client";

import { useSearchParams } from "next/navigation";
import LegalLinks from "../../../components/LegalLinks";

const Page = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const heading = mode === "reset" ? "Reset Your Password" : "Check Your Email";
  const message =
    mode === "reset"
      ? "We've sent a password reset link to your email address. Please click the link to reset your password."
      : "We've sent a confirmation link to your email address. Please click the link to complete your registration.";

  return (
    <div className="flex flex-col gap-4 w-[340px] max-h-[100vh] overflow-y-scroll hide-scrollbar pb-3 pt-5">
      <h1 className="text-2xl font-bold leading-6 text-yellow text-center">
        {heading}
      </h1>
      <p className="text-light-100 leading-6 text-center px-4 mt-8 mb-8">
        {message}
      </p>

      <LegalLinks />
    </div>
  );
};

export default Page;
