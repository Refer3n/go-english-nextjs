"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LegalLinks from "@/components/LegalLinks";
import { useRouter } from "next/navigation";
import { logInWithRegistrationToken } from "@/lib/actions/auth";
import { useLoading } from "@/context/LoadingContext";

const VerifyPage = () => {
  const { isLoading, setLoading } = useLoading();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Invalid verification link");
      return;
    }

    const verify = async () => {
      setLoading(true);
      const result = await logInWithRegistrationToken({
        registrationToken: token,
      });
      setLoading(false);

      if (result.success) {
        router.push("/profile");
      } else {
        setError(result.error || "Verification failed");
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="auth-form-container">
      <h1 className="auth-heading">
        {isLoading
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
