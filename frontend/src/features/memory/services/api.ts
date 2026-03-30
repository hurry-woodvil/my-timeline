import { useApp } from '@/contexts';
import { PostApiRequest, GetApiRequest } from '@/lib';
import { ApiResponse } from '../../auth';
import {
  PostMemoryRequest,
  PostMemoryResponseData,
  MemoriesRequest,
  MemoriesResponseData,
} from '../types';

export async function callPostMemoryApi(
  payload: PostMemoryRequest,
): Promise<ApiResponse<PostMemoryResponseData>> {
  const request: PostApiRequest<PostMemoryRequest> = {
    method: 'POST',
    path: '/memory',
    withAuth: true,
    body: payload,
  };

  const { apiClient } = useApp();
  const response = await apiClient.request<PostMemoryResponseData>(request);

  return response;
}

export async function callMemoriesApi(): Promise<
  ApiResponse<MemoriesResponseData>
> {
  const request: GetApiRequest<MemoriesRequest> = {
    method: 'GET',
    path: 'memories',
    withAuth: true,
    query: {},
  };

  const { apiClient } = useApp();
  const response = await apiClient.request<MemoriesResponseData>(request);

  return response;
}
