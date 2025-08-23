import Link from 'next/link';
import React from 'react';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM23.681 21.244C23.844 21.063 23.85 20.813 23.694 20.631L20.444 16.844C21.631 15.481 22.144 13.569 21.688 11.669C21.231 9.769 19.869 8.281 18.075 7.631C16.281 6.981 14.319 7.269 12.756 8.369C11.194 9.469 10.25 11.231 10.25 13.125C10.25 15.319 11.269 17.281 12.831 18.456L9.119 22.844C8.962 23.025 8.956 23.275 9.112 23.456L10.369 24.881C10.519 25.056 10.769 25.069 10.931 24.906L14.631 21.3C15.069 21.494 15.538 21.631 16.031 21.713C16.519 21.788 17.013 21.806 17.5 21.769C19.656 21.612 21.588 20.531 22.813 18.819L26.219 22.844C26.375 23.025 26.625 23.031 26.781 22.869L28.031 21.619C28.188 21.45 28.181 21.2 28.031 21.025L23.681 21.244Z" fill="url(#paint0_linear_1_2)"/>
    <path d="M18.5 14.5C18.5 15.88 17.38 17 16 17C14.62 17 13.5 15.88 13.5 14.5C13.5 13.12 14.62 12 16 12C17.38 12 18.5 13.12 18.5 14.5Z" fill="white"/>
    <defs>
      <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5"/>
        <stop offset="1" stopColor="#818CF8"/>
      </linearGradient>
    </defs>
  </svg>
);

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
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
