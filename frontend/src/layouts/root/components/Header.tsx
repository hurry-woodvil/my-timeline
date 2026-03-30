'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/lib/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/lib/components/ui/tooltip';
import { useAuth } from '@/contexts';

export default function Header() {
  const { signout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between px-4">
        <h1 className="font-[Marcellus] text-2xl tracking-[0.25em] text-neutral-800 sm:text-3xl">
          nagisa
        </h1>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={signout}
              className="rounded-full text-neutral-700 hover:bg-white/70"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign out</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
