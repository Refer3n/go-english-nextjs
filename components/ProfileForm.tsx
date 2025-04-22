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
import { useLoading } from "@/context/LoadingContext";

interface Props<T extends FieldValues> {
  type: "UPDATE_PROFILE" | "UPDATE_PASSWORD";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}

const ProfileForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const { isLoading, setLoading } = useLoading();
  const isProfileMode = type === "UPDATE_PROFILE";
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
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="p-4 text-center text-red-600">{errorMessage}</div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 w-full"
          noValidate
        >
          {Object.keys(defaultValues).map((field) => {
            if (
              field === "id" ||
              (field === "email" && isProfileMode === false)
            ) {
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
                    <FormLabel className="capitalize text-light-300 font-normal">
                      {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                    </FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <Input
                          type={
                            FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                          }
                          placeholder={
                            FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]
                          }
                          {...field}
                          className="w-full bg-light-400 text-light-300 px-3 py-2 border border-gray-300 rounded-[16px]"
                          disabled={
                            field.name === "email" && isProfileMode === true
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            );
          })}

          <Button
            type="submit"
            className="w-fit bg-yellow text-primary rounded-full font-bold text-lg px-8 py-7 hover:bg-yellow hover:text-primary"
            disabled={isLoading}
          >
            {isProfileMode ? "Update Profile" : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
