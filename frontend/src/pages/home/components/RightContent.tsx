import { Memory } from '@/features/memory';
import { Button } from '@/lib/components/ui/button';
import { RefreshCw } from 'lucide-react';

type RightContentProps = {
  isRefreshing: boolean;
  isLoading: boolean;
  memoryItems: Memory[];
  handleRefresh: () => Promise<void>;
  errorMessage: string | null;
};

export default function RightContent({
  isRefreshing,
  isLoading,
  memoryItems,
  handleRefresh,
  errorMessage,
}: RightContentProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-[2rem] border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <header className="mb-4">
        <p className="text-sm text-neutral-600">Today&apos;s Memories</p>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-800">今日の投稿</h2>
          <button
            type="button"
            aria-label="Refresh memories"
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/50 bg-white/70 text-neutral-700 transition hover:bg-white"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-100 bg-white/70 p-4">
          <p className="text-sm text-neutral-600">今日の投稿一覧をここに表示</p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-destructive">Loading memories...</p>
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
      </div>
    </section>
  );
}
