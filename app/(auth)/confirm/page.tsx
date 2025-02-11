"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LegalLinks from "@/components/LegalLinks";
import { useRouter } from "next/navigation";
import { logInWithRegistrationToken } from "@/lib/actions/auth";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Invalid verification link");
      setLoading(false);
      return;
    }

    const verify = async () => {
      const result = await logInWithRegistrationToken({
        registrationToken: token,
      });

      if (result.success) {
        router.push("/profile");
      } else {
        setError(result.error || "Verification failed");
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col gap-4 w-[340px] max-h-[100vh] overflow-y-scroll hide-scrollbar pb-3 pt-5">
      <h1 className="text-2xl font-bold leading-6 text-yellow text-center">
        {loading
          ? "Verifying your account..."
          : error
            ? "Something went wrong"
            : "Your registration is ready"}
      </h1>

      {error ? (
        <div className="text-light-100 leading-6 text-center px-4 mt-8 mb-8">
          <p className="text-red">{error}</p>
          <p className="mt-4">
            Register again{" "}
            <button
              onClick={() => router.push("/sign-up")}
              className="text-yellow hover:underline"
            >
              here
            </button>
          </p>
        </div>
      ) : (
        <p className="text-light-100 leading-6 text-center px-4 mt-8 mb-8">
          If the page does not reload automatically, click{" "}
          <button
            onClick={() => router.push("/profile")}
            className="text-yellow hover:underline"
          >
            here
          </button>
        </p>
      )}

      <LegalLinks />
    </div>
  );
};

export default VerifyPage;
