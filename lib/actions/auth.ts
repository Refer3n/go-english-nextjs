"use server";

import { signIn } from "@/auth";
import api from "../api";

export const logInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        error: "Invalid credentials",
      };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: "Invalid credentials",
    };
  }
};

export const logInWithRegistrationToken = async (
  params: Pick<AuthCredentials, "registrationToken">,
) => {
  const { registrationToken } = params;

  try {
    const { data } = await api.post("/auth/verify", {
      Token: registrationToken,
    });

    const result = await signIn("credentials", {
      registrationToken: data.token,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        error: "Invalid credentials",
      };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: "Invalid credentials",
    };
  }
};

export const signUp = async (
  params: Pick<
    AuthCredentials,
    "firstName" | "lastName" | "email" | "password"
  >,
) => {
  const { firstName, lastName, email, password } = params;

  try {
    const result = await api.post("/auth/register", {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    if (result?.status !== 200) {
      return { success: false, error: result.data };
    }
  } catch (error: any) {
    console.error("Sign up error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data };
  }

  return { success: true };
};

export const resetPassword = async (params: Pick<PasswordReset, "email">) => {
  const { email } = params;

  try {
    const result = await api.post("/auth/reset-password", {
      email: email,
    });

    if (result?.status !== 200) {
      return { success: false, error: result.data };
    }
  } catch (error: any) {
    console.error(
      "Reset password error:",
      error.response?.data || error.message,
    );
    return { success: false, error: error.response?.data };
  }

  return { success: true };
};

export const confirmResetPassword = async (
  params: Pick<PasswordReset, "password" | "token">,
) => {
  const { password, token } = params;

  try {
    const result = await api.post("/auth/confirm-reset", {
      newPassword: password,
      token: token,
    });

    if (result?.status !== 200) {
      return { success: false, error: result.data };
    }
  } catch (error: any) {
    console.error(
      "Confirm reset password error:",
      error.response?.data || error.message,
    );
    return { success: false, error: error.response?.data };
  }

  return { success: true };
};
