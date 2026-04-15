'use client';

import { useParams } from 'react-router-dom';
import { useMemory } from './hooks/use-memory';

export default function MemoryDetailPage() {
  const { memory_id } = useParams<{ memory_id: string }>();

  const { success, message, content, created_at, isPending, isError, error } =
    useMemory(memory_id!);

  return (
    <div className="flex h-full min-h-0 w-full gap-4">
      <h1>Memory Detail</h1>
      {isPending && <p>Loading...</p>}
      {isError ? (
        <p>{error?.message}</p>
      ) : success ? (
        <>
          <p>{content}</p>
          {created_at && (
            <p>{new Date(created_at).toLocaleDateString('ja-JP')}</p>
          )}
        </>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
