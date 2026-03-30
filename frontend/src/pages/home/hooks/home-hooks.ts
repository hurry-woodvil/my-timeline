import { memories, Memory, postMemory } from '@/features/memory';
import { useCallback, useState } from 'react';

export function useHooks() {
  const [isOpen, setIsOpen] = useState(false);
  const [memoryItems, setMemoryItems] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMemories = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage(null);

    try {
      const response = await memories();

      if (!response.success) {
        setErrorMessage(response.message || 'Failed to fetch memories.');
        setMemoryItems([]);
        return;
      }

      setMemoryItems(response.data?.items ?? []);
    } catch (error) {
      console.log('failed to fetch memories', error);
      setErrorMessage('Failed to fetch memories.');
      setMemoryItems([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleRefresh = async () => {
    await fetchMemories({ silent: true });
  };

  const handleSubmitMemory = async (content: string) => {
    try {
      let result = await postMemory(content);
      console.log(result.message);
      console.log(result.data);
      console.log('posted memory:', content);
      setIsOpen(false);
      await fetchMemories({ silent: true });
    } catch (error) {
      console.error('failed to post memory', error);
    }
  };

  return {
    isOpen,
    setIsOpen,
    memoryItems,
    isLoading,
    isRefreshing,
    errorMessage,
    fetchMemories,
    handleRefresh,
    handleSubmitMemory,
  };
}
