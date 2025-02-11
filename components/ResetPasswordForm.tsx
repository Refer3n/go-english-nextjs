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
  const router = useRouter();
  const isConfirmMode = type === "CONFIRM_RESET_PASSWORD";
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
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
    <div className="flex flex-col gap-4 w-[340px] max-h-[100vh] overflow-y-scroll hide-scrollbar pb-3 pt-5">
      {/* Заголовок */}
      <h1 className="text-2xl font-bold leading-6 text-yellow text-center mt-5">
        {isConfirmMode ? "Password Reset" : "Forgotten Password"}
      </h1>

      {/* Подзаголовок */}
      {isConfirmMode ? (
        <p className="text-light-100 leading-6 text-center px-4">
          Almost done! Enter your new password and try to remember it this time.
        </p>
      ) : (
        <p className="text-light-100 leading-6 text-center px-4">
          Oh dear. You forgot your password.
          <br />
          Don't worry! Let's reset your password.
        </p>
      )}

      {errorMessage && (
        <div className="p-10 text-center text-red">{errorMessage}</div>
      )}

      {/* Форма */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 w-full"
          noValidate
        >
          {Object.keys(defaultValues).map((field) => {
            // Скрываем поле token
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
                      <div className="relative flex items-center">
                        <div className="absolute left-3">
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
                          className="pl-10 bg-white rounded-2xl text-primary text-base"
                        />
                        {(field.name === "password" ||
                          field.name === "confirmPassword") && (
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-2 text-primary"
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

          {/* Кнопка отправки */}
          <Button
            type="submit"
            className="w-full bg-yellow text-primary rounded-full font-bold text-lg hover:bg-yellow hover:text-primary py-4 px-8"
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
