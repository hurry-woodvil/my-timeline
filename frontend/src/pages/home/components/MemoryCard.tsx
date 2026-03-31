import { Button } from '@/lib/components/ui/button';
import { Trash2 } from 'lucide-react';

type MemoryCardProps = {
  memory_id: string;
  content: string;
  created_at: string;
};

export default function MemoryCard({
  memory_id,
  content,
  created_at,
}: MemoryCardProps) {
  return (
    <div key={memory_id} className="rounded-xl border bg-card p-4">
      <p className="whitespace-pre-wrap">{content}</p>
      <div className="flex">
        <p className="mt-2 text-sm text-muted-foreground">
          {new Date(created_at).toLocaleString('ja-JP')}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-neutral-700 hover:text-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
