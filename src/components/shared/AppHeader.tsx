
"use client";

import Link from 'next/link';
import { LogOut } from 'lucide-react'; // GraduationCap removed as it's replaced by SVG
import { Button } from '@/components/ui/button';
import { useMockAuth } from '@/hooks/useMockAuth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const CollegeLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-primary" // Ensures size and color match previous icon
    aria-label="College Logo"
  >
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" />
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontSize="16"
      fontWeight="bold"
      fill="currentColor"
    >
      EA
    </text>
  </svg>
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
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
