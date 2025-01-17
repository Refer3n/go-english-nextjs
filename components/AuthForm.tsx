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
  const isLogIn = type === "LOG_IN";
  const [showPassword, setShowPassword] = useState(false);

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    await onSubmit(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-primary text-center">
        {isLogIn ? "Log in to Go English" : "Registration page"}
      </h1>
      <p className="text-primary text-center">
        {isLogIn ? "Don't have an account? " : "Already have an account? "}
        <Link className="text-blue-100" href={isLogIn ? "/sign-up" : "/log-in"}>
          {isLogIn ? "Sign up" : "Log in"}
        </Link>
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
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
                    <FormLabel className="capitalize text-primary">
                      {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                    </FormLabel>
                  )}
                  <FormControl>
                    {field.name === "rememberMe" ? (
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-primary">Remember me</span>
                      </div>
                    ) : field.name === "password" ? (
                      <div className="relative">
                        <Input
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder={field.name}
                          {...field}
                        />
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
                      </div>
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        placeholder={field.name}
                        {...field}
                      />
                    )}
                  </FormControl>
                  {isLogIn && field.name === "password" && (
                    <div className="text-left mt-1">
                      <Link href="/forgot-password" className="text-blue-100">
                        Forgot Password?
                      </Link>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="w-full bg-primary text-yellow">
            {isLogIn ? "Log In" : "Sign Up"}
          </Button>
        </form>
      </Form>
      <p className="text-primary text-center">Or continue with</p>
      <div className="flex flex-row gap-2 justify-center">
        {["google", "facebook", "apple"].map((platform) => (
          <Button
            key={platform}
            className="bg-white"
          >
            <Image
              src={`/icons/${platform}-icon.svg`}
              width={20}
              height={20}
              alt={`${platform} icon`}
            />
          </Button>
        ))}
      </div>
      <div className="flex flex-row gap-2 justify-center">
        <Link href="/terms" className="text-blue-100 text-center">
          Terms & Conditions
        </Link>
        <Link href="/privacy" className="text-blue-100 text-center">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default AuthForm;
