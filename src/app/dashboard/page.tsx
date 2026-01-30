"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PaperFilters } from "@/components/dashboard/PaperFilters";
import { PaperList } from "@/components/dashboard/PaperList";
import { DEPARTMENTS, SEMESTERS } from "@/lib/constants"; // ⬅️ no PAPERS import now
import type { Filters, Subject, Paper } from "@/types";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/shared/AppHeader";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const currentUser = session?.user;

  /* --------------- state---------------- */
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);        // ⬅️ new
  const [filters, setFilters] = useState<Filters>({
    department: undefined,
    semester: undefined,
    subject: undefined,
  });

  /* -------- authentication guard -------- */
  useEffect(() => {
    if (!isLoading && !currentUser) router.push("/login");
  }, [isLoading, currentUser, router]);

  /* -------- load subject & paper -------- */
  useEffect(() => {
    const load = async () => {
      try {
        const [subRes, paperRes] = await Promise.all([
          fetch("/api/subject", { cache: "no-store" }),
          fetch("/api/papers",   { cache: "no-store" }),   // ⬅️ get live data
        ]);

        if (!subRes.ok || !paperRes.ok) throw new Error("Fetch failed");
        setSubjects(await subRes.json());
        setPapers(await paperRes.json());
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };
    load();
  }, []);

  /* -------- filter -------- */
  const handleFilterChange = useCallback((f: Filters) => setFilters(f), []);

  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      const deptOK   = !filters.department || p.departmentId === filters.department;
      const subjOK   = !filters.subject    || p.subjectId    === filters.subject;
      const semOK    = !filters.semester   || p.semester.toString() === filters.semester;
      return deptOK && subjOK && semOK;
    });
  }, [papers, filters]);

  /* -------- loading screen -------- */
  if (isLoading || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse text-muted-foreground">Loading dashboard…</p>
      </div>
    );
  }

  const firstName = currentUser.fullName?.split(" ")[0] ?? "User";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <main className="p-6 space-y-8">
        {/* welcome card */}
        <Card className="bg-gradient-to-r from-primary/10 via-background to-background border-primary/30 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <UserCircle className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-xl font-headline flex items-center">
                  Welcome back, {firstName}!
                  {currentUser.isAdmin && (
                    <Badge variant="success" className="ml-2 text-xs">
                      <ShieldCheck className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Logged in as: {currentUser.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs bg-white/10 backdrop-blur-md text-muted-foreground border border-blue-200 p-2 rounded-md">
              <strong>Security Reminder:</strong> Never share your password.
              This app will <strong className="underline">never</strong> show or ask for password after login.
            </p>
          </CardContent>
        </Card>

        {/* heading */}
        <div>
          <h1 className="text-3xl font-bold font-headline">Question Paper Archive</h1>
          <p className="text-muted-foreground">
            Find and download previous-year question papers for your department and subjects.
          </p>
        </div>

        <Separator />

        {/* paper filters */}
        <PaperFilters
          departments={DEPARTMENTS}
          subjects={subjects}
          semesters={SEMESTERS}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
        {/* papers list */}
        <PaperList papers={filteredPapers} />
      </main>
    </div>
  );
}
