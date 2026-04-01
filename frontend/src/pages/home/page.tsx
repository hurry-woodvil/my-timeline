'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';
import { deleteMemory, memories, Memory } from '@/features/memory';

type MemoryContextValue = {
  items: Memory[];
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  fetchMemories: (options?: { silent?: boolean }) => Promise<void>;
  deleteHandler: (memory_id: string) => Promise<void>;
};

const MemoryContext = createContext<MemoryContextValue | null>(null);

type MemoryProviderProps = {
  children: ReactNode;
};

function MemoryProvider({ children }: MemoryProviderProps) {
  const [items, setItems] = useState<Memory[]>([]);
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
        setErrorMessage(response.message || 'Failed to fethc memories.');
        setItems([]);
        return;
      }

      setItems(response.data.items);
    } catch (error) {
      console.log('failed to fetch memories', error);
      setErrorMessage('Failed to fetch memories.');
      setItems([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const deleteHandler = useCallback(async (memory_id: string) => {
    try {
      const response = await deleteMemory(memory_id);

      if (!response.success) {
        setErrorMessage(response.message || 'Failed to delete memory.');
        return;
      }
    } catch (error) {
      console.error('Failed delete memory', error);
    }

    await fetchMemories({ silent: true });
  }, []);

  const value = useMemo<MemoryContextValue>(
    () => ({
      items,
      isLoading,
      isRefreshing,
      errorMessage,
      fetchMemories,
      deleteHandler,
    }),
    [items, isLoading, isRefreshing, errorMessage],
  );

  return <MemoryContext value={value}>{children}</MemoryContext>;
}

export function useMemory() {
  const context = useContext(MemoryContext);

  if (!context) {
    throw new Error('useMemory must be used with MemoryProvider');
  }

  return context;
}

export default function HomePage() {
  return (
    <div className="flex h-full min-h-0 w-full gap-4">
      <MemoryProvider>
        {/* Left: beach / random memory / post button */}
        <LeftContent />
        {/* Right: today memories */}
        <RightContent />
      </MemoryProvider>
    </div>
  );
}
