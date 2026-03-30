'use client';

import { useEffect } from 'react';
import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';
import PostMemoryDialog from './components/PostMemoryDialog';
import { useHooks } from './hooks/home-hooks';

export default function HomePage() {
  const {
    isOpen,
    setIsOpen,
    memoryItems,
    isLoading,
    isRefreshing,
    errorMessage,
    fetchMemories,
    handleRefresh,
    handleSubmitMemory,
  } = useHooks();

  useEffect(() => {
    void fetchMemories();
  }, [fetchMemories]);

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
