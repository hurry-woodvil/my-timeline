'use client';

import { useCallback, useEffect, useState } from 'react';
import { Memory, memories, postMemory } from '@/features/memory';
import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';
import PostMemoryDialog from './components/PostMemoryDialog';

export default function HomePage() {
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

  useEffect(() => {
    void fetchMemories();
  }, [fetchMemories]);

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

  return (
    <div className="flex h-full min-h-0 gap-4">
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
