import {
  Response,
  SignInRequest,
  SignInResponseData,
  SignUpRequest,
  SignUpResponseData,
  RefreshRequest,
  RefreshResponseData,
} from '../types/auth';
import { callRefreshApi, callSignInApi } from './api';

export async function signin(
  email: string,
  password: string,
): Promise<Response<SignInResponseData>> {
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
): Promise<Response<SignUpResponseData>> {
  const payload: SignUpRequest = {
    email,
    password,
  };

  const body = await callSignInApi(payload);

  return body;
}

export async function refresh(): Promise<Response<RefreshResponseData>> {
  const payload: RefreshRequest = {};

  const body = await callRefreshApi(payload);

  return body;
}
