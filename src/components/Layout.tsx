import React from 'react';
import { BookOpen, Github } from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-sans" dir="rtl">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center gap-2 font-bold">
            <BookOpen className="h-6 w-6" />
            <span>چارت درسی</span>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Add search or other nav items here */}
            </div>
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/SoroushJM/course-hub"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            ساخته شده با ❤️ برای دانشجویان. متن باز در GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
};
