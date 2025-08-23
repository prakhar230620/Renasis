import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Review Insights AI
          </h1>
        </Link>
      </div>
    </header>
  );
}
