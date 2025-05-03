"use client";

import AuthForm from "@/components/AuthForm";
import React from "react";
import { signUpSchema } from "@/lib/validations";
import { signUp } from "@/lib/actions/auth";

const page = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }}
    onSubmit={signUp}
  />
);

export default page;
