import AuthForm from "@/components/AuthForm";
import React from "react";
import { logInSchema } from "@/lib/validations";

const page = () => (
  <AuthForm
    type="LOG_IN"
    schema={logInSchema}
    defaultValues={{ email: "", password: "" }}
    onSubmit={() => {}}
  />
);

export default page;
