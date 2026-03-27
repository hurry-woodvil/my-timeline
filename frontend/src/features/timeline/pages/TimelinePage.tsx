'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PostMemoryDialog } from '@/features/memory';
import { Memory } from '../types/memories';
import { memories } from '../services/memories-service';
import { postMemory as postMemoryService } from '@/features/memory/services/memory-service';

export default function TimelinePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [memoryItems, setMemoryItems] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { signout } = useAuth();

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
      let result = await postMemoryService(content);
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
    <main className="relative min-h-screen bg-background">
      <div className="mb-auto max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Timeline</h1>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Loading memories...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          ) : memoryItems.length === 0 ? (
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                No memories posted yet.
              </p>
            </div>
          ) : (
            memoryItems.map((memory) => (
              <div
                key={memory.memory_id}
                className="rounded-xl border bg-card p-4"
              >
                <p className="whitespace-pre-wrap">{memory.content}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {new Date(memory.created_at).toLocaleString('ja-JP')}
                </p>
              </div>
            ))
          )}
        </div>

        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full px-5 py-6 shadow-lg"
        >
          Post Memory
        </Button>

        <PostMemoryDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleSubmitMemory}
        />

        <button
          className="rounded-md border border-gray-300 px-4 py-2"
          onClick={signout}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
