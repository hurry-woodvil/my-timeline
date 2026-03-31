import { ApiResponse } from '@/features/auth';
import {
  PostMemoryRequest,
  PostMemoryResponseData,
  MemoriesResponseData,
  MemoriesRequest,
} from '../types';
import { ApiClient, GetApiRequest, PostApiRequest } from '@/lib';

export async function postMemory(
  apiClient: ApiClient,
  content: string,
): Promise<ApiResponse<PostMemoryResponseData>> {
  const payload: PostMemoryRequest = {
    content,
  };

  const request: PostApiRequest<PostMemoryRequest> = {
    method: 'POST',
    path: '/memory',
    withAuth: true,
    body: payload,
  };

  const response = await apiClient.request<PostMemoryResponseData>(request);

  return response;
}

export async function memories(
  apiClient: ApiClient,
): Promise<ApiResponse<MemoriesResponseData>> {
  const request: GetApiRequest<MemoriesRequest> = {
    method: 'GET',
    path: 'memories',
    withAuth: true,
    query: {},
  };

  const response = await apiClient.request<MemoriesResponseData>(request);

  return response;
}
