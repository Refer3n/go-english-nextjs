"use client";

import AuthForm from "@/components/AuthForm";
import React from "react";
import { logInSchema } from "@/lib/validations";
import { logInWithCredentials } from "@/lib/actions/auth";

const page = () => (
  <AuthForm
    type="LOG_IN"
    schema={logInSchema}
    defaultValues={{ email: "", password: "", rememberMe: false }}
    onSubmit={logInWithCredentials}
  />
);

export default page;
