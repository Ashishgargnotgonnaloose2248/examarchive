import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

/* ────────────  Small logo components  ──────────── */
const CollegeLogo = () => (
  <Image
    src="/MITS LOGO PNG.png"
    alt="Exam Archive College Logo"
    width={32}
    height={32}
    className="h-8 w-8"
    unoptimized
  />
);

/* ────────────  Admin layout  ──────────── */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  /* 1️⃣  Get the current session (server-side) */
  const session = await getServerSession(authOptions);

  /* 2️⃣  Redirect rules (match old behaviour) */
  if (!session) {
    redirect("/login");      // not logged in
  }
  if (!session.user?.isAdmin) {
    redirect("/dashboard");  // logged in but not admin
  }

  /* 3️⃣  Render admin UI */
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 flex items-center justify-between bg-background/70 backdrop-blur sticky top-0 z-50">
        <Link href="/admin/add-exam" className="flex items-center gap-2">
          <CollegeLogo />
          <h1 className="font-bold text-xl font-headline">
            Exam Archive – Admin
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              User Dashboard
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Admin Options ▾</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem asChild>
                <Link href="/admin/add-exam">Add Exam</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/manage-exams">Edit / Delete Exams</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/add-subject">Add Subject</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-6 bg-muted/50 overflow-y-auto">{children}</main>
      <Toaster />
    </div>
  );
}
