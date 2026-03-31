import { Memory } from '@/features/memory';
import { useState } from 'react';

export function useHooks() {
  const [isOpen, setIsOpen] = useState(false);
  const [memoryItems, setMemoryItems] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return {
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
  };
}
