import { ApiResponse } from '@/features/auth';
import {
  PostMemoryRequest,
  PostMemoryResponseData,
  MemoriesResponseData,
  MemoriesRequest,
} from '../types';
import {
  apiClient,
  DeleteApiRequest,
  GetApiRequest,
  PostApiRequest,
} from '@/lib';

export async function postMemory(
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

  const response = await apiClient<PostMemoryResponseData>(request);

  return response;
}

export async function memories(): Promise<ApiResponse<MemoriesResponseData>> {
  const request: GetApiRequest<MemoriesRequest> = {
    method: 'GET',
    path: 'memories',
    withAuth: true,
    query: {},
  };

  const response = await apiClient<MemoriesResponseData>(request);

  return response;
}

export async function deleteMemory(memory_id: string) {
  const request: DeleteApiRequest = {
    method: 'DELETE',
    path: `memory/${memory_id}`,
    withAuth: true,
  };

  const response = await apiClient(request);

  return response;
}
