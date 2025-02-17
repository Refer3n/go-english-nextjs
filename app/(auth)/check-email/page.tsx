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
    <div className="auth-form-container !gap-10">
      <h1 className="auth-heading">
        {heading}
      </h1>
      <p className="auth-subtext">
        {message}
      </p>

      <LegalLinks />
    </div>
  );
};

export default Page;
