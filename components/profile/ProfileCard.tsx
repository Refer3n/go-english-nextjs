"use client";

import { updatePasswordSchema, updateProfileSchema } from "@/lib/validations";
import ProfileForm from "../ProfileForm";
import { User } from "next-auth";
import { updatePassword, updateProfile } from "@/lib/actions/updateUser";

interface Props {
  type: "PROFILE" | "PASSWORD";
  userData?: User;
}

const ProfileCard = ({ type, userData }: Props) => {
  const isProfileMode = type === "PROFILE";

  return (
    <div className="flex flex-col flex-1 bg-white p-4 rounded-xl px-6">
      <p className="text-base font-semibold">
        {isProfileMode ? "My Profile Details" : "My Password"}
      </p>
      <hr className="border-t-2 border-gray-300 mt-10 mb-[-12]" />
      {isProfileMode ? (
        <ProfileForm
          type="UPDATE_PROFILE"
          schema={updateProfileSchema}
          defaultValues={{
            id: userData?.id || "",
            firstName: userData?.name || "",
            lastName: userData?.lastname || "",
            email: userData?.email || "",
          }}
          onSubmit={updateProfile}
        />
      ) : (
        <ProfileForm
          type="UPDATE_PASSWORD"
          schema={updatePasswordSchema}
          defaultValues={{
            id: userData?.id || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            email: userData?.email || "",
          }}
          onSubmit={updatePassword}
        />
      )}
    </div>
  );
};

export default ProfileCard;
