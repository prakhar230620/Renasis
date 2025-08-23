import Link from 'next/link';
import React from 'react';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.1413 21.0116C20.9113 19.8216 22.0013 17.9216 22.0013 15.8116C22.0013 12.0016 18.9913 8.99158 15.1813 8.99158C11.3713 8.99158 8.36133 12.0016 8.36133 15.8116C8.36133 17.9216 9.45133 19.8216 11.2213 21.0116" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.1816 16.8916V22.0016" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <h1 className="text-2xl font-bold tracking-tight">
            Review Insights AI
          </h1>
        </Link>
      </div>
    </header>
  );
}
