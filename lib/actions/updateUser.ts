import api from "../api";

export const updateProfile = async (
  params: Pick<UpdateUser, "id" | "email" | "firstName" | "lastName">,
) => {
  const { id, email, firstName, lastName } = params;

  try {
    const result = await api.put(`/user/updateuser/${id}`, {
      email: email,
      firstName: firstName,
      lastName: lastName,
    });

    if (result?.status !== 200) {
      return { success: false, error: result.data };
    }
  } catch (error: any) {
    console.error(
      "Update profile error:",
      error.response?.data || error.message,
    );
    return { success: false, error: error.response?.data };
  }

  return { success: true };
};

export const updatePassword = async (
  params: Pick<UpdateUser, "id" | "email" | "oldPassword" | "newPassword">,
) => {
  const { id, email, oldPassword, newPassword } = params;

  try {
    const result = await api.put(`/user/updateuser/${id}`, {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    });

    if (result?.status !== 200) {
      return { success: false, error: result.data };
    }
  } catch (error: any) {
    console.error(
      "Update password error:",
      error.response?.data || error.message,
    );
    return { success: false, error: error.response?.data };
  }

  return { success: true };
};
