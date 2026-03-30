import { Memory } from '@/features/memory';
import { Button } from '@/lib/components/ui/button';

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
    <section className="h-full flex-1 rounded-3xl border border-amber-100 bg-white/70 p-6 shadow-sm backdrop-blur-[2px]">
      <header className="mb-6">
        <p className="text-sm text-neutral-600">Today's Memories</p>
        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        <h2 className="text-xl font-semibold text-neutral-800">今日の投稿</h2>
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
