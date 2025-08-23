import Link from 'next/link';
import React from 'react';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#29ABE2" />
        <stop offset="100%" stopColor="#1E88E5" />
      </linearGradient>
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
        <feOffset dx="1" dy="1" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#dropShadow)">
      <circle cx="16" cy="16" r="15" fill="hsl(var(--card))" stroke="url(#logoGradient)" strokeWidth="2"/>
      <path d="M13 18C13 15.7909 14.7909 14 17 14C19.2091 14 21 15.7909 21 18" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 22L11.5 20.5" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round"/>

      <rect x="10" y="10" width="3" height="5" rx="1" fill="hsl(var(--primary))" />
      <rect x="14" y="8" width="3" height="7" rx="1" fill="hsl(var(--primary))" />
      <rect x="18" y="11" width="3" height="4" rx="1" fill="hsl(var(--primary))" />
    </g>
  </svg>
);


export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <h1 className="text-2xl font-bold tracking-tight">
            RENASIS
          </h1>
        </Link>
      </div>
    </header>
  );
}
