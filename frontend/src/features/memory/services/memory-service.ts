import { ApiResponse } from '@/features/auth';
import {
  PostMemoryRequest,
  PostMemoryResponseData,
  MemoriesResponseData,
} from '../types';
import { callPostMemoryApi, callMemoriesApi } from './api';

export async function postMemory(
  content: string,
): Promise<ApiResponse<PostMemoryResponseData>> {
  const payload: PostMemoryRequest = {
    content,
  };

  const body = await callPostMemoryApi(payload);

  return body;
}

export async function memories(): Promise<ApiResponse<MemoriesResponseData>> {
  const body = await callMemoriesApi();

  return body;
}
