
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from './ThemeToggle';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { LogOut, UserCircle, Settings, PlusCircle, Edit3, BookPlus, LayoutDashboard } from 'lucide-react';
import { ADMIN_EMAIL } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CollegeLogo = () => (
  <Image
    src="/MITS LOGO PNG.png"
    alt="Exam Archive College Logo"
    width={40}
    height={40}
    className="h-10 w-10"
    unoptimized={true}
  />
);

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const currentUser = session?.user;
  const logout = () => signOut()
  const handleLogout = async () => {
    if (isLoading) return;
    await logout();
    toast({
      title: "Logout Successful",
      description: "You have been logged out.",
    });
  };

  const isAdmin = currentUser?.email === ADMIN_EMAIL;
  const adminSpecificPaths = ['/admin/add-exam', '/admin/add-subject', '/admin/manage-exam'];
  const showDirectDashboardLink = isAdmin && adminSpecificPaths.includes(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={isAdmin && !showDirectDashboardLink ? "/admin/add-exam" : "/dashboard"} className="flex items-center gap-2">
          <CollegeLogo />
          <span className="text-xl font-bold text-foreground font-headline">
            Exam Archive
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {currentUser && (
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {currentUser.fullName }
              </span>
            </div>
          )}

          {showDirectDashboardLink && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}

          <ThemeToggle />

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Admin Options">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/add-exam" className="flex items-center w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Exam Paper
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/add-subject" className="flex items-center w-full">
                    <BookPlus className="mr-2 h-4 w-4" />
                    Add Subject
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/manage-exams" className="flex items-center w-full">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Manage Exams
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {currentUser && (
            <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoading} aria-label="Log out">
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
