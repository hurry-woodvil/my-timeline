import { ApiResponse } from '@/features/auth';
import { MemoriesResponseData } from '../types/memories';
import { callMemoriesApi } from './api';

export async function memories(): Promise<ApiResponse<MemoriesResponseData>> {
  const body = await callMemoriesApi();

  return body;
}
