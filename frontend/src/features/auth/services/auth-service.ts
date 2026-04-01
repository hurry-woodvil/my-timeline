import { apiClient, GetApiRequest, PostApiRequest } from '@/lib';
import {
  ApiResponse,
  SignInRequest,
  SignInResponseData,
  SignUpRequest,
  SignUpResponseData,
  RefreshRequest,
  RefreshResponseData,
  SignOutResponseData,
  SignOutRequest,
} from '../types/auth';

export async function signin(
  email: string,
  password: string,
): Promise<ApiResponse<SignInResponseData>> {
  const payload: SignInRequest = {
    email,
    password,
  };

  const request: PostApiRequest<SignInRequest> = {
    method: 'POST',
    path: '/auth/signin',
    withAuth: false,
    body: payload,
  };

  const response = await apiClient<SignInResponseData>(request);

  return response;
}

export async function signup(
  email: string,
  password: string,
): Promise<ApiResponse<SignUpResponseData>> {
  const payload: SignUpRequest = {
    email,
    password,
  };

  const request: PostApiRequest<SignUpRequest> = {
    method: 'POST',
    path: '/auth/signup',
    withAuth: false,
    body: payload,
  };

  const response = await apiClient<SignUpResponseData>(request);

  return response;
}

export async function signout(): Promise<ApiResponse<SignOutResponseData>> {
  const payload: SignOutRequest = {};

  const request: GetApiRequest<SignOutRequest> = {
    method: 'GET',
    path: '/auth/signout',
    withAuth: false,
    query: payload,
  };

  const response = await apiClient<SignOutResponseData>(request);

  return response;
}

export async function refresh(): Promise<ApiResponse<RefreshResponseData>> {
  const payload: RefreshRequest = {};

  const request: GetApiRequest<RefreshRequest> = {
    method: 'GET',
    path: '/auth/refresh',
    withAuth: false,
    query: payload,
  };

  const response = await apiClient<RefreshResponseData>(request);

  return response;
}
