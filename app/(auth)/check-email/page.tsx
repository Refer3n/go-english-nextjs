"use client";

import LegalLinks from "../../../components/LegalLinks";

const page = () => {
  return (
    <div className="flex flex-col gap-4 w-[340px] max-h-[100vh] overflow-y-scroll hide-scrollbar pb-3 pt-5">
      <h1 className="text-2xl font-bold leading-6 text-yellow text-center">
        Check Your Email
      </h1>

      <p className="text-light-100 leading-6 text-center px-4">
        We've sent a confirmation link to your email address. Please click the
        link to complete your registration.
      </p>

      <div className="mt-8 text-center mb-8">
        <p className="text-light-100 text-sm mb-2">
          Check your spam folder if you can't find the email
        </p>
      </div>

      <LegalLinks />
    </div>
  );
};

export default page;
