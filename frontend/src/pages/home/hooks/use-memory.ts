import {
  callGetMemoriesApi,
  callPostMemoryApi,
  callDeleteMemoryApi,
} from '@/features/memory';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMemory() {
  const queryClient = useQueryClient();

  const fetchMemories = async () => {
    try {
      const response = await callGetMemoriesApi();

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data.items;
    } catch (e: unknown) {
      throw e;
    }
  };

  const createMemory = async (content: string) => {
    const now = new Date();
    try {
      let result = await callPostMemoryApi(
        content,
        false,
        [],
        now.toISOString(),
        now.toISOString(),
      );

      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (e: unknown) {
      throw e;
    }
  };

  const deleteMemory = async (memory_id: string) => {
    try {
      let result = await callDeleteMemoryApi(memory_id);

      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (e: unknown) {
      throw e;
    }
  };

  const query = useQuery({
    queryKey: ['memories'],
    queryFn: fetchMemories,
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => {
      return createMemory(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ memory_id }: { memory_id: string }) => {
      return deleteMemory(memory_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  return {
    query,
    createMutation,
    deleteMutation,
  };
}
