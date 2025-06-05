
"use client";

import Link from 'next/link';
import Image from 'next/image'; // Added import for Next.js Image component
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockAuth } from '@/hooks/useMockAuth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from './ThemeToggle';

const CollegeLogo = () => (
  <Image
    src="/MITS-LOGO.png" // Path to your logo in the public directory
    alt="Exam Archive College Logo"
    width={32} // Set the desired width
    height={32} // Set the desired height
    className="h-8 w-8" // Tailwind classes for sizing, can be adjusted
  />
);

export function AppHeader() {
  const { logout } = useMockAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CollegeLogo />
          <span className="text-xl font-bold text-foreground font-headline">
            Exam Archive
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
