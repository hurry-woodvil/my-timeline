import { Button } from '@/lib/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/dialog';
import { Textarea } from '@/lib/components/ui/textarea';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useMemory } from '../page';
import { postMemory } from '@/features/memory';

type PostMemoryDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function PostMemoryDialog({
  isOpen,
  setIsOpen,
}: PostMemoryDialogProps) {
  const { fetchMemories } = useMemory();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      setIsSubmitting(true);

      let result = await postMemory(content);
      console.log(result.message);
      console.log(result.data);
      await fetchMemories({ silent: true });

      setContent('');
      setIsOpen(false);
    } catch (error) {
      console.error('failed to post memory', error);
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end border-t px-6 py-4">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
