import { ApiResponse } from '@/features/auth';
import { MemoriesRequest, MemoriesResponseData } from '../types/memories';
import { GetApiRequest } from '@/shared/api-request-type';
import { ApiClient } from '@/shared/api-client';
import { env } from '@/config/env';

export async function callMemoriesApi(): Promise<
  ApiResponse<MemoriesResponseData>
> {
  const request: GetApiRequest<MemoriesRequest> = {
    method: 'GET',
    path: 'memories',
    withAuth: true,
    query: {},
  };

  const apiClient = new ApiClient(env.apiBaseUrl);
  const response = await apiClient.request<MemoriesResponseData>(request);

  return response;
}
