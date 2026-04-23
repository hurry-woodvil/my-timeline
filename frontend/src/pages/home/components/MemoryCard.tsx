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
import { Link } from 'react-router-dom';
import { formatUtcToLocalTime } from '@/lib/utils';

type MemoryCardProps = {
  memoryId: string;
  content: string;
  createdAt: string;
};

export default function MemoryCard({
  memoryId,
  content,
  createdAt,
}: MemoryCardProps) {
  const { deleteMutation } = useMemory();

  return (
    <div className="rounded-xl border bg-card p-4">
      <Link to={`/memory/${memoryId}`} className="block">
        <p className="whitespace-pre-wrap">{content}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatUtcToLocalTime(createdAt)}
        </p>
      </Link>
      <div className="mt-2 flex justify-end">
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
                onClick={() => deleteMutation.mutate({ memoryId })}
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
