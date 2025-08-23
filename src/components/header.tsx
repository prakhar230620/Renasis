import Link from 'next/link';
import React from 'react';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="url(#logo-gradient)" />
    <defs>
      <radialGradient id="logo-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24.5) rotate(90) scale(22)">
        <stop stopColor="#29ABE2"/>
        <stop offset="1" stopColor="#0071BC"/>
      </radialGradient>
    </defs>
    <path d="M12.4,22.4 C11.2,22.4 10.1,22 9.2,21.1 C8.3,20.2 7.9,19.2 7.9,18 C7.9,16.8 8.3,15.8 9.2,14.9 C10.1,14 11.2,13.6 12.4,13.6 C13.3,13.6 14.1,13.8 14.8,14.2 C15.5,14.6 16.1,15.2 16.5,15.9 L14.5,16.8 C14.3,16.4 14,16.1 13.6,15.8 C13.2,15.6 12.8,15.5 12.3,15.5 C11.6,15.5 11,15.7 10.5,16.2 C10,16.7 9.8,17.3 9.8,18 C9.8,18.7 10,19.3 10.5,19.8 C11,20.3 11.6,20.5 12.3,20.5 C12.8,20.5 13.2,20.4 13.6,20.2 C14,20 14.3,19.7 14.5,19.3 L16.5,20.1 C16.1,20.8 15.5,21.4 14.8,21.8 C14.1,22.2 13.3,22.4 12.4,22.4 Z M17.4,22.1 L17.4,13.9 L19.2,13.9 L19.2,15.7 C19.6,15.1 20.1,14.6 20.7,14.2 C21.3,13.8 22,13.6 22.7,13.6 C23.8,13.6 24.7,14 25.4,14.8 C26.1,15.6 26.5,16.6 26.5,17.8 L26.5,22.1 L24.6,22.1 L24.6,18.1 C24.6,17.4 24.4,16.9 24.1,16.5 C23.8,16.1 23.3,15.9 22.7,15.9 C22,15.9 21.4,16.2 21,16.8 C20.6,17.4 20.4,18.1 20.4,18.9 L20.4,22.1 L17.4,22.1 Z" fill="white" />
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
