import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="border-t bg-background/95">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} Review Insights AI. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/terms" className="hover:text-primary hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-primary hover:underline">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
