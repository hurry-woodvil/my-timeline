import {
  ApiResponse,
  SignInRequest,
  SignInResponseData,
  SignUpRequest,
  SignUpResponseData,
  RefreshRequest,
  RefreshResponseData,
} from '../types/auth';
import { callRefreshApi, callSignInApi, callSignUpApi } from './api';

export async function signin(
  email: string,
  password: string,
): Promise<ApiResponse<SignInResponseData>> {
  const payload: SignInRequest = {
    email,
    password,
  };

  const body = await callSignInApi(payload);

  return body;
}

export async function signup(
  email: string,
  password: string,
): Promise<ApiResponse<SignUpResponseData>> {
  const payload: SignUpRequest = {
    email,
    password,
  };

  const body = await callSignUpApi(payload);

  return body;
}

export async function refresh(): Promise<ApiResponse<RefreshResponseData>> {
  const payload: RefreshRequest = {};

  const body = await callRefreshApi(payload);

  return body;
}
