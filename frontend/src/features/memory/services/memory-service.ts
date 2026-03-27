import { ApiResponse } from '../../auth';
import { PostMemoryRequest, PostMemoryResponseData } from '../types/memory';
import { callPostMemoryApi } from './api';

export async function postMemory(
  content: string,
): Promise<ApiResponse<PostMemoryResponseData>> {
  const payload: PostMemoryRequest = {
    content,
  };

  const body = await callPostMemoryApi(payload);

  return body;
}
