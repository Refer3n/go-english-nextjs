"use client";

import ResetPasswordForm from "@/components/ResetPasswordForm";
import { confirmResetPassword, resetPassword } from "@/lib/actions/auth";
import {
  resetPasswordSchema,
  confirmResetPasswordSchema,
} from "@/lib/validations";
import { useSearchParams } from "next/navigation";

const ForgotPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const isConfirmReset = Boolean(token);

  return isConfirmReset ? (
    <ResetPasswordForm
      type={"CONFIRM_RESET_PASSWORD"}
      schema={confirmResetPasswordSchema}
      defaultValues={{ token, password: "" }}
      onSubmit={confirmResetPassword}
    />
  ) : (
    <ResetPasswordForm
      type={"RESET_PASSWORD"}
      schema={resetPasswordSchema}
      defaultValues={{ email: "" }}
      onSubmit={resetPassword}
    />
  );
};

export default ForgotPassword;
