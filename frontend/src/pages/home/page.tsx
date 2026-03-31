'use client';

import { useCallback, useEffect } from 'react';
import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';
import PostMemoryDialog from './components/PostMemoryDialog';
import { useHooks } from './hooks/home-hooks';
import { memories, postMemory } from '@/features/memory';
import { useApp } from '@/contexts';

export default function HomePage() {
  const { apiClient } = useApp();
  const {
    isOpen,
    setIsOpen,
    memoryItems,
    setMemoryItems,
    isLoading,
    setIsLoading,
    isRefreshing,
    setIsRefreshing,
    errorMessage,
    setErrorMessage,
  } = useHooks();

  const fetchMemories = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage(null);

    try {
      const response = await memories(apiClient);

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

  useEffect(() => {
    void fetchMemories();
  }, [fetchMemories]);

  const handleRefresh = async () => {
    await fetchMemories({ silent: true });
  };

  const handleSubmitMemory = async (content: string) => {
    try {
      let result = await postMemory(apiClient, content);
      console.log(result.message);
      console.log(result.data);
      console.log('posted memory:', content);
      setIsOpen(false);
      await fetchMemories({ silent: true });
    } catch (error) {
      console.error('failed to post memory', error);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full gap-4">
      {/* Left: beach / random memory / post button */}
      <LeftContent setIsOpen={setIsOpen} />

      {/* Right: today memories */}
      <RightContent
        isRefreshing={isRefreshing}
        isLoading={isLoading}
        memoryItems={memoryItems}
        handleRefresh={handleRefresh}
        errorMessage={errorMessage}
      />

      <PostMemoryDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmitMemory}
      />
    </div>
  );
}
