import { Button } from '@/lib/components/ui/button';
import { Trash2, Trash2Icon } from 'lucide-react';
import { useMemory } from '../hooks/use-memory';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
  const { deleteMutation } = useMemory();

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="whitespace-pre-wrap">{content}</p>
      <div className="flex">
        <p className="mt-2 text-sm text-muted-foreground">
          {new Date(created_at).toLocaleString('ja-JP')}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-neutral-700 hover:text-red-500"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete memory?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this memory.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => deleteMutation.mutate({ memory_id })}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
