import { ApiResponse } from '@/features/auth';
import {
  GetMemoriesRequestPayload,
  GetMemoriesResponseBodyData,
  GetMemoryRequestPayload,
  GetMemoryResponseBodyData,
  PostMemoryRequestPayload,
  PostMemoryResponseBodyData,
  DeleteMemoryRequestPayload,
  DeleteMemoryResponseBodyData,
  PatchMemoryRequestPayload,
  PatchMemoryResponseBodyData,
} from '../types';
import {
  apiClient,
  DeleteApiRequest,
  GetApiRequest,
  PatchApiRequest,
  PostApiRequest,
} from '@/lib';

export async function callGetMemoriesApi(): Promise<
  ApiResponse<GetMemoriesResponseBodyData>
> {
  const request: GetApiRequest<GetMemoriesRequestPayload> = {
    method: 'GET',
    path: 'memories',
    withAuth: true,
    query: {},
  };

  const response = await apiClient<GetMemoriesResponseBodyData>(request);

  return response;
}

export async function callGetMemoryApi(
  memory_id: string,
): Promise<ApiResponse<GetMemoryResponseBodyData>> {
  const request: GetApiRequest<GetMemoryRequestPayload> = {
    method: 'GET',
    path: `memories/${memory_id}`,
    withAuth: true,
    query: {},
  };

  const response = await apiClient<GetMemoryResponseBodyData>(request);

  return response;
}

export async function callPostMemoryApi(
  content: string,
  isClip: boolean,
  tags: string[],
  createdAt: string,
  updatedAt: string,
): Promise<ApiResponse<PostMemoryResponseBodyData>> {
  const payload: PostMemoryRequestPayload = {
    content,
    isClip,
    tags,
    createdAt,
    updatedAt,
  };

  const request: PostApiRequest<PostMemoryRequestPayload> = {
    method: 'POST',
    path: '/memories',
    withAuth: true,
    body: payload,
  };

  const response = await apiClient<PostMemoryResponseBodyData>(request);

  return response;
}

export async function callDeleteMemoryApi(
  memory_id: string,
): Promise<ApiResponse<DeleteMemoryResponseBodyData>> {
  const request: DeleteApiRequest<DeleteMemoryRequestPayload> = {
    method: 'DELETE',
    path: `memories/${memory_id}`,
    withAuth: true,
    query: {},
  };

  const response = await apiClient<DeleteMemoryResponseBodyData>(request);

  return response;
}

export async function callPatchMemoryApi(
  memory_id: string,
  updatedAt: string,
  props: {
    content: string | null;
    isClip: boolean | null;
    tags: string[] | null;
  },
): Promise<ApiResponse<PatchMemoryResponseBodyData>> {
  const payload: PatchMemoryRequestPayload = {
    content: props.content,
    isClip: props.isClip,
    tags: props.tags,
    updatedAt,
  };

  const request: PatchApiRequest<PatchMemoryRequestPayload> = {
    method: 'PATCH',
    path: `memories/${memory_id}`,
    withAuth: true,
    body: payload,
  };

  const response = await apiClient<PatchMemoryResponseBodyData>(request);

  return response;
}
