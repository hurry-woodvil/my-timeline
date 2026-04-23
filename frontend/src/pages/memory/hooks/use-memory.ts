import { ApiResponse } from '@/features/auth';
import {
  callGetMemoryApi,
  callPatchMemoryApi,
  GetMemoryResponseBodyData,
} from '@/features/memory';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

export function useMemory(memoryId: string) {
  const queryClient = useQueryClient();

  const updateMemory = async (content: string) => {
    const now = new Date();

    try {
      const result = await callPatchMemoryApi(memoryId, now.toISOString(), {
        content,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    } catch (e: unknown) {
      throw e;
    }
  };

  const query = useQuery<ApiResponse<GetMemoryResponseBodyData>>({
    queryKey: ['memory', memoryId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      return await callGetMemoryApi(id as string);
    },
    enabled: !!memoryId,
    retry: 1,
  });

  const initialDataRef = useRef<{ content: string } | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!query.data?.data) return;

    if (initialDataRef.current === null) {
      initialDataRef.current = query.data.data;
    }

    setContent(query.data.data.content);
  }, [query.data]);

  const updateMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => {
      return updateMemory(content);
    },
    onSuccess: (response) => {
      queryClient.setQueriesData<ApiResponse<GetMemoryResponseBodyData>>(
        ['memory', memoryId],
        (old) => {
          if (!old) {
            return {
              success: response.success,
              message: response.message,
              data: response.data,
            };
          }

          return {
            ...old,
            success: response.success,
            message: response.message,
            data: response.data,
          };
        },
      );

      initialDataRef.current = { content: response.data.content || '' };

      setContent(response.data.content || '');
    },
  });

  const hasChanged = initialDataRef.current?.content !== content;

  return {
    success: query.data?.success,
    message: query.data?.message,
    createdAt: query.data?.data.createdAt,
    content,
    setContent,
    hasChanged,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    updateMemory: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
