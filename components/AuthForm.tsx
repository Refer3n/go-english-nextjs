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
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import Image from "next/image";
import { Checkbox } from "./ui/checkbox";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "./GoogleSignInButton";
import LegalLinks from "./LegalLinks";

interface Props<T extends FieldValues> {
  type: "LOG_IN" | "SIGN_UP";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();
  const isLogIn = type === "LOG_IN";
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
      if (isLogIn) {
        router.push("/profile");
      } else {
        router.push("/check-email");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-4 w-[340px] max-h-[100vh] overflow-y-scroll hide-scrollbar pb-3 pt-5">
      <h1 className="text-2xl font-bold leading-6 text-yellow text-center mt-5">
        {isLogIn ? "Log in to Go English" : "Welcome to Go English"}
      </h1>
      <p className="text-light-100 leading-6 text-center">
        {isLogIn ? "Don't have an account? " : "Already have a profile? "}
        <Link className="text-yellow" href={isLogIn ? "/sign-up" : "/log-in"}>
          {isLogIn ? "Sign up" : "Log in"}
        </Link>
      </p>
      {errorMessage && (
        <div className="p-10 text-center text-red">{errorMessage}</div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 w-full"
          noValidate
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  {field.name !== "rememberMe" && (
                    <FormLabel className="capitalize text-light-100 font-normal">
                      {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                    </FormLabel>
                  )}
                  <FormControl>
                    {field.name === "rememberMe" ? (
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className=" bg-primary border-light-100 data-[state=checked]:text-white"
                        />
                        <span className="text-blue-100">Remember me</span>
                      </div>
                    ) : (
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
                    )}
                  </FormControl>
                  {isLogIn && field.name === "password" && (
                    <div className="text-left mt-1">
                      <Link href="/forgot-password" className="text-blue-100">
                        Forgot Password?
                      </Link>
                    </div>
                  )}
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className="w-full bg-yellow text-primary rounded-full font-bold text-lg hover:bg-yellow hover:text-primary py-4 px-8"
          >
            {isLogIn ? "Log In" : "Create an account"}
          </Button>
        </form>
      </Form>
      <p className="text-light-100 font-normal text-center">Or continue with</p>
      <div className="flex flex-row gap-2 justify-center">
        {/* {["google", "facebook", "apple"].map((platform) => (
          <Button
            key={platform}
            className="bg-white hover:bg-white px-10 py-6 rounded-3xl"
          >
            <Image
              src={`/icons/${platform}-icon.svg`}
              width={24}
              height={24}
              alt={`${platform} icon`}
            />
          </Button>
        ))} */}
        <GoogleSignInButton />
      </div>
      <LegalLinks />
    </div>
  );
};

export default AuthForm;
