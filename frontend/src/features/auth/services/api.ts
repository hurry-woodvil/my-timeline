import { useApp } from '@/contexts';
import { GetApiRequest, PostApiRequest } from '@/lib';
import {
  ApiResponse,
  SignInRequest,
  SignInResponseData,
  SignUpRequest,
  SignUpResponseData,
  SignOutRequest,
  SignOutResponseData,
  RefreshRequest,
  RefreshResponseData,
} from '../types/auth';

export async function callSignInApi(
  payload: SignInRequest,
): Promise<ApiResponse<SignInResponseData>> {
  const request: PostApiRequest<SignInRequest> = {
    method: 'POST',
    path: '/auth/signin',
    withAuth: false,
    body: payload,
  };

  const { apiClient } = useApp();
  const response = await apiClient.request<SignInResponseData>(request);

  return response;
}

export async function callSignUpApi(
  payload: SignUpRequest,
): Promise<ApiResponse<SignUpResponseData>> {
  const request: PostApiRequest<SignUpRequest> = {
    method: 'POST',
    path: '/auth/signup',
    withAuth: false,
    body: payload,
  };

  const { apiClient } = useApp();
  const response = await apiClient.request<SignUpResponseData>(request);

  return response;
}

export async function callSignoutApi(
  payload: SignOutRequest,
): Promise<ApiResponse<SignOutResponseData>> {
  const request: GetApiRequest<SignOutRequest> = {
    method: 'GET',
    path: '/auth/signout',
    withAuth: false,
    query: payload,
  };

  const { apiClient } = useApp();
  const response = await apiClient.request<SignOutResponseData>(request);

  return response;
}

export async function callRefreshApi(
  payload: RefreshRequest,
): Promise<ApiResponse<RefreshResponseData>> {
  const request: GetApiRequest<RefreshRequest> = {
    method: 'GET',
    path: '/auth/refresh',
    withAuth: false,
    query: payload,
  };

  const { apiClient } = useApp();
  const response = await apiClient.request<RefreshResponseData>(request);

  return response;
}
