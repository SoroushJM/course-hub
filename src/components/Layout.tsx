import React from 'react';
import { BookOpen, Github } from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen font-sans flex flex-col" dir="rtl">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mr-4 flex items-center gap-2 font-bold text-primary text-xl tracking-tight">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              چارت درسی
            </span>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Add search or other nav items here */}
            </div>
            <nav className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 hover:text-primary transition-colors"
                asChild
              >
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
      <main className="flex-1 container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-border/40 py-8 bg-background/50 backdrop-blur-sm mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
              ساخته شده با{" "}
              <span className="text-red-500 animate-pulse">❤️</span> برای
              دانشجویان. متن باز در GitHub.
            </p>
            <p className="text-center text-xs text-muted-foreground/80 md:text-right">
              اگر مشکلی مشاهده کردید، لطفاً در گیت‌هاب Issue ثبت کنید. ستاره
              دادن به پروژه هم یادتون نره! ⭐
            </p>
            <div className="mt-2">
              <a href="#/help" className="text-xs text-primary hover:underline">
                راهنمای استفاده
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
