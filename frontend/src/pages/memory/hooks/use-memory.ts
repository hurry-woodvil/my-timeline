import { callGetMemoryApi } from '@/features/memory';
import { useQuery } from '@tanstack/react-query';

export function useMemory(memory_id: string) {
  const query = useQuery({
    queryKey: ['memory', memory_id],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return callGetMemoryApi(id);
    },
    enabled: !!memory_id,
    retry: 1,
  });

  return {
    success: query.data?.success,
    message: query.data?.message,
    content: query.data?.data.content,
    created_at: query.data?.data.content,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
  };
}
