'use client';

import { Printer } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function PrintButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border bg-fd-secondary px-2.5 py-1.5 text-sm font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent print:hidden',
        className,
      )}
    >
      <Printer className="size-3.5" />
      {children}
    </button>
  );
}
