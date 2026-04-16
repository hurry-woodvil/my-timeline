import { ApiResponse } from '@/features/auth';
import {
  PostMemoryRequest,
  PostMemoryResponseData,
  MemoriesResponseData,
  MemoriesRequest,
  MemoryResponseData,
} from '../types';
import {
  apiClient,
  DeleteApiRequest,
  GetApiRequest,
  PostApiRequest,
} from '@/lib';

export async function callGetMemoriesApi(): Promise<
  ApiResponse<MemoriesResponseData>
> {
  const request: GetApiRequest<MemoriesRequest> = {
    method: 'GET',
    path: 'memories',
    withAuth: true,
    query: {},
  };

  const response = await apiClient<MemoriesResponseData>(request);

  return response;
}

export async function callGetMemoryApi(
  memory_id: string,
): Promise<ApiResponse<MemoryResponseData>> {
  const request: GetApiRequest = {
    method: 'GET',
    path: `memories/${memory_id}`,
    withAuth: true,
  };

  const response = await apiClient<MemoryResponseData>(request);

  return response;
}

export async function callPostMemoryApi(
  content: string,
): Promise<ApiResponse<PostMemoryResponseData>> {
  const payload: PostMemoryRequest = {
    content,
  };

  const request: PostApiRequest<PostMemoryRequest> = {
    method: 'POST',
    path: '/memories',
    withAuth: true,
    body: payload,
  };

  const response = await apiClient<PostMemoryResponseData>(request);

  return response;
}

export async function callDeleteMemoryApi(memory_id: string) {
  const request: DeleteApiRequest = {
    method: 'DELETE',
    path: `memories/${memory_id}`,
    withAuth: true,
  };

  const response = await apiClient(request);

  return response;
}
