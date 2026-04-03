import { RefreshCw } from 'lucide-react';
import MemoryCard from './MemoryCard';
import { useMemory } from '../hooks/use-memory';

export default function RightContent() {
  const { query } = useMemory();

  return (
    <>
      <section className="flex min-h-0 flex-1 flex-col rounded-[2rem] border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur-md">
        <header className="mb-4">
          <p className="text-sm text-neutral-600">Today&apos;s Memories</p>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-800">今日の投稿</h2>
            <button
              type="button"
              aria-label="Refresh memories"
              className="inline-flex size-9 items-center justify-center rounded-full border border-white/50 bg-white/70 text-neutral-700 transition hover:bg-white"
              onClick={() => query.refetch}
              disabled={query.isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="space-y-4">
          <div className="space-y-4">
            {query.isLoading ? (
              <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-destructive">Loading memories...</p>
              </div>
            ) : query.isError ? (
              <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-destructive">
                  {query.error.message}
                </p>
              </div>
            ) : query.data?.length === 0 ? (
              <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                  No memories posted yet.
                </p>
              </div>
            ) : (
              query.data?.map((memory) => (
                <MemoryCard
                  key={memory.memory_id}
                  memory_id={memory.memory_id}
                  content={memory.content}
                  created_at={memory.created_at}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
