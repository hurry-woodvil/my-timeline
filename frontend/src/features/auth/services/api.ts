import { env } from '../../../config/env';
import { ApiClient } from '../../../shared/api-client';
import {
  GetApiRequest,
  PostApiRequest,
} from '../../../shared/api-request-type';
import {
  Response,
  SignInRequest,
  SignInResponseData,
  SignUpRequest,
  SignUpResponseData,
  RefreshRequest,
  RefreshResponseData,
} from '../types/auth';

export async function callSignInApi(
  payload: SignInRequest,
): Promise<Response<SignInResponseData>> {
  const request: PostApiRequest<SignInRequest> = {
    method: 'POST',
    path: '/auth/signin',
    withAuth: false,
    body: payload,
  };

  const apiClient = new ApiClient(env.apiBaseUrl);
  const response = await apiClient.request<SignInResponseData>(request);

  return response;
}

export async function callSignUpApi(
  payload: SignUpRequest,
): Promise<Response<SignUpResponseData>> {
  const request: PostApiRequest<SignUpRequest> = {
    method: 'POST',
    path: '/auth/signup',
    withAuth: false,
    body: payload,
  };

  const apiClient = new ApiClient(env.apiBaseUrl);
  const response = await apiClient.request<SignUpResponseData>(request);

  return response;
}

export async function callRefreshApi(
  payload: RefreshRequest,
): Promise<Response<RefreshResponseData>> {
  const request: GetApiRequest<RefreshRequest> = {
    method: 'GET',
    path: '/auth/refresh',
    withAuth: false,
    query: payload,
  };

  const apiClient = new ApiClient(env.apiBaseUrl);
  const response = await apiClient.request<RefreshResponseData>(request);

  return response;
}
