"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LegalLinks from "./LegalLinks";
import { useLoading } from "@/context/LoadingContext";

interface Props<T extends FieldValues> {
  type: "RESET_PASSWORD" | "CONFIRM_RESET_PASSWORD";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}

const ResetPasswordForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const { isLoading, setLoading } = useLoading();
  const router = useRouter();
  const isConfirmMode = type === "CONFIRM_RESET_PASSWORD";
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    setLoading(true);
    const result = await onSubmit(data);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || "Error");
    } else {
      setErrorMessage(null);
      if (isConfirmMode) {
        router.push("/log-in");
      } else {
        router.push(`/check-email?mode=reset`);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-form-container">
      <h1 className="auth-heading">
        {isConfirmMode ? "Password Reset" : "Forgotten Password"}
      </h1>

      {isConfirmMode ? (
        <p className="auth-subtext px-4">
          Almost done! Enter your new password and try to remember it this time.
        </p>
      ) : (
        <p className="auth-subtext px-4">
          Oh dear. You forgot your password.
          <br />
          Don't worry! Let's reset your password.
        </p>
      )}

      {errorMessage && (
        <div className="p-10 text-center text-red">{errorMessage}</div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 w-full"
          noValidate
        >
          {Object.keys(defaultValues).map((field) => {
            if (field === "token") {
              return (
                <FormField
                  key={field}
                  control={form.control}
                  name={field as Path<T>}
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            }

            return (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize text-light-100 font-normal">
                      {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                    </FormLabel>

                    <FormControl>
                      <div className="auth-input-container">
                        <div className="icon-left">
                          <Image
                            src={`/icons/${field.name}-icon.svg`}
                            width={20}
                            height={20}
                            alt={`${field.name} icon`}
                          />
                        </div>
                        <Input
                          type={
                            field.name === "password" ||
                            field.name === "confirmPassword"
                              ? showPassword
                                ? "text"
                                : "password"
                              : FIELD_TYPES[
                                  field.name as keyof typeof FIELD_TYPES
                                ]
                          }
                          placeholder={
                            FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]
                          }
                          {...field}
                          className="auth-input"
                        />
                        {(field.name === "password" ||
                          field.name === "confirmPassword") && (
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="toggle-password"
                          >
                            {showPassword ? (
                              <Image
                                src="/icons/eye-open-icon.svg"
                                width={20}
                                height={20}
                                alt="Show password"
                              />
                            ) : (
                              <Image
                                src="/icons/eye-closed-icon.svg"
                                width={20}
                                height={20}
                                alt="Hide password"
                              />
                            )}
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red" />
                  </FormItem>
                )}
              />
            );
          })}

          <Button
            type="submit"
            className="auth-button hover:bg-yellow hover:text-primary"
            disabled={isLoading}
          >
            {isConfirmMode ? "Change Password" : "Reset Password"}
          </Button>
        </form>
      </Form>

      <LegalLinks />
    </div>
  );
};

export default ResetPasswordForm;
