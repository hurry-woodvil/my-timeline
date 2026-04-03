import { Button } from '@/lib/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/dialog';
import { Textarea } from '@/lib/components/ui/textarea';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useMemory } from '../hooks/use-memory';

type PostMemoryDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function PostMemoryDialog({
  isOpen,
  setIsOpen,
}: PostMemoryDialogProps) {
  const { createMutation } = useMemory();

  const [content, setContent] = useState('');

  const handleClose = () => {
    if (createMutation.isPending) return;
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      await createMutation.mutateAsync({ content: trimmed });

      setContent('');
      setIsOpen(false);
    } catch (error) {
      console.error('failed to post memory', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg p-0 gap-0" showCloseButton={false}>
        <div className="relative border-b px-6 py-4">
          <DialogTitle className="text-base font-semibold">
            Post Memory
          </DialogTitle>

          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none"
            aria-label="Close"
            disabled={createMutation.isPending}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-40 resize-none"
            disabled={createMutation.isPending}
          />
        </div>

        <div className="flex justify-end border-t px-6 py-4">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={createMutation.isPending || !content.trim()}
          >
            {createMutation.isPending ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
