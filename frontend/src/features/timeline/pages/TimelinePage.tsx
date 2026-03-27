'use client';

import { useState } from 'react';
import { useAuth } from '../../auth/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PostMemoryDialog } from '@/features/memory';

export default function TimelinePage() {
  const [isOpen, setIsOpen] = useState(false);
  const { signout } = useAuth();

  const handleSubmitMemory = async (content: string) => {
    console.log('posted memory:', content);
  };

  return (
    <main className="relative min-h-screen bg-background">
      <div className="mb-auto max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Timeline</h1>

        {/* タイムライン一覧をここに表示 */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Memory list will be displayed here.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full px-5 py-6 shadow-lg"
        >
          Post Memory
        </Button>

        <PostMemoryDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleSubmitMemory}
        />

        <button
          className="rounded-md border border-gray-300 px-4 py-2"
          onClick={signout}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
