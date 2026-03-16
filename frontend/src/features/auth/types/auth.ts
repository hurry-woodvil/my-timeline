export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  accessToken: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
};
