interface AuthCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  registrationToken: string;
}

interface PasswordReset {
  email: string;
  password: string;
  token: string | null;
}

type SortOrder = "asc" | "desc"
interface UpdateUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  oldPassword: string;
  newPassword: string;
}
