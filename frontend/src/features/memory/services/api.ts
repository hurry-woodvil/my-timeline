import { env } from '../../../config/env';
import { ApiClient } from '../../../shared/api-client';
import { PostApiRequest } from '../../../shared/api-request-type';
import { ApiResponse } from '../../auth';
import { PostMemoryRequest, PostMemoryResponseData } from '../types/memory';

export async function callPostMemoryApi(
  payload: PostMemoryRequest,
): Promise<ApiResponse<PostMemoryResponseData>> {
  const request: PostApiRequest<PostMemoryRequest> = {
    method: 'POST',
    path: '/memory',
    withAuth: true,
    body: payload,
  };

  const apiClient = new ApiClient(env.apiBaseUrl);
  const response = await apiClient.request<PostMemoryResponseData>(request);

  return response;
}
