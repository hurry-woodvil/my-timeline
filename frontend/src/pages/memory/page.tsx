'use client';

import { useParams } from 'react-router-dom';
import { useMemory } from './hooks/use-memory';
import { formatUtcToLocalTime } from '@/lib/utils';
import { Textarea } from '@/lib/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function MemoryDetailPage() {
  const { memoryId } = useParams<{ memoryId: string }>();

  const {
    success,
    message,
    createdAt,
    content,
    setContent,
    hasChanged,
    isPending,
    isError,
    error,
    updateMemory,
    isUpdating,
  } = useMemory(memoryId!);

  const handleUpdate = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (!hasChanged) return;

    try {
      await updateMemory({ content: trimmed });
    } catch (e) {
      console.error('failed to update memory', e);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full gap-4">
      <h1>Memory Detail</h1>

      {isPending && <p>Loading...</p>}

      {isError ? (
        <p>{error?.message}</p>
      ) : success ? (
        <>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {createdAt && <p>{formatUtcToLocalTime(createdAt)}</p>}

          <div className="absolute bottom-6 left-6">
            <Button
              className="rounded-full bg-neutral-900 px-6 text-white shadow-md hover:bg-neutral-800"
              onClick={handleUpdate}
              disabled={!hasChanged || isUpdating}
            >
              {isUpdating ? '更新中...' : '更新'}
            </Button>
          </div>
        </>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
