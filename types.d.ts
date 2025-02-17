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
