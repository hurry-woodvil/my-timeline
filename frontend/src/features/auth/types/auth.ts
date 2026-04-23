export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AuthToken = {
  accessToken: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponseData = AuthToken & {};

export type SignUpRequest = {
  email: string;
  password: string;
};

export type SignUpResponseData = AuthToken & {};

export type SignOutRequest = {};

export type SignOutResponseData = {};

export type RefreshRequest = {};

export type RefreshResponseData = AuthToken & {};

export type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
};
